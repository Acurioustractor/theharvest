/**
 * The Harvest: people on site, rent flows, and which entity books what.
 * Run: npx tsx .scratch/harvest-financial-model/people-places-entities.ts
 *
 * Added 2026-09-07 after the first green week. Sits beside model.ts (cost base,
 * scenarios, contribution) and does NOT repeat it. This file holds the three
 * things the money model did not have a place for:
 *   1. People who live or work across more than one ACT project (Joey, Susie,
 *      Dennis, Trina) and how their cost and their rent should be split.
 *   2. Rent flowing the other way: Joey living at The Harvest, Susie renting at
 *      the Farm. These are income lines nobody has modelled.
 *   3. The entity map: which legal entity books each kind of money today, and
 *      which one should after the Harvest Pty exists.
 *
 * Every figure carries a source and a confidence. `null` means nobody has
 * written the number down anywhere an agent can read. Do not fill a null from
 * memory; ask Ben or Nic.
 */

type Confidence = "verified" | "inferred" | "assumption" | "unknown";

/* ------------------------------------------------------------------ *
 * 1. PEOPLE ACROSS PROJECTS
 * Share is the fraction of the person's paid time each project carries.
 * Shares must sum to 1. Harvest's cost = cost x share.
 * ------------------------------------------------------------------ */

type Project = "harvest" | "goods" | "farm" | "act";

interface Person {
  name: string;
  role: string;
  monthlyCost: number | null; // employer cost incl. super + WorkCover where known
  costConfidence: Confidence;
  costSource: string;
  shares: Partial<Record<Project, number>>;
  sharesConfidence: Confidence;
  livesAt: "harvest" | "farm" | "own" | null;
  note?: string;
}

const PEOPLE: Person[] = [
  {
    name: "Dennis",
    role: "Harvest hospitality lead (pizza, service, Square)",
    monthlyCost: 11224,
    costConfidence: "inferred",
    costSource: "model.ts STAFF_COSTS; staffing-model Option 4 Harvest slice",
    shares: { harvest: 1 },
    sharesConfidence: "inferred",
    livesAt: null,
    note: "10-week trial ended 1 Sep 2026. Whether he continues, and at what rate, is not written down anywhere.",
  },
  {
    name: "Trina",
    role: "Goods on Country bed-production trainee (0.5 FTE)",
    monthlyCost: null,
    costConfidence: "unknown",
    costSource: "staffing-model brief: 'her cost largely Goods', number not isolated",
    shares: { goods: 0.8, harvest: 0.2 },
    sharesConfidence: "assumption",
    livesAt: null,
    note: "The split is the single biggest swing in the staffing brief and was never locked.",
  },
  {
    name: "Joey",
    role: "Community steward; beds, garden, build; also Goods work",
    monthlyCost: 3720,
    costConfidence: "assumption",
    costSource: "act-global-infrastructure/config/harvest-budget.json: $43/h x ~20h/wk, contractor",
    shares: { harvest: 0.6, goods: 0.4 },
    sharesConfidence: "assumption",
    livesAt: "harvest",
    note: "Ben, 7 Sep 2026: Joey will start living at The Harvest and works across Goods and Harvest. Split is a placeholder for Ben and Nic to set. Contractor today; live-in plus set hours looks like employment, ask Standard Ledger.",
  },
  {
    name: "Susie",
    role: "Community steward, operations",
    monthlyCost: 3683,
    costConfidence: "assumption",
    costSource: "harvest-budget.json: $850/wk fixed, contractor",
    shares: { harvest: 0.7, farm: 0.3 },
    sharesConfidence: "assumption",
    livesAt: "farm",
    note: "Rents at the Farm (Ben, 7 Sep). Farm duties exist but are not listed anywhere. Split is a placeholder.",
  },
];

/* ------------------------------------------------------------------ *
 * 2. RENT FLOWING IN
 * Joey at The Harvest and Susie at the Farm are INCOME to whichever entity
 * holds the dwelling. Neither is in model.ts. Both are also FBT questions if
 * the person is an employee and the rent is below market.
 * ------------------------------------------------------------------ */

interface RentIn {
  who: string;
  where: "harvest" | "farm";
  landlordEntity: string;
  weeklyRent: number | null;
  marketWeekly: number | null;
  confidence: Confidence;
  note: string;
}

const RENT_IN: RentIn[] = [
  {
    who: "Joey",
    where: "harvest",
    landlordEntity: "Harvest tenant entity (sole trader today; Harvest Pty once it exists). Sonas is head landlord; sublet permitted without consent under the lease, but a residential sublet inside a commercial lease still needs a written OK.",
    weeklyRent: null,
    marketWeekly: null,
    confidence: "unknown",
    note: "Staffing brief 2026-06 flagged: on-site dwelling exists, Maleny is non-remote, housing FBT ~$30K/yr unless neutralised by a market-rent contribution. Cheapest clean shape: Joey pays market rent, rent is netted against pay, no FBT.",
  },
  {
    who: "Susie",
    where: "farm",
    landlordEntity: "Farm lease sits with Nic's trust -> ACT (subsidiary decision 2026-05-05). Rent Susie pays is Farm income, never Harvest income.",
    weeklyRent: null,
    marketWeekly: null,
    confidence: "unknown",
    note: "If part of Susie's rent is being forgiven in exchange for farm duties, that is wages in kind and belongs on a payslip, not a handshake.",
  },
];

/* ------------------------------------------------------------------ *
 * 3. ENTITY MAP: who books what, today and next
 * Source: CLAUDE.md ACT Context (synced 2026-09-05), subsidiary decision
 * 2026-05-05, Xero org info pulled 2026-09-07 (org = Nicholas Marchesi,
 * ABN 21 591 780 066, sole trader; net profit 1 Jul–7 Sep $42,901 on
 * $227,063 income, all projects mixed, wages $0).
 * ------------------------------------------------------------------ */

interface EntityRule {
  money: string;
  today: string;
  next: string;
  why: string;
}

const ENTITY_MAP: EntityRule[] = [
  {
    money: "Square takings (pizza, drinks, shop), cash tin, sauna sessions, venue hire, tickets",
    today: "Sole trader Xero. VERIFIED 7 Sep: 28 Square settlements ($8,396.50 since 20 Jun) coded to 485 Subscriptions, tagged ACT-CORE or blank. Harvest income reads $0",
    next: "The Harvest Pty Ltd, own Xero file, own bank account, Square settles there",
    why: "Trading footprint with hundreds of small GST transactions; keep it out of the consulting P&L",
  },
  {
    money: "Bidfood, firewood, gas, consumables",
    today: "Sole trader Xero, 12 Bidfood bills $5,855 in 446 Materials & Supplies, mostly tagged ACT-HV (the real tracking option; HARVEST-* codes in the wiki do not exist)",
    next: "Harvest Pty, Cost of Goods Sold (currently $0 in Xero; food inputs are being booked as Materials)",
    why: "Without COGS the food margin cannot be read off the P&L",
  },
  {
    money: "Dennis, Susie, Joey wages (Harvest share)",
    today: "Not in the file at all. No bill, contact or bank line for Dennis, Susie, Joey or Trina since 20 Jun (checked mirror 7 Sep)",
    next: "Harvest Pty payroll; Goods share recharged to ACT Pty (Goods on Country trades through it)",
    why: "The green week is only green because staff cost is missing from the file",
  },
  {
    money: "Trina, Joey time on beds",
    today: "Unbooked",
    next: "A Curious Tractor Pty Ltd trading as Goods on Country, tracking ACT-GD",
    why: "Goods is the R&D claimant and product seller; its labour must sit in its own entity",
  },
  {
    money: "Donations and DGR-receipted gifts for Harvest programmes",
    today: "Nowhere",
    next: "The Butterfly Movement Ltd (Item 1 DGR + PBI) auspices; grants Harvest via a written agreement",
    why: "DGR runs only through Butterfly. Never ACT Pty, never A Kind Tractor, never Harvest Pty",
  },
  {
    money: "A Kind Tractor Ltd",
    today: "Dormant, not DGR",
    next: "Stays dormant. Not a Harvest vehicle",
    why: "Adding it to the map adds a BAS and an ACNC return for nothing",
  },
  {
    money: "Rent Joey pays",
    today: "Nowhere. Account 200 Sales - Rent shows $1,524 Jul–Sep; the only readable posting to it is Dennis's $2,000 refund invoice, so it is miscoded and unreconciled",
    next: "Harvest tenant entity, account 200 Sales - Rent, tagged ACT-HV",
    why: "Income line; also the FBT neutraliser",
  },
  {
    money: "Rent Susie pays",
    today: "Presumably Nic's trust or sole trader; unverified",
    next: "Farm entity when it exists; until then the sole trader with tracking FARM",
    why: "Farm money funds Farm growth; keep it off the Harvest line",
  },
  {
    money: "Shared services (Ben's build time, GHL, Vercel, brand)",
    today: "Unbooked, carried by founders",
    next: "Services Agreement ACT Pty -> Harvest Pty, monthly recharge",
    why: "Lets the landlord read Harvest's real cost on one page",
  },
];

/* ------------------------------------------------------------------ *
 * 4. THE WEEKLY CASH VIEW: the five numbers Ben wants to see on Monday
 * Each row names its source system and whether an agent can read it.
 * ------------------------------------------------------------------ */

interface CashLine {
  line: string;
  source: string;
  agentReadable: "yes" | "no" | "after-setup";
  setup: string;
}

const WEEKLY_VIEW: CashLine[] = [
  { line: "Card takings (gross, fees, net) by day and by item category", source: "Square Sales report", agentReadable: "after-setup", setup: "Square read-only token in Supabase secrets + nightly pull (square-supabase-pull-2026-06.md, never built). Interim: Ben exports CSV every Monday." },
  { line: "Cash takings", source: "Cash tin count sheet", agentReadable: "after-setup", setup: "Record the count as a Square 'cash sale' or a $0 note at close, so Square is the single till record. Otherwise it is a photo of a notebook." },
  { line: "Food and drink inputs (Bidfood, firewood, gas)", source: "Bidfood invoices -> Dext -> Xero bills", agentReadable: "yes", setup: "Code to 310 COGS not 446 Materials; tag ACT-HV. Xero MCP get_bills already reads them." },
  { line: "Wages for the week", source: "Xero payroll", agentReadable: "yes", setup: "Not running. Until payroll exists the weekly view is fiction." },
  { line: "Rent, outgoings, insurance, subscriptions", source: "Xero repeating bills", agentReadable: "yes", setup: "Rent is booked ($9,279 Jul–Sep). Outgoings still 'verify from Sonas' since April." },
  { line: "Rent in (Joey), sauna, venue hire, tickets", source: "Square invoices / GHL payments / Humanitix", agentReadable: "after-setup", setup: "Decide the one booking tool (see plan doc). Everything settles to the Harvest bank account." },
];

/* ------------------------------------------------------------------ *
 * OUTPUT
 * ------------------------------------------------------------------ */

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-AU");

console.log("=".repeat(74));
console.log("PEOPLE ACROSS PROJECTS: Harvest share of monthly cost");
console.log("=".repeat(74));
let harvestStaff = 0;
let unknownCount = 0;
for (const p of PEOPLE) {
  const sharesOk = Math.abs(Object.values(p.shares).reduce((a, b) => a + b, 0) - 1) < 1e-9;
  if (!sharesOk) throw new Error(`${p.name}: shares do not sum to 1`);
  const hv = p.shares.harvest ?? 0;
  const cost = p.monthlyCost === null ? null : p.monthlyCost * hv;
  if (cost === null) unknownCount++; else harvestStaff += cost;
  console.log(`  ${p.name.padEnd(8)} ${String(Math.round(hv * 100)).padStart(3)}% Harvest  ${cost === null ? "   unknown" : money(cost).padStart(10)}  [${p.costConfidence}/${p.sharesConfidence}]  lives: ${p.livesAt ?? "-"}`);
  if (p.note) console.log(`           ${p.note}`);
}
console.log(`\n  Harvest share of known people cost: ${money(harvestStaff)}/month (${unknownCount} person unpriced).`);
console.log(`  model.ts carries Dennis $11,224 + 'Susie + Joey' $8,750 = $19,974. This split view says
  ${money(harvestStaff)} once Goods and Farm carry their share. The difference is not savings; it is
  cost moving to Goods and Farm, which must then afford it.`);

console.log("\n" + "=".repeat(74));
console.log("RENT FLOWING IN: not in model.ts at all");
console.log("=".repeat(74));
for (const r of RENT_IN) {
  console.log(`  ${r.who} at ${r.where}: rent ${r.weeklyRent ?? "unknown"}/wk, market ${r.marketWeekly ?? "unknown"}/wk [${r.confidence}]`);
  console.log(`    books to: ${r.landlordEntity}`);
  console.log(`    ${r.note}`);
}

console.log("\n" + "=".repeat(74));
console.log("ENTITY MAP: who books what");
console.log("=".repeat(74));
for (const e of ENTITY_MAP) {
  console.log(`\n  ${e.money}`);
  console.log(`    today: ${e.today}`);
  console.log(`    next:  ${e.next}`);
  console.log(`    why:   ${e.why}`);
}

console.log("\n" + "=".repeat(74));
console.log("WEEKLY CASH VIEW: what feeds it");
console.log("=".repeat(74));
for (const c of WEEKLY_VIEW) {
  console.log(`  [${c.agentReadable === "yes" ? "x" : c.agentReadable === "no" ? " " : "~"}] ${c.line}`);
  console.log(`      source: ${c.source}`);
  console.log(`      setup:  ${c.setup}`);
}
console.log(`
  [x] readable now  [~] readable after a one-off setup  [ ] not readable

  Unknowns only Ben or Nic can fill (edit the nulls above):
    Joey rent/wk, Joey market rent/wk, Susie rent/wk, Trina monthly cost,
    Joey and Susie and Trina project splits, whether Dennis continues after 1 Sep.`);
