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

export type WorkStatusLabel = "Built" | "Growing" | "Forthcoming";

/**
 * Resolve a work's many lifecycle tags down to the single human status the
 * /works hero promises ("some built, some growing, some forthcoming"). The full
 * tag taxonomy stays for admins and comms; visitors see one honest word.
 */
export function resolveWorkStatus(
  tags: LifecycleTag[],
): { label: WorkStatusLabel; badgeClass: string } {
  const growing: LifecycleTag[] = ["growing", "building", "making", "extending"];
  const built: LifecycleTag[] = ["built", "made", "harvested", "open", "maintained"];
  if (tags.some((t) => growing.includes(t))) {
    return { label: "Growing", badgeClass: "bg-emerald-700 text-emerald-50" };
  }
  if (tags.some((t) => built.includes(t))) {
    return { label: "Built", badgeClass: "bg-stone-800 text-amber-300" };
  }
  return { label: "Forthcoming", badgeClass: "bg-amber-100 text-stone-800 border border-amber-300" };
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
  href?: string;
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
  /** Optional extra external links */
  links?: { label: string; href: string }[];
  /** Optional article/story links related to this work */
  storyLinks?: { label: string; href: string }[];
  /** Optional related works for cross-linking */
  related?: string[];
  /** Display weight. "note" renders a short template (label, intro, hands, any
   *  calls to action); "feature" (the default) renders the full long-form page. */
  weight?: "feature" | "note";
};

export const works: Work[] = [
  {
    number: "Work 01",
    slug: "the-garden",
    title: "The Garden",
    subtitle: "The volcano made the soil. The community works the rows.",
    lifecycleTags: ["planted", "growing"],
    materials: "Red volcanic soil · seasonal beds · local hands",
    year: "Established 2025, planting ongoing",
    heroImage: "/images/optimized/hero-aerial-1400.webp",
    heroAlt: "The garden taking shape at The Harvest, Witta",
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
      { name: "Sophie from Sophie's Seedlings", role: "Garden volunteer", href: "https://sophiesseedlings.com/" },
      { name: "Susie & Joey", role: "Community Stewards" },
    ],
    related: ["milk-crate-pavilion", "the-shop"],
  },
  {
    number: "Work 02",
    slug: "milk-crate-pavilion",
    title: "Milk Crate Pavilion",
    subtitle: "A gathering structure made from the dairy industry’s everyday object.",
    lifecycleTags: ["building"],
    materials: "Reclaimed milk crates · scaffold · salvaged timber · community hands",
    year: "Building through 2026",
    heroImage: "/images/optimized/gathering-recap-crowd-1200.webp",
    heroAlt: "People gathered at The Harvest",
    heroCredit: "Radical Scoops fellowship · Regional Arts Australia",
    blurb:
      "The community is building it together. Milk crates from the dairy industry, scaffold poles, found timber. The first piece of architecture on the site, and the most communal.",
    whatItIs:
      "A modular open-air pavilion at the heart of The Harvest. Roughly 14m × 9m, sized to fit comfortably under the pecan trees. Plays the role of gallery, theatre, market hall, dining room and weather shelter, sometimes in the same afternoon. Designed to come apart, rearrange, and grow.",
    why:
      "A pavilion lets the community gather before anything else is finished. Markets, exhibitions, films, dinners, conversations. It says clearly: this place is for gathering, and gathering is the first work.",
    how:
      "Being built by community members under the Radical Scoops fellowship. Milk crates were sourced from the dairy industry that once powered Witta. Scaffold was hired and rebuilt as structure. Timber is offcuts, salvage, and gifts. No single builder. Everyone takes a corner.",
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
      { name: "Community members", role: "Builders" },
      { name: "Regional Arts Australia", role: "Radical Scoops fellowship funder" },
      { name: "Ben Knight & Nicholas Marchesi", role: "Co-founders, project leads" },
    ],
    link: {
      label: "Radical Scoops fellowship",
      href: "https://regionalarts.com.au/resources/radical-scoops",
    },
    links: [
      {
        label: "Hatch Electrical",
        href: "https://www.hatchelectrical.com.au/",
      },
    ],
    related: ["the-cedar", "the-garden"],
  },
  {
    number: "Work 03",
    slug: "the-cedar",
    title: "The Garden Paths",
    subtitle: "Reclaimed St Mary's timber, becoming walkways at Witta",
    lifecycleTags: ["building", "making"],
    materials: "Reclaimed St Mary's Cathedral timber · garden paths · source trail being traced",
    year: "Sourced 2026",
    heroImage: "/images/optimized/barry-5745-1000.webp",
    heroAlt: "Reclaimed timber connected to the garden paths at The Harvest",
    blurb:
      "The garden paths are being made from timber reclaimed from St Mary's Cathedral in Sydney. The source trail is still being checked. For now, the timber carries the larger ridge story: cut, moved, used, and now returned to daily work.",
    whatItIs:
      "A set of garden walkways made from reclaimed St Mary's Cathedral timber. The paths carry people through the beds while carrying the timber story back into the landscape it came from.",
    why:
      "The timber story belongs in the ground, not only on a wall. Paths are how people first read a garden: where to enter, where to slow down, where to notice what is growing.",
    how:
      "Timber we believe came from St Mary's Cathedral in Sydney, being prepared for use as garden walkways at The Harvest. We are still tracing exactly how it left the cathedral and reached the range. Used visibly, so the grain, the old marks, and the honest gaps in its story stay part of the work.",
    wittaThreads: [
      {
        year: "1860",
        moment: "Bunya pine reserve rescinded. Timber-getters flood in. The 'red gold' rush begins.",
        thread:
          "The paths carry the timber story back into the garden, plank by plank.",
      },
      {
        year: "1886",
        moment: "Two giant cedar logs shipped to the Indian and Colonial Exhibition in London. No buyer, too large for any mill in the world.",
        thread:
          "Some Witta timber travelled far from the range. This work follows one return journey.",
      },
      {
        year: "1906",
        moment: "Red cedar faces commercial extinction. One-third of Queensland's hoop and bunya pine already gone.",
        thread:
          "The paths keep the timber visible as material, memory, and daily use.",
      },
    ],
    hands: [
      { name: "Nicholas Marchesi", role: "Material lead" },
      { name: "Ben Knight", role: "Source trail and documentation" },
      { name: "Local timber hands", role: "Preparation and installation" },
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
    year: "First shelf taking shape, 2026",
    heroImage: "/images/optimized/local-produce-760.webp",
    heroAlt: "Local produce gathered for The Harvest shop test",
    blurb:
      "Witta has roughly 1,300 residents and no shops, no pub. The Shop is a small, slow attempt to put one back with a shared shelf and the makers who already live here.",
    whatItIs:
      "A small retail space at The Harvest stocking what Witta and the surrounding hinterland produces. Preserves, ferments, ceramics, prints, oils, herbs, baked goods, gifts from the residencies. Run as a small shared-shelf test rather than a buy-low-sell-high shop, kept at arm's length from the rest of the Harvest operating setup.",
    why:
      "The strategic plan calls for sub-licenced retail. The deeper reason is that Witta's last shop closed inside living memory and the gap is felt every week. A village without a shop has to drive for everything. A shop with the right shape, not Coles, not boutique, gives makers a shelf and gives neighbours a reason to walk past.",
    how:
      "Capital-light by design. Co-design with local makers and the Wednesday Maintenance Crew. Honest signage: who made it, where it came from, what they got paid. Open progressively as products and operators are ready, not all at once.",
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
      { name: "The Harvest team", role: "Operating setup" },
    ],
    storyLinks: [
      {
        label: "Offer produce for the first shelf",
        href: "/works/the-shop#shop-interest",
      },
      {
        label: "Stock something you make",
        href: "/works/the-shop#shop-interest",
      },
      {
        label: "Help shape The Shop",
        href: "/works/the-shop#shop-interest",
      },
    ],
    related: ["the-garden", "milk-crate-pavilion"],
  },
  {
    number: "Work 05",
    slug: "kids-area",
    title: "Kids' Area",
    subtitle: "A play area shaped with the kids who will use it",
    weight: "note",
    lifecycleTags: ["consulting", "planned"],
    materials: "Logs · shade · loose parts · local kids' ideas",
    year: "In design 2026",
    heroImage: "/images/optimized/team-garden-selfie-1000.webp",
    heroAlt: "Harvest garden crew gathered at the old nursery site",
    blurb:
      "The kids area is being shaped with local kids, not handed down as a finished playground. They help decide what belongs there, what it should feel like, and what makes them want to come back.",
    whatItIs:
      "A small outdoor play area inside the garden rhythm of The Harvest. Logs, shade, loose parts, climbable edges, and room for children to make their own rules without turning the whole place into a plastic playground.",
    why:
      "If families are part of The Harvest, kids need a place that is theirs. Co-design keeps the area practical, safer, stranger, and more loved than a bought object dropped on site.",
    how:
      "The first version starts with listening, sketches, and small build tests. Kids bring ideas. Adults bring care, tools, safe joins, shade, and the ability to make the good ideas stand up.",
    wittaThreads: [
      {
        year: "Today",
        moment: "Families, work days, and open days bring children through the gate.",
        thread:
          "The kids area makes room for children as contributors to the place, not just people waiting while adults talk.",
      },
      {
        year: "Former nursery",
        moment: "The old nursery site was already a place where local families came for seeds, plants, and practical garden knowledge.",
        thread:
          "The play area keeps that everyday family use alive in the next version of the site.",
      },
    ],
    hands: [
      { name: "Local kids", role: "Ideas and co-design" },
      { name: "Parents and builders", role: "Care, safety, materials" },
      { name: "The Harvest team", role: "Design and build coordination" },
    ],
    related: ["the-garden", "milk-crate-pavilion"],
  },
  {
    number: "Work 06",
    slug: "the-milk-man",
    title: "The Milk Man",
    subtitle: "A milk crate sentinel at the front of The Harvest",
    weight: "note",
    lifecycleTags: ["built", "made"],
    materials: "Milk crates · stacked figure · front gate marker · dairy memory",
    year: "Standing now",
    heroImage: "/images/optimized/member-welcome-crates-1200.webp",
    heroAlt: "Milk crates stacked at The Harvest",
    blurb:
      "The Milk Man stands at the front of The Harvest: a figure made from milk crates, holding the dairy story at the gate before people even read a sign.",
    whatItIs:
      "A milk crate figure at the front of the site. Part sign, part marker, part local joke with a serious backbone: the dairy industry made the object, and now the object watches the next version of the place arrive.",
    why:
      "The Harvest needs recognisable things people can point at, remember, and talk about. The Milk Man does that before anyone reads a paragraph. He makes the dairy thread visible without turning it into a museum label.",
    how:
      "Built from stacked milk crates and kept visible at the front of the site. The next work is naming him properly, photographing him well, and deciding how he carries the dairy story with enough humour and enough respect.",
    wittaThreads: [
      {
        year: "1900s",
        moment: "Dairy and co-operative infrastructure shaped work, movement, and daily life across the hinterland.",
        thread:
          "The crate was a working object before it became a sculpture. The Milk Man keeps that plain material memory standing at the gate.",
      },
    ],
    hands: [
      { name: "The Harvest team", role: "Build and placement" },
      { name: "Local photographers", role: "Still needed" },
      { name: "Neighbours", role: "Name suggestions and crate leads" },
    ],
    storyLinks: [
      {
        label: "Send a name idea or photo",
        href: "/membership#questions",
      },
      {
        label: "See the Milk Crate Pavilion",
        href: "/works/milk-crate-pavilion",
      },
    ],
    related: ["milk-crate-pavilion", "the-garden"],
  },
];

export const worksBySlug: Record<string, Work> = Object.fromEntries(
  works.map((w) => [w.slug, w]),
);
