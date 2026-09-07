/**
 * Harvest books fix. Applies the recodes from `npm run books:check` to Xero through the API.
 *
 *   npm run books:fix                                   # dry run: lists what would change, and the revenue accounts
 *   npm run books:fix -- --sales-account 205            # dry run with the Square target account chosen
 *   npm run books:fix -- --sales-account 205 --apply    # writes to Xero (Tier 3: Ben's verb, day-shift)
 *   npm run books:fix -- --create-sales-account 205     # creates revenue account 205 'Harvest sales' (GST on income), then exits
 *   npm run books:fix -- --sales-account 205 --apply --stop-on-fail   # stop at the first rejected update
 *   npm run books:fix -- --since 2026-06-20 ...
 *
 * What it changes, and only this:
 *   - Square Australia RECEIVE bank transactions: every line -> AccountCode = --sales-account,
 *     Project Tracking = ACT-HV. Business Divisions tracking is kept.
 *   - Bidfood SPEND bank transactions: every line -> AccountCode 310 Cost of Goods Sold, ACT-HV.
 * Reconciled bank transactions cannot be edited through the API (Xero: "cannot be edited as it has
 * been reconciled"). For those it posts ONE MANUAL JOURNAL PER MONTH that reverses each original line
 * (same account, tax type and tracking) and re-posts it to the target account with ACT-HV. The bank
 * reconciliation is untouched and the journal can be voided to undo. Unreconciled transactions are
 * edited in place. A revert file (journal IDs + before state) is written to thoughts/shared/books/.
 * Sales invoices (e.g. INV-0348 Dennis in 200 Sales - Rent) are not touched; fix those in Xero by hand.
 *
 * Auth: the ACT Xero app. XERO_CLIENT_ID / XERO_CLIENT_SECRET / XERO_TENANT_ID and the Supabase
 * creds come from ~/Code/act-global-infrastructure/.env.local; the refresh token lives in the
 * `xero_tokens` table and is rotated on every run (same as the ACT scripts).
 */
import { createClient } from "@supabase/supabase-js";
import { config as dotenv } from "dotenv";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const AGI = join(homedir(), "Code/act-global-infrastructure");
const agiEnv = join(AGI, ".env.local");
dotenv({ path: ".env" });
if (existsSync(agiEnv)) dotenv({ path: agiEnv });

const need = (k: string) => { const v = process.env[k]; if (!v) { console.error(`Missing ${k} (looked in .env and ${agiEnv})`); process.exit(1); } return v; };
const SB_URL = process.env.SUPABASE_SHARED_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || need("SUPABASE_URL");
const SB_KEY = process.env.SUPABASE_SHARED_SERVICE_ROLE_KEY || need("SUPABASE_SERVICE_ROLE_KEY");
const CLIENT_ID = need("XERO_CLIENT_ID"), CLIENT_SECRET = need("XERO_CLIENT_SECRET"), TENANT = need("XERO_TENANT_ID");

const argv = process.argv.slice(2);
const flag = (n: string) => argv.includes(n);
const opt = (n: string) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : undefined);
const APPLY = flag("--apply");
const SINCE = opt("--since") ?? "2026-06-20";
const SALES = opt("--sales-account");
const COGS = "310";
const HV_CODE = "ACT-HV";
const PROJECT_CAT = "Project Tracking";
const TILL = /^square australia$/i;
const FOOD = /^bidfood/i;

const sb = createClient(SB_URL, SB_KEY);
const XERO = "https://api.xero.com/api.xro/2.0";

async function accessToken(): Promise<string> {
  const { data: row } = await sb.from("xero_tokens").select("refresh_token").eq("id", "default").single();
  if (!row?.refresh_token) throw new Error("No refresh token in xero_tokens; run node scripts/xero-auth.mjs in act-global-infrastructure");
  const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const r = await fetch("https://identity.xero.com/connect/token", {
    method: "POST",
    headers: { Authorization: `Basic ${creds}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: row.refresh_token }),
  });
  if (!r.ok) throw new Error(`Token refresh failed ${r.status}: ${await r.text()}`);
  const t = await r.json();
  const expiresAt = new Date(Date.now() + t.expires_in * 1000 - 60000).toISOString();
  await sb.from("xero_tokens").upsert({ id: "default", refresh_token: t.refresh_token, access_token: t.access_token, expires_at: expiresAt, updated_at: new Date().toISOString(), updated_by: "harvest-books-fix" }, { onConflict: "id" });
  if (existsSync(agiEnv)) {
    let body = readFileSync(agiEnv, "utf8");
    body = /^XERO_REFRESH_TOKEN=/m.test(body) ? body.replace(/^XERO_REFRESH_TOKEN=.*/m, `XERO_REFRESH_TOKEN=${t.refresh_token}`) : `${body.trimEnd()}\nXERO_REFRESH_TOKEN=${t.refresh_token}\n`;
    writeFileSync(agiEnv, body);
  }
  return t.access_token;
}
const headers = (token: string) => ({ Authorization: `Bearer ${token}`, "xero-tenant-id": TENANT, Accept: "application/json", "Content-Type": "application/json" });
async function xget<T>(token: string, path: string): Promise<T> {
  const r = await fetch(`${XERO}/${path}`, { headers: headers(token) });
  if (!r.ok) throw new Error(`GET ${path} ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json() as Promise<T>;
}

interface Tracking { Name: string; Option: string; TrackingCategoryID?: string; TrackingOptionID?: string }
interface XLine { LineItemID?: string; Description?: string; Quantity?: number; UnitAmount?: number; LineAmount?: number; TaxType?: string; AccountCode?: string; Tracking?: Tracking[] }
interface BankTxn { BankTransactionID: string; Type: string; Status: string; Date: string; Total: number; Contact?: { ContactID?: string; Name?: string }; BankAccount?: { AccountID?: string; Code?: string }; LineAmountTypes?: string; LineItems: XLine[]; IsReconciled?: boolean }
interface Account { Code?: string; Name: string; Type: string; Status: string }
interface Category { Name: string; TrackingCategoryID: string; Options: { Name: string; TrackingOptionID: string; Status: string }[] }

const token = await accessToken();

// Tracking option for ACT-HV
const cats = (await xget<{ TrackingCategories: Category[] }>(token, "TrackingCategories")).TrackingCategories;
const projectCat = cats.find((c) => c.Name === PROJECT_CAT);
const hvOpt = projectCat?.Options.find((o) => o.Name.startsWith(HV_CODE) && o.Status === "ACTIVE");
if (!projectCat || !hvOpt) throw new Error(`No active '${HV_CODE}…' option under '${PROJECT_CAT}' in Xero`);
const hvTracking = (existing: Tracking[] = []): Tracking[] => [
  ...existing.filter((t) => t.Name !== PROJECT_CAT),
  { Name: PROJECT_CAT, Option: hvOpt.Name, TrackingCategoryID: projectCat.TrackingCategoryID, TrackingOptionID: hvOpt.TrackingOptionID },
];

const CREATE = opt("--create-sales-account");
if (CREATE) {
  const r = await fetch(`${XERO}/Accounts`, { method: "PUT", headers: headers(token), body: JSON.stringify({ Code: CREATE, Name: "Harvest sales", Type: "REVENUE", TaxType: "OUTPUT", Description: "The Harvest Witta till: pizza, drinks, shop, sauna, tickets. Tag ACT-HV." }) });
  const txt = await r.text();
  if (!r.ok) throw new Error(`Create account failed ${r.status}: ${txt.slice(0, 400)}`);
  console.log(`Created revenue account ${CREATE} 'Harvest sales'. Rerun with --sales-account ${CREATE}.`);
  process.exit(0);
}

// Revenue accounts, so Ben can pick or see the target
const accounts = (await xget<{ Accounts: Account[] }>(token, "Accounts?where=Type%3D%3D%22REVENUE%22")).Accounts.filter((a) => a.Status === "ACTIVE");
console.log(`\nRevenue accounts in this Xero file:`);
for (const a of accounts) console.log(`  ${a.Code ?? "----"}  ${a.Name}`);
if (SALES && !accounts.some((a) => a.Code === SALES)) throw new Error(`--sales-account ${SALES} is not an active revenue account. Create 'Harvest sales' in Xero (Accounting > Chart of accounts) first, then pass its code.`);
if (!SALES) console.log(`\nNo --sales-account given: Square lines will be listed but not planned. Create a 'Harvest sales' revenue account in Xero if none fits, then rerun with --sales-account <code>.`);

// Candidates from the mirror
const { data, error } = await sb.from("xero_transactions").select("xero_transaction_id,type,contact_name,total,date,line_items").gte("date", SINCE).order("date");
if (error) throw new Error(error.message);
interface MirrorRow { xero_transaction_id: string; type: string; contact_name: string | null; total: number; date: string; line_items: { account_code?: string; tracking?: Tracking[] }[] | null }
const rows = (data ?? []) as MirrorRow[];
const projOf = (li: { tracking?: Tracking[] }) => li.tracking?.find((t) => t.Name === PROJECT_CAT)?.Option?.split(" ")[0] ?? "";
const targets = rows.flatMap((r) => {
  const name = r.contact_name ?? "";
  if (r.type === "RECEIVE" && TILL.test(name)) {
    const bad = (r.line_items ?? []).some((li) => li.account_code !== SALES || projOf(li) !== HV_CODE) || !(r.line_items?.length);
    return bad ? [{ r, kind: "square" as const, account: SALES }] : [];
  }
  if (r.type === "SPEND" && FOOD.test(name)) {
    const bad = (r.line_items ?? []).some((li) => li.account_code !== COGS || projOf(li) !== HV_CODE) || !(r.line_items?.length);
    return bad ? [{ r, kind: "bidfood" as const, account: COGS }] : [];
  }
  return [];
});

console.log(`\n=== Harvest books fix ${APPLY ? "*** APPLY ***" : "(dry run)"} | since ${SINCE} | ${targets.length} bank transactions ===\n`);
const revert: { id: string; contact: string; date: string; before: XLine[] }[] = [];
interface JLine { LineAmount: number; AccountCode: string; Description: string; TaxType?: string; Tracking?: Tracking[] }
const journals = new Map<string, { lineAmountTypes: string; lines: JLine[] }>(); // key = YYYY-MM
let done = 0, skipped = 0, failed = 0;
for (const t of targets) {
  const label = `${t.r.date} ${t.r.contact_name} $${Number(t.r.total).toFixed(2)}`;
  if (!t.account) { console.log(`  [skip] ${label}: no target account`); skipped++; continue; }
  const bt = (await xget<{ BankTransactions: BankTxn[] }>(token, `BankTransactions/${t.r.xero_transaction_id}`)).BankTransactions?.[0];
  if (!bt) { console.log(`  [skip] ${label}: not found in Xero`); skipped++; continue; }
  if (bt.Status !== "AUTHORISED") { console.log(`  [skip] ${label}: status ${bt.Status}`); skipped++; continue; }
  const lines = bt.LineItems.map((li) => ({
    LineItemID: li.LineItemID, Description: li.Description, Quantity: li.Quantity, UnitAmount: li.UnitAmount, LineAmount: li.LineAmount, TaxType: li.TaxType,
    AccountCode: t.account, Tracking: hvTracking(li.Tracking),
  }));
  const from = bt.LineItems.map((li) => `${li.AccountCode}/${li.Tracking?.find((x) => x.Name === PROJECT_CAT)?.Option?.split(" ")[0] || "none"}`).join(",");
  const via = bt.IsReconciled ? "journal" : "edit";
  console.log(`  ${APPLY ? "->" : "  "} ${label}: ${from} -> ${t.account}/${HV_CODE} (${via})`);
  if (bt.IsReconciled) {
    // Reclassify by journal. SPEND lines were debits to the original account; RECEIVE lines were credits.
    const month = bt.Date.slice(0, 7);
    const j = journals.get(month) ?? { lineAmountTypes: bt.LineAmountTypes ?? "Inclusive", lines: [] };
    for (const li of bt.LineItems) {
      const amt = Number(li.LineAmount ?? 0);
      const debitOriginal = bt.Type === "SPEND";
      const desc = `${bt.Date.slice(0, 10)} ${t.r.contact_name} ${li.Description ?? ""}`.trim().slice(0, 4000);
      j.lines.push({ LineAmount: debitOriginal ? -amt : amt, AccountCode: String(li.AccountCode), Description: `Reverse: ${desc}`, TaxType: li.TaxType, Tracking: li.Tracking ?? [] });
      j.lines.push({ LineAmount: debitOriginal ? amt : -amt, AccountCode: t.account, Description: `Reclass: ${desc}`, TaxType: t.kind === "square" ? "OUTPUT" : li.TaxType, Tracking: hvTracking(li.Tracking) });
    }
    journals.set(month, j);
    continue;
  }
  if (!APPLY) continue;
  revert.push({ id: bt.BankTransactionID, contact: t.r.contact_name ?? "", date: bt.Date, before: bt.LineItems });
  const pr = await fetch(`${XERO}/BankTransactions/${bt.BankTransactionID}`, { method: "POST", headers: headers(token), body: JSON.stringify({ BankTransactions: [{ BankTransactionID: bt.BankTransactionID, Type: bt.Type, Date: bt.Date, Contact: { ContactID: bt.Contact?.ContactID }, BankAccount: { AccountID: bt.BankAccount?.AccountID }, LineAmountTypes: bt.LineAmountTypes, LineItems: lines }] }) });
  if (pr.ok) done++;
  else {
    failed++;
    const txt = await pr.text();
    let msg = txt.slice(0, 300);
    try {
      const j = JSON.parse(txt); const el = j.Elements?.[0];
      const ve = (el?.ValidationErrors ?? []).concat((el?.LineItems ?? []).flatMap((l: { ValidationErrors?: { Message: string }[] }) => l.ValidationErrors ?? []));
      if (ve.length) msg = ve.map((v: { Message: string }) => v.Message).join(" | ");
    } catch { /* keep raw */ }
    console.log(`     FAILED ${pr.status}: ${msg}`);
    if (flag("--stop-on-fail")) break;
  }
  await new Promise((r) => setTimeout(r, 250)); // Xero: 60 calls/min
}
// Post the monthly reclass journals
const postedJournals: { month: string; id: string; lines: number }[] = [];
for (const [month, j] of [...journals.entries()].sort()) {
  const [y, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10); // last day of the month
  const sum = j.lines.reduce((a, l) => a + l.LineAmount, 0);
  console.log(`\n  Journal ${month} dated ${date}: ${j.lines.length} lines (${j.lines.length / 2} transactions), balances to ${sum.toFixed(2)}`);
  if (Math.abs(sum) > 0.005) { console.log("     does not balance, not posting"); failed++; continue; }
  if (!APPLY) continue;
  const body = { ManualJournals: [{ Narration: `Harvest reclass ${month}: Square deposits to ${SALES} Harvest sales, Bidfood to ${COGS} COGS, tracking ${HV_CODE}. Posted by harvest-books-fix.`, Date: date, LineAmountTypes: j.lineAmountTypes, Status: "POSTED", JournalLines: j.lines }] };
  const pr = await fetch(`${XERO}/ManualJournals`, { method: "PUT", headers: headers(token), body: JSON.stringify(body) });
  const txt = await pr.text();
  if (pr.ok) {
    const id = JSON.parse(txt).ManualJournals?.[0]?.ManualJournalID as string;
    postedJournals.push({ month, id, lines: j.lines.length });
    done += j.lines.length / 2;
    console.log(`     posted ManualJournalID ${id}`);
  } else {
    failed++;
    let msg = txt.slice(0, 400);
    try {
      const el = JSON.parse(txt).Elements?.[0];
      const ve = (el?.ValidationErrors ?? []).concat((el?.JournalLines ?? []).flatMap((l: { ValidationErrors?: { Message: string }[] }) => l.ValidationErrors ?? []));
      if (ve.length) msg = ve.map((v: { Message: string }) => v.Message).join(" | ");
    } catch { /* keep raw */ }
    console.log(`     FAILED ${pr.status}: ${msg}`);
    if (flag("--stop-on-fail")) break;
  }
}

if (APPLY) {
  mkdirSync("thoughts/shared/books", { recursive: true });
  const out = `thoughts/shared/books/harvest-books-fix-revert-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
  writeFileSync(out, JSON.stringify({ journals: postedJournals, edited: revert }, null, 2));
  console.log(`\nApplied ${done} transactions (${postedJournals.length} journals), failed ${failed}, skipped ${skipped}. Revert file: ${out}`);
  console.log(`To undo a journal: Xero > Accounting > Manual journals > open it > Void. IDs are in the revert file.`);
  console.log(`The mirror updates on the next sync (act-global-infrastructure sync-xero-bank-feed.mjs); rerun books:check after that.`);
} else {
  console.log(`\nDry run. ${targets.length - skipped} would change (${journals.size} monthly journals for the reconciled ones), ${skipped} skipped. Add --apply to write.`);
}
