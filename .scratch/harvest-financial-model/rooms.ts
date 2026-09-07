/**
 * The Harvest building, room by room.
 * Run: npx tsx .scratch/harvest-financial-model/rooms.ts
 *
 * Sources:
 *   - Architect's measured survey with the nursery's original labels:
 *     client/public/images/plans/building-survey-labelled.jpeg (Thais, Jan 2026)
 *   - January 2026 walkthrough zone plan: docs/vision-prep/audio-transcripts/site-walkthrough-jan2026.md
 *   - The site's own floor-plan viewer: client/src/components/FloorPlanViewer.tsx (7 named spaces)
 *   - Ben, 7 Sep 2026: "front room is the room, the bathroom links to it, the back room is the studio,
 *     then the workshop space"
 *
 * `today` is what the room is used for now. `let` is whether it can earn as space by the week.
 * Where Ben's three names have not been matched to a survey label, `today` says so. Nothing here
 * is a measurement of what has been built; the survey is the nursery as it was.
 */

interface Room {
  survey: string;              // label on the architect's survey
  janPlan: string;             // what the January zone plan intended
  today: string;               // Ben, 7 Sep 2026, or "unmapped"
  let: "week" | "session" | "no";
  weekly: number | null;       // $/wk if let by the week
  note?: string;
}

export const ROOMS: Room[] = [
  { survey: "Office (front, with its own PWD toilet)", janPlan: "Reception area at entry", today: "Probably 'the front room': Joey's room, bathroom linked. Ben to confirm", let: "week", weekly: 400 },
  { survey: "Staff Room", janPlan: "Part of the back rooms", today: "unmapped", let: "no", weekly: null, note: "Small. Candidate for the residency if the studio is an office." },
  { survey: "Green Room", janPlan: "Back rooms", today: "unmapped", let: "no", weekly: null },
  { survey: "Cold Room", janPlan: "Keep; food storage", today: "Cold room", let: "no", weekly: null, note: "Earns through food, not rent." },
  { survey: "Green store", janPlan: "Storage", today: "unmapped", let: "no", weekly: null },
  { survey: "Server nook + PWD", janPlan: "Bathrooms decision (options A to D)", today: "The bathroom that links to the front room", let: "no", weekly: null },
  { survey: "Office 1", janPlan: "Rammed earth room = artist in residence office/studio", today: "Probably 'the back room', the studio. Ben to confirm", let: "week", weekly: 600, note: "Office tenant at $600, or a resident at $400. One at a time." },
  { survey: "Office 2", janPlan: "Office spaces (site floor-plan viewer)", today: "unmapped", let: "week", weekly: 600, note: "If this is a second lettable office, the rent ladder changes. Ben has not named it." },
  { survey: "Mail Order Business: Receive & Pack + Store (the hall, pallet racking)", janPlan: "Demolish internal walls: one modular rectangle, restaurant, gallery, performance, making", today: "The workshop space (the Art Space) and the indoor pizza and gathering room", let: "session", weekly: null, note: "Earns by the session: workshops, work days, ticketed nights, hire. Never by the week." },
  { survey: "Tool Store", janPlan: "Storage for classroom equipment on wheels", today: "unmapped", let: "no", weekly: null },
  { survey: "Seed Pack", janPlan: "'The Classroom': bookable education and workshop space", today: "unmapped", let: "session", weekly: null, note: "The January plan's bookable classroom. Pilates, pottery, cooking, birthing classes." },
  { survey: "Seed Store", janPlan: "Storage", today: "unmapped", let: "no", weekly: null },
  { survey: "Eco-Garden Centre (the big shed)", janPlan: "Stage 1: clad, light, retail or deli, pop-up shop", today: "The Deli / General Store (Zones DB: Planning)", let: "session", weekly: null, note: "Café licence lives here or in the hall. Council food posture gates it." },
  { survey: "Outside: Milk Create Pavilion, Pergola, fire pit, sauna", janPlan: "Scaffold pavilion, pizza oven, fire pit under the pecans", today: "Pizza nights, sauna sessions", let: "session", weekly: null },
];

const weekly = ROOMS.filter((r) => r.let === "week");
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-AU");
console.log("=".repeat(96));
console.log("THE BUILDING, ROOM BY ROOM");
console.log("=".repeat(96));
console.log("survey label".padEnd(44) + "today".padEnd(40) + "let      $/wk");
for (const r of ROOMS) console.log(r.survey.slice(0, 43).padEnd(44) + r.today.slice(0, 39).padEnd(40) + r.let.padEnd(8) + (r.weekly === null ? "" : " " + money(r.weekly)));
console.log(`
  Lettable by the week: ${weekly.length} rooms (${weekly.map((r) => r.survey.split(" ")[0] + " " + (r.survey.split(" ")[1] ?? "")).join(", ")}).
  Full let, every week: ${money(weekly.reduce((a, r) => a + (r.weekly ?? 0), 0))}/wk against base rent of $962/wk.
  Unmapped rooms (nobody has said what they are today): ${ROOMS.filter((r) => r.today === "unmapped").length}.

  Ben's three names, matched to the survey as best the files allow:
    front room  -> Office (front, with PWD)   [confirm]
    back room   -> Office 1, the rammed earth room the January plan gave to the artist in residence   [confirm]
    workshop    -> the Mail Order hall   [confirm]
  If Office 2 is a real second room and not part of the hall, it is the missing office in the rent ladder.`);
