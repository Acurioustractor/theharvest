/**
 * Pull orders straight from Square (read-only) and print the weekend review.
 *
 *   npm run square:pull                                  # last 7 days
 *   npm run square:pull -- --from 2026-09-04 --to 2026-09-06
 *   npm run square:pull -- --from 2026-09-04 --to 2026-09-06 --csv   # also writes CSVs into thoughts/shared/square-exports/
 *
 * Needs SQUARE_ACCESS_TOKEN in .env (a production access token from developer.squareup.com,
 * read-only scopes: ORDERS_READ, PAYMENTS_READ, ITEMS_READ, MERCHANT_PROFILE_READ). Optional
 * SQUARE_LOCATION_ID; if unset, every location on the account is included.
 * Never writes to Square. Dates are Brisbane (UTC+10) calendar days.
 */
import { config as dotenv } from "dotenv";
import { mkdirSync, writeFileSync } from "node:fs";
dotenv({ path: ".env" });

const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
if (!TOKEN) { console.error("SQUARE_ACCESS_TOKEN missing in .env. Create a read-only production token at developer.squareup.com (Applications > your app > Production > Access token) and add SQUARE_ACCESS_TOKEN=... to .env."); process.exit(1); }
const API = "https://connect.squareup.com/v2";
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", "Square-Version": "2025-01-23" };
const argv = process.argv.slice(2);
const opt = (n: string) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : undefined);
const TZ = "+10:00";
const today = new Date(Date.now() + 10 * 3600e3).toISOString().slice(0, 10);
const FROM = opt("--from") ?? new Date(Date.now() + 10 * 3600e3 - 6 * 86400e3).toISOString().slice(0, 10);
const TO = opt("--to") ?? today;

async function sq<T>(path: string, body?: unknown): Promise<T> {
  const r = await fetch(`${API}${path}`, { method: body ? "POST" : "GET", headers: H, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(`${path} ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json() as Promise<T>;
}
interface Money { amount?: number; currency?: string }
interface LineItem { name?: string; variation_name?: string; quantity?: string; catalog_object_id?: string; gross_sales_money?: Money; total_discount_money?: Money; total_money?: Money; total_tax_money?: Money }
interface Tender { type?: string; amount_money?: Money; processing_fee_money?: Money }
interface Order { id: string; closed_at?: string; created_at?: string; state?: string; line_items?: LineItem[]; total_money?: Money; total_discount_money?: Money; total_tax_money?: Money; tenders?: Tender[]; refunds?: unknown[] }

const cents = (m?: Money) => (m?.amount ?? 0) / 100;
const locs = (await sq<{ locations: { id: string; name: string }[] }>("/locations")).locations ?? [];
const locIds = process.env.SQUARE_LOCATION_ID ? [process.env.SQUARE_LOCATION_ID] : locs.map((l) => l.id);
console.log(`Square locations: ${locs.map((l) => `${l.name} (${l.id})`).join(", ")}`);

// Catalog: variation -> item -> category name
const cat = new Map<string, string>(); const itemCat = new Map<string, string>(); const varItem = new Map<string, string>();
let cursor: string | undefined;
do {
  const page = await sq<{ objects?: { id: string; type: string; category_data?: { name: string }; item_data?: { name?: string; category_id?: string; reporting_category?: { id: string }; variations?: { id: string }[] } }[]; cursor?: string }>(`/catalog/list?types=ITEM,CATEGORY${cursor ? `&cursor=${cursor}` : ""}`);
  for (const o of page.objects ?? []) {
    if (o.type === "CATEGORY" && o.category_data) cat.set(o.id, o.category_data.name);
    if (o.type === "ITEM" && o.item_data) { const c = o.item_data.reporting_category?.id ?? o.item_data.category_id; if (c) itemCat.set(o.id, c); for (const v of o.item_data.variations ?? []) varItem.set(v.id, o.id); }
  }
  cursor = page.cursor;
} while (cursor);
const categoryOf = (li: LineItem) => { const item = li.catalog_object_id ? varItem.get(li.catalog_object_id) : undefined; const c = item ? itemCat.get(item) : undefined; return (c && cat.get(c)) || "(no category)"; };

// Orders
const orders: Order[] = []; cursor = undefined;
do {
  const page = await sq<{ orders?: Order[]; cursor?: string }>("/orders/search", { location_ids: locIds, limit: 500, cursor, query: { filter: { state_filter: { states: ["COMPLETED"] }, date_time_filter: { closed_at: { start_at: `${FROM}T00:00:00${TZ}`, end_at: `${TO}T23:59:59${TZ}` } } }, sort: { sort_field: "CLOSED_AT", sort_order: "ASC" } } });
  orders.push(...(page.orders ?? [])); cursor = page.cursor;
} while (cursor);
console.log(`${orders.length} completed orders ${FROM} to ${TO}`);

// Payments carry the processing fee and the tender type; orders often do not.
interface Payment { id: string; order_id?: string; status?: string; source_type?: string; amount_money?: Money; processing_fee?: { amount_money?: Money }[]; created_at?: string }
const payByOrder = new Map<string, { fee: number; cash: number; card: number }>();
let pc: string | undefined; let paymentCount = 0;
do {
  const page = await sq<{ payments?: Payment[]; cursor?: string }>(`/payments?begin_time=${encodeURIComponent(`${FROM}T00:00:00${TZ}`)}&end_time=${encodeURIComponent(`${TO}T23:59:59${TZ}`)}&limit=100${pc ? `&cursor=${pc}` : ""}`);
  for (const p of page.payments ?? []) {
    if (p.status !== "COMPLETED" || !p.order_id) continue;
    paymentCount++;
    const e = payByOrder.get(p.order_id) ?? { fee: 0, cash: 0, card: 0 };
    e.fee += (p.processing_fee ?? []).reduce((a, f) => a + cents(f.amount_money), 0);
    if (p.source_type === "CASH") e.cash += cents(p.amount_money); else e.card += cents(p.amount_money);
    payByOrder.set(p.order_id, e);
  }
  pc = page.cursor;
} while (pc);
console.log(`${paymentCount} completed payments\n`);

const fmt = (n: number) => "$" + n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dayOf = (o: Order) => new Date(new Date(o.closed_at ?? o.created_at ?? "").getTime() + 10 * 3600e3).toISOString().slice(0, 10);
const isPizza = (n: string, c: string) => /pizza/i.test(n) || /pizza/i.test(c);
// Head count: paying adults + $0 head-count items (see the review page: "Kid eats free", "Visitor, not eating").
const isAdult = (n: string) => /all you can eat/i.test(n);
const isKid = (n: string) => /kid/i.test(n) && /free|eat/i.test(n);
const isVisitor = (n: string) => /visitor|not eating|sauna only/i.test(n);
const isDrink = (n: string, c: string) => /drink|beverage|soda|kombucha|coffee|beer|wine|juice/i.test(c) || /kombucha|soda|coffee|beer|wine|juice|ginger|lemonade|cola|water/i.test(n);

const report = (label: string, O: Order[]) => {
  const n = O.length;
  const gross = O.reduce((a, o) => a + cents(o.total_money) + cents(o.total_discount_money), 0);
  const disc = O.reduce((a, o) => a + cents(o.total_discount_money), 0);
  const total = O.reduce((a, o) => a + cents(o.total_money), 0);
  const fees = O.reduce((a, o) => a + (payByOrder.get(o.id)?.fee ?? (o.tenders ?? []).reduce((b, t) => b + cents(t.processing_fee_money), 0)), 0);
  const cash = O.reduce((a, o) => a + (payByOrder.get(o.id)?.cash ?? (o.tenders ?? []).filter((t) => t.type === "CASH").reduce((b, t) => b + cents(t.amount_money), 0)), 0);
  const byCat = new Map<string, { qty: number; net: number }>(); const byItem = new Map<string, { qty: number; net: number }>();
  let pizzas = 0, drinks = 0, items = 0, adults = 0, kids = 0, visitors = 0;
  for (const o of O) for (const li of o.line_items ?? []) {
    const q = Number(li.quantity ?? 0), net = cents(li.total_money) - cents(li.total_tax_money), c = categoryOf(li), name = `${li.name ?? "(item)"}${li.variation_name && li.variation_name !== "Regular" ? ` / ${li.variation_name}` : ""}`;
    items += q; if (isPizza(name, c)) pizzas += q; if (isDrink(name, c)) drinks += q;
    if (isAdult(name)) adults += q; else if (isKid(name)) kids += q; else if (isVisitor(name)) visitors += q;
    const a = byCat.get(c) ?? { qty: 0, net: 0 }; a.qty += q; a.net += net; byCat.set(c, a);
    const b = byItem.get(name) ?? { qty: 0, net: 0 }; b.qty += q; b.net += net; byItem.set(name, b);
  }
  console.log(`${"=".repeat(70)}\n${label}\n${"=".repeat(70)}`);
  console.log(`  sales ${n}  gross ${fmt(gross)}  discounts ${fmt(disc)}  taken ${fmt(total)}  card fees ${fmt(fees)}  keeps ${fmt(total - fees)}`);
  console.log(`  average sale ${fmt(n ? total / n : 0)}  cash ${fmt(cash)} (${total ? Math.round((cash / total) * 100) : 0}%)  fee rate ${gross ? ((fees / total) * 100).toFixed(2) : "0"}%`);
  const heads = adults + kids + visitors;
  console.log(`  heads ${heads} = adults ${adults} + kids ${kids} + visitors ${visitors}   (${kids + visitors === 0 ? "no $0 head-count items rung yet" : "from $0 items"})`);
  console.log(`  items ${items}  pizzas ${pizzas} (${n ? (pizzas / n).toFixed(2) : 0} per sale)  drinks ${drinks} (${heads ? (drinks / heads).toFixed(2) : 0} per head)`);
  console.log(`  by category (net of GST):`);
  for (const [c, v] of [...byCat].sort((a, b) => b[1].net - a[1].net)) console.log(`    ${c.slice(0, 28).padEnd(28)} ${String(v.qty).padStart(5)}  ${fmt(v.net).padStart(11)}`);
  console.log(`  top items:`);
  for (const [i, v] of [...byItem].sort((a, b) => b[1].net - a[1].net).slice(0, 12)) console.log(`    ${i.slice(0, 28).padEnd(28)} ${String(v.qty).padStart(5)}  ${fmt(v.net).padStart(11)}`);
  console.log();
};
const days = [...new Set(orders.map(dayOf))].sort();
for (const d of days) report(d, orders.filter((o) => dayOf(o) === d));
if (days.length > 1) report(`TOTAL ${FROM} to ${TO}`, orders);

if (argv.includes("--csv")) {
  mkdirSync("thoughts/shared/square-exports", { recursive: true });
  const q = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const tx = ["Date,Time,Gross Sales,Discounts,Net Sales,Fees,Card,Cash,Transaction ID,Event Type"];
  const it = ["Date,Time,Category,Item,Qty,Gross Sales,Discounts,Net Sales,Tax,Transaction ID,Event Type"];
  for (const o of orders) {
    const d = dayOf(o), t = (o.closed_at ?? "").slice(11, 19);
    const pay = payByOrder.get(o.id); const card = pay?.card ?? cents(o.total_money), cash = pay?.cash ?? 0;
    tx.push([d, t, cents(o.total_money) + cents(o.total_discount_money), cents(o.total_discount_money), cents(o.total_money), pay?.fee ?? 0, card, cash, o.id, "Payment"].map(String).map(q).join(","));
    for (const li of o.line_items ?? []) it.push([d, t, categoryOf(li), li.name ?? "", li.quantity ?? "0", cents(li.gross_sales_money), cents(li.total_discount_money), cents(li.total_money) - cents(li.total_tax_money), cents(li.total_tax_money), o.id, "Payment"].map(String).map(q).join(","));
  }
  writeFileSync(`thoughts/shared/square-exports/square-transactions-${FROM}-to-${TO}.csv`, tx.join("\n"));
  writeFileSync(`thoughts/shared/square-exports/square-items-${FROM}-to-${TO}.csv`, it.join("\n"));
  console.log(`CSVs written to thoughts/shared/square-exports/.`);
}
