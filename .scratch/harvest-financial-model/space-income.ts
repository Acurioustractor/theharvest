/**
 * The Harvest: what the building can earn as space, and what that covers.
 * Run: npx tsx .scratch/harvest-financial-model/space-income.ts
 *
 * Added 2026-09-07 after Ben asked to start pricing rooms, residencies, offices, the café,
 * kitchen events and philanthropy. Rent to Sonas is paused by agreement for now and resumes
 * soon, so the question is: which spaces, at what price, cover the rent when it restarts?
 *
 * Only two prices come from Ben (front room $400/wk for Joey, office $600/wk). Everything
 * else is null until someone writes it down. The building, per Ben on 7 Sep 2026:
 *   front room (Joey's room, the bathroom links to it), back room (the studio),
 *   and the workshop space. That is one room, one studio, one workshop. No offices beyond
 *   the studio, no spare bedrooms.
 */

type Confidence = "verified" | "inferred" | "assumption" | "unknown";

interface Space {
  name: string;
  kind: "room" | "office" | "residency" | "kitchen" | "cafe" | "gift";
  weekly: number | null;      // $ per unit per week, incl GST where GST applies
  count: number | null;       // how many units exist
  occupancy: number;          // 0..1, share of weeks let
  confidence: Confidence;
  source: string;
  note?: string;
}

const SPACES: Space[] = [
  { name: "Front room (Joey, live-in caretaker)", kind: "room", weekly: 400, count: 1, occupancy: 1, confidence: "verified", source: "Ben, 7 Sep 2026",
    note: "Rent is booked as income to the Harvest tenant entity. If $400 is at or above market for one room in a shared house in Maleny, there is no housing FBT; if below, the gap is pay in kind. Market for the room: unverified." },
  { name: "Other rooms", kind: "room", weekly: 400, count: 0, occupancy: 0.8, confidence: "verified", source: "Ben, 7 Sep: the front room is the room. No other bedroom.",
    note: "The '3-bed dwelling' in the June staffing brief is not what the building offers for letting today." },
  { name: "Back room, the studio (office or residency)", kind: "office", weekly: 600, count: 1, occupancy: 0.7, confidence: "assumption", source: "Ben: back room is the studio; office price $600/wk. One space, one tenant at a time",
    note: "Either an office tenant at $600, or a resident at $400 (Ben: residencies priced like the room). Not both. The ladder below uses the office price; a residency is $200/wk less." },
  { name: "Workshop space", kind: "office", weekly: null, count: 1, occupancy: 0, confidence: "verified", source: "Ben, 7 Sep: the workshop space. This is the Art Space",
    note: "Not for letting by the week. Earns by the session (workshops, work days, makers) and that lives in model.ts as programme income, not here." },
  { name: "Kitchen for an event or a producer", kind: "kitchen", weekly: null, count: 1, occupancy: 0.3, confidence: "unknown", source: "Not priced. Council food posture gates this",
    note: "Comparable: commercial kitchen hire in SE Qld runs $30 to $60 an hour. Unverified." },
  { name: "Café licence (sub-operator)", kind: "cafe", weekly: null, count: 1, occupancy: 1, confidence: "unknown", source: "working-capital-plan: $0 to $5K over 4 months; nothing signed",
    note: "Per month or % of sales. The operating model says sub-operator by end October." },
  { name: "Philanthropy and grants", kind: "gift", weekly: null, count: 1, occupancy: 1, confidence: "unknown", source: "No line in any model. DGR only through The Butterfly Movement",
    note: "Not space income. Listed here because Ben asked; belongs in model.ts as its own stream once a first ask exists." },
];

/* ---- what rent costs, per week ---- */
const RENT = {
  baseYearly: 50000,          // lease.md: $50K/yr base from 1 Jul 2026 (verified)
  outgoingsMonthly: 1500,     // working-capital-plan: 'verify from Sonas', still unverified since April
  paidSoFar: 4616.70,         // one payment, 17 Jul 2026, from the Xero mirror (verified 7 Sep)
  paused: true,               // Ben, 7 Sep: 'we have not had to pay for a bit but will pay again soon'
};
const rentWeek = RENT.baseYearly / 52;
const outgoingsWeek = (RENT.outgoingsMonthly * 12) / 52;

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-AU");
console.log("=".repeat(74));
console.log("WHAT RENT COSTS, PER WEEK");
console.log("=".repeat(74));
console.log(`  Base rent ${money(rentWeek)}/wk  + outgoings ${money(outgoingsWeek)}/wk (unverified)  = ${money(rentWeek + outgoingsWeek)}/wk`);
console.log(`  Paid since 1 July: ${money(RENT.paidSoFar)} (one payment). Rent is ${RENT.paused ? "paused by agreement, resuming soon" : "due monthly"}.`);

console.log("\n" + "=".repeat(74));
console.log("SPACES, priced or not");
console.log("=".repeat(74));
let known = 0; const unknown: string[] = [];
for (const s of SPACES) {
  const line = s.weekly !== null && s.count !== null ? s.weekly * s.count * s.occupancy : null;
  if (line !== null) known += line; else unknown.push(s.name);
  console.log(`  ${s.name.padEnd(42)} ${s.weekly === null ? "   ?" : ("$" + s.weekly).padStart(5)}/wk x ${s.count === null ? "?" : s.count} @ ${Math.round(s.occupancy * 100)}%  = ${line === null ? "unknown" : money(line) + "/wk"}  [${s.confidence}]`);
  if (s.note) console.log(`      ${s.note}`);
}
console.log(`\n  Known space income today: ${money(known)}/wk, which is ${Math.round((known / rentWeek) * 100)}% of base rent.`);

console.log("\n" + "=".repeat(74));
console.log("THE LADDER: what it takes to cover rent from space alone");
console.log("=".repeat(74));
const ladder: { label: string; weekly: number }[] = [
  { label: "Joey's front room", weekly: 400 },
  { label: "+ the studio as a residency at $400, half the year", weekly: 400 + 400 * 0.5 },
  { label: "+ the studio as an office at $600, 70% let (instead)", weekly: 400 + 600 * 0.7 },
  { label: "+ the studio as an office, every week", weekly: 400 + 600 },
];
for (const step of ladder) {
  const covers = step.weekly >= rentWeek ? "covers base rent" : step.weekly >= rentWeek * 0.5 ? "covers half" : "does not cover";
  const withOut = step.weekly >= rentWeek + outgoingsWeek ? ", and outgoings" : "";
  console.log(`  ${step.label.padEnd(40)} ${money(step.weekly).padStart(7)}/wk  ${covers}${withOut}`);
}
console.log(`
  Reading: with one room and one studio, space alone tops out at $1,000/wk with the
  studio let as an office every week of the year, which is base rent and nothing else.
  The realistic case (front room + studio office most of the time) is about $820/wk,
  85% of base rent. Pizza, sauna, the workshop sessions and the café licence have to
  carry outgoings and everything in model.ts. Space is a floor under rent, not a business.

  Unknowns only a walk of the building or a decision can fill:
    ${unknown.join("\n    ")}`);
