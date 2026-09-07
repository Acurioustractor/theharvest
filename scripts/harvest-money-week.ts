/**
 * Money, weekly: one row per week (Mon to Sun) into the Notion database "Money, weekly".
 * Rows are titled by the weekend they contain ("Weekend 4 to 6 Sep 2026") because that is when
 * The Harvest trades; the Week starting date underneath is the Monday, so outgoings line up.
 *
 *   npm run money:week                       # last 8 weeks, dry run (prints rows, writes nothing)
 *   npm run money:week -- --weeks 12
 *   npm run money:week -- --apply            # upserts the rows into Notion
 *
 * Sources, each named in the row's Source field:
 *   Square API (SQUARE_ACCESS_TOKEN, The Harvest location): taken, sales, heads, card fees, cash.
 *   Supabase xero_transactions mirror (ACT infra .env.local creds): Bidfood out, wages out (477/478), other ACT-HV spend.
 *   Xero API (ACT OAuth app, token in Supabase xero_tokens): bank balance at week end, whole sole trader file.
 *   Notion: NOTION_TOKEN (this repo .env) or NOTION_TOKEN from ACT infra .env.local; database NOTION_MONEY_DB_ID.
 * Founder labour is not a cost line here. Net week is honest only about cash that moved.
 */
import { createClient } from "@supabase/supabase-js";
import { config as dotenv } from "dotenv";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const AGI = join(homedir(), "Code/act-global-infrastructure");
const agiEnv = join(AGI, ".env.local");
dotenv({ path: ".env" });
const local = { NOTION_TOKEN: process.env.NOTION_TOKEN };
if (existsSync(agiEnv)) dotenv({ path: agiEnv });
if (local.NOTION_TOKEN && !process.env.NOTION_TOKEN_ACT) process.env.NOTION_TOKEN_ACT = process.env.NOTION_TOKEN; // keep both to try

const need = (k: string) => { const v = process.env[k]; if (!v) { console.error(`Missing ${k}`); process.exit(1); } return v; };
const SQUARE = need("SQUARE_ACCESS_TOKEN");
const SQ_LOC = process.env.SQUARE_LOCATION_ID ?? "LQQBD77AGYED7";
const SB_URL = process.env.SUPABASE_SHARED_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || need("SUPABASE_URL");
const SB_KEY = process.env.SUPABASE_SHARED_SERVICE_ROLE_KEY || need("SUPABASE_SERVICE_ROLE_KEY");
const XERO_ID = need("XERO_CLIENT_ID"), XERO_SECRET = need("XERO_CLIENT_SECRET"), XERO_TENANT = need("XERO_TENANT_ID");
const NOTION_DB = process.env.NOTION_MONEY_DB_ID ?? "31cb5ac11b6d4e1eb3163e3082dd7c50";
const NOTION_TOKENS = [local.NOTION_TOKEN, process.env.NOTION_API_KEY, process.env.NOTION_TOKEN].filter((t): t is string => !!t);

const argv = process.argv.slice(2);
const APPLY = argv.includes("--apply");
const WEEKS = Number(argv[argv.indexOf("--weeks") + 1]) || 8;
const TZ = "+10:00";
const sb = createClient(SB_URL, SB_KEY);

// ---- weeks (Brisbane Mondays) ----
const todayBris = new Date(Date.now() + 10 * 3600e3);
const dow = (todayBris.getUTCDay() + 6) % 7;
const thisMonday = new Date(Date.UTC(todayBris.getUTCFullYear(), todayBris.getUTCMonth(), todayBris.getUTCDate() - dow));
const iso = (d: Date) => d.toISOString().slice(0, 10);
const weeks: { start: string; end: string }[] = [];
for (let i = WEEKS - 1; i >= 0; i--) { const s = new Date(thisMonday); s.setUTCDate(s.getUTCDate() - 7 * i); const e = new Date(s); e.setUTCDate(e.getUTCDate() + 6); weeks.push({ start: iso(s), end: iso(e) }); }

// ---- Square ----
const SQH = { Authorization: `Bearer ${SQUARE}`, "Content-Type": "application/json", "Square-Version": "2025-01-23" };
async function sq<T>(path: string, body?: unknown): Promise<T> {
  const r = await fetch(`https://connect.squareup.com/v2${path}`, { method: body ? "POST" : "GET", headers: SQH, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(`Square ${path} ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json() as Promise<T>;
}
interface Money { amount?: number }
interface Order { id: string; closed_at?: string; line_items?: { name?: string; quantity?: string; total_money?: Money }[]; total_money?: Money }
interface Payment { order_id?: string; status?: string; source_type?: string; amount_money?: Money; processing_fee?: { amount_money?: Money }[] }
const cents = (m?: Money) => (m?.amount ?? 0) / 100;
async function squareWeek(start: string, end: string) {
  const orders: Order[] = []; let cursor: string | undefined;
  do {
    const p = await sq<{ orders?: Order[]; cursor?: string }>("/orders/search", { location_ids: [SQ_LOC], limit: 500, cursor, query: { filter: { state_filter: { states: ["COMPLETED"] }, date_time_filter: { closed_at: { start_at: `${start}T00:00:00${TZ}`, end_at: `${end}T23:59:59${TZ}` } } } } });
    orders.push(...(p.orders ?? [])); cursor = p.cursor;
  } while (cursor);
  const fees = new Map<string, number>(); let cash = 0; let pc: string | undefined;
  do {
    const p = await sq<{ payments?: Payment[]; cursor?: string }>(`/payments?begin_time=${encodeURIComponent(`${start}T00:00:00${TZ}`)}&end_time=${encodeURIComponent(`${end}T23:59:59${TZ}`)}&location_id=${SQ_LOC}&limit=100${pc ? `&cursor=${pc}` : ""}`);
    for (const pay of p.payments ?? []) { if (pay.status !== "COMPLETED") continue; if (pay.order_id) fees.set(pay.order_id, (fees.get(pay.order_id) ?? 0) + (pay.processing_fee ?? []).reduce((a, f) => a + cents(f.amount_money), 0)); if (pay.source_type === "CASH") cash += cents(pay.amount_money); }
    pc = p.cursor;
  } while (pc);
  let taken = 0, heads = 0, cardFees = 0;
  for (const o of orders) {
    taken += cents(o.total_money); cardFees += fees.get(o.id) ?? 0;
    for (const li of o.line_items ?? []) { const n = li.name ?? ""; if (/all you can eat/i.test(n) || (/kid/i.test(n) && /free|eat/i.test(n)) || /visitor|not eating/i.test(n)) heads += Number(li.quantity ?? 0); }
  }
  return { taken, sales: orders.length, heads, cardFees, cash };
}

// ---- Xero mirror ----
interface Row { date: string; type: string; contact_name: string | null; total: number; project_code: string | null; line_items: { account_code?: string; line_amount?: number; tracking?: { Name: string; Option: string }[] }[] | null }
const { data: rowsRaw, error } = await sb.from("xero_transactions").select("date,type,contact_name,total,project_code,line_items").gte("date", weeks[0].start).lte("date", weeks[weeks.length - 1].end);
if (error) throw new Error(error.message);
const rows = (rowsRaw ?? []) as Row[];
const isHV = (r: Row, li?: Row["line_items"] extends (infer L)[] | null ? L : never) => (li?.tracking?.find((t) => t.Name === "Project Tracking")?.Option ?? "").startsWith("ACT-HV") || r.project_code === "ACT-HV";
function mirrorWeek(start: string, end: string) {
  let bidfood = 0, wages = 0, other = 0;
  for (const r of rows) {
    if (r.date < start || r.date > end || r.type !== "SPEND") continue;
    if (/^bidfood/i.test(r.contact_name ?? "")) { bidfood += Number(r.total); continue; }
    for (const li of r.line_items ?? []) {
      if (!isHV(r, li)) continue;
      const amt = Number(li.line_amount ?? 0);
      if (li.account_code === "477" || li.account_code === "478") wages += amt; else other += amt;
    }
  }
  return { bidfood, wages, other };
}

// ---- Xero bank balance (ACT OAuth app) ----
async function xeroToken(): Promise<string> {
  const { data: row } = await sb.from("xero_tokens").select("refresh_token").eq("id", "default").single();
  if (!row?.refresh_token) throw new Error("No Xero refresh token in xero_tokens");
  const r = await fetch("https://identity.xero.com/connect/token", { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${XERO_ID}:${XERO_SECRET}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: row.refresh_token }) });
  if (!r.ok) throw new Error(`Xero token ${r.status}`);
  const t = await r.json();
  await sb.from("xero_tokens").upsert({ id: "default", refresh_token: t.refresh_token, access_token: t.access_token, expires_at: new Date(Date.now() + t.expires_in * 1000 - 60000).toISOString(), updated_at: new Date().toISOString(), updated_by: "harvest-money-week" }, { onConflict: "id" });
  if (existsSync(agiEnv)) { let b = readFileSync(agiEnv, "utf8"); b = /^XERO_REFRESH_TOKEN=/m.test(b) ? b.replace(/^XERO_REFRESH_TOKEN=.*/m, `XERO_REFRESH_TOKEN=${t.refresh_token}`) : `${b.trimEnd()}\nXERO_REFRESH_TOKEN=${t.refresh_token}\n`; writeFileSync(agiEnv, b); }
  return t.access_token;
}
const xt = await xeroToken();
async function bankBalance(date: string): Promise<number | null> {
  const r = await fetch(`https://api.xero.com/api.xro/2.0/Reports/BankSummary?fromDate=${date}&toDate=${date}`, { headers: { Authorization: `Bearer ${xt}`, "xero-tenant-id": XERO_TENANT, Accept: "application/json" } });
  if (!r.ok) return null;
  const j = await r.json() as { Reports?: { Rows?: { RowType: string; Rows?: { Cells?: { Value?: string }[] }[] }[] }[] };
  // Cells: name, opening, received, spent, closing. Only the business account Harvest trades through; not the credit card, not Nic's personal account.
  for (const sec of j.Reports?.[0]?.Rows ?? []) for (const row of sec.Rows ?? []) { const cells = row.Cells ?? []; if (row.RowType === "Row" && /ACT Everyday/i.test(cells[0]?.Value ?? "")) { const closing = Number(cells[cells.length - 1]?.Value ?? ""); return isNaN(closing) ? null : closing; } }
  return null;
}

// ---- Notion ----
const NH = (tok: string) => ({ Authorization: `Bearer ${tok}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" });
async function notionToken(): Promise<string | null> {
  for (const t of NOTION_TOKENS) { const r = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB}`, { headers: NH(t) }); if (r.ok) return t; }
  return null;
}
async function upsert(tok: string, w: Record<string, unknown>, title: string) {
  const q = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB}/query`, { method: "POST", headers: NH(tok), body: JSON.stringify({ filter: { property: "Week starting", date: { equals: w.start as string } } }) });
  const found = ((await q.json()) as { results?: { id: string }[] }).results?.[0];
  const num = (n: number | null) => (n === null ? { number: null } : { number: Math.round(n * 100) / 100 });
  const props = {
    Week: { title: [{ text: { content: title } }] },
    "Week starting": { date: { start: w.start as string } },
    "Square taken": num(w.taken as number), Sales: num(w.sales as number), Heads: num(w.heads as number), "Card fees": num(w.cardFees as number), Cash: num(w.cash as number),
    "Bidfood out": num(w.bidfood as number), "Wages out": num(w.wages as number), "Other Harvest spend": num(w.other as number), "Net week": num(w.net as number), "Bank balance": num(w.bank as number | null),
    Status: { select: { name: w.status as string } },
    Source: { rich_text: [{ text: { content: w.source as string } }] },
  };
  const r = found
    ? await fetch(`https://api.notion.com/v1/pages/${found.id}`, { method: "PATCH", headers: NH(tok), body: JSON.stringify({ properties: props }) })
    : await fetch(`https://api.notion.com/v1/pages`, { method: "POST", headers: NH(tok), body: JSON.stringify({ parent: { database_id: NOTION_DB }, properties: props }) });
  if (!r.ok) throw new Error(`Notion ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return found ? "updated" : "created";
}

// ---- run ----
const weekendLabel = (start: string, end: string) => {
  const fri = new Date(start + "T00:00:00Z"); fri.setUTCDate(fri.getUTCDate() + 4);
  const sun = new Date(end + "T00:00:00Z");
  const d = (x: Date) => x.getUTCDate();
  const mon = (x: Date) => x.toLocaleString("en-AU", { month: "short", timeZone: "UTC" });
  return fri.getUTCMonth() === sun.getUTCMonth() ? `Weekend ${d(fri)} to ${d(sun)} ${mon(sun)} ${sun.getUTCFullYear()}` : `Weekend ${d(fri)} ${mon(fri)} to ${d(sun)} ${mon(sun)} ${sun.getUTCFullYear()}`;
};
const fmt = (n: number | null) => (n === null ? "n/a" : "$" + n.toLocaleString("en-AU", { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
const now = new Date().toISOString().slice(0, 16).replace("T", " ");
const tok = APPLY ? await notionToken() : null;
if (APPLY && !tok) { console.error("No Notion token can read the Money, weekly database. Share the database with the integration in Notion (... > Connections), or put a working NOTION_TOKEN in .env."); process.exit(1); }
console.log(`Money, weekly ${APPLY ? "*** APPLY ***" : "(dry run)"} | ${weeks[0].start} to ${weeks[weeks.length - 1].end}\n`);
console.log("week (Mon)  taken   sales heads   fees   cash  bidfood  wages  other     net     bank  status");
for (const wk of weeks) {
  const s = await squareWeek(wk.start, wk.end);
  const m = mirrorWeek(wk.start, wk.end);
  const bank = await bankBalance(wk.end);
  const net = s.taken - s.cardFees - m.bidfood - m.wages - m.other;
  const partial = wk.end >= iso(new Date(Date.now() + 10 * 3600e3 - 3 * 86400e3));
  const status = partial ? "Partial" : net >= 0 ? "Green" : "Red";
  const w = { ...s, ...m, net, bank, status, start: wk.start, source: `harvest-money-week ${now} AEST: Square API (The Harvest, closed orders + payments), xero_transactions mirror (Bidfood by contact, 477/478 wages, other ACT-HV spend), Xero BankSummary at ${wk.end}, account NJ Marchesi T/as ACT Everyday only. Founder labour not counted.` };
  console.log(`${wk.start}  ${fmt(s.taken).padStart(7)} ${String(s.sales).padStart(5)} ${String(s.heads).padStart(5)} ${fmt(s.cardFees).padStart(6)} ${fmt(s.cash).padStart(6)} ${fmt(m.bidfood).padStart(8)} ${fmt(m.wages).padStart(6)} ${fmt(m.other).padStart(6)} ${fmt(net).padStart(7)} ${fmt(bank).padStart(8)}  ${status}`);
  if (APPLY && tok) console.log(`             -> Notion ${await upsert(tok, w, weekendLabel(wk.start, wk.end))}`);
}
if (!APPLY) console.log("\nDry run. Add --apply to write the rows to Notion.");
