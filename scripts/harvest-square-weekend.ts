/**
 * Harvest weekend review from Square CSV exports. Read-only, local files only.
 *
 *   npm run square:weekend                       # reads every CSV in thoughts/shared/square-exports/
 *   npm run square:weekend -- --from 2026-09-04 --to 2026-09-06
 *
 * Export from Square Dashboard > Reports:
 *   - "Item sales" (Items) with the date range, Export > CSV  -> item lines
 *   - "Transactions" with the same range, Export > CSV        -> one row per sale (covers, fees, card vs cash)
 * Drop both files in thoughts/shared/square-exports/. Names do not matter; columns are detected.
 *
 * Output: per day and total: sales count, gross, discounts, net, fees, card vs cash, average sale,
 * items by category, top items, pizzas per sale and drinks per sale. Those last two are the numbers
 * model.ts section E has been waiting for since July.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "thoughts/shared/square-exports";
const argv = process.argv.slice(2);
const opt = (n: string) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : undefined);
const FROM = opt("--from"), TO = opt("--to");

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []; let row: string[] = []; let cell = ""; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some((x) => x.trim()));
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}
const money = (s: string | undefined) => { if (!s) return 0; const n = Number(s.replace(/[^0-9.-]/g, "")); return isNaN(n) ? 0 : n; };
const fmt = (n: number) => "$" + n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const isoDate = (s: string) => { // Square exports dd/mm/yyyy or yyyy-mm-dd depending on locale
  const m = s.match(/(\d{4})-(\d{2})-(\d{2})/); if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const d = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/); if (d) return `${d[3]}-${d[2].padStart(2, "0")}-${d[1].padStart(2, "0")}`;
  return s;
};
const inRange = (d: string) => (!FROM || d >= FROM) && (!TO || d <= TO);
const col = (r: Record<string, string>, ...names: string[]) => { for (const n of names) { const k = Object.keys(r).find((k) => k.toLowerCase() === n.toLowerCase()); if (k) return r[k]; } return undefined; };

let files: string[] = [];
try { files = readdirSync(DIR).filter((f) => f.toLowerCase().endsWith(".csv")); } catch { /* none */ }
if (!files.length) { console.log(`No CSVs in ${DIR}. Export "Item sales" and "Transactions" from Square Dashboard > Reports and drop them there.`); process.exit(0); }

interface Sale { date: string; gross: number; discounts: number; net: number; fees: number; tender: string; id: string }
interface Line { date: string; category: string; item: string; qty: number; net: number; txn: string }
const sales: Sale[] = []; const lines: Line[] = [];
for (const f of files) {
  const rows = parseCsv(readFileSync(join(DIR, f), "utf8"));
  if (!rows.length) continue;
  const keys = Object.keys(rows[0]).map((k) => k.toLowerCase());
  const isItems = keys.includes("item") && keys.includes("qty");
  const isTxns = !isItems && keys.some((k) => k === "transaction id") && keys.some((k) => k.includes("gross sales"));
  for (const r of rows) {
    const date = isoDate(col(r, "Date") ?? "");
    if (!inRange(date)) continue;
    if (isItems) {
      const ev = (col(r, "Event Type") ?? "").toLowerCase();
      if (ev.includes("refund")) continue;
      lines.push({ date, category: col(r, "Category") || "(no category)", item: col(r, "Item") || "(no item)", qty: money(col(r, "Qty")), net: money(col(r, "Net Sales")), txn: col(r, "Transaction ID") ?? "" });
    } else if (isTxns) {
      const ev = (col(r, "Event Type") ?? "").toLowerCase();
      if (ev.includes("refund")) continue;
      const card = money(col(r, "Card")), cash = money(col(r, "Cash"));
      sales.push({ date, gross: money(col(r, "Gross Sales")), discounts: money(col(r, "Discounts")), net: money(col(r, "Net Sales")), fees: Math.abs(money(col(r, "Fees"))), tender: cash > 0 && card === 0 ? "cash" : "card", id: col(r, "Transaction ID") ?? "" });
    }
  }
  console.log(`${f}: ${isItems ? "item lines" : isTxns ? "transactions" : "unrecognised, skipped"} (${rows.length} rows)`);
}

const days = [...new Set([...sales.map((s) => s.date), ...lines.map((l) => l.date)])].sort();
const isPizza = (l: Line) => /pizza/i.test(l.item) || /pizza/i.test(l.category);
const isDrink = (l: Line) => /drink|beverage|soda|kombucha|coffee|beer|wine|juice/i.test(l.category) || /kombucha|soda|coffee|beer|wine|juice|ginger|lemonade|cola|water/i.test(l.item);

const report = (label: string, S: Sale[], L: Line[]) => {
  const n = S.length, gross = S.reduce((a, s) => a + s.gross, 0), disc = S.reduce((a, s) => a + s.discounts, 0), net = S.reduce((a, s) => a + s.net, 0), fees = S.reduce((a, s) => a + s.fees, 0);
  const cash = S.filter((s) => s.tender === "cash").reduce((a, s) => a + s.net, 0);
  const txns = new Set(L.map((l) => l.txn).filter(Boolean)).size || n;
  const pizzas = L.filter(isPizza).reduce((a, l) => a + l.qty, 0), drinks = L.filter(isDrink).reduce((a, l) => a + l.qty, 0);
  console.log(`\n${"=".repeat(70)}\n${label}\n${"=".repeat(70)}`);
  if (n) console.log(`  sales ${n}  gross ${fmt(gross)}  discounts ${fmt(disc)}  net ${fmt(net)}  fees ${fmt(fees)}  keeps ${fmt(net - fees)}\n  average sale ${fmt(n ? net / n : 0)}  cash ${fmt(cash)} (${net ? Math.round((cash / net) * 100) : 0}%)`);
  if (L.length) {
    const byCat = new Map<string, { qty: number; net: number }>();
    for (const l of L) { const c = byCat.get(l.category) ?? { qty: 0, net: 0 }; c.qty += l.qty; c.net += l.net; byCat.set(l.category, c); }
    console.log(`  items: ${L.reduce((a, l) => a + l.qty, 0)} across ${txns} sales.  pizzas ${pizzas} (${(pizzas / txns).toFixed(2)} per sale)  drinks ${drinks} (${(drinks / txns).toFixed(2)} per sale)`);
    console.log(`  by category:`);
    for (const [c, v] of [...byCat].sort((a, b) => b[1].net - a[1].net)) console.log(`    ${c.padEnd(28)} ${String(v.qty).padStart(5)}  ${fmt(v.net).padStart(11)}`);
    const byItem = new Map<string, { qty: number; net: number }>();
    for (const l of L) { const c = byItem.get(l.item) ?? { qty: 0, net: 0 }; c.qty += l.qty; c.net += l.net; byItem.set(l.item, c); }
    console.log(`  top items:`);
    for (const [i, v] of [...byItem].sort((a, b) => b[1].net - a[1].net).slice(0, 12)) console.log(`    ${i.slice(0, 28).padEnd(28)} ${String(v.qty).padStart(5)}  ${fmt(v.net).padStart(11)}`);
  }
};
for (const d of days) report(d, sales.filter((s) => s.date === d), lines.filter((l) => l.date === d));
if (days.length > 1) report(`TOTAL ${days[0]} to ${days[days.length - 1]}`, sales, lines);
console.log(`\nFor model.ts section E: coversPerSession = sales per session day, averageTicketGross = average sale, pizzasPerCover and drinkAttachRate above, merchantFeeRate = fees / gross.`);
