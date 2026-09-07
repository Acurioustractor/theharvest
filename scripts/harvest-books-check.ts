/**
 * Harvest books check. Read-only. Reads the Xero mirror (`xero_transactions` in the shared
 * Supabase project) and writes a bookkeeper fix-note for The Harvest's lines.
 *
 *   npm run books:check                 # last 12 weeks, note to thoughts/shared/books/
 *   npm run books:check -- --since 2026-07-01
 *
 * Never writes to Xero. The note is Tier 1; the Xero correction is Tier 3 and a human does it.
 * Rules it checks (each one bit us in the 7 Sep 2026 review):
 *   1. Square settlements must land in a sales account (2xx) and carry the ACT-HV tracking option.
 *   2. Bidfood (and other food suppliers) must go to 310 Cost of Goods Sold, tagged ACT-HV.
 *   3. Nothing should sit in 200 Sales - Rent unless it is rent someone paid.
 *   4. Harvest-tagged lines that are untagged or tagged to another project get listed.
 *   5. Whether anyone on site has been paid through this file at all.
 * Env: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from this repo's .env, else from
 * ~/Code/act-global-infrastructure/.env.local (the command-center finance env).
 */
import { createClient } from "@supabase/supabase-js";
import { config as dotenv } from "dotenv";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

dotenv({ path: ".env" });
const fallback = join(homedir(), "Code/act-global-infrastructure/.env.local");
if (!(process.env.SUPABASE_SERVICE_ROLE_KEY && (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)) && existsSync(fallback)) {
  dotenv({ path: fallback });
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (checked .env and " + fallback + ")");
  process.exit(1);
}

const argv = process.argv.slice(2);
const sinceArg = argv[argv.indexOf("--since") + 1];
const since = argv.includes("--since") && sinceArg ? sinceArg : isoDaysAgo(84);
const today = new Date().toISOString().slice(0, 10);

const HV_OPTION = "ACT-HV";
const SALES_ACCOUNTS = /^2\d\d$/;
const COGS = "310";
const FOOD_SUPPLIERS = [/^bidfood/i];
const TILL = [/^square australia$/i];
const SITE_PEOPLE = [/schlagenauf/i, /\bdennis\b/i, /\bdenis\b/i, /\bsusie\b/i, /\bsuzie\b/i, /\bjoey\b/i, /\btrina\b/i];
// Account names from act-global-infrastructure/config/xero-chart-import.csv (the sole trader chart).
const ACCOUNT_NAME: Record<string, string> = loadChart() ?? {
  "200": "Sales - Rent", "210": "Eco-tourism sales", "220": "Consulting/Mentoring Income", "260": "Other Revenue",
  "310": "Cost of Goods Sold", "400": "Advertising & Marketing", "407": "Bank Fees", "411": "Merchant Fees",
  "412": "Consulting & Accounting", "421": "Light meals & refreshments", "446": "Materials & Supplies",
  "461": "Printing & Stationery", "469": "Rent", "473": "Repairs and Maintenance", "485": "Subscriptions",
  "486": "Sub-contractors", "493": "Travel - National",
};

interface Tracking { Name?: string; Option?: string }
interface LineItem { account_code?: string; line_amount?: number; description?: string; tracking?: Tracking[] }
interface Txn {
  xero_transaction_id: string; type: string; contact_name: string | null; total: string | number;
  date: string; project_code: string | null; is_reconciled: boolean | null; line_items: LineItem[] | null;
}

const sb = createClient(url, key);
const { data, error } = await sb
  .from("xero_transactions")
  .select("xero_transaction_id,type,contact_name,total,date,project_code,is_reconciled,line_items")
  .gte("date", since)
  .order("date");
if (error) { console.error(error.message); process.exit(1); }
const txns = (data ?? []) as Txn[];

const projectOf = (li: LineItem, t: Txn) =>
  li.tracking?.find((x) => x.Name === "Project Tracking")?.Option?.split(" ")[0] ?? t.project_code ?? "";
const matches = (name: string | null, pats: RegExp[]) => !!name && pats.some((p) => p.test(name));
const money = (n: number) => "$" + n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const acct = (c?: string) => (c ? `${c} ${ACCOUNT_NAME[c] ?? ""}`.trim() : "(uncoded)");

interface Finding { rule: string; date: string; contact: string; amount: number; where: string; fix: string }
const findings: Finding[] = [];

for (const t of txns) {
  const lines = t.line_items?.length ? t.line_items : [{} as LineItem];
  for (const li of lines) {
    const amt = Number(li.line_amount ?? t.total);
    const proj = projectOf(li, t);
    const c = t.contact_name ?? "(no contact)";
    if (t.type === "RECEIVE" && matches(t.contact_name, TILL)) {
      const bad = !SALES_ACCOUNTS.test(li.account_code ?? "") || proj !== HV_OPTION;
      if (bad) findings.push({ rule: "1 Square settlement not in sales / not ACT-HV", date: t.date, contact: c, amount: amt, where: `${acct(li.account_code)}, project ${proj || "(none)"}`, fix: `Recode to a Harvest sales account (2xx, ideally a new 'Harvest sales' line) and set Project Tracking = ${HV_OPTION}. Merchant fee, if netted, to 411 Merchant Fees.` });
    }
    if (t.type === "SPEND" && matches(t.contact_name, FOOD_SUPPLIERS)) {
      const bad = li.account_code !== COGS || proj !== HV_OPTION;
      if (bad) findings.push({ rule: "2 Food supplier not in 310 COGS / not ACT-HV", date: t.date, contact: c, amount: amt, where: `${acct(li.account_code)}, project ${proj || "(none)"}`, fix: `Recode to 310 Cost of Goods Sold, Project Tracking = ${HV_OPTION}.` });
    }
    if (li.account_code === "200") {
      findings.push({ rule: "3 Posting in 200 Sales - Rent", date: t.date, contact: c, amount: amt, where: `${acct("200")}, project ${proj || "(none)"}`, fix: "Confirm this is rent someone paid. If not, recode to the right income account." });
    }
    if (proj === HV_OPTION && !t.is_reconciled) {
      findings.push({ rule: "4 Harvest line unreconciled", date: t.date, contact: c, amount: amt, where: acct(li.account_code), fix: "Reconcile against the bank line." });
    }
  }
}

// 5. Anyone on site paid through this file?
const peoplePaid = txns.filter((t) => t.type === "SPEND" && (matches(t.contact_name, SITE_PEOPLE) || t.line_items?.some((li) => matches(li.description ?? null, SITE_PEOPLE))));

// Harvest-tagged summary by account
const summary = new Map<string, { n: number; amount: number }>();
for (const t of txns) for (const li of t.line_items ?? []) {
  if (projectOf(li, t) !== HV_OPTION) continue;
  const k = `${t.type} ${acct(li.account_code)}`;
  const s = summary.get(k) ?? { n: 0, amount: 0 };
  s.n++; s.amount += Number(li.line_amount ?? 0); summary.set(k, s);
}

// Weekly till in vs food out
const weeks = new Map<string, { till: number; food: number }>();
for (const t of txns) {
  const d = new Date(t.date + "T00:00:00Z"); const day = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - day);
  const wk = d.toISOString().slice(0, 10);
  const w = weeks.get(wk) ?? { till: 0, food: 0 };
  if (t.type === "RECEIVE" && matches(t.contact_name, TILL)) w.till += Number(t.total);
  if (t.type === "SPEND" && matches(t.contact_name, FOOD_SUPPLIERS)) w.food += Number(t.total);
  weeks.set(wk, w);
}

const byRule = new Map<string, Finding[]>();
for (const f of findings) byRule.set(f.rule, [...(byRule.get(f.rule) ?? []), f]);

let md = `# Harvest books check, ${today}\n\n`;
md += `Source: \`xero_transactions\` mirror in Supabase \`${new URL(url).host}\` (sole trader file, Nicholas Marchesi), transactions dated ${since} to ${today}, ${txns.length} rows. Read-only. Verdict: **${findings.length ? "HOLD" : "PASS"}**.\n\n`;
md += `## Weekly till in versus food out (as settled to the bank)\n\n| Week starting | Square in | Bidfood out |\n|---|---|---|\n`;
for (const [wk, w] of [...weeks.entries()].sort()) if (w.till || w.food) md += `| ${wk} | ${money(w.till)} | ${money(w.food)} |\n`;
md += `\nSquare settles two to four days after the sale, so the latest week is incomplete.\n\n`;
md += `## Harvest-tagged lines (${HV_OPTION}) by account\n\n| Line | Count | Amount |\n|---|---|---|\n`;
for (const [k, s] of [...summary.entries()].sort((a, b) => b[1].amount - a[1].amount)) md += `| ${k} | ${s.n} | ${money(s.amount)} |\n`;
md += `\n## People on site paid through this file\n\n${peoplePaid.length ? peoplePaid.map((t) => `- ${t.date} ${t.contact_name} ${money(Number(t.total))}`).join("\n") : "None. No bill, contact or bank line matching Dennis, Susie, Joey or Trina. Whoever is paying them, it is not this Xero file."}\n\n`;
md += `## Fix-note for the bookkeeper\n\n`;
if (!findings.length) md += "Nothing to fix in this window.\n";
for (const [rule, fs] of byRule) {
  const total = fs.reduce((a, f) => a + f.amount, 0);
  md += `### ${rule}: ${fs.length} lines, ${money(total)}\n\nFix: ${fs[0].fix}\n\n| Date | Contact | Amount | Currently |\n|---|---|---|---|\n`;
  for (const f of fs) md += `| ${f.date} | ${f.contact} | ${money(f.amount)} | ${f.where} |\n`;
  md += "\n";
}
md += `## Standing rules (so this note gets shorter each week)\n\n1. Square Australia deposits: Harvest sales account, Project Tracking ${HV_OPTION}. Fees to 411.\n2. Bidfood and any food or drink supplier: 310 Cost of Goods Sold, ${HV_OPTION}.\n3. 200 Sales - Rent only for rent actually paid by a tenant.\n4. Anyone working on site is paid through payroll or a bill in this file, tagged ${HV_OPTION} (or split with ACT-GD for Goods hours).\n`;

const outDir = "thoughts/shared/books";
mkdirSync(outDir, { recursive: true });
const out = join(outDir, `harvest-books-check-${today}.md`);
writeFileSync(out, md);
console.log(md);
console.log(`\nWritten: ${out}`);

function loadChart(): Record<string, string> | null {
  const chart = join(homedir(), "Code/act-global-infrastructure/config/xero-chart-import.csv");
  if (!existsSync(chart)) return null;
  const out: Record<string, string> = {};
  for (const line of readFileSync(chart, "utf8").split("\n").slice(1)) {
    const [code, name] = line.split(",");
    if (code && name) out[code.trim()] = name.trim();
  }
  return out;
}
function isoDaysAgo(n: number) { const d = new Date(); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); }
