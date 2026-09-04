/**
 * The Harvest — Year 1 financial model
 *
 * Built 2026-07-29. Run with: npx tsx .scratch/harvest-financial-model/model.ts
 *
 * WHY THIS IS CODE AND NOT A SPREADSHEET
 * Every figure carries its source and a confidence level, and the types make it
 * impossible to add a number without saying where it came from. The book value
 * of this file is the provenance, not the arithmetic.
 *
 * THE CENTRAL FINDING THIS MODEL EXISTS TO EXPOSE
 * Harvest's costs are not separable in the ledger. The 1-29 July sole trader P&L
 * shows Rent $0.00, Wages $0.00, Superannuation $0.00, Rates & Water $0.00, against
 * a lease that commenced 1 July at $4,167/month and a staff trial that began 27 June.
 * So every cost line below is a PLAN figure, not an actual. Nothing here is
 * reconciled to the books, because the books cannot currently answer the question.
 *
 * Fix that first. Until Harvest has its own tracking category (or its own entity),
 * this model cannot be validated against reality.
 */

type Confidence =
  | "verified" // queried the source directly
  | "inferred" // derived from a comparable or a listing, not directly confirmed
  | "assumption"; // no external source; planning placeholder, argue with it

interface Line {
  name: string;
  monthly: number;
  confidence: Confidence;
  source: string;
  note?: string;
}

/* ------------------------------------------------------------------ *
 * COSTS
 * ------------------------------------------------------------------ */

const FIXED_COSTS: Line[] = [
  {
    name: "Base rent",
    monthly: 4167,
    confidence: "verified",
    source: "lease.md §3.1(d); $50K/yr, commenced 1 Jul 2026",
  },
  {
    name: "Outgoings (rates, utilities, waste, property insurance)",
    monthly: 1500,
    confidence: "assumption",
    source: "working-capital-plan.md, 24 Apr 2026",
    note: "The plan itself says 'verify from Sonas'. Never verified.",
  },
  {
    name: "Public liability + contents (Harvest portion)",
    monthly: 542,
    confidence: "inferred",
    source: "insurance-harvest-broker-addendum: $5-8K/yr Harvest slice; midpoint $6.5K",
    note: "UNCONFIRMED whether $20M PL is bound at all, or in whose name. See risk note.",
  },
  {
    name: "Accounting (Standard Ledger, BAS + year end, amortised)",
    monthly: 250,
    confidence: "assumption",
    source: "working-capital-plan.md: $2-3K setup + first BAS",
  },
  {
    name: "Xero",
    monthly: 70,
    confidence: "verified",
    source: "working-capital-plan.md, business tier",
  },
  {
    name: "Website, domain, hosting",
    monthly: 100,
    confidence: "verified",
    source: "working-capital-plan.md",
  },
];

const STAFF_COSTS: Line[] = [
  {
    name: "Dennis (hospitality lead, Wed-Sun ~35h)",
    monthly: 11224,
    confidence: "inferred",
    source: "staffing-model: Option 4 Harvest slice ~$25,900 over 10 weeks",
    note: "Includes 12% super + ~2.5% WorkCover. Trial only; ongoing rate not yet decided. A $1,650/wk variant saves ~$15-20K/yr.",
  },
  {
    name: "Susie + Joey (community stewards)",
    monthly: 8750,
    confidence: "assumption",
    source: "staffing-model brief flags this as 'unconfirmed placeholder Ben must lock down'",
    note: "BIGGEST UNKNOWN IN THE MODEL. If additive, it nearly doubles staff cost.",
  },
];

const VARIABLE_COSTS: Line[] = [
  {
    name: "Programming (presenters, materials)",
    monthly: 750,
    confidence: "assumption",
    source: "working-capital-plan.md: $500-1,000/mo, scales with activity",
  },
  {
    name: "Art space consumables",
    monthly: 500,
    confidence: "assumption",
    source: "working-capital-plan.md",
  },
];

/* ------------------------------------------------------------------ *
 * REVENUE ANCHORS
 * Only prices with a real source. Everything else is left for Ben to set,
 * because inventing a price here would be the exact failure this file guards against.
 * ------------------------------------------------------------------ */

interface RevenueAnchor {
  stream: string;
  unitPrice: number | null;
  unit: string;
  confidence: Confidence;
  source: string;
  strand: "sublicence" | "facility" | "programme" | "product";
}

const REVENUE_ANCHORS: RevenueAnchor[] = [
  {
    stream: "DIY pizza",
    unitPrice: 30,
    unit: "per person",
    confidence: "verified",
    source: "editable_content DB, whats-on/pizza-gallery-pizza-body: '$30 each'",
    strand: "programme",
  },
  {
    stream: "Sauna session",
    unitPrice: 45,
    unit: "per session",
    confidence: "inferred",
    source: "Blue Mountains Sauna, Leura: A$45 off-peak / A$55 peak (comparable, not our price)",
    strand: "facility",
  },
  {
    stream: "Membership",
    unitPrice: null,
    unit: "per year",
    confidence: "assumption",
    source: "UNDECIDED. Comparables: CERES A$66/yr, Northey Street $15-125/yr banded",
    strand: "product",
  },
  { stream: "Venue / event space hire", unitPrice: null, unit: "per booking", confidence: "assumption", source: "Unpriced by design: /venue-hire says 'nothing is named or priced yet, on purpose'", strand: "facility" },
  { stream: "Workshops", unitPrice: null, unit: "per head", confidence: "assumption", source: "Not set", strand: "programme" },
  { stream: "Dinner events", unitPrice: null, unit: "per head", confidence: "assumption", source: "Not set. Casual chef days cost $500-1,000/day if Dennis is not cooking", strand: "programme" },
  { stream: "Artists in residence", unitPrice: null, unit: "per residency", confidence: "assumption", source: "Not set. May be cost centre not revenue", strand: "programme" },
  { stream: "Shop (produce, local goods)", unitPrice: null, unit: "margin on turnover", confidence: "assumption", source: "Not set. See harvest-selling-system skill for margin work", strand: "product" },
  { stream: "Garden produce", unitPrice: null, unit: "margin on turnover", confidence: "assumption", source: "Not set", strand: "product" },
  { stream: "The Goods / manufacturing platform", unitPrice: null, unit: "unknown", confidence: "assumption", source: "Goods on Country is a separate project code; may not be Harvest revenue at all", strand: "product" },
  { stream: "Cafe licence fee", unitPrice: null, unit: "per month or % of sales", confidence: "assumption", source: "Sublicenced per operating model. working-capital-plan estimates $0-5K over 4 months", strand: "sublicence" },
  { stream: "Play area", unitPrice: null, unit: "n/a", confidence: "assumption", source: "Co-designed with kids; almost certainly a draw, not a revenue line", strand: "sublicence" },
];

/* ------------------------------------------------------------------ *
 * COMPUTE
 * ------------------------------------------------------------------ */

const sum = (lines: Line[]) => lines.reduce((t, l) => t + l.monthly, 0);
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-AU");

const fixed = sum(FIXED_COSTS);
const staff = sum(STAFF_COSTS);
const variable = sum(VARIABLE_COSTS);
const subtotal = fixed + staff + variable;
const contingency = subtotal * 0.1; // working-capital-plan.md uses 10%
const totalMonthly = subtotal + contingency;

const staffLight = fixed + variable + STAFF_COSTS[0].monthly; // Dennis only
const staffLightTotal = staffLight * 1.1;

console.log("=".repeat(74));
console.log("THE HARVEST — YEAR 1 MONTHLY COST BASE (PLAN, NOT ACTUAL)");
console.log("=".repeat(74));

const show = (label: string, lines: Line[]) => {
  console.log(`\n${label}`);
  for (const l of lines) {
    const flag = l.confidence === "assumption" ? " (!)" : l.confidence === "inferred" ? " (~)" : "";
    console.log(`  ${money(l.monthly).padStart(9)}  ${l.name}${flag}`);
  }
};

show("FIXED", FIXED_COSTS);
show("STAFF", STAFF_COSTS);
show("VARIABLE", VARIABLE_COSTS);

console.log("\n" + "-".repeat(74));
console.log(`  ${money(subtotal).padStart(9)}  subtotal`);
console.log(`  ${money(contingency).padStart(9)}  contingency @ 10%`);
console.log(`  ${money(totalMonthly).padStart(9)}  TOTAL PER MONTH   = ${money(totalMonthly * 12)} / yr`);
console.log("-".repeat(74));
console.log(`\n  Without Susie + Joey (Dennis only): ${money(staffLightTotal)}/mo = ${money(staffLightTotal * 12)}/yr`);
console.log(`  Staff is ${Math.round((staff / subtotal) * 100)}% of the cost base. Rent is ${Math.round((4167 / subtotal) * 100)}%.`);

/* --- Break-even, expressed in the only two units we have real prices for --- */

console.log("\n" + "=".repeat(74));
console.log("BREAK-EVEN, IN THE TWO UNITS WE HAVE A SOURCED PRICE FOR");
console.log("=".repeat(74));
console.log("Gross revenue needed, before cost of goods, wages-to-serve it, or GST.\n");

const pizza = REVENUE_ANCHORS[0].unitPrice!;
const sauna = REVENUE_ANCHORS[1].unitPrice!;

for (const [label, target] of [
  ["Full cost base", totalMonthly],
  ["Dennis only (no Susie + Joey)", staffLightTotal],
  ["Rent + outgoings alone", (4167 + 1500) * 1.1],
] as const) {
  console.log(`${label}: ${money(target)}/mo`);
  console.log(`   ${Math.ceil(target / pizza).toLocaleString()} pizzas @ $${pizza}  (${Math.ceil(target / pizza / 12)} per weekend session, 3 sessions x 4 weeks)`);
  console.log(`   ${Math.ceil(target / sauna).toLocaleString()} sauna sessions @ $${sauna}  (${Math.ceil(target / sauna / 30)} per day, every day)\n`);
}

/* --- The membership question, answered against the real cost base --- */

console.log("=".repeat(74));
console.log("WHAT MEMBERSHIP CAN AND CANNOT DO");
console.log("=".repeat(74));
for (const price of [66, 125, 250, 520]) {
  const members = Math.ceil(totalMonthly * 12 / price);
  console.log(`  At $${price}/yr, covering the full cost base needs ${members.toLocaleString()} members.`);
}
console.log("\n  Witta's population is small. Sanity-check any of these against how many");
console.log("  people could plausibly join before treating membership as a revenue plan.");
console.log("  On the comparables, membership funds belonging. Facilities fund the place.");

/* --- Honesty ledger --- */

const all = [...FIXED_COSTS, ...STAFF_COSTS, ...VARIABLE_COSTS];
const assumptions = all.filter((l) => l.confidence === "assumption");
const assumedValue = sum(assumptions);

console.log("\n" + "=".repeat(74));
console.log("HOW MUCH OF THIS IS GUESSWORK");
console.log("=".repeat(74));
console.log(`  ${money(assumedValue)}/mo of ${money(subtotal)}/mo is (!) assumption, not sourced.`);
console.log(`  That is ${Math.round((assumedValue / subtotal) * 100)}% of the cost base.\n`);
for (const l of assumptions) console.log(`  (!) ${l.name}\n      ${l.note ?? l.source}`);

const unpriced = REVENUE_ANCHORS.filter((r) => r.unitPrice === null);
console.log(`\n  ${unpriced.length} of ${REVENUE_ANCHORS.length} revenue streams have no price set:`);
console.log("  " + unpriced.map((r) => r.stream).join(", "));

console.log("\n" + "=".repeat(74));
console.log("BEFORE THIS MODEL MEANS ANYTHING");
console.log("=".repeat(74));
console.log(`  1. Confirm $20M public liability is bound, and in whose name. Site is open.
  2. Get Harvest costs separable in the ledger. Rent, wages and super are all
     $0.00 in the 1-29 July books against a live lease and a live staff trial.
  3. Lock the Susie + Joey number. It is ${Math.round((8750 / subtotal) * 100)}% of the cost base and it is a placeholder.
  4. Verify outgoings with Sonas. The plan has said "verify" since April.
  5. Then price the facilities. They are what pays; membership is not.`);
console.log("=".repeat(74));

/* ------------------------------------------------------------------ *
 * SCENARIOS
 *
 * These are NOT forecasts. Nobody knows what pizza volumes actually are,
 * because the books do not yet separate July operating revenue. Each
 * scenario is a set of dials, stated openly, so the question becomes
 * "do we believe these dials?" rather than "do we believe this number?".
 *
 * Every volume below is an ASSUMPTION. Every price is flagged for source.
 * ------------------------------------------------------------------ */

interface Dial {
  stream: string;
  price: number;
  priceBasis: Confidence;
  unitsPerMonth: number;
  volumeBasis: string;
}

const SESSIONS_PER_MONTH = 13; // 3 weekend sessions x 4.33 weeks

const scenario = (name: string, blurb: string, dials: Dial[]) => {
  const total = dials.reduce((t, d) => t + d.price * d.unitsPerMonth, 0);
  console.log(`\n${"=".repeat(74)}\n${name.toUpperCase()}\n${"=".repeat(74)}`);
  console.log(blurb + "\n");
  for (const d of dials) {
    const rev = d.price * d.unitsPerMonth;
    console.log(`  ${money(rev).padStart(9)}  ${d.stream}`);
    console.log(`             ${d.unitsPerMonth} x $${d.price} — ${d.volumeBasis}`);
  }
  console.log(`  ${"-".repeat(70)}`);
  console.log(`  ${money(total).padStart(9)}  gross revenue per month`);
  console.log(`  ${money(totalMonthly).padStart(9)}  full cost base`);
  const gap = total - totalMonthly;
  const gapLight = total - staffLightTotal;
  console.log(`  ${(gap >= 0 ? "+" : "") + money(gap).padStart(8)}  against full cost base`);
  console.log(`  ${(gapLight >= 0 ? "+" : "") + money(gapLight).padStart(8)}  against Dennis-only base (${money(staffLightTotal)})`);
  return total;
};

interface Scenario {
  name: string;
  blurb: string;
  dials: Dial[];
}

/**
 * The dials live in data, not in the print calls, so the contribution layer
 * further down can re-run the SAME scenarios in net terms without restating
 * a single volume. Change a number once, both views move.
 */
const SCENARIOS: Scenario[] = [
  {
    name: "Base — what is already possible",
    blurb: "Nothing new is built. Venue hire simply gets a price and a calendar.\nThis is the honest floor: it needs no capital and no sauna.",
    dials: [
      { stream: "DIY pizza", price: 30, priceBasis: "verified", unitsPerMonth: 25 * SESSIONS_PER_MONTH, volumeBasis: "25 people a session, 13 sessions. ASSUMPTION: real volumes unknown." },
      { stream: "Venue hire", price: 600, priceBasis: "assumption", unitsPerMonth: 2, volumeBasis: "2 bookings a month. ASSUMPTION: price and demand both unset." },
      { stream: "Shop margin", price: 1200, priceBasis: "assumption", unitsPerMonth: 1, volumeBasis: "ASSUMPTION: no margin work done yet." },
    ],
  },
  {
    name: "Good — sauna live, programme running",
    blurb: "Sauna built and earning. Workshops run fortnightly. Cafe sublicensed.\nThis is the first point the place plausibly stands up.",
    dials: [
      { stream: "DIY pizza", price: 30, priceBasis: "verified", unitsPerMonth: 40 * SESSIONS_PER_MONTH, volumeBasis: "40 a session. ASSUMPTION." },
      { stream: "Sauna", price: 45, priceBasis: "inferred", unitsPerMonth: 100, volumeBasis: "100 sessions a month, ~3.3/day. ASSUMPTION: capacity never sized." },
      { stream: "Venue hire", price: 600, priceBasis: "assumption", unitsPerMonth: 4, volumeBasis: "one booking a week. ASSUMPTION." },
      { stream: "Workshops", price: 70, priceBasis: "assumption", unitsPerMonth: 24, volumeBasis: "2 workshops x 12 heads. ASSUMPTION. Costs Dennis 2 days." },
      { stream: "Shop margin", price: 2000, priceBasis: "assumption", unitsPerMonth: 1, volumeBasis: "ASSUMPTION." },
      { stream: "Cafe licence", price: 1000, priceBasis: "assumption", unitsPerMonth: 1, volumeBasis: "ASSUMPTION: no sub-operator signed." },
    ],
  },
  {
    name: "Stretch — everything working",
    blurb: "Strong pizza, sauna near capacity, weekly workshops, dinners running,\nmembership at a modest band. Optimistic on every dial at once.",
    dials: [
      { stream: "DIY pizza", price: 30, priceBasis: "verified", unitsPerMonth: 60 * SESSIONS_PER_MONTH, volumeBasis: "60 a session. ASSUMPTION: near oven ceiling." },
      { stream: "Sauna", price: 45, priceBasis: "inferred", unitsPerMonth: 200, volumeBasis: "~6.6/day. ASSUMPTION: likely at or past capacity." },
      { stream: "Venue hire", price: 800, priceBasis: "assumption", unitsPerMonth: 6, volumeBasis: "ASSUMPTION." },
      { stream: "Workshops", price: 80, priceBasis: "assumption", unitsPerMonth: 60, volumeBasis: "weekly, 15 heads. ASSUMPTION: needs a second pair of hands." },
      { stream: "Dinner events", price: 90, priceBasis: "assumption", unitsPerMonth: 40, volumeBasis: "2 dinners x 20. ASSUMPTION: chef cost not netted off." },
      { stream: "Shop margin", price: 3500, priceBasis: "assumption", unitsPerMonth: 1, volumeBasis: "ASSUMPTION." },
      { stream: "Cafe licence", price: 1500, priceBasis: "assumption", unitsPerMonth: 1, volumeBasis: "ASSUMPTION." },
      { stream: "Membership", price: 10, priceBasis: "assumption", unitsPerMonth: 150, volumeBasis: "150 members at ~$120/yr. ASSUMPTION: nearly the whole current list converting." },
    ],
  },
];

for (const s of SCENARIOS) scenario(s.name, s.blurb, s.dials);

console.log(`\n${"=".repeat(74)}`);
console.log("READ THIS BEFORE QUOTING ANY NUMBER ABOVE");
console.log("=".repeat(74));
console.log(`  Gross, not net. None of these subtract cost of goods (dough, cheese,
  firewood, stock), the wages to serve them, merchant fees, or GST.
  A pizza at $30 is not $30 of contribution.

  Every VOLUME above is an assumption. Only the $30 pizza price is verified.
  The sauna price is a comparable from another business in another town.

  The dials that matter most, in order:
    1. Pizza volume per session. It moves more than anything else and
       nobody has measured it.
    2. Whether Susie + Joey are additive ($8,750/mo swing).
    3. Sauna capacity. Unknown, and it caps the second-biggest stream.

  Measure one thing first: count heads at the next four pizza sessions.
  That single number decides whether Base is optimistic or pessimistic.

  Everything above this line is GROSS. Keep reading: the contribution layer
  below re-runs the same dials in the only terms that pay a bill.`);
console.log("=".repeat(74));

/* ================================================================== *
 * CONTRIBUTION LAYER
 * Added 2026-07-31.
 *
 * WHY
 * Everything above is gross revenue. Gross revenue does not pay rent.
 * A $30 pizza is not $30. It is $30 less the GST you remit, less the dough
 * and cheese, less the card fee. This layer converts every stream into what
 * it actually keeps, so break-even is stated in dollars that exist.
 *
 * THE DOUBLE-COUNTING RULE (read before changing anything here)
 * Staff in STAFF_COSTS is FIXED OVERHEAD. Dennis is on a wage, not paid per
 * cover, so his cost does not move with volume. Streams below therefore carry
 * only the costs that DO move with volume: goods, merchant fee, GST.
 *
 * `marginalLabour` is the single exception: hands you must hire ON TOP of the
 * fixed staff for that stream to happen at all, such as a casual chef for a
 * dinner service. That is incremental, not a second helping of Dennis.
 *
 * Get this wrong in either direction and the model lies:
 *   - full labour on every stream AND staff in the cost base
 *     -> every stream looks unprofitable, and you close things that pay
 *   - no labour anywhere
 *     -> dinners look free to run when they need a $500-1,000/day chef
 * ================================================================== */

const GST_RATE = 0.1;

const MERCHANT_FEE_RATE = 0.016;
// (!) ASSUMPTION. Square in-person card rate, not verified against a statement.
// Confirm from a Square settlement report. It is small next to food cost, so it
// moves conclusions very little, but it should still be a real number.

interface CostProfile {
  cogs: number; // per unit, ex-GST, the goods that move with volume
  cogsBasis: Confidence;
  cogsSource: string;
  gstFree?: boolean;
  marginalLabour?: number; // per unit, ON TOP of fixed staff. See rule above.
  merchantRate?: number; // override; 0 for invoice or bank transfer
  merchantFixed?: number; // per-transaction cents component, e.g. subscriptions
  alreadyNet?: boolean; // the "price" is already a margin figure, do not decompose
  note?: string;
}

const COST_PROFILES: Record<string, CostProfile> = {
  "DIY pizza": {
    cogs: 8.0,
    cogsBasis: "assumption",
    cogsSource:
      "margin-method.md built margherita = $5.19 (base $3.07 + sauce $0.48 + cheese $1.64), uplifted for an unlimited self-serve topping bench and bench wastage",
    note:
      "The single most load-bearing assumption in this layer. A built margherita is a controlled portion; a DIY bench is not. Measure it from a Bidfood invoice against a night's cover count.",
  },
  Sauna: {
    cogs: 4.0,
    cogsBasis: "assumption",
    cogsSource: "firewood, water, cleaning consumables, towel laundry per session",
    marginalLabour: 0,
    note:
      "No sauna exists yet, so nothing here is measured. Labour set to 0 assumes a steward turns it over inside hours already paid for. If it needs its own attendant, this line is wrong and the stream is much thinner.",
  },
  "Venue hire": {
    cogs: 60,
    cogsBasis: "assumption",
    cogsSource: "cleaning consumables, power, bins per booking",
    marginalLabour: 0,
    merchantRate: 0,
    note:
      "Labour 0 holds only while bookings land inside Dennis's Wed-Sun hours. A midweek booking needs casual hours added here. Merchant 0 assumes invoiced, not tapped.",
  },
  Workshops: {
    cogs: 12,
    cogsBasis: "assumption",
    cogsSource: "materials per head",
    marginalLabour: 0,
    note:
      "KNOWN BOUNDARY, surfaced not fixed: presenter fees already sit in VARIABLE_COSTS as a fixed $750/mo, which covers roughly two workshops. Above that volume this model undercounts presenters. The Stretch dial (60 heads) breaches it.",
  },
  "Dinner events": {
    cogs: 25,
    cogsBasis: "assumption",
    cogsSource: "food per head at a seated dinner",
    marginalLabour: 37.5,
    note:
      "Casual chef $500-1,000/day (model.ts REVENUE_ANCHORS), midpoint $750 spread over 20 covers. This is genuine incremental labour: Dennis is not cooking it. Watch what it does to the contribution rate.",
  },
  "Shop margin": {
    cogs: 0,
    cogsBasis: "assumption",
    cogsSource: "n/a, the dial is entered as a margin figure already",
    alreadyNet: true,
    note:
      "LEAST TRUSTWORTHY LINE HERE. It passes through untouched because a margin figure cannot be decomposed without the turnover behind it. It is also pure assumption in every scenario. Treat it as a placeholder, not income.",
  },
  "Cafe licence": {
    cogs: 0,
    cogsBasis: "assumption",
    cogsSource: "a licence fee has no cost of goods to Harvest",
    merchantRate: 0,
    note: "Invoiced, so no merchant fee. GST applies. No sub-operator is signed, so the whole line is hypothetical.",
  },
  Membership: {
    cogs: 0,
    cogsBasis: "assumption",
    cogsSource: "no goods; whatever a membership unlocks is a cost to the stream it is redeemed against",
    merchantRate: 0.022,
    merchantFixed: 0.3,
    note:
      "Recurring-billing rates run above in-person rates. If membership unlocks discounted pizza, the cost lands on the pizza line as forgone revenue, not here.",
  },
};

interface Contribution {
  gross: number;
  net: number;
  cogs: number;
  labour: number;
  merchant: number;
  keeps: number;
  rate: number; // keeps as a share of gross
}

const contributionOf = (gross: number, p: CostProfile): Contribution => {
  if (p.alreadyNet) {
    return { gross, net: gross, cogs: 0, labour: 0, merchant: 0, keeps: gross, rate: 1 };
  }
  const net = p.gstFree ? gross : gross / (1 + GST_RATE);
  const merchant = gross * (p.merchantRate ?? MERCHANT_FEE_RATE) + (p.merchantFixed ?? 0);
  const labour = p.marginalLabour ?? 0;
  const keeps = net - p.cogs - labour - merchant;
  return { gross, net, cogs: p.cogs, labour, merchant, keeps, rate: keeps / gross };
};

/* --- A. What each stream actually keeps, per unit --- */

/** Cents matter here: a card fee rounded to the dollar reads as free. */
const money2 = (n: number) =>
  (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const signed = (n: number) => (n >= 0 ? "+" : "-") + "$" + Math.abs(Math.round(n)).toLocaleString("en-AU");

console.log("\n" + "=".repeat(74));
console.log("WHAT EACH STREAM ACTUALLY KEEPS, PER UNIT");
console.log("=".repeat(74));
console.log("Gross -> less GST -> less goods -> less incremental labour -> less card fee.\n");

const COLS = ["gross", "net", "goods", "labour", "card", "KEEPS"];
const W = 11;
console.log("  " + "stream".padEnd(16) + COLS.map((c) => c.padStart(W)).join("") + "   rate");
console.log("  " + "-".repeat(16 + W * COLS.length + 7));

const unitPriceFor: Record<string, number> = {};
for (const s of SCENARIOS) for (const d of s.dials) unitPriceFor[d.stream] ??= d.price;

for (const [name, profile] of Object.entries(COST_PROFILES)) {
  const price = unitPriceFor[name];
  if (price === undefined) continue;
  const c = contributionOf(price, profile);
  const cell = (n: number) => money2(n).padStart(W);
  const flag = profile.alreadyNet ? " (?)" : "";
  console.log(
    `  ${(name + flag).padEnd(16)}${cell(c.gross)}${cell(c.net)}${cell(c.cogs)}${cell(c.labour)}${cell(c.merchant)}${cell(c.keeps)}  ${(c.rate * 100).toFixed(0).padStart(4)}%`,
  );
}

console.log(`
  (?) Shop margin is entered as a margin figure, so this layer cannot decompose it
      and it passes through at 100%. That makes it look like the best stream here.
      It is not a stream at all yet: it is a placeholder with no margin work behind it.

  The comparison that matters: a $90 dinner keeps LESS per head than a $30 pizza,
  because someone has to be paid to cook it. Headline price is not what pays.
  Every goods figure above is (!) assumption. See COST_PROFILES for each source.`);

/* --- B. The same scenarios, in contribution terms --- */

console.log("\n" + "=".repeat(74));
console.log("THE SAME THREE SCENARIOS, IN CONTRIBUTION TERMS");
console.log("=".repeat(74));
console.log("Identical dials to the gross scenarios above. Only the accounting changed.\n");

for (const s of SCENARIOS) {
  let gross = 0;
  let keeps = 0;
  let placeholder = 0; // the undecomposable Shop margin line
  for (const d of s.dials) {
    const profile = COST_PROFILES[d.stream];
    if (!profile) continue;
    const c = contributionOf(d.price, profile);
    gross += d.price * d.unitsPerMonth;
    keeps += c.keeps * d.unitsPerMonth;
    if (profile.alreadyNet) placeholder += c.keeps * d.unitsPerMonth;
  }
  const label = s.name.split("—")[0].trim();
  const real = keeps - placeholder;
  console.log(`${label.toUpperCase()}`);
  console.log(`  ${money(gross).padStart(9)}  gross per month`);
  console.log(`  ${money(keeps).padStart(9)}  CONTRIBUTION per month  (${((keeps / gross) * 100).toFixed(0)}% of gross)`);
  console.log(`  ${money(placeholder).padStart(9)}  of which is the (?) shop-margin placeholder`);
  console.log(`  ${money(real).padStart(9)}  contribution you can actually point at\n`);
  console.log(`     vs full cost base   ${money(totalMonthly).padStart(8)}   ${signed(keeps - totalMonthly)}  (${signed(real - totalMonthly)} ex-placeholder)`);
  console.log(`     vs Dennis-only base ${money(staffLightTotal).padStart(8)}   ${signed(keeps - staffLightTotal)}  (${signed(real - staffLightTotal)} ex-placeholder)\n`);
}

/* --- B2. The finding that changed when we stopped using gross --- */

console.log("=".repeat(74));
console.log("WHAT CHANGED WHEN WE STOPPED COUNTING GROSS");
console.log("=".repeat(74));
console.log(`  This file previously carried one headline finding:

     "In the Good case the place stands up WITHOUT a second steward pair,
      and does not stand up with one."

  In gross terms that held: Good's $27,180 cleared the Dennis-only base of
  $21,013 by $6,167, and the second pair was what broke it.

  In contribution terms it does not hold. Good keeps $19,454, which MISSES the
  Dennis-only base by $1,559, and by $3,559 once the shop-margin placeholder is
  set aside. The second steward pair was never the only thing in the way.

  The corrected finding, stated plainly:

     Nothing except Stretch stands up, and Stretch is optimistic on every
     dial at once: near-ceiling pizza, a sauna at capacity that does not
     exist yet, weekly workshops, dinners, and most of the current member
     list converting to paid.

  That does not make the Susie + Joey decision less urgent. It makes it
  insufficient on its own. Two things now have to move, not one:
  the cost base AND a real measured revenue floor.

  Caveat, held honestly: this conclusion rests on goods assumptions that are
  themselves unmeasured. If real DIY pizza food cost is well under $8.00, Good
  moves back toward standing up. That is the first thing Square would settle.
`);
console.log("=".repeat(74));

/* --- C. Break-even, restated --- */

const pizzaKeeps = contributionOf(30, COST_PROFILES["DIY pizza"]).keeps;

console.log("=".repeat(74));
console.log("BREAK-EVEN, RESTATED IN DOLLARS THAT EXIST");
console.log("=".repeat(74));
for (const [label, target] of [
  ["Full cost base", totalMonthly],
  ["Dennis only (no Susie + Joey)", staffLightTotal],
  ["Rent + outgoings alone", (4167 + 1500) * 1.1],
] as const) {
  const grossCovers = Math.ceil(target / 30);
  const realCovers = Math.ceil(target / pizzaKeeps);
  console.log(`${label}: ${money(target)}/mo`);
  console.log(`   gross maths said  ${grossCovers.toLocaleString().padStart(6)} covers  (${Math.ceil(grossCovers / SESSIONS_PER_MONTH)} a session)`);
  console.log(`   contribution says ${realCovers.toLocaleString().padStart(6)} covers  (${Math.ceil(realCovers / SESSIONS_PER_MONTH)} a session)  <- the real one\n`);
}

/* --- D. The $30 question --- */

console.log("=".repeat(74));
console.log("THE $30 QUESTION, UNRESOLVED AND WORTH RESOLVING");
console.log("=".repeat(74));
console.log(`  The site says "$30 each" (editable_content, whats-on/pizza-gallery-pizza-body).
  Every scenario above reads that as $30 PER PERSON. It may well mean $30 PER PIZZA.

  Those are the same number only if one person makes one pizza and buys nothing else.
  A family of four making two pizzas is $15 a head, not $30.

  What that does to Base:`);
for (const [reading, perHead] of [
  ["$30 per person", 30],
  ["one pizza between two", 15],
] as const) {
  const keepsPerHead = contributionOf(perHead, COST_PROFILES["DIY pizza"]).keeps;
  const covers = 25 * SESSIONS_PER_MONTH;
  console.log(`    ${reading.padEnd(24)} ${money(keepsPerHead * covers).padStart(9)}/mo contribution from pizza`);
}
console.log(`
  One look at Square settles it: total take divided by covers, and pizzas sold
  divided by covers. Until then, treat Base as a range, not a figure.`);

/* --- E. What Square retires --- */

interface Measured {
  value: number | null;
  unit: string;
  retires: string;
}

const SQUARE_ACTUALS: Record<string, Measured> = {
  coversPerSession: { value: null, unit: "people", retires: "the 25 / 40 / 60 dial, the biggest swing in the model" },
  averageTicketGross: { value: null, unit: "$ per transaction", retires: "the $30 per person vs per pizza fork above" },
  pizzasPerCover: { value: null, unit: "ratio", retires: "the same fork, from the other direction" },
  drinkAttachRate: { value: null, unit: "drinks per cover", retires: "a whole revenue line nobody has modelled at all" },
  foodCostPercent: { value: null, unit: "% of net food sales", retires: "the $8.00 DIY pizza goods assumption" },
  merchantFeeRate: { value: null, unit: "% of gross", retires: "the 1.6% card-fee assumption" },
};

console.log("\n" + "=".repeat(74));
console.log("WHAT SIX WEEKS OF SQUARE DATA WOULD RETIRE");
console.log("=".repeat(74));
console.log(`  Open since 20 June. The till has been running. None of it is in this model.
  The harvest_square_* mirror in docs/strategy/square-supabase-pull-2026-06.md was
  scoped 19 June and never built (verified 2026-07-31: only harvest_businesses and
  harvest_events exist in tednluwflfhxyucgwigh). But the mirror is not needed to
  answer any of this. Square's own sales report is.\n`);
for (const [k, m] of Object.entries(SQUARE_ACTUALS)) {
  console.log(`  [${m.value === null ? " " : "x"}] ${k} (${m.unit})`);
  console.log(`      retires: ${m.retires}`);
}
console.log(`
  Fill the values in above and the assumption count in this file drops by six,
  including the two largest. That is a report export, not a build.`);

/* ================================================================== *
 * MEMBERSHIP ECONOMICS
 * Added 2026-07-31, on top of the contribution layer.
 *
 * WHY THIS BELONGS HERE AND NOT IN THE WAYFINDER MAP
 * A member discount is paid out of CONTRIBUTION, not out of gross. Until the
 * layer above existed there was no way to price a membership honestly, because
 * "15% off" is not 15% of anything that pays a bill.
 *
 * WHAT THIS DOES NOT DO
 * It does not set a price. Price is ticket 07 in .scratch/membership-model and
 * it is a judgement about a town, not an output of a spreadsheet. What this does
 * is answer one sub-question of ticket 07 that IS arithmetic:
 *   "What is the floor below which this is not worth administering?"
 * ================================================================== */

const MEMBER_DISCOUNT = 0.15;
// Square flat Members-group discount, member-model.md "Decided (2026-06-18)".
// (~) That doc also says to confirm it with a test sale per launch-runbook.md §2.
// Unknown whether that test sale ever happened.

const COFFEE = { price: 5.0, cogs: 0.7 }; // margin-method.md, "Coffee (when it exists)"

const BILLING_DRAG = 0.04;
// Mighty Launch take 2% + Stripe AU 1.7% + $0.30/charge billed monthly.
// member-model.md verified these rates 2026-06-18. Excludes the fixed $79/mo
// platform fee, which is a cost of the TIER, not of a member.

/**
 * What one member visit costs in forgone contribution.
 * Two bounds, because the free coffee is worth different things depending on
 * whether they would have bought one anyway.
 */
const memberVisitCost = () => {
  const full = contributionOf(30, COST_PROFILES["DIY pizza"]).keeps;
  const discounted = contributionOf(30 * (1 - MEMBER_DISCOUNT), COST_PROFILES["DIY pizza"]).keeps;
  const discountCost = full - discounted;

  const coffeeMakeOnly = COFFEE.cogs; // they were never going to buy one
  const coffeeFullMargin = COFFEE.price / (1 + GST_RATE) - COFFEE.cogs; // they would have

  return {
    discountCost,
    low: discountCost + coffeeMakeOnly,
    high: discountCost + coffeeFullMargin,
  };
};

const mv = memberVisitCost();

console.log("\n" + "=".repeat(74));
console.log("MEMBERSHIP: WHAT A MEMBER COSTS, PER VISIT");
console.log("=".repeat(74));
console.log(`  The offer on the table is 15% off the menu plus a free coffee each visit.

  A full-price DIY pizza keeps          ${money2(contributionOf(30, COST_PROFILES["DIY pizza"]).keeps)}
  The same pizza at 15% off keeps       ${money2(contributionOf(30 * (1 - MEMBER_DISCOUNT), COST_PROFILES["DIY pizza"]).keeps)}
  So the discount costs                 ${money2(mv.discountCost)}   (not the $4.50 on the sticker:
                                                you also remit less GST and pay a smaller card fee)

  Free coffee, if they'd not have bought one    ${money2(COFFEE.cogs)}
  Free coffee, if they would have               ${money2(COFFEE.price / (1 + GST_RATE) - COFFEE.cogs)}

  COST PER MEMBER VISIT: ${money2(mv.low)} to ${money2(mv.high)}`);

/* --- The floor, expressed as visits --- */

const CANDIDATE_PRICES: { annual: number; label: string }[] = [
  { annual: 66, label: "CERES comparable" },
  { annual: 125, label: "Northey Street top band" },
  { annual: 250, label: "unanchored midpoint" },
  { annual: 520, label: "$10/week" },
  { annual: 1040, label: "$20/week (parked figure)" },
  { annual: 1560, label: "$30/week (parked figure)" },
];

console.log("\n" + "=".repeat(74));
console.log("THE FLOOR: HOW MANY VISITS BEFORE A MEMBER STOPS PAYING FOR THEMSELVES");
console.log("=".repeat(74));
console.log(`  Assumes the visit would have happened anyway at full price.
  A weekly regular makes 52 visits a year. Read that column against this table.\n`);
console.log("  annual fee   net of billing   break-even visits/yr        anchor");
console.log("  " + "-".repeat(70));
for (const p of CANDIDATE_PRICES) {
  const net = p.annual * (1 - BILLING_DRAG);
  const lo = net / mv.high;
  const hi = net / mv.low;
  const range = `${Math.floor(lo)} to ${Math.floor(hi)}`;
  console.log(`  ${money(p.annual).padStart(9)}${money2(net).padStart(16)}   ${range.padEnd(22)} ${p.label}`);
}

console.log(`
  THE INVERSION. Two documents in this repo point in opposite directions:

    member-model.md says "position the paid tier for REGULARS, people in the
    door often."

    01-comparable-models-worldwide.md says real Australian prices are $66 to
    $125 a year.

  Put together, that is a loss-making offer aimed squarely at the people who
  use it most. At $66/yr a weekly regular costs roughly ${money(Math.round(52 * mv.low - 66 * (1 - BILLING_DRAG)))} to ${money(Math.round(52 * mv.high - 66 * (1 - BILLING_DRAG)))} a year
  more than they pay. Your best members would be your most expensive.

  Only two ways out, and they are both decisions, not calculations:
    a) price high enough to cover expected frequency (~${money(Math.round((52 * mv.low) / (1 - BILLING_DRAG)))}/yr floor for a
       weekly regular, which is roughly $5/week and well above every comparable)
    b) stop putting per-visit-costly perks in the membership`);

/* --- The escape hatch: incrementality --- */

const incrementalKeeps = contributionOf(30 * (1 - MEMBER_DISCOUNT), COST_PROFILES["DIY pizza"]).keeps;

console.log("\n" + "=".repeat(74));
console.log("THE ESCAPE HATCH: DOES MEMBERSHIP CAUSE VISITS?");
console.log("=".repeat(74));
console.log(`  Everything above assumes a member's visits would have happened anyway, so
  the discount is pure cannibalisation. If membership CAUSES visits that would
  not otherwise happen, each of those still brings ${money2(incrementalKeeps)} of contribution,
  and the maths flips.

  How much causation is needed to break even, for a weekly member:\n`);
for (const p of CANDIDATE_PRICES.slice(0, 4)) {
  const net = p.annual * (1 - BILLING_DRAG);
  const deficit = 52 * mv.low - net;
  if (deficit <= 0) {
    console.log(`    ${money(p.annual).padStart(6)}/yr   no causation needed, pays for itself outright`);
    continue;
  }
  const needed = Math.ceil(deficit / incrementalKeeps);
  console.log(
    `    ${money(p.annual).padStart(6)}/yr   needs ${needed} of 52 visits to be caused by membership (${Math.round((needed / 52) * 100)}%)`,
  );
}
console.log(`
  This is the single most important unknown in the membership question, it is
  measurable, and nobody has measured it. It is also the reason a survey cannot
  answer this: people do not know, and do not honestly report, what caused them
  to turn up.`);

/* --- The design principle that falls out --- */

console.log("\n" + "=".repeat(74));
console.log("THE PRINCIPLE THIS SUGGESTS FOR TICKET 03 (ONE TIER OR TWO)");
console.log("=".repeat(74));
console.log(`  Sort perks by MARGINAL COST, not by tier fashion. The economics then
  sort the tiers for you:

    Zero marginal cost   notes, invitations, being on the list, priority
                         booking, having a say, being known by name
                         -> can live in a free or very cheap tier forever,
                            costs nothing per member, scales without limit

    Real marginal cost   food and drink discount, free coffee, facility
                         access, free event entry
                         -> must either be priced per use, or sit behind a fee
                            that covers EXPECTED FREQUENCY, not average frequency

  Ticket 07 asks "what is the floor below which this is not worth administering".
  For a membership carrying zero-marginal-cost perks only, there is no economic
  floor: the floor is purely administrative burden. For one carrying the current
  15%-plus-coffee offer, the floor is roughly ${money(Math.round((52 * mv.low) / (1 - BILLING_DRAG)))}/yr against a weekly regular.

  That gap is the actual decision, and it is Ben's, not the model's.`);
console.log("=".repeat(74));

/* --- F. What this layer still does not do --- */

console.log("\n" + "=".repeat(74));
console.log("WHAT THIS LAYER STILL DOES NOT DO");
console.log("=".repeat(74));
console.log(`  1. No grant or philanthropic income line exists anywhere in this model.
     Every scenario is trading revenue alone. If part of the cost base is meant
     to be grant funded, this file makes the place look worse than the plan does.
     If it is not, then reaching positive is a staffing decision before it is a
     sales one, and the Susie + Joey number is the whole question.
  2. Shop margin passes through undecomposed. It is a placeholder, not income.
  3. Workshop presenter cost double-counts above ~2 workshops a month.
  4. Seasonality is absent. A hinterland winter Saturday is not a January one.
  5. Nothing here is reconciled to the books, because the books still cannot
     separate Harvest. That has not changed since this file was written.`);
console.log("=".repeat(74));
