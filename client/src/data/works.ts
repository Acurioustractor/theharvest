/**
 * The Harvest — Works
 *
 * Each "work" is a piece in The Harvest's living collection. Some are built,
 * some are growing, some are forthcoming. They are presented like a museum
 * exhibition: every piece carries a thread back to Witta's history.
 *
 * Edit this file to add, reorder, or update works. The /works index and
 * /works/:slug detail pages render directly from this data.
 */

/* ─────────────────────────────────────────────────────────
   Lifecycle vocabulary — the tense/state taxonomy.
   Each work carries one or more of these tags. Tags also
   double as the comms taxonomy (build campaign / grow
   campaign / etc.). Works move through tags over time.
   ───────────────────────────────────────────────────────── */

export type LifecycleFamily = "build" | "grow" | "make" | "concept" | "open";
export type LifecycleTense = "past" | "present" | "future" | "ongoing";

export type LifecycleVocabEntry = {
  label: string;
  family: LifecycleFamily;
  tense: LifecycleTense;
  /** Tailwind class string for the badge background + text */
  badgeClass: string;
};

export const LIFECYCLE_VOCAB = {
  // Build family — physical structures, infrastructure
  planned:    { label: "Planned",    family: "build" as const, tense: "future"  as const, badgeClass: "bg-stone-100 text-stone-700 border border-stone-300" },
  funded:     { label: "Funded",     family: "build" as const, tense: "future"  as const, badgeClass: "bg-amber-100 text-amber-900 border border-amber-300" },
  building:   { label: "Building",   family: "build" as const, tense: "present" as const, badgeClass: "bg-amber-500 text-stone-900" },
  built:      { label: "Built",      family: "build" as const, tense: "past"    as const, badgeClass: "bg-stone-800 text-amber-300" },
  extending:  { label: "Extending",  family: "build" as const, tense: "present" as const, badgeClass: "bg-orange-500 text-stone-900" },
  maintained: { label: "Maintained", family: "build" as const, tense: "ongoing" as const, badgeClass: "bg-stone-300 text-stone-800" },

  // Grow family — gardens, food, slow living things
  planted:    { label: "Planted",   family: "grow" as const, tense: "past"    as const, badgeClass: "bg-emerald-100 text-emerald-900 border border-emerald-300" },
  growing:    { label: "Growing",   family: "grow" as const, tense: "present" as const, badgeClass: "bg-emerald-700 text-emerald-50" },
  harvested:  { label: "Harvested", family: "grow" as const, tense: "past"    as const, badgeClass: "bg-emerald-900 text-emerald-100" },

  // Make family — art, craft, fabrication
  drafted:    { label: "Drafted", family: "make" as const, tense: "past"    as const, badgeClass: "bg-rose-100 text-rose-900 border border-rose-300" },
  making:     { label: "Making",  family: "make" as const, tense: "present" as const, badgeClass: "bg-rose-600 text-rose-50" },
  made:       { label: "Made",    family: "make" as const, tense: "past"    as const, badgeClass: "bg-rose-900 text-rose-100" },

  // Concept family — early stages, listening
  concept:    { label: "Concept",    family: "concept" as const, tense: "future"  as const, badgeClass: "bg-stone-100 text-stone-600 border border-dashed border-stone-400" },
  consulting: { label: "Consulting", family: "concept" as const, tense: "present" as const, badgeClass: "bg-amber-100 text-stone-800 border border-amber-300" },

  // Open family — public-facing states
  open:       { label: "Open",       family: "open" as const, tense: "present" as const, badgeClass: "bg-emerald-500 text-stone-900" },
  forthcoming:{ label: "Forthcoming",family: "open" as const, tense: "future"  as const, badgeClass: "bg-amber-100 text-stone-800 border border-amber-300" },
} as const satisfies Record<string, LifecycleVocabEntry>;

export type LifecycleTag = keyof typeof LIFECYCLE_VOCAB;

/** Sort key — past first, then ongoing, present, future. Within each, by label. */
const TENSE_ORDER: Record<LifecycleTense, number> = { past: 0, ongoing: 1, present: 2, future: 3 };
export function sortLifecycleTags(tags: LifecycleTag[]): LifecycleTag[] {
  return [...tags].sort((a, b) => {
    const ta = TENSE_ORDER[LIFECYCLE_VOCAB[a].tense];
    const tb = TENSE_ORDER[LIFECYCLE_VOCAB[b].tense];
    if (ta !== tb) return ta - tb;
    return LIFECYCLE_VOCAB[a].label.localeCompare(LIFECYCLE_VOCAB[b].label);
  });
}

/** @deprecated Use lifecycleTags array instead. Kept only for legacy callers. */
export type WorkStatus = "built" | "growing" | "forthcoming";

export type WittaThread = {
  /** Year or era anchor — should match an entry in /witta timeline where possible */
  year: string;
  /** What that moment in Witta history was */
  moment: string;
  /** The thread — how this work pulls on that history */
  thread: string;
};

export type WorkHand = {
  name: string;
  role: string;
};

export type Work = {
  /** Catalogue number — "Work 01", "Work 02" etc. Explicit so it stays stable as works are added/reordered */
  number: string;
  slug: string;
  title: string;
  /** One-line subtitle shown under the title */
  subtitle: string;
  /**
   * Lifecycle tags — one or more from LIFECYCLE_VOCAB. A work can be in
   * multiple states at once (e.g. ["built", "extending"] for a structure
   * that's up but actively being added to). These tags also drive comms
   * categorisation and shift over time as the work progresses.
   */
  lifecycleTags: LifecycleTag[];
  /** "Reclaimed milk crates, scaffold, timber" — kept short, museum-label style */
  materials: string;
  /** Year built / planted / opening — flexible string */
  year: string;
  /** Hero image, served from /images/... */
  heroImage: string;
  heroAlt: string;
  /** Optional credit line for the hero image */
  heroCredit?: string;
  /** Short description for the index card (1-2 sentences) */
  blurb: string;
  /** Long-form sections on the detail page */
  whatItIs: string;
  why: string;
  how: string;
  /** Threads back to Witta history — usually 2-4 */
  wittaThreads: WittaThread[];
  /** People (and partner orgs) behind it */
  hands: WorkHand[];
  /** Optional external link (e.g. fellowship page) */
  link?: { label: string; href: string };
  /** Optional related works for cross-linking */
  related?: string[];
};

export const works: Work[] = [
  {
    number: "Work 01",
    slug: "the-garden",
    title: "The Garden",
    subtitle: "The volcano made the soil. The community works the rows.",
    lifecycleTags: ["planted", "growing"],
    materials: "Krasnozem basalt soil · seasonal beds · community-managed",
    year: "Established 2025, planted ongoing",
    heroImage: "/images/compendium/sophie-garden.jpg",
    heroAlt: "Sophie working in the garden at The Harvest",
    blurb:
      "The reason anything grows here is Jurassic. Volcanic red soil, two metres of rain a year, mist from the coast that gets pushed up the range. The garden is half landscape, half practice.",
    whatItIs:
      "The productive garden at The Harvest. Beds for kitchen herbs, salad, fruiting vegetables, perennials, and a slowly building food forest. Tended by the Wednesday Maintenance Crew and a rotating roster of volunteers. Not a display garden. A working one.",
    why:
      "If we don't grow some of what we eat, we are not what we say we are. The garden is the daily proof. It also gives us a reason for people to come back every week. Caring for something living is the strongest invitation we have.",
    how:
      "Beds were laid out in late 2025 around the existing canopy. Wednesday Maintenance Crew runs weekly through the seasons. Weeding, mulching, planting, harvesting. Cuttings go to the kitchen, surplus to neighbours, scraps back to compost. Decisions are made in the bed, not on paper.",
    wittaThreads: [
      {
        year: "Time immemorial",
        moment: "Jinibara custodianship of the Blackall Range. Land managed through fire, seasonal movement, and deep ecological knowledge.",
        thread:
          "The first gardeners of this place worked it for tens of thousands of years. We grow on Country, with respect, and we are still learning.",
      },
      {
        year: "Jurassic era",
        moment: "Volcanic basalt soils form the deep, nutrient-rich krasnozem of the Blackall Range.",
        thread:
          "The soil is older than every story. It is the reason the rainforest, the dairies, and now the garden exist.",
      },
      {
        year: "1893",
        moment: "Meat and Dairy Encouragement Act. Dairy begins replacing timber across the range.",
        thread:
          "The pasture economy that followed was monoculture. The garden is the opposite: plural, seasonal, and small enough to know.",
      },
    ],
    hands: [
      { name: "Wednesday Maintenance Crew", role: "Weekly stewards" },
      { name: "Sophie", role: "Garden volunteer" },
      { name: "Susie & Joey", role: "Community Stewards (from July 2026)" },
    ],
    related: ["milk-crate-pavilion", "the-shop"],
  },
  {
    number: "Work 02",
    slug: "milk-crate-pavilion",
    title: "Milk Crate Pavilion",
    subtitle: "Milk crate, milk create. The same syllables, both true.",
    lifecycleTags: ["building"],
    materials: "Reclaimed milk crates, scaffold, salvaged timber, community hands",
    year: "Built March 2026",
    heroImage: "/images/social/04-radical-scoops.png",
    heroAlt: "The Milk Crate Pavilion under construction at The Harvest, March 2026",
    heroCredit: "Radical Scoops fellowship · Regional Arts Australia",
    blurb:
      "Eighty people built it together in a single weekend. Milk crates from the dairy industry, scaffold poles, found timber. The first piece of architecture on the site is also the most communal.",
    whatItIs:
      "A modular open-air pavilion at the heart of The Harvest. Roughly 14m × 9m, sized to fit comfortably under the pecan trees. Plays the role of gallery, theatre, market hall, dining room and weather shelter, sometimes in the same afternoon. Designed to come apart, rearrange, and grow.",
    why:
      "We needed a shared roof before we needed walls. A pavilion lets the community show up before the buildings finish. Markets, exhibitions, films, dinners, conversations. It says clearly: this place is for gathering, and gathering is the first work.",
    how:
      "Built across one weekend in March 2026 with more than eighty community members under the Radical Scoops fellowship. Milk crates were sourced from the dairy industry that once powered Witta. Scaffold was hired and rebuilt as structure. Timber was offcuts, salvage, and gifts. No single builder. Everyone took a corner.",
    wittaThreads: [
      {
        year: "1904",
        moment: "Maleny's first butter factory opens. The co-operative model takes root.",
        thread:
          "The crate is the icon of that century. Stacked, shared, returned, restacked. We took the form and made it a roof.",
      },
      {
        year: "1960s",
        moment: "Dairy industry peak. Around 300 butter and cheese factories across the hinterland.",
        thread:
          "These crates carried the milk that built every house on this ridge. Reusing them keeps the lineage in the room.",
      },
      {
        year: "2000",
        moment: "Dairy deregulation. Farms that sustained families for generations become unviable.",
        thread:
          "What was discarded after deregulation becomes the architecture of the next chapter. Not nostalgia. Repurpose.",
      },
    ],
    hands: [
      { name: "Eighty community members", role: "Builders, weekend of 7 March 2026" },
      { name: "Regional Arts Australia", role: "Radical Scoops fellowship funder" },
      { name: "Ben Knight & Nicholas Marchesi", role: "Co-founders, project leads" },
    ],
    link: {
      label: "Radical Scoops fellowship",
      href: "https://regionalarts.com.au/resources/radical-scoops",
    },
    related: ["the-cedar", "the-garden"],
  },
  {
    number: "Work 03",
    slug: "the-cedar",
    title: "The Cedar",
    subtitle: "Working with the wood the range almost lost",
    lifecycleTags: ["building", "making"],
    materials: "Red cedar and hoop pine from local properties · second- and third-growth",
    year: "Sourced 2026",
    heroImage: "/images/compendium/barry/IMG_5699.jpg",
    heroAlt: "Barry in his shed at Witta, the primary source of cedar for The Harvest",
    blurb:
      "Cedar came back. Not the giants. Those went to London and never came home. But what's grown back belongs to the people who stayed. We're working with timber from a Witta resident's land.",
    whatItIs:
      "An ongoing collection of timber pieces being built into The Harvest. Bench seats, a bar, gallery rails, the kitchen pass. Mostly red cedar and hoop pine, sourced locally rather than imported. Each piece is documented: where it came from, who milled it, where it sits.",
    why:
      "The range was stripped of cedar inside two generations. By 1906 it was commercially extinct. The wood we now use carries that history. It is what came back after the rush. Choosing local timber over plantation hardwood is a small act of repair, and an act of recognition.",
    how:
      "Sourced from Barry Rodgerig's property and other Witta residents who have nursed second-growth stands for decades. Milled by local sawyers. Used unfinished where possible. The grain stays visible. Where a knot or split tells a story, we keep it.",
    wittaThreads: [
      {
        year: "1860",
        moment: "Bunya pine reserve rescinded. Timber-getters flood in. The 'red gold' rush begins.",
        thread:
          "What was extracted is what we are now restoring, slowly, plank by plank.",
      },
      {
        year: "1886",
        moment: "Two giant cedar logs shipped to the Indian and Colonial Exhibition in London. No buyer, too large for any mill in the world.",
        thread:
          "Half of one of those logs is reportedly still in a London museum. The wood we use today is from the descendants the loggers missed.",
      },
      {
        year: "1906",
        moment: "Red cedar faces commercial extinction. One-third of Queensland's hoop and bunya pine already gone.",
        thread:
          "Every cedar plank in The Harvest is a quiet refusal of that ending.",
      },
    ],
    hands: [
      { name: "Barry Rodgerig", role: "27-year nurseryman, primary timber source" },
      { name: "Local sawyers", role: "Milling and dressing" },
      { name: "Nicholas Marchesi", role: "Material lead, gallery rail design" },
    ],
    related: ["milk-crate-pavilion", "the-garden"],
  },
  {
    number: "Work 04",
    slug: "the-shop",
    title: "The Shop",
    subtitle: "Reclaiming the village shop that Witta hasn't had in a generation",
    lifecycleTags: ["concept", "planned"],
    materials: "Local makers · shared shelf test · low overhead · honesty more than ornament",
    year: "Proposed 2027",
    heroImage: "/images/local-produce.jpg",
    heroAlt: "Local produce gathered for The Harvest shop test",
    blurb:
      "Witta has roughly 1,300 residents and no shops, no pub. The Shop is a small, slow attempt to put one back with a shared shelf and the makers who already live here.",
    whatItIs:
      "A small retail space at The Harvest stocking what Witta and the surrounding hinterland produces. Preserves, ferments, ceramics, prints, oils, herbs, baked goods, gifts from the residencies. Run as a consignment and shared-shelf test rather than a buy-low-sell-high shop. Sublicenced under the lease, at arm's length from Harvest Pty's programming.",
    why:
      "The strategic plan calls for sub-licenced retail. The deeper reason is that Witta's last shop closed inside living memory and the gap is felt every week. A village without a shop has to drive for everything. A shop with the right shape, not Coles, not boutique, gives makers a shelf and gives neighbours a reason to walk past.",
    how:
      "Sub-licenced under the lease, capital-light by design. Co-design with local makers and the Wednesday Maintenance Crew. Honest signage: who made it, where it came from, what they got paid. Open progressively as products and operators are ready, not all at once.",
    wittaThreads: [
      {
        year: "Today",
        moment: "Witta: ~1,300 residents. No shops. No pub. A school that closed in 1974.",
        thread:
          "The Shop answers an absence that's been there for fifty years. Modestly, on the village's own terms.",
      },
      {
        year: "1904",
        moment: "Maleny's first butter factory opens. The co-operative model takes root.",
        thread:
          "The first commerce here was co-operative. The Shop tests that shared operating instinct at village scale before any formal structure is claimed.",
      },
      {
        year: "1980s",
        moment: "Maleny attracts artists, craftspeople, and alternative lifestylers. Co-ops, organic produce, and intentional communities replace dairy infrastructure.",
        thread:
          "Forty years of makers around Witta still need a shelf. We're building the shelf.",
      },
    ],
    hands: [
      { name: "Local makers (Witta + hinterland)", role: "Stockists, co-designers" },
      { name: "Sub-operator (TBC)", role: "Day-to-day retail" },
      { name: "Harvest Pty Ltd", role: "Sub-licence holder" },
    ],
    related: ["the-garden", "milk-crate-pavilion"],
  },
];

export const worksBySlug: Record<string, Work> = Object.fromEntries(
  works.map((w) => [w.slug, w]),
);
