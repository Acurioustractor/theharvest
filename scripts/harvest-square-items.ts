/**
 * Create the two $0 head-count items in the Harvest Square catalog (idempotent by name).
 *   npm run square:items            # dry run: shows what exists and what would be created
 *   npm run square:items -- --apply # creates them (Square catalog write)
 * Items: "Kid eats free" and "Visitor, not eating", $0, category "Pizza night", visible at The Harvest location.
 */
import { config as dotenv } from "dotenv";
import { randomUUID } from "node:crypto";
dotenv({ path: ".env" });
const TOKEN = process.env.SQUARE_ACCESS_TOKEN; if (!TOKEN) { console.error("SQUARE_ACCESS_TOKEN missing"); process.exit(1); }
const API = "https://connect.squareup.com/v2";
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", "Square-Version": "2025-01-23" };
const APPLY = process.argv.includes("--apply");
const HARVEST_LOCATION = process.env.SQUARE_LOCATION_ID ?? "LQQBD77AGYED7";
const ITEMS = [
  { name: "Kid eats free", desc: "One per child eating. $0. Rung in the same sale as the adults so heads are exact." },
  { name: "Visitor, not eating", desc: "One per person on site who is not eating: sauna, drink only, just visiting. $0." },
];
const CATEGORY = "Pizza night";

async function sq<T>(path: string, body?: unknown): Promise<T> {
  const r = await fetch(`${API}${path}`, { method: body ? "POST" : "GET", headers: H, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(`${path} ${r.status}: ${(await r.text()).slice(0, 500)}`);
  return r.json() as Promise<T>;
}
interface Obj { id: string; type: string; item_data?: { name?: string }; category_data?: { name?: string } }
const existing: Obj[] = []; let cursor: string | undefined;
do { const p = await sq<{ objects?: Obj[]; cursor?: string }>(`/catalog/list?types=ITEM,CATEGORY${cursor ? `&cursor=${cursor}` : ""}`); existing.push(...(p.objects ?? [])); cursor = p.cursor; } while (cursor);
const cat = existing.find((o) => o.type === "CATEGORY" && o.category_data?.name?.toLowerCase() === CATEGORY.toLowerCase());
const have = new Map(existing.filter((o) => o.type === "ITEM").map((o) => [o.item_data?.name?.toLowerCase() ?? "", o.id]));
const toCreate = ITEMS.filter((i) => !have.has(i.name.toLowerCase()));
console.log(`Category "${CATEGORY}": ${cat ? "exists" : "will be created"}`);
for (const i of ITEMS) console.log(`  ${have.has(i.name.toLowerCase()) ? "[exists]" : "[create]"} ${i.name}`);
if (!toCreate.length) { console.log("Nothing to create."); process.exit(0); }
if (!APPLY) { console.log("\nDry run. Add --apply to create."); process.exit(0); }

const catId = cat?.id ?? "#pizza-night";
const objects: unknown[] = [];
if (!cat) objects.push({ type: "CATEGORY", id: catId, present_at_all_locations: true, category_data: { name: CATEGORY } });
for (const i of toCreate) {
  const iid = `#${i.name.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  objects.push({ type: "ITEM", id: iid, present_at_all_locations: false, present_at_location_ids: [HARVEST_LOCATION], item_data: {
    name: i.name, description: i.desc, categories: [{ id: catId }], reporting_category: { id: catId },
    variations: [{ type: "ITEM_VARIATION", id: `${iid}-reg`, present_at_all_locations: false, present_at_location_ids: [HARVEST_LOCATION], item_variation_data: { item_id: iid, name: "Regular", pricing_type: "FIXED_PRICING", price_money: { amount: 0, currency: "AUD" } } }],
  } });
}
const res = await sq<{ objects?: Obj[]; id_mappings?: { client_object_id: string; object_id: string }[] }>("/catalog/batch-upsert", { idempotency_key: randomUUID(), batches: [{ objects }] });
console.log(`Created: ${(res.objects ?? []).map((o) => `${o.type} ${o.item_data?.name ?? o.category_data?.name ?? ""} (${o.id})`).join(", ")}`);
console.log("Now add both to the till favourites next to All You Can Eat, and tell Dennis: ring them in the same sale as the adults.");
