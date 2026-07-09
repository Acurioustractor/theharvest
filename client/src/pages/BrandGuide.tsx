import { useState, useEffect, useRef, type CSSProperties } from "react";
import { Link } from "wouter";
import { rootStyle, colors, fonts } from "@/styles/brand";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { trpc } from "@/lib/trpc";
import { optimize } from "@/lib/imageOptimize";

/* ─────────────────────────────────────
   DATA
   ───────────────────────────────────── */

const chapters = [
  { id: "current", label: "Current Flow" },
  { id: "content", label: "3-Week Content" },
  { id: "logo", label: "The Mark" },
  { id: "stance", label: "Stance" },
  { id: "threes", label: "Grow Make Gather" },
  { id: "rooms", label: "What It Means" },
  { id: "principles", label: "Principles" },
  { id: "writing", label: "Writing Style" },
  { id: "gallery", label: "Visual Library" },
  { id: "sketchpad", label: "Sketch Pad" },
  { id: "social", label: "Social Kit" },
  { id: "palette", label: "Palette" },
  { id: "typography", label: "Typography" },
  { id: "voice", label: "Voice Rules" },
  { id: "photo", label: "Photography" },
  { id: "donts", label: "Do / Don't" },
];

const threes = [
  {
    label: "Grow. Make. Gather.",
    type: "Public tagline",
    items: [
      { word: "Grow", desc: "The garden, the old nursery, seedlings, beds, soil, and the practical work of opening the place.", color: colors.canopy, colorName: "Canopy" },
      { word: "Make", desc: "The hands-on work: art space, repairs, timber, tools, signs, workshops, and things being shaped in public.", color: colors.crane, colorName: "Crane" },
      { word: "Gather", desc: "The social promise: neighbours, open days, long tables, music, food, questions, and people coming through the gate.", color: colors.goldenHour, colorName: "Golden Hour" },
    ],
  },
  {
    label: "Garden opening. Creative gathering place.",
    type: "Plain explanation",
    items: [
      { word: "Garden opening", desc: "The immediate public promise. This is what people can understand and come to.", color: colors.canopy, colorName: "Canopy" },
      { word: "Creative", desc: "The making thread: art, repair, timber, signs, objects, workshops, and the build itself.", color: colors.crane, colorName: "Crane" },
      { word: "Gathering place", desc: "The social thread: neighbours, food, music, tables, questions, and community days.", color: colors.goldenHour, colorName: "Golden Hour" },
    ],
  },
];

const rooms = [
  {
    name: "Garden",
    color: colors.canopy,
    verb: "Grow",
    tagline: "Grow",
    what: "The public opening edge. Beds, paths, seedlings, old nursery memory, kids, soil, and the practical work people can see.",
    who: "Families, homeschoolers, gardeners, neighbours, kids with ideas.",
    spirit: "The garden is the first thing people understand. Let it carry the opening.",
    questions: [
      "What can be honestly shown by the end of June?",
      "What help do we need this week?",
      "What makes someone feel welcome at the gate?",
    ],
  },
  {
    name: "Make",
    color: colors.crane,
    verb: "Make",
    tagline: "Make",
    what: "The creative build: timber, tools, signs, objects, repair, art, workshops, and the visible work of making the place.",
    who: "Artists, builders, kids, practical people, workshop people, and anyone who wants to make something useful.",
    spirit: "Make is not a program category. It is the way the place comes into being.",
    questions: [
      "What are people making now?",
      "What object or photo proves the idea fastest?",
      "What is useful enough to show before it is polished?",
    ],
  },
  {
    name: "Gather",
    color: colors.goldenHour,
    textColor: colors.shed,
    verb: "Gather",
    tagline: "Gather",
    what: "The reason people come through and stay: neighbours, shared tables, food, music, open days, questions, and local stories.",
    who: "Witta locals, families, neighbours, makers, growers, artists, and curious visitors.",
    spirit: "Gather is the promise. Do not overcomplicate it.",
    questions: [
      "What is the next simple invitation?",
      "What should people do when they arrive?",
      "What gets remembered after they leave?",
    ],
  },
];

const principles = [
  {
    bold: "Nothing is permanent.",
    desc: "Like a gallery. The space is always becoming.",
  },
  {
    bold: "Community-built.",
    desc: "We don't build for people. We build with them.",
  },
  {
    bold: "Custodianship.",
    desc: "We build to hand over.",
  },
];

const launchContentWeeks = [
  {
    week: "Week 1",
    dates: "8-14 June",
    theme: "Make the place legible",
    job: "People should understand the simple public frame before they are asked to do anything.",
    proof: "front gate, garden beds, Milk Man, milk crates, one wide site photo",
    cta: "Learn about The Harvest",
    posts: {
      facebook: "Photo-led explainer: Witta, Jinibara Country, garden opening end of June. Keep it plain and shareable for locals.",
      instagram: "Carousel: Grow / Make / Gather, one real photo per word, short caption.",
      newsletter: "Subject: The Harvest garden opens end of June. Lead with what is taking shape, then three practical updates.",
    },
  },
  {
    week: "Week 2",
    dates: "15-21 June",
    theme: "Invite the right kinds of help",
    job: "Move from awareness to participation without making it feel like a marketing push.",
    proof: "hands working, timber, signs, garden detail, question wall, useful objects",
    cta: "Bring a question, a story, or a pair of hands",
    posts: {
      facebook: "Local ask: what can people bring, lend, remember, or help with before the garden opens?",
      instagram: "Stories/reels: short clips of making, carrying, clearing, planting, marking, building.",
      newsletter: "Subject: A few hands before the garden opens. One lead story, three asks, one reply CTA.",
    },
  },
  {
    week: "Week 3",
    dates: "22-28 June",
    theme: "Turn opening into memory",
    job: "Show proof, thank people, collect stories, and point to the next useful action.",
    proof: "best approved photos, question wall notes, people from behind or consented faces, objects left behind",
    cta: "Share a photo, a question, or the next thing you want to help with",
    posts: {
      facebook: "Thank-you and recap: what happened, what people asked, what is next.",
      instagram: "Photo wall carousel/reel: real moments, minimal words, no overclaiming.",
      newsletter: "Subject: What we heard at The Harvest. Recap, photo wall, next callout.",
    },
  },
];

const launchAudienceLoops = [
  {
    audience: "Witta locals",
    hook: "This is in your backyard.",
    proof: "gate, road, familiar objects, plain local detail",
    ask: "Come see what is taking shape. Tell us what this place should hold.",
  },
  {
    audience: "Families and kids",
    hook: "The garden should feel usable, not precious.",
    proof: "paths, shade, kids' area materials, soil, hands",
    ask: "Bring a question from a kid, or an idea for the garden.",
  },
  {
    audience: "Makers and artists",
    hook: "The place is being made, not decorated.",
    proof: "timber, tools, signs, workbench, rough edges",
    ask: "Bring a skill, a workshop idea, or a useful object.",
  },
  {
    audience: "Growers and producers",
    hook: "The local shelf and table start small.",
    proof: "produce, crates, jars, labels, shared table",
    ask: "Tell us what you grow, make, preserve, bake, or could put on a shelf.",
  },
  {
    audience: "Supporters and funders",
    hook: "This is early proof, not polished theatre.",
    proof: "real turnout, questions, practical needs, before/after photos",
    ask: "Help with one concrete gap: materials, insurance, food setup, signage, or documentation.",
  },
];

const currentBrandAssets = [
  { src: "/images/social/harvest-social-card.jpg", label: "Current share image - real milk crate pavilion" },
  { src: "/images/membership/member-welcome-crates.jpg", label: "Milk crate pavilion source photo" },
  { src: "/images/optimized/member-welcome-crates-1200.webp", label: "Milk crate pavilion crop" },
  { src: "/images/optimized/seed-house-front-1600.webp", label: "Front building - real site proof" },
  { src: "/images/optimized/hero-aerial-1600.webp", label: "Aerial site context" },
  { src: "/images/optimized/hero-aerial-1400.webp", label: "Garden work" },
  { src: "/images/optimized/team-garden-selfie-1000.webp", label: "Garden crew" },
  { src: "/images/optimized/barry-5745-1000.webp", label: "Barry and the workbench" },
  { src: "/images/optimized/barry-5764-1000.webp", label: "Barry at golden hour" },
  { src: "/images/compendium/canvas-drawing-full.jpg", label: "Whole-site drawing" },
];

const imageGallery: { category: string; images: { src: string; label: string }[] }[] = [
  {
    category: "Current Brand Picks",
    images: currentBrandAssets,
  },
  {
    category: "Canvas Drawings",
    images: [
      { src: "/images/compendium/canvas-drawing.jpg", label: "Canvas drawing" },
      { src: "/images/compendium/canvas-drawing-full.jpg", label: "Canvas drawing (full)" },
      { src: "/images/compendium/canvas-drawing-dark.jpg", label: "Canvas drawing (dark)" },
    ],
  },
  {
    category: "Architect Plans",
    images: [
      { src: "/images/compendium/MASTER FLOOR PLAN.png", label: "Master floor plan" },
      ...Array.from({ length: 12 }, (_, i) => ({
        src: `/images/compendium/MASTER FLOOR PLAN_${i + 1}.jpeg`,
        label: `Floor plan sheet ${i + 1}`,
      })),
    ],
  },
  {
    category: "Site Plan Layers",
    images: [
      { src: "/images/site-plan/cropped/photo.png", label: "Aerial photo" },
      { src: "/images/site-plan/cropped/masterplan.png", label: "Master plan" },
      { src: "/images/site-plan/cropped/landscaping.png", label: "Landscaping" },
      { src: "/images/site-plan/cropped/circulation.png", label: "Circulation" },
      { src: "/images/site-plan/cropped/zone-labels.png", label: "Zone labels" },
      { src: "/images/site-plan/cropped/wind-flow.png", label: "Wind flow" },
      { src: "/images/site-plan/cropped/sun-compass.png", label: "Sun compass" },
      { src: "/images/site-plan/cropped/landscaping-sketch.png", label: "Landscaping sketch" },
    ],
  },
  {
    category: "Site Plan Sketches",
    images: [
      { src: "/images/site-plan/layers/sketches/00-base-plan.png", label: "Base plan sketch" },
      { src: "/images/site-plan/layers/sketches/01-annotations.png", label: "Annotations" },
      { src: "/images/site-plan/layers/sketches/02-building-outline.png", label: "Building outline" },
      { src: "/images/site-plan/layers/sketches/03-dimensions.png", label: "Dimensions" },
    ],
  },
  {
    category: "Barry & The Shed",
    images: [
      { src: "/images/compendium/barry/IMG_5764.jpg", label: "Barry at golden hour" },
      { src: "/images/compendium/barry/IMG_5777.jpg", label: "Looking out" },
      { src: "/images/compendium/barry/IMG_5745.jpg", label: "On the workbench telling stories" },
      { src: "/images/compendium/barry/IMG_5819.jpg", label: "With the Blue Heelers" },
      { src: "/images/compendium/barry/IMG_5613.jpg", label: "The machinery graveyard" },
      { src: "/images/compendium/barry/IMG_5699.jpg", label: "Inside the shed" },
      { src: "/images/compendium/barry/IMG_5659.jpg", label: "Among the engines" },
      { src: "/images/compendium/barry/IMG_5758.jpg", label: "With the Case bulldozer" },
      { src: "/images/compendium/barry/IMG_5687.jpg", label: "The workshop" },
      { src: "/images/compendium/barry/IMG_5618.jpg", label: "Surveying the yard" },
      { src: "/images/compendium/barry/IMG_5727.jpg", label: "With visitors" },
      { src: "/images/compendium/barry/IMG_5633.jpg", label: "Barry" },
    ],
  },
  {
    category: "Witta History (1899-1931)",
    images: [
      { src: "/images/witta/history/teutoburg-farm-couple-corn-1899.png", label: "Farm couple with corn, 1899" },
      { src: "/images/witta/history/teutoburg-cheese-making-1899.png", label: "Cheese making, 1899" },
      { src: "/images/witta/history/teutoburg-children-grapevines-1899.png", label: "Children in grapevines, 1899" },
      { src: "/images/witta/history/teutoburg-man-hoe-1899.png", label: "Man with hoe, 1899" },
      { src: "/images/witta/history/teutoburg-nothling-cottage-1899.png", label: "Nothling cottage, 1899" },
      { src: "/images/witta/history/teutoburg-pit-sawyers-1899.png", label: "Pit sawyers, 1899" },
      { src: "/images/witta/history/bunya-pines-witta-1931.png", label: "Bunya pines, 1931" },
      { src: "/images/witta/history/witta-towards-conondale-1931.png", label: "Towards Conondale, 1931" },
    ],
  },
];

type BrandMediaAsset = {
  id: string;
  src: string;
  title: string | null;
  description: string | null;
  altText: string | null;
  date: string | null;
  tags?: string[];
  themes?: string[];
  works?: string[];
};

const coreMediaRules: {
  label: string;
  role: string;
  rank: number;
  status: string;
  terms: string[];
  ids?: string[];
}[] = [
  {
    label: "Milk Man",
    role: "Open-day object / public question",
    rank: 1,
    status: "Core candidate. Confirm consent before public use.",
    ids: ["95f88438-1ea0-4b5f-adda-8cbf2eebb28d", "33556076-3356-4f01-b9ca-fedc4eb8906e"],
    terms: ["milk man", "milkman", "1e5a4420", "1e5a4423"],
  },
  {
    label: "Giant milk crate",
    role: "Gathering object / public signal",
    rank: 2,
    status: "Core candidate. Use if source and brand approval are clear.",
    ids: ["04bb3713-85d1-4b51-8dc4-cff11f4138f7"],
    terms: ["milk crate", "milk-crate", "pavilion", "1e5a4841", "crate"],
  },
  {
    label: "Site context",
    role: "Whole-place proof",
    rank: 3,
    status: "Core candidate. Good for page/deck context.",
    ids: ["1a7af0d1-17ed-4f63-9a90-054e781ea508"],
    terms: ["dji", "aerial", "hero-aerial", "site"],
  },
  {
    label: "Garden work",
    role: "Garden first / real hands",
    rank: 4,
    status: "Core if people consent is clear.",
    terms: ["sophie", "garden", "seedling", "team-garden"],
  },
  {
    label: "Barry / timber",
    role: "Timber, tools, old shed memory",
    rank: 5,
    status: "Core story asset. Check story consent and attribution.",
    terms: ["barry", "5745", "5764", "shed", "timber"],
  },
  {
    label: "Plans / drawings",
    role: "Structure, rooms, proof of work",
    rank: 6,
    status: "Core support asset.",
    terms: ["floor plan", "master floor", "canvas", "drawing", "plan"],
  },
];

/* ─────────────────────────────────────
   COLLAPSIBLE SECTION
   ───────────────────────────────────── */

function Collapsible({ title, defaultOpen = true, children }: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginBottom: open ? 20 : 0,
          color: "inherit",
        }}
      >
        <span style={{
          fontFamily: "monospace",
          fontSize: 12,
          opacity: 0.4,
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.15s ease",
          display: "inline-block",
        }}>
          {"\u25B6"}
        </span>
        <span style={{
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: "0.12em",
          opacity: 0.5,
        }}>
          {open ? "COLLAPSE" : "EXPAND"} {title.toUpperCase()}
        </span>
      </button>
      {open && children}
    </div>
  );
}

function isVideoAsset(src: string): boolean {
  return /\.(mp4|mov|m4v|webm)(\?.*)?$/i.test(src);
}

function mediaHaystack(asset: BrandMediaAsset): string {
  return [
    asset.id,
    asset.src,
    asset.title,
    asset.description,
    asset.altText,
    ...(asset.tags ?? []),
    ...(asset.themes ?? []),
    ...(asset.works ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getCoreRule(asset: BrandMediaAsset) {
  const haystack = mediaHaystack(asset);
  return coreMediaRules.find((rule) => {
    if (rule.ids?.includes(asset.id)) return true;
    return rule.terms.some((term) => haystack.includes(term.toLowerCase()));
  });
}

function EmpathyLedgerBrandMedia({
  isMobile,
  onImageClick,
}: {
  isMobile: boolean;
  onImageClick: (src: string, label: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const query = trpc.gallery.fromEL.useQuery(
    { limit: 300 },
    { staleTime: 5 * 60 * 1000 },
  );

  const media = ((query.data?.media ?? []) as BrandMediaAsset[]).filter((asset) => asset.src);
  const ranked = media
    .map((asset, index) => {
      const rule = getCoreRule(asset);
      return {
        asset,
        rule,
        rank: rule?.rank ?? 1000 + index,
      };
    })
    .sort((a, b) => a.rank - b.rank);

  const core = ranked.filter((item) => item.rule);
  const visible = showAll ? ranked : ranked.slice(0, 36);
  const total = query.data?.pagination?.total ?? media.length;

  return (
    <div style={{
      marginBottom: 56,
      border: `1px solid rgba(28,25,23,0.12)`,
      backgroundColor: "rgba(255,255,255,0.32)",
    }}>
      <div style={{
        padding: isMobile ? "22px 18px" : "28px 32px",
        borderBottom: `1px solid rgba(28,25,23,0.1)`,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
        gap: 18,
        alignItems: "start",
      }}>
        <div>
          <span style={{ ...smallLabelStyle, color: colors.shed, opacity: 0.45 }}>
            EMPATHY LEDGER MEDIA · LIVE LIBRARY
          </span>
          <h3 style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: isMobile ? 22 : 30,
            letterSpacing: "0.04em",
            margin: "12px 0 10px",
          }}>
            CORE PHOTOS FIRST
          </h3>
          <p style={{
            fontFamily: fonts.body,
            fontSize: 15,
            lineHeight: 1.7,
            opacity: 0.68,
            margin: 0,
            maxWidth: 680,
          }}>
            Pulls from `project=the-harvest` in Empathy Ledger. Known launch and brand assets are ranked at the top; the wider EL library stays available underneath.
          </p>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, auto)",
          gap: 8,
        }}>
          {[
            ["EL total", query.isLoading ? "..." : String(total)],
            ["Loaded", String(media.length)],
            ["Core hits", String(core.length)],
          ].map(([label, value]) => (
            <div key={label} style={{
              border: `1px solid rgba(28,25,23,0.12)`,
              padding: "10px 12px",
              minWidth: 74,
              textAlign: "center",
              backgroundColor: colors.milk,
            }}>
              <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 18 }}>{value}</div>
              <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 9, letterSpacing: "0.1em", opacity: 0.45 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {query.isLoading ? (
        <div style={{ padding: 28, fontFamily: fonts.body, opacity: 0.55 }}>
          Loading Empathy Ledger media...
        </div>
      ) : query.error ? (
        <div style={{ padding: 28, fontFamily: fonts.body, color: colors.crane }}>
          Empathy Ledger media is not available right now. Use the local folders below.
        </div>
      ) : media.length === 0 ? (
        <div style={{ padding: 28, fontFamily: fonts.body, opacity: 0.55 }}>
          No Harvest media returned from Empathy Ledger.
        </div>
      ) : (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
            gap: 12,
            padding: isMobile ? 18 : 24,
          }}>
            {visible.map(({ asset, rule }) => {
              const video = isVideoAsset(asset.src);
              const title = asset.title || asset.altText || "Untitled Harvest media";
              return (
                <figure key={asset.id} style={{
                  margin: 0,
                  border: `1px solid ${rule ? "rgba(196,146,42,0.55)" : "rgba(28,25,23,0.1)"}`,
                  backgroundColor: colors.milk,
                }}>
                  <button
                    onClick={() => !video && onImageClick(asset.src, title)}
                    style={{
                      display: "block",
                      width: "100%",
                      border: "none",
                      padding: 0,
                      cursor: video ? "default" : "pointer",
                      backgroundColor: "rgba(28,25,23,0.08)",
                      position: "relative",
                    }}
                  >
                    {video ? (
                      <video src={asset.src} controls preload="metadata" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                    ) : (
                      <img
                        src={optimize(asset.src, "card")}
                        alt={asset.altText || title}
                        loading="lazy"
                        decoding="async"
                        style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
                      />
                    )}
                    <span style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      backgroundColor: rule ? colors.goldenHour : "rgba(28,25,23,0.75)",
                      color: rule ? colors.shed : colors.milk,
                      padding: "5px 7px",
                      fontFamily: fonts.display,
                      fontWeight: 900,
                      fontSize: 9,
                      letterSpacing: "0.1em",
                    }}>
                      {rule ? `CORE ${rule.rank}` : "EL"}
                    </span>
                  </button>
                  <figcaption style={{ padding: 14 }}>
                    <div style={{
                      fontFamily: fonts.display,
                      fontWeight: 900,
                      fontSize: 12,
                      letterSpacing: "0.04em",
                      marginBottom: 6,
                    }}>
                      {rule?.label ?? title}
                    </div>
                    <p style={{
                      fontFamily: fonts.body,
                      fontSize: 12,
                      lineHeight: 1.5,
                      opacity: 0.68,
                      margin: "0 0 10px",
                    }}>
                      {rule?.role ?? asset.description ?? asset.altText ?? "Harvest EL media asset."}
                    </p>
                    <div style={{
                      display: "grid",
                      gap: 4,
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: 10,
                      opacity: 0.55,
                      overflowWrap: "anywhere",
                    }}>
                      <span>status: {rule?.status ?? "Library asset. Review source, rights, consent, and story job before public use."}</span>
                      <span>date: {asset.date ?? "unknown"}</span>
                      <span>id: {asset.id}</span>
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {ranked.length > 36 && (
            <div style={{ padding: "0 24px 24px", textAlign: "center" }}>
              <button
                onClick={() => setShowAll((current) => !current)}
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  color: colors.shed,
                  backgroundColor: colors.goldenHour,
                  border: "none",
                  padding: "12px 20px",
                  cursor: "pointer",
                }}
              >
                {showAll ? "SHOW CORE SET" : `SHOW ALL ${ranked.length} LOADED`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────
   COMPONENT
   ───────────────────────────────────── */

export default function BrandGuide() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("bg-auth") === "1");
  const [pw, setPw] = useState("");
  const [shake, setShake] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const [lightbox, setLightbox] = useState<{ src: string; label: string } | null>(null);
  const [activeChapter, setActiveChapter] = useState("current");
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Track active chapter on scroll
  useEffect(() => {
    if (!authed) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveChapter(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const ch of chapters) {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [authed]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!authed) {
    return (
      <div style={{ ...rootStyle, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pw.toUpperCase() === "BCV") {
              sessionStorage.setItem("bg-auth", "1");
              setAuthed(true);
            } else {
              setShake(true);
              setTimeout(() => setShake(false), 500);
              setPw("");
            }
          }}
          style={{
            textAlign: "center",
            animation: shake ? "shake 0.4s ease" : undefined,
          }}
        >
          <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }`}</style>
          <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 14, letterSpacing: "0.2em", opacity: 0.4, marginBottom: 24 }}>
            THE HARVEST. BRAND GUIDE
          </div>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            autoFocus
            style={{
              fontFamily: fonts.body,
              fontSize: 18,
              textAlign: "center",
              padding: "14px 24px",
              border: `2px solid ${colors.shed}`,
              borderRadius: 0,
              background: "transparent",
              outline: "none",
              letterSpacing: "0.1em",
              width: 200,
            }}
          />
          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.3, fontFamily: fonts.display }}>ENTER TO CONTINUE</div>
        </form>
      </div>
    );
  }

  return (
    <div style={rootStyle}>
      {/* Header */}
      <header style={{
        backgroundColor: colors.shed,
        color: colors.milk,
        padding: isMobile ? "60px 24px 40px" : "80px 40px 48px",
        textAlign: "center",
      }}>
        <span style={smallLabelStyle}>INTERNAL WORKING DOCUMENT</span>
        <h1 style={{
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: isMobile ? 32 : 48,
          letterSpacing: "0.12em",
          margin: "16px 0 12px",
        }}>
          BRAND GUIDE
        </h1>
        <p style={{
          fontFamily: fonts.body,
          fontSize: 16,
          opacity: 0.5,
          margin: 0,
        }}>
          Current spine, visual memory, and production rules
        </p>
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
          marginTop: 24,
        }}>
          <Link href="/brand-development" style={heroLinkStyle}>
            BRAND DEVELOPMENT WORKBENCH
          </Link>
          <Link href="/june-20" style={{ ...heroLinkStyle, backgroundColor: "transparent", color: colors.milk, border: `1px solid rgba(245,240,232,0.28)` }}>
            JUNE 20 PAGE
          </Link>
        </div>
      </header>

      {/* Sticky chapter nav */}
      <nav
        ref={navRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: colors.shed,
          borderBottom: "1px solid rgba(245,240,232,0.08)",
          overflow: "visible",
        }}
      >
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: isMobile ? "0 2px" : "0 4px",
          maxWidth: 1600,
          margin: "0 auto",
          padding: isMobile ? "4px 8px" : "6px 16px",
        }}>
          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => scrollTo(ch.id)}
              style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: "0.12em",
                color: colors.milk,
                opacity: activeChapter === ch.id ? 1 : 0.35,
                backgroundColor: "transparent",
                border: "none",
                borderBottom: activeChapter === ch.id ? `2px solid ${colors.goldenHour}` : "2px solid transparent",
                padding: isMobile ? "10px 8px" : "10px 12px",
                cursor: "pointer",
                transition: "opacity 0.15s, border-color 0.15s",
                flexShrink: 1,
                whiteSpace: "nowrap",
              }}
            >
              {ch.label.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* ─── CURRENT FLOW ─── */}
      <section id="current" style={{ padding: isMobile ? "60px 24px" : "80px 40px" }}>
        <h2 style={sectionHeadingStyle}>CURRENT FLOW</h2>
        <p style={sectionDescStyle}>
          This is the current public-facing Harvest idea. Lead with this before any internal model, program map, or future operating system.
        </p>

        <div style={{
          maxWidth: 1100,
          margin: "44px auto 0",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr",
          gap: 18,
          alignItems: "stretch",
        }}>
          <div style={{
            backgroundColor: colors.shed,
            color: colors.milk,
            padding: isMobile ? "28px 22px" : "36px 42px",
            borderTop: `6px solid ${colors.goldenHour}`,
          }}>
            <span style={smallLabelStyle}>WITTA · JINIBARA COUNTRY · GARDEN OPENING END OF JUNE</span>
            <h3 style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? 46 : 72,
              letterSpacing: "0.04em",
              lineHeight: 0.94,
              margin: "22px 0 16px",
            }}>
              THE HARVEST
            </h3>
            <p style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? 22 : 34,
              letterSpacing: "0.04em",
              color: colors.goldenHour,
              margin: "0 0 18px",
            }}>
              Grow. Make. Gather.
            </p>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 16 : 18,
              lineHeight: 1.75,
              opacity: 0.82,
              margin: 0,
              maxWidth: 680,
            }}>
              A community garden and creative gathering place taking shape in Witta.
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: 12,
              marginTop: 28,
            }}>
              {[
                ["Grow", "Garden opening", colors.canopy],
                ["Make", "Creative build", colors.crane],
                ["Gather", "Community place", colors.goldenHour],
              ].map(([verb, role, color]) => (
                <div key={verb} style={{ border: `1px solid rgba(245,240,232,0.14)`, padding: 16 }}>
                  <div style={{ width: 32, height: 5, backgroundColor: color, marginBottom: 12 }} />
                  <strong style={{ fontFamily: fonts.display, fontSize: 14, letterSpacing: "0.08em" }}>{verb}</strong>
                  <p style={{ fontFamily: fonts.body, fontSize: 13, opacity: 0.62, margin: "6px 0 0" }}>{role}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            border: `1px solid rgba(28,25,23,0.12)`,
            padding: isMobile ? "24px 20px" : "28px 30px",
            backgroundColor: "rgba(255,255,255,0.35)",
          }}>
            <span style={{ ...smallLabelStyle, color: colors.shed, opacity: 0.45 }}>
              HOW TO USE THIS PAGE
            </span>
            <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
              {[
                ["Lead", "Start with Witta, Jinibara Country, garden opening end of June, The Harvest, Grow. Make. Gather."],
                ["Explain", "Use one plain sentence: a community garden and creative gathering place taking shape in Witta."],
                ["Then deepen", "Only after that, bring in photos, people, stories, timber, dairy, tables, shop, events, and the longer build."],
              ].map(([title, body]) => (
                <div key={title} style={{ borderBottom: `1px solid rgba(28,25,23,0.08)`, paddingBottom: 14 }}>
                  <strong style={{ fontFamily: fonts.display, fontSize: 12, letterSpacing: "0.1em" }}>{title}</strong>
                  <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.6, opacity: 0.68, margin: "6px 0 0" }}>{body}</p>
                </div>
              ))}
            </div>
            <Link href="/brand-development" style={{
              display: "inline-block",
              marginTop: 20,
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: 12,
              letterSpacing: "0.08em",
              color: colors.shed,
              backgroundColor: colors.goldenHour,
              padding: "13px 18px",
              textDecoration: "none",
            }}>
              OPEN WORKBENCH →
            </Link>
          </div>
        </div>

        <div style={{
          maxWidth: 1100,
          margin: "18px auto 0",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 12,
        }}>
          {[
            ["1", "Public lockup", "Always first", "The exact words people should meet before any deeper explanation."],
            ["2", "Photo proof", "Always second", "Real garden, real people, real work, real Witta. No fake Harvest scenes."],
            ["3", "Next action", "Always third", "Learn about The Harvest, come through, ask a question, bring hands, or follow the next note."],
          ].map(([n, title, timing, body]) => (
            <div key={title} style={{
              border: `1px solid rgba(28,25,23,0.12)`,
              padding: 18,
              backgroundColor: "rgba(255,255,255,0.28)",
            }}>
              <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 22, color: colors.crane }}>{n}</span>
              <h3 style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 14, letterSpacing: "0.06em", margin: "10px 0 4px" }}>{title}</h3>
              <p style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 10, letterSpacing: "0.1em", opacity: 0.45, margin: "0 0 10px" }}>{timing}</p>
              <p style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.55, opacity: 0.68, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <LaunchContentPlan isMobile={isMobile} />

      {/* ─── THE MARK ─── */}
      <section id="logo" style={{ padding: isMobile ? "60px 24px" : "80px 40px" }}>
        <h2 style={sectionHeadingStyle}>THE MARK</h2>
        <p style={sectionDescStyle}>
          One wordmark. Three approved variants. Use it like it costs something to be wrong.
        </p>

        {/* Hero. wordmark big on cream */}
        <div style={{
          margin: "48px auto 0",
          maxWidth: 900,
          border: `1px solid rgba(26,26,26,0.1)`,
          padding: isMobile ? "40px 24px" : "80px 60px",
          backgroundColor: colors.milk,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}>
          <img
            src="/images/logo-v1-dark-clean.png"
            alt="The Harvest"
            style={{ maxWidth: "100%", width: 520, height: "auto" }}
          />
          <p style={{
            fontFamily: fonts.body,
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            opacity: 0.45,
            margin: 0,
          }}>
            The Harvest wordmark · V1 · locked Feb 2026
          </p>
        </div>

        {/* Three variants */}
        <div style={{ marginTop: 64, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
          <span style={{ ...smallLabelStyle, color: colors.shed, opacity: 0.5, marginBottom: 20, display: "block" }}>
            THREE VARIANTS · ONE WORDMARK
          </span>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 12,
          }}>
            {/* Dark on cream */}
            <div style={{
              backgroundColor: colors.milk,
              border: `1px solid rgba(26,26,26,0.1)`,
              padding: 28,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}>
              <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src="/images/logo-v1-dark-clean.png"
                  alt=""
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              </div>
              <div>
                <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.14em", color: colors.shed }}>
                  DARK
                </span>
                <p style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.5, opacity: 0.6, margin: "8px 0 0" }}>
                  For light backgrounds. Cream, soft tints, paper. The default.
                </p>
              </div>
            </div>

            {/* White on dark, via CSS invert */}
            <div style={{
              backgroundColor: colors.shed,
              padding: 28,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}>
              <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src="/images/logo-v1-dark-clean.png"
                  alt=""
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", filter: "brightness(0) invert(1)" }}
                />
              </div>
              <div>
                <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.14em", color: colors.goldenHour }}>
                  WHITE
                </span>
                <p style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.5, color: colors.milk, opacity: 0.65, margin: "8px 0 0" }}>
                  For dark backgrounds. Hero, footer, photo overlays. Invert via CSS, do not ship a separate white file.
                </p>
              </div>
            </div>

            {/* Colour on cream */}
            <div style={{
              backgroundColor: colors.milk,
              border: `1px solid rgba(26,26,26,0.1)`,
              padding: 28,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}>
              <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src="/images/logo-v1-colour-clean.png"
                  alt=""
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              </div>
              <div>
                <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.14em", color: colors.canopy }}>
                  COLOUR
                </span>
                <p style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.5, opacity: 0.6, margin: "8px 0 0" }}>
                  For light backgrounds and brand moments. Use sparingly: covers, signs, hero pieces.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage rules */}
        <div style={{ marginTop: 64, maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
          <span style={{ ...smallLabelStyle, color: colors.shed, opacity: 0.5, marginBottom: 20, display: "block" }}>
            USAGE RULES
          </span>
          <div style={{ display: "grid", gap: 0 }}>
            {[
              { label: "Clear space", body: "Keep one cap-height of THE HARVEST clear around every edge. The roots are part of the mark. Never crop them. Never sit text inside them." },
              { label: "Minimum size", body: "Don't go below 96px wide on screen, or 32mm wide in print. Below that, the roots stop reading and the mark turns to mush." },
              { label: "Backgrounds", body: "Cream (#F5F0E8) or shed black (#1C1917). Avoid mid-tone greys, busy photos, and any other palette colour (Crane, Canopy, Golden Hour, etc.) as a background. they all fight the mark." },
              { label: "On photography", body: "Only on heavily darkened or simplified imagery. If the background has texture, drop a 60–72% shed-black scrim under the mark first." },
              { label: "Alongside text", body: "If a lockup needs a line, use 'Grow. Make. Gather.' or 'Witta · Jinibara Country'. Keep it outside the wordmark clear space." },
            ].map((rule) => (
              <div key={rule.label} style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "180px 1fr",
                gap: isMobile ? 6 : 24,
                padding: "16px 0",
                borderBottom: `1px solid rgba(26,26,26,0.08)`,
              }}>
                <span style={{
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  color: colors.shed,
                  opacity: 0.6,
                  textTransform: "uppercase",
                }}>
                  {rule.label}
                </span>
                <p style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                  {rule.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What never to do */}
        <div style={{ marginTop: 64, maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
          <span style={{ ...smallLabelStyle, color: colors.shed, opacity: 0.5, marginBottom: 20, display: "block" }}>
            WHAT NEVER TO DO
          </span>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: 12,
          }}>
            {[
              "Don't redraw, retype, or substitute another font. The wordmark is custom letterforms.",
              "Don't recolour the dark variant. Use as-is or invert to white for dark backgrounds.",
              "Don't stretch, squish, rotate or skew the wordmark.",
              "Don't crop the roots. They are the mark.",
              "Don't add drop shadow, outer glow, outline or other effects.",
              "Don't combine with another wordmark, sub-brand or tagline inside the bounding box.",
              "Don't place on a busy photo without a scrim.",
              "Don't use the old three-circle mono mark (logo-mono-v1.png). It is retired.",
            ].map((rule, i) => (
              <div key={i} style={{
                padding: "16px 20px",
                border: "1px solid rgba(214,44,44,0.2)",
                backgroundColor: "rgba(214,44,44,0.04)",
              }}>
                <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 11, letterSpacing: "0.14em", color: colors.crane, display: "block", marginBottom: 8 }}>
                  ✗ DON&apos;T
                </span>
                <p style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Source files */}
        <div style={{
          marginTop: 48,
          maxWidth: 800,
          marginLeft: "auto",
          marginRight: "auto",
          padding: isMobile ? "24px 20px" : "28px 32px",
          border: `2px solid ${colors.goldenHour}`,
        }}>
          <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.16em", color: colors.goldenHour }}>
            SOURCE FILES
          </span>
          <div style={{ marginTop: 16, display: "grid", gap: 10, fontFamily: fonts.body, fontSize: 14, lineHeight: 1.6 }}>
            <div><strong>Dark, transparent:</strong> <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13 }}>/images/logo-v1-dark-clean.png</code></div>
            <div><strong>White (via CSS):</strong> <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13 }}>filter: brightness(0) invert(1)</code> applied to the dark file</div>
            <div><strong>Colour:</strong> <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13 }}>/images/logo-v1-colour-clean.png</code></div>
            <div style={{ marginTop: 12, opacity: 0.65 }}>
              For the H-mark lifecycle and lettering rationale, see <Link href="/logo-story" style={{ color: colors.shed, textDecoration: "underline" }}>/logo-story</Link>.
            </div>
          </div>
        </div>
      </section>

      {/* ─── STANCE ─── */}
      <section id="stance" style={{
        backgroundColor: colors.shed,
        color: colors.milk,
        padding: isMobile ? "60px 24px" : "80px 40px",
      }}>
        <h2 style={{ ...sectionHeadingStyle, color: colors.milk }}>STANCE</h2>
        <p style={{ ...sectionDescStyle, color: colors.milk, opacity: 0.6 }}>
          The mark sits above. The stance sits underneath. What we want a person to think, feel and do when they meet The Harvest.
        </p>

        {/* THINK / FEEL / DO */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 16,
          maxWidth: 1100,
          margin: "48px auto 0",
        }}>
          {[
            {
              word: "THINK",
              color: colors.canopy,
              sub: "The mental model we want them to form.",
              points: [
                "This is a place, not a brand. Soil, sheds, weather, a history older than us. On Jinibara Country, in Witta in the Sunshine Coast Hinterland.",
                "It's being made slowly, in public, by the people who live here. Not by a developer. Not by a chain.",
                "You're not a customer. You're a neighbour, a maker, or someone curious. Any of those is enough.",
                "Garden opening first. Grow. Make. Gather. The longer operating model comes after people understand that.",
              ],
            },
            {
              word: "FEEL",
              color: colors.goldenHour,
              sub: "The emotional posture they leave with.",
              points: [
                "Welcomed, not sold to.",
                "Calm. The site does not urge.",
                "Curious. There's more here than one visit shows.",
                "Capable. Like they could turn up and be useful.",
                "Trusting. Things and people are named. Nothing hides behind marketing.",
              ],
            },
            {
              word: "DO",
              color: colors.crane,
              sub: "The behaviour we're inviting.",
              points: [
                "Learn about The Harvest.",
                "Come through when the garden opens at the end of June.",
                "Bring a question, a story, or a pair of hands.",
                "Follow the next note if they're not ready to turn up.",
                "Stay around long enough to help shape what it becomes.",
              ],
            },
          ].map((col) => (
            <div key={col.word} style={{
              border: `1px solid rgba(245,240,232,0.14)`,
              borderTop: `4px solid ${col.color}`,
              padding: 28,
              backgroundColor: "rgba(245,240,232,0.04)",
            }}>
              <span style={{
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: 18,
                letterSpacing: "0.18em",
                color: col.color,
              }}>
                {col.word}
              </span>
              <p style={{
                fontFamily: fonts.body,
                fontSize: 13,
                fontStyle: "italic",
                opacity: 0.55,
                color: colors.milk,
                margin: "10px 0 20px",
                lineHeight: 1.5,
              }}>
                {col.sub}
              </p>
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: 0,
              }}>
                {col.points.map((point, i) => (
                  <li key={i} style={{
                    fontFamily: fonts.body,
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: colors.milk,
                    opacity: 0.82,
                    paddingTop: 14,
                    paddingBottom: 14,
                    borderTop: i === 0 ? "none" : `1px solid rgba(245,240,232,0.08)`,
                  }}>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* What this is not */}
        <div style={{
          maxWidth: 1100,
          margin: "48px auto 0",
          padding: isMobile ? "32px 24px" : "40px 48px",
          border: `2px solid ${colors.goldenHour}`,
        }}>
          <span style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: 14,
            letterSpacing: "0.18em",
            color: colors.goldenHour,
          }}>
            AND THIS IS NOT
          </span>
          <p style={{
            fontFamily: fonts.body,
            fontSize: 15,
            lineHeight: 1.6,
            opacity: 0.7,
            color: colors.milk,
            margin: "12px 0 24px",
            maxWidth: 700,
          }}>
            Just as important as what we are. If the work starts drifting into any of these, pull it back.
          </p>
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: 14,
          }}>
            {[
                "Not a commercial entity looking to profit off community.",
                "Not flashy. Not claiming to be perfect.",
                "Not promising polished days and nights.",
                "Not pretending a formal cooperative exists before the governance is real.",
            ].map((line, i) => (
              <li key={i} style={{
                fontFamily: fonts.body,
                fontSize: 14,
                lineHeight: 1.55,
                padding: "14px 18px",
                border: `1px solid rgba(245,240,232,0.16)`,
                color: colors.milk,
              }}>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── THE THREES ─── */}
      <section id="threes" style={{ padding: isMobile ? "60px 24px" : "80px 40px" }}>
        <h2 style={sectionHeadingStyle}>GROW. MAKE. GATHER.</h2>
        <p style={sectionDescStyle}>
          This is the current public rhythm. It is not a department structure. It is the simplest way to understand what the place asks people to do.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          gap: 32,
          maxWidth: 900,
          margin: "40px auto 0",
        }}>
          {threes.map((set) => (
            <div key={set.label} style={{
              border: `1px solid rgba(26,26,26,0.1)`,
              padding: 28,
            }}>
              <span style={{ ...smallLabelStyle, color: colors.shed, opacity: 0.4 }}>
                {set.type.toUpperCase()}
              </span>
              <h3 style={{
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: 20,
                letterSpacing: "0.04em",
                margin: "8px 0 20px",
              }}>
                {set.label}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {set.items.map((item) => (
                  <div key={item.word} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      backgroundColor: item.color,
                      flexShrink: 0,
                    }} />
                    <div>
                      <strong style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 14 }}>
                        {item.word}
                      </strong>
                      <span style={{ fontFamily: fonts.body, fontSize: 14, opacity: 0.6, marginLeft: 8 }}>
                        {item.desc}
                      </span>
                      <span style={{ fontFamily: fonts.display, fontSize: 11, opacity: 0.35, marginLeft: 8, letterSpacing: "0.05em" }}>
                        {item.colorName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Alignment map */}
        <div style={{
          maxWidth: 700,
          margin: "48px auto 0",
          border: `1px solid rgba(26,26,26,0.1)`,
          padding: 28,
        }}>
          <span style={{ ...smallLabelStyle, color: colors.shed, opacity: 0.4 }}>
            HOW IT WORKS
          </span>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 16,
            fontFamily: fonts.body,
            fontSize: 14,
          }}>
            <thead>
              <tr>
                {["Verb", "Public meaning", "Colour"].map((h) => (
                  <th key={h} style={{
                    textAlign: "left",
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    padding: "8px 12px 8px 0",
                    borderBottom: `1px solid rgba(26,26,26,0.1)`,
                    opacity: 0.5,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { verb: "Grow", room: "Garden opening, seedlings, soil, work days, old nursery memory.", color: colors.canopy, colorName: "Canopy" },
                { verb: "Make", room: "Creative work, timber, repair, signs, art, workshops, visible making.", color: colors.crane, colorName: "Crane" },
                { verb: "Gather", room: "Neighbours, tables, food, music, stories, questions, community days.", color: colors.goldenHour, colorName: "Golden Hour" },
              ].map((row) => (
                <tr key={row.verb}>
                  <td style={tableCellStyle}>{row.verb}</td>
                  <td style={tableCellStyle}>{row.room}</td>
                  <td style={tableCellStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 16,
                        height: 16,
                        backgroundColor: row.color,
                        display: "inline-block",
                        flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 12, opacity: 0.6 }}>{row.colorName}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{
            fontFamily: fonts.body,
            fontSize: 13,
            lineHeight: 1.6,
            opacity: 0.55,
            marginTop: 20,
            marginBottom: 0,
          }}>
            Do not replace this with internal room language in public copy. Food, tables, and kitchen ideas sit inside Gather until the public model needs more detail.
          </p>
        </div>
      </section>

      {/* ─── WHAT IT MEANS ─── */}
      <section id="rooms" style={{
        backgroundColor: colors.shed,
        color: colors.milk,
        padding: isMobile ? "60px 24px" : "80px 40px",
      }}>
        <h2 style={{ ...sectionHeadingStyle, color: colors.milk }}>WHAT IT MEANS</h2>
        <p style={{ ...sectionDescStyle, color: colors.milk, opacity: 0.6 }}>
          The words need jobs. This is how Grow, Make, and Gather stay useful without turning into a complicated brand diagram.
        </p>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
          maxWidth: 900,
          margin: "40px auto 0",
        }}>
          {rooms.map((room) => (
            <div key={room.name} style={{
              borderTop: `3px solid ${room.color}`,
              padding: isMobile ? "36px 0" : "40px 0",
            }}>
              <div style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 24 : 48,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{
                      width: 10,
                      height: 10,
                      backgroundColor: room.color,
                    }} />
                    <span style={{
                      fontFamily: fonts.display,
                      fontWeight: 700,
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      opacity: 0.5,
                    }}>
                      {room.verb.toUpperCase()}
                    </span>
                  </div>
                  <h3 style={{
                    fontFamily: fonts.display,
                    fontWeight: 900,
                    fontSize: isMobile ? 24 : 28,
                    letterSpacing: "0.06em",
                    margin: "0 0 16px",
                  }}>
                    {room.name.toUpperCase()}
                  </h3>
                  <p style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 1.8, opacity: 0.8, margin: "0 0 12px" }}>
                    <strong>What:</strong> {room.what}
                  </p>
                  <p style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 1.8, opacity: 0.8, margin: "0 0 12px" }}>
                    <strong>Who:</strong> {room.who}
                  </p>
                  <p style={{
                    fontFamily: fonts.body,
                    fontSize: 15,
                    lineHeight: 1.8,
                    fontStyle: "italic",
                    opacity: 0.6,
                    margin: 0,
                  }}>
                    "{room.spirit}"
                  </p>
                </div>
                <div style={{
                  flex: isMobile ? "auto" : "0 0 280px",
                  backgroundColor: "rgba(245,240,232,0.05)",
                  padding: 20,
                }}>
                  <span style={{
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    opacity: 0.4,
                    display: "block",
                    marginBottom: 12,
                  }}>
                    OPEN QUESTIONS
                  </span>
                  {room.questions.map((q, i) => (
                    <p key={i} style={{
                      fontFamily: fonts.body,
                      fontSize: 13,
                      lineHeight: 1.7,
                      opacity: 0.5,
                      margin: i === 0 ? 0 : "8px 0 0",
                    }}>
                      {q}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/zone-workshop" style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.1em",
            color: colors.shed,
            backgroundColor: colors.goldenHour,
            padding: "14px 32px",
            textDecoration: "none",
            display: "inline-block",
          }}>
            OPEN ZONE WORKSHOP &rarr;
          </Link>
          <p style={{
            fontFamily: fonts.body,
            fontSize: 12,
            opacity: 0.4,
            margin: "10px 0 0",
            color: colors.milk,
          }}>
            Sketch, plan, and collect ideas for each zone
          </p>
        </div>
      </section>

      {/* ─── PRINCIPLES ─── */}
      <section id="principles" style={{ padding: isMobile ? "60px 24px" : "80px 40px" }}>
        <h2 style={sectionHeadingStyle}>PRINCIPLES</h2>
        <p style={sectionDescStyle}>
          Three operating principles. These don't map to rooms. They apply to everything.
        </p>

        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 32,
          maxWidth: 900,
          margin: "40px auto 0",
        }}>
          {principles.map((p) => (
            <div key={p.bold} style={{
              flex: 1,
              border: `1px solid rgba(26,26,26,0.1)`,
              padding: 28,
              textAlign: "center",
            }}>
              <h3 style={{
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: 18,
                margin: "0 0 12px",
              }}>
                {p.bold}
              </h3>
              <p style={{
                fontFamily: fonts.body,
                fontSize: 15,
                lineHeight: 1.7,
                opacity: 0.6,
                margin: 0,
              }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WRITING STYLE ─── */}
      <section id="writing" style={{
        backgroundColor: colors.shed,
        color: colors.milk,
        padding: isMobile ? "60px 24px" : "80px 40px",
      }}>
        <h2 style={{ ...sectionHeadingStyle, color: colors.milk }}>WRITING STYLE</h2>
        <p style={{ ...sectionDescStyle, color: colors.milk, opacity: 0.6 }}>
          Barry's story as published on the Empathy Ledger. This is the voice and tone we're aiming for. Matter-of-fact, grounded, no flourish.
        </p>

        <div style={{
          maxWidth: 700,
          margin: "48px auto 0",
        }}>
          <Collapsible title="Barry's Article" defaultOpen={false}>
            <div style={{
              borderLeft: `3px solid ${colors.crane}`,
              paddingLeft: 24,
              marginBottom: 32,
            }}>
              <span style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: "0.2em",
                opacity: 0.4,
                display: "block",
                marginBottom: 8,
              }}>
                REFERENCE ARTICLE
              </span>
              <h3 style={{
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: isMobile ? 24 : 32,
                letterSpacing: "0.04em",
                margin: "0 0 8px",
              }}>
                The Last of the Timber Men
              </h3>
              <p style={{
                fontFamily: fonts.body,
                fontSize: 13,
                opacity: 0.4,
                margin: 0,
              }}>
                Barry Rodgerig / Witta, QLD / 12 February 2026 / 8 min read
              </p>
              <a
                href="https://empathy-ledger-v2.vercel.app/stories/8a777af3-558f-4ccc-864a-fc9b6b52e031"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: colors.goldenHour,
                  opacity: 0.7,
                  textDecoration: "none",
                  display: "inline-block",
                  marginTop: 12,
                }}
              >
                VIEW ON EMPATHY LEDGER &rarr;
              </a>
            </div>

            <div style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 15 : 16,
              lineHeight: 2,
              opacity: 0.8,
            }}>
              <p style={{ margin: "0 0 20px" }}>
                Barry Rodgerig's mother lived to ninety-one in perfect health, yet decided she'd had enough and refused medication. His matter-of-fact recounting of her death, "I don't want to live anymore. That was the bloody end of it", reflects an unsentimental acceptance of her autonomous choice.
              </p>
              <p style={{ margin: "0 0 20px" }}>
                At eighty himself, Barry has lived on his Queensland property since 1972, when it was bare land. He repeatedly notes this transformation: "There was nothing here. We built all that since '72." The sprawling site now contains sheds, machinery, and rusted equipment scattered across red soil that corrodes metal like disease consumes flesh.
              </p>
              <p style={{ margin: "0 0 20px" }}>
                Barry operated heavy machinery in the logging industry before environmental activists, described as hippies from nearby Crystal Waters, sabotaged his equipment by contaminating fuel, poisoning motors, and booby-trapping machinery. These acts cost him dearly, as no insurance covered sabotage. The activists later harvested trees they'd protected for their bakery, adding insult to injury.
              </p>
              <p style={{ margin: "0 0 20px" }}>
                His first job involved feeding pigs at Peachester, where his family spent twenty-five years. Barry's intimate knowledge of swine behavior, their ability to find escape routes repeatedly, informs his lifelong aversion to pork. He can distinguish meat origins by smell alone: "They're just buggers... They know where the hole is."
              </p>
              <p style={{ margin: "0 0 20px" }}>
                Three Blue Heelers and fourteen parrots share his home, consuming more food than Barry himself. He maintains a cycle of naming, "Samantha Series 3," multiple Diesels, suggesting reincarnation despite animals never being identical. This reflects his philosophy about continuity and change.
              </p>
              <p style={{ margin: "0 0 20px" }}>
                Regulations now prevent Barry from driving heavy trucks on public roads, though he could on his property. He's transitioned from working himself to exhaustion to making "just a living" without killing himself over it anymore. The quarry became his sanctuary, operating a dozer, stacking gravel, finding peace in rhythmic work during rainfall.
              </p>
              <p style={{ margin: 0 }}>
                His property functions as a working museum featuring 1940s military trucks, a 1957 Land Rover awaiting restoration, and vintage tractors. He inhabits this accumulation without sentimentality, simply living among the machinery that has marked his eighty years.
              </p>
            </div>
          </Collapsible>

          {/* Style notes */}
          <Collapsible title="Voice Notes" defaultOpen={true}>
            <div style={{
              padding: 24,
              backgroundColor: "rgba(245,240,232,0.05)",
            }}>
              <ul style={{
                fontFamily: fonts.body,
                fontSize: 14,
                lineHeight: 1.8,
                opacity: 0.6,
                margin: 0,
                paddingLeft: 20,
              }}>
                <li>Matter-of-fact. No sentimentality. Let the subject speak.</li>
                <li>Direct quotes carry the weight. The writer observes, doesn't interpret.</li>
                <li>Specific details over abstract description (red soil, 1957 Land Rover, Samantha Series 3).</li>
                <li>Short paragraphs. Each one earns its space.</li>
                <li>Place and time anchored. "Since 1972", "Peachester", "Crystal Waters".</li>
                <li>Respects complexity. Barry's relationship with environmentalists isn't simplified.</li>
              </ul>
            </div>
          </Collapsible>
        </div>
      </section>

      {/* ─── IMAGE GALLERY ─── */}
      <section id="gallery" style={{ padding: isMobile ? "60px 24px" : "80px 40px" }}>
        <h2 style={sectionHeadingStyle}>VISUAL LIBRARY</h2>
        <p style={sectionDescStyle}>
          Empathy Ledger first, local source folders second. Core launch and brand photos are ranked at the top.
        </p>

        <div style={{ maxWidth: 1100, margin: "40px auto 0" }}>
          <EmpathyLedgerBrandMedia
            isMobile={isMobile}
            onImageClick={(src, label) => setLightbox({ src, label })}
          />

          {imageGallery.map((group) => (
            <div key={group.category} style={{ marginBottom: 48 }}>
              <Collapsible title={group.category} defaultOpen={false}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "repeat(2, 1fr)"
                    : `repeat(auto-fill, minmax(180px, 1fr))`,
                  gap: isMobile ? 8 : 12,
                }}>
                  {group.images.map((img) => (
                    <button
                      key={img.src}
                      onClick={() => setLightbox(img)}
                      style={{
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        backgroundColor: "rgba(26,26,26,0.04)",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={img.src}
                        alt={img.label}
                        loading="lazy"
                        style={{
                          width: "100%",
                          aspectRatio: "4/3",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <span style={{
                        fontFamily: fonts.body,
                        fontSize: 11,
                        padding: "6px 8px",
                        opacity: 0.5,
                        textAlign: "left",
                        display: "block",
                      }}>
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </Collapsible>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.92)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <div style={{
            position: "absolute",
            top: 16,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
            zIndex: 1,
          }}>
            <span style={{
              fontFamily: fonts.body,
              fontSize: 13,
              color: colors.milk,
              opacity: 0.6,
            }}>
              {lightbox.label}
            </span>
            <span style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.1em",
              color: colors.milk,
              opacity: 0.5,
            }}>
              ESC / CLICK TO CLOSE
            </span>
          </div>
          <img
            src={lightbox.src}
            alt={lightbox.label}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "92vw",
              maxHeight: "88vh",
              objectFit: "contain",
              cursor: "default",
            }}
          />
        </div>
      )}

      {/* ─── SKETCH PAD ─── */}
      <section id="sketchpad" style={{
        backgroundColor: colors.shed,
        color: colors.milk,
        padding: isMobile ? "60px 24px" : "80px 40px",
      }}>
        <h2 style={{ ...sectionHeadingStyle, color: colors.milk }}>SKETCH PAD</h2>
        <p style={{ ...sectionDescStyle, color: colors.milk, opacity: 0.6 }}>
          Concept-only sketching. AI-generated images are not Harvest brand assets and must not be used as public proof.
        </p>

        <SketchPad isMobile={isMobile} />
      </section>

      {/* ─── SOCIAL KIT ─── */}
      <section id="social" style={{
        backgroundColor: colors.shed,
        color: colors.milk,
        padding: isMobile ? "60px 24px" : "80px 40px",
      }}>
        <h2 style={{ ...sectionHeadingStyle, color: colors.milk }}>SOCIAL KIT</h2>
        <p style={{ ...sectionDescStyle, color: colors.milk, opacity: 0.6 }}>
          Everything a social media manager needs. Images, captions, posting order, and channel guidance.
        </p>

        <SocialTemplates isMobile={isMobile} onImageClick={(src, label) => setLightbox({ src, label })} />
      </section>

      {/* ─── COLOR PALETTE ─── */}
      <section id="palette" style={{ padding: isMobile ? "60px 24px" : "80px 40px" }}>
        <h2 style={sectionHeadingStyle}>PALETTE</h2>
        <p style={sectionDescStyle}>
          Every colour drawn from the place itself. Named after what you can see and touch on the property.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          gap: 24,
          maxWidth: 1000,
          margin: "40px auto 0",
        }}>
          {[
            { name: "shed", hex: colors.shed, img: "/images/compendium/barry/IMG_5687.jpg", desc: "Barry's shed interior. Dark timber shadow, corrugated iron walls, decades of oil and sawdust.", light: false },
            { name: "milk", hex: colors.milk, img: "/images/witta/history/teutoburg-cheese-making-1899.png", desc: "Raw milk, aged paper, sandstone render. The dairy heritage of Witta, 1899.", light: true },
            { name: "rammedEarth", hex: colors.rammedEarth, img: "/images/palette/rammed-earth.jpg", desc: "The rammed earth walls of The Harvest building. Local soil compressed into architecture.", light: true },
            { name: "goldenHour", hex: colors.goldenHour, img: "/images/compendium/barry/IMG_5764.jpg", desc: "Late afternoon on the ridge. Honey timber, warm light through the shed door.", light: false },
            { name: "workshirt", hex: colors.workshirt, img: "/images/compendium/barry/IMG_5758.jpg", desc: "Barry's navy work shirt. Hinterland dusk, the blue you see every afternoon.", light: false },
            { name: "calendula", hex: colors.calendula, img: "/images/palette/calendula.jpg", desc: "Calendula in the garden beds. Warm permaculture orange, companion planting.", light: false },
            { name: "canopy", hex: colors.canopy, img: "/images/compendium/barry/IMG_5613.jpg", desc: "Paddock green, ridge eucalyptus canopy. The colour behind everything.", light: false },
            { name: "hardwood", hex: colors.hardwood, img: "/images/compendium/barry/IMG_5699.jpg", desc: "Blackbutt beams, shed framing, dark bark. The structure holding it all together.", light: false },
            { name: "lillyPilly", hex: colors.lillyPilly, img: "/images/palette/lilly-pilly.jpg", desc: "Syzygium new growth. The tree at the front gate of The Harvest, burgundy flush.", light: false },
            { name: "crane", hex: colors.crane, img: "/images/compendium/barry/IMG_5613.jpg", desc: "Rusted iron on Barry's crane. Corrugated iron patina, oxidized by decades of weather.", light: false },
          ].map((c) => (
            <div key={c.name} style={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: `1px solid rgba(26,26,26,0.08)`,
            }}>
              {/* Reference photo */}
              <div style={{
                height: 180,
                backgroundImage: `url(${c.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }} />
              {/* Color swatch + info */}
              <div style={{
                backgroundColor: c.hex,
                padding: "20px 24px",
                color: c.light ? colors.shed : colors.milk,
                flex: 1,
              }}>
                <div style={{
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 13,
                  letterSpacing: "0.15em",
                  marginBottom: 8,
                }}>
                  {c.name.replace(/([A-Z])/g, " $1").trim().toUpperCase()}
                </div>
                <div style={{
                  fontFamily: fonts.body,
                  fontSize: 13,
                  lineHeight: 1.6,
                  opacity: 0.85,
                  marginBottom: 12,
                }}>
                  {c.desc}
                </div>
                <div style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  opacity: 0.5,
                }}>
                  {c.hex}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compact alias reference */}
        <div style={{
          maxWidth: 1000,
          margin: "40px auto 0",
          padding: 24,
          backgroundColor: colors.shed,
          color: colors.milk,
        }}>
          <div style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.12em",
            opacity: 0.4,
            marginBottom: 16,
          }}>
            CSS ALIASES (BACKWARD COMPATIBLE)
          </div>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}>
            {(["black", "cream", "red", "yellow", "blue", "orange", "green", "indigo", "magenta"] as const).map((alias) => (
              <div key={alias} style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <div style={{
                  width: 16,
                  height: 16,
                  backgroundColor: colors[alias],
                  border: alias === "cream" ? `1px solid rgba(245,240,232,0.3)` : "none",
                }} />
                <span style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  opacity: 0.6,
                }}>
                  {alias}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TYPOGRAPHY ─── */}
      <section id="typography" style={{
        padding: isMobile ? "60px 24px" : "80px 40px",
        borderTop: `1px solid rgba(26,26,26,0.08)`,
      }}>
        <h2 style={sectionHeadingStyle}>TYPOGRAPHY</h2>
        <div style={{
          maxWidth: 700,
          margin: "32px auto 0",
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}>
          <div>
            <span style={{ ...smallLabelStyle, color: colors.shed, opacity: 0.4 }}>
              DISPLAY / MONTSERRAT
            </span>
            <p style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? 32 : 48,
              letterSpacing: "0.08em",
              margin: "8px 0 0",
            }}>
              THE HARVEST
            </p>
            <p style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.15em",
              margin: "12px 0 0",
              opacity: 0.5,
            }}>
              LABELS, BUTTONS, SMALL CAPS
            </p>
          </div>
          <div>
            <span style={{ ...smallLabelStyle, color: colors.shed, opacity: 0.4 }}>
              BODY / INTER
            </span>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 16 : 18,
              lineHeight: 1.8,
              margin: "8px 0 0",
            }}>
              A community garden and creative gathering place taking shape in Witta.
            </p>
            <p style={{
              fontFamily: fonts.body,
              fontStyle: "italic",
              fontSize: isMobile ? 16 : 18,
              lineHeight: 1.8,
              margin: "12px 0 0",
              opacity: 0.7,
            }}>
              "Timber workers, dairy farmers, red soil. We're not starting from nothing."
            </p>
          </div>
        </div>
      </section>

      {/* ─── VOICE RULES ─── */}
      <section id="voice" style={{
        backgroundColor: colors.shed,
        color: colors.milk,
        padding: isMobile ? "60px 24px" : "80px 40px",
      }}>
        <h2 style={{ ...sectionHeadingStyle, color: colors.milk }}>VOICE RULES</h2>
        <p style={{ ...sectionDescStyle, color: colors.milk, opacity: 0.6 }}>
          Write like you're talking to a neighbor over the fence. If it sounds like a council newsletter, start again.
        </p>

        <div style={{ maxWidth: 800, margin: "40px auto 0" }}>
          {/* The Rule */}
          <div style={{
            border: `2px solid ${colors.goldenHour}`,
            padding: isMobile ? "24px 20px" : "32px 40px",
            marginBottom: 40,
            textAlign: "center",
          }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: isMobile ? 14 : 18, letterSpacing: "0.08em", color: colors.goldenHour }}>
              THE 3-SECOND RULE
            </span>
            <p style={{ fontFamily: fonts.body, fontSize: isMobile ? 15 : 17, lineHeight: 1.7, color: colors.milk, opacity: 0.7, margin: "12px 0 0" }}>
              Read it out loud. If you wouldn't say it to someone standing in the garden, rewrite it.
            </p>
          </div>

          {/* Word List */}
          <div style={{ marginBottom: 48 }}>
            <span style={{ ...smallLabelStyle, marginBottom: 16 }}>WORD LIST. SAY THIS, NOT THAT</span>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr",
              gap: 0,
              marginTop: 16,
            }}>
              <div style={{ padding: "12px 16px", backgroundColor: "rgba(58,110,71,0.15)", borderBottom: "1px solid rgba(245,240,232,0.06)" }}>
                <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 10, letterSpacing: "0.15em", color: colors.canopy, opacity: 0.8 }}>SAY THIS</span>
              </div>
              <div style={{ padding: "12px 16px", backgroundColor: "rgba(214,44,44,0.1)", borderBottom: "1px solid rgba(245,240,232,0.06)" }}>
                <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 10, letterSpacing: "0.15em", color: colors.crane, opacity: 0.8 }}>NOT THAT</span>
              </div>
              {[
                ["gather", "event"],
                ["share a table", "networking opportunity"],
                ["neighbours", "stakeholders"],
                ["grow", "develop"],
                ["make", "create content"],
                ["come along", "register now"],
                ["come through", "attend our activation"],
                ["the place", "the venue"],
                ["what's forming", "our vision"],
                ["try something", "participate"],
                ["we're figuring it out", "we're strategically positioned"],
                ["kids, dogs, everyone", "all demographics"],
                ["Saturday morning", "upcoming activation"],
                ["work day", "working bee"],
                ["a question", "an enquiry"],
                ["bring a question", "submit an enquiry"],
              ].map(([yes, no], i) => (
                <div key={i} style={{ display: "contents" }}>
                  <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(245,240,232,0.06)", fontFamily: fonts.body, fontSize: 14, color: colors.milk }}>
                    {yes}
                  </div>
                  <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(245,240,232,0.06)", fontFamily: fonts.body, fontSize: 14, color: colors.milk, opacity: 0.35, textDecoration: "line-through" }}>
                    {no}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Examples */}
          <div>
            <span style={{ ...smallLabelStyle, marginBottom: 16 }}>BY CHANNEL. SAME MESSAGE, DIFFERENT FORMAT</span>
            {[
              {
                channel: "SOCIAL CAPTION",
                color: colors.workshirt,
                good: "Witta · Jinibara Country · Garden opening end of June\n\nThe Harvest\nGrow. Make. Gather.\n\nA community garden and creative gathering place taking shape in Witta.",
                bad: "Join us for our inaugural community gathering event! We're excited to announce The Harvest's first open day featuring local food, live music and more. RSVP via the link in our bio. #community #sundayvibes",
              },
              {
                channel: "NEWSLETTER SUBJECT",
                color: colors.goldenHour,
                good: "The Harvest garden opens end of June",
                bad: "The Harvest Community Hub. March Newsletter & Upcoming Events",
              },
              {
                channel: "EVENT SIGNAGE",
                color: colors.calendula,
                good: "THE HARVEST\nGrow. Make. Gather.\nGarden opening end of June.",
                bad: "Welcome to The Harvest Community Hub First Gathering Event. Food Service Area Located Ahead",
              },
              {
                channel: "INSTAGRAM STORY",
                color: colors.crane,
                good: "The Milk Man is doing his job.\nNot selling milk. Starting conversations.",
                bad: "Meet our amazing community partner @shaunfisher who will be providing fresh locally-sourced oysters at our upcoming event! 🦪✨ Don't miss out!",
              },
            ].map((ex) => (
              <div key={ex.channel} style={{ marginTop: 32 }}>
                <span style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: ex.color,
                  display: "block",
                  marginBottom: 12,
                }}>
                  {ex.channel}
                </span>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: isMobile ? 8 : 16,
                }}>
                  <div style={{
                    padding: "16px 20px",
                    border: `1px solid rgba(58,110,71,0.3)`,
                    borderRadius: 2,
                  }}>
                    <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 9, letterSpacing: "0.15em", color: colors.canopy, display: "block", marginBottom: 8 }}>ON-BRAND</span>
                    <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.7, color: colors.milk, margin: 0, whiteSpace: "pre-line" }}>{ex.good}</p>
                  </div>
                  <div style={{
                    padding: "16px 20px",
                    border: `1px solid rgba(214,44,44,0.2)`,
                    borderRadius: 2,
                    opacity: 0.5,
                  }}>
                    <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 9, letterSpacing: "0.15em", color: colors.crane, display: "block", marginBottom: 8 }}>OFF-BRAND</span>
                    <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.7, color: colors.milk, margin: 0, whiteSpace: "pre-line" }}>{ex.bad}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Never List */}
          <div style={{
            marginTop: 48,
            padding: "24px 28px",
            backgroundColor: "rgba(214,44,44,0.06)",
            border: "1px solid rgba(214,44,44,0.15)",
          }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", color: colors.crane }}>
              NEVER USE THESE WORDS
            </span>
            <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 2, color: colors.milk, opacity: 0.5, margin: "12px 0 0" }}>
              synergy · leverage · stakeholder · activation · holistic · scalable · innovative · curated · bespoke · journey · ecosystem · empower · uplift · vibrant · tapestry · testament · underscore · pivotal · crucial · world-class · cutting-edge · best practice · thought leader · paradigm · reimagine
            </p>
            <p style={{ fontFamily: fonts.body, fontSize: 12, lineHeight: 1.6, color: colors.milk, opacity: 0.4, margin: "12px 0 0", fontStyle: "italic" }}>
              The bottom row of that list is the AI-tells set. If you find them in a draft, it was written by a machine, not by you.
            </p>
          </div>

          {/* Punctuation rule */}
          <div style={{
            marginTop: 32,
            padding: "24px 28px",
            border: `2px solid ${colors.goldenHour}`,
          }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.16em", color: colors.goldenHour }}>
              PUNCTUATION
            </span>
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: "16px 0 0",
              display: "grid",
              gap: 10,
              fontFamily: fonts.body,
              fontSize: 14,
              lineHeight: 1.6,
              color: colors.milk,
            }}>
              <li style={{ opacity: 0.82 }}>
                <strong style={{ color: colors.goldenHour }}>No em-dashes.</strong> Ever. Use periods or semicolons. A middle dot (·) is fine for inline lists.
              </li>
              <li style={{ opacity: 0.82 }}>
                <strong style={{ color: colors.goldenHour }}>One exclamation mark per page maximum,</strong> if ever.
              </li>
              <li style={{ opacity: 0.82 }}>
                <strong style={{ color: colors.goldenHour }}>Curly quotes</strong> ‘like this’ and “like this”, not straight quotes.
              </li>
              <li style={{ opacity: 0.82 }}>
                <strong style={{ color: colors.goldenHour }}>Short sentences. Full stops.</strong> Let silence do the work.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── PHOTOGRAPHY RULES ─── */}
      <section id="photo" style={{
        padding: isMobile ? "60px 24px" : "80px 40px",
      }}>
        <h2 style={sectionHeadingStyle}>PHOTOGRAPHY</h2>
        <p style={{ ...sectionDescStyle, opacity: 0.6 }}>
          Every photo should feel like you stumbled across something real. Not staged, not filtered, not stock.
        </p>

        <div style={{ maxWidth: 900, margin: "40px auto 0" }}>
          {/* Core Rule */}
          <div style={{
            border: `2px solid ${colors.canopy}`,
            padding: isMobile ? "24px 20px" : "32px 40px",
            marginBottom: 40,
            textAlign: "center",
          }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: isMobile ? 14 : 18, letterSpacing: "0.08em", color: colors.canopy }}>
              THE PHOTO TEST
            </span>
            <p style={{ fontFamily: fonts.body, fontSize: isMobile ? 15 : 17, lineHeight: 1.7, opacity: 0.7, margin: "12px 0 0" }}>
              Could this photo have been taken by a neighbour with a good phone? If it looks like a marketing shoot, don't use it.
            </p>
          </div>

          {/* Style Rules Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 24,
            marginBottom: 48,
          }}>
            {[
              {
                title: "LIGHT",
                rule: "Natural light only. Golden hour, overcast, dappled shade through trees. Never flash, never studio.",
                color: colors.goldenHour,
              },
              {
                title: "SUBJECTS",
                rule: "People doing things. hands in soil, fire cooking, painting, building. Not posed. Not looking at camera. Action over portrait.",
                color: colors.crane,
              },
              {
                title: "LANDSCAPE",
                rule: "Hinterland greens, morning mist on ridgelines, red soil, timber grain. Wide and atmospheric or tight and textural.",
                color: colors.canopy,
              },
              {
                title: "TONE",
                rule: "Warm. Earthy. Slightly desaturated. Think morning light on timber, not Instagram sunset filter. Honest, not aspirational.",
                color: colors.calendula,
              },
              {
                title: "COMPOSITION",
                rule: "Off-center, environmental. Show the place around the person. Leave breathing room. Don't crop tight like a headshot.",
                color: colors.workshirt,
              },
              {
                title: "TEXTURE",
                rule: "Close-ups of materials matter: timber grain, soil, clay, canvas, rust, woven fabric, handwritten notes, well-used tools.",
                color: colors.lillyPilly,
              },
            ].map((r) => (
              <div key={r.title} style={{
                padding: "20px 24px",
                borderLeft: `3px solid ${r.color}`,
                backgroundColor: "rgba(26,26,26,0.03)",
              }}>
                <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", color: r.color }}>
                  {r.title}
                </span>
                <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.7, margin: "8px 0 0", opacity: 0.7 }}>
                  {r.rule}
                </p>
              </div>
            ))}
          </div>

          {/* Reference Pairs */}
          <span style={{ ...smallLabelStyle, color: colors.shed, opacity: 0.4, marginBottom: 16 }}>REFERENCE. ON-BRAND PHOTOGRAPHY</span>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 12,
            marginTop: 16,
          }}>
            {[
              { src: "/images/social/harvest-social-card.jpg", label: "Public signal · milk crate pavilion", rule: "Real object, current campaign, no fake crowd scene" },
              { src: "/images/optimized/seed-house-front-1600.webp", label: "Place proof · front building", rule: "Shows where people are going" },
              { src: "/images/optimized/hero-aerial-1400.webp", label: "Garden · real work", rule: "Process over product, hands and soil" },
              { src: "/images/optimized/barry-5745-1000.webp", label: "Making · timber and tools", rule: "Local memory, useful work, warm tone" },
              { src: "/images/membership/member-welcome-crates.jpg", label: "Materials · milk crates", rule: "Tight on real material, shows character and scale" },
              { src: "/images/compendium/canvas-drawing.jpg", label: "Plan · work in progress", rule: "Unfinished is better than polished" },
            ].map((ref) => (
              <div key={ref.src} style={{ cursor: "pointer" }} onClick={() => setLightbox({ src: ref.src, label: ref.label })}>
                <img src={ref.src} alt={ref.label} loading="lazy" style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  display: "block",
                  borderRadius: 2,
                }} />
                <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 10, letterSpacing: "0.1em", display: "block", marginTop: 8, opacity: 0.6 }}>
                  {ref.label.toUpperCase()}
                </span>
                <span style={{ fontFamily: fonts.body, fontSize: 12, display: "block", marginTop: 2, opacity: 0.4 }}>
                  {ref.rule}
                </span>
              </div>
            ))}
          </div>

          {/* Don'ts */}
          <div style={{
            marginTop: 40,
            padding: "24px 28px",
            backgroundColor: "rgba(214,44,44,0.04)",
            border: "1px solid rgba(214,44,44,0.1)",
          }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", color: colors.crane }}>
              NEVER USE
            </span>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 4,
              marginTop: 12,
            }}>
              {[
                "Stock photography of any kind",
                "Group photos where everyone faces camera and smiles",
                "Drone shots that look like real estate listings",
                "Heavy filters, HDR, or oversaturation",
                "Corporate headshots or team photos",
                "Food photography that looks styled for a magazine",
                "Anything with a watermark or getty/shutterstock feel",
                "Clip art, icons, or generic illustrations",
              ].map((dont) => (
                <div key={dont} style={{
                  fontFamily: fonts.body,
                  fontSize: 13,
                  color: colors.crane,
                  opacity: 0.6,
                  padding: "4px 0",
                }}>
                  {"\u2717"} {dont}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── DO / DON'T ─── */}
      <section id="donts" style={{
        backgroundColor: colors.shed,
        color: colors.milk,
        padding: isMobile ? "60px 24px" : "80px 40px",
      }}>
        <h2 style={{ ...sectionHeadingStyle, color: colors.milk }}>DO / DON'T</h2>
        <p style={{ ...sectionDescStyle, color: colors.milk, opacity: 0.6 }}>
          When in doubt, check here. On-brand vs off-brand at a glance.
        </p>

        <div style={{ maxWidth: 800, margin: "40px auto 0" }}>
          {[
            {
              category: "COLOUR",
              color: colors.goldenHour,
              doList: [
                "Use colour by public meaning. Canopy is Grow. Crane is Make. Golden Hour is Gather.",
                "Shed black backgrounds with milk cream text for digital.",
                "Milk cream backgrounds with shed text for print and light contexts.",
                "One accent colour per composition. Don't rainbow.",
              ],
              dontList: [
                "Mix zone colours randomly (red heading on a garden post).",
                "Use Golden Hour as decoration when the surface is not carrying gathering, table, food, warmth, or invitation.",
                "Use gradients or colour transitions.",
                "Use colour as decoration. Every colour means something.",
                "White backgrounds. Use cream (#F5F0E8), not #FFFFFF.",
              ],
            },
            {
              category: "TYPE",
              color: colors.workshirt,
              doList: [
                "Montserrat 900 for display headlines, always uppercase",
                "Montserrat 700 for labels, buttons, and small caps",
                "Inter for body text, quotes, and descriptions",
                "Generous letter-spacing on display text (0.08em+)",
              ],
              dontList: [
                "Use more than 2 fonts in any composition",
                "Set body text in Montserrat (it's for display only)",
                "Use thin or light weights. minimum 400 for body, 700 for display",
                "Center-align body paragraphs (left-align or justify)",
              ],
            },
            {
              category: "PHOTOGRAPHY",
              color: colors.canopy,
              doList: [
                "Natural light, warm tones, real people doing real things.",
                "Show the place. Hinterland, timber, soil, garden.",
                "Texture close-ups. Hands, materials, food, tools.",
                "Unposed, mid-action, environmental portraits.",
              ],
              dontList: [
                "Stock photography, ever.",
                "Staged group photos or corporate headshots.",
                "Heavy editing, filters, or HDR processing.",
                "Drone shots that look like real estate marketing.",
              ],
            },
            {
              category: "ILLUSTRATION",
              color: colors.rammedEarth,
              doList: [
                "Graphite pencil on warm cream toned paper. Soft shading, hatching, atmospheric perspective.",
                "Faithful to the real place. Real proportions. Real architectural detail.",
                "Use concept sketches for internal thinking only unless they are based on real source material and clearly approved.",
                "One support visual per composition. Do not decorate around it.",
              ],
              dontList: [
                "Ink line drawings. Not the Harvest style.",
                "Flat vector cartoons, icon sets, or sticker sheets.",
                "Watercolour, gouache, or any painterly fills.",
                "Adding colour or filters to graphite illustrations after the fact.",
              ],
            },
            {
              category: "COPY",
              color: colors.calendula,
              doList: [
                "Short sentences. Full stops. Let silence do the work.",
                "Name real things. Witta, garden opening, Milk Man, crates, Barry, Jinibara Country.",
                "Use 'we' and 'you'. first/second person",
                "Read it aloud. If you wouldn't say it, rewrite it.",
              ],
              dontList: [
                "Marketing jargon (activation, leverage, synergy, stakeholder)",
                "Long paragraphs. if it's more than 3 sentences, break it up",
                "Exclamation marks (one per page maximum, if ever)",
                "Hashtag stuffing. max 3 per post, and only if relevant",
              ],
            },
            {
              category: "LAYOUT",
              color: colors.crane,
              doList: [
                "Lots of whitespace. let things breathe",
                "Strong grid with one focal point per composition",
                "Left-aligned text with generous leading (1.7+)",
                "Bauhaus-inspired: bold geometry, clean blocks of color",
              ],
              dontList: [
                "Busy layouts with competing elements",
                "Rounded corners or soft drop shadows",
                "Decorative borders or frames (except heritage sketch elements)",
                "Centered layouts for anything longer than a headline",
              ],
            },
            {
              category: "TONE",
              color: colors.lillyPilly,
              doList: [
                "Warm, direct, honest. like a conversation",
                "Acknowledge uncertainty: \"we're figuring it out together\"",
                "Specific over vague: \"Saturday in the garden\" not \"upcoming event\"",
                "Let the place speak. heritage, soil, timber, community",
              ],
              dontList: [
                "Corporate polish or PR-speak",
                "Overselling or hype (\"amazing\", \"incredible\", \"world-class\")",
                "Vague aspiration (\"building a better tomorrow\")",
                "Speaking about community in third person (\"the community will benefit\")",
              ],
            },
          ].map((section) => (
            <div key={section.category} style={{ marginBottom: 40 }}>
              <span style={{
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: 14,
                letterSpacing: "0.12em",
                color: section.color,
                display: "block",
                marginBottom: 16,
              }}>
                {section.category}
              </span>
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? 8 : 16,
              }}>
                <div style={{
                  padding: "20px 24px",
                  border: "1px solid rgba(58,110,71,0.25)",
                  borderRadius: 2,
                }}>
                  <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 10, letterSpacing: "0.15em", color: colors.canopy, display: "block", marginBottom: 12 }}>DO</span>
                  {section.doList.map((item, i) => (
                    <p key={i} style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.6, color: colors.milk, opacity: 0.7, margin: i === 0 ? 0 : "8px 0 0" }}>
                      {"\u2713"} {item}
                    </p>
                  ))}
                </div>
                <div style={{
                  padding: "20px 24px",
                  border: "1px solid rgba(214,44,44,0.15)",
                  borderRadius: 2,
                  opacity: 0.6,
                }}>
                  <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 10, letterSpacing: "0.15em", color: colors.crane, display: "block", marginBottom: 12 }}>DON'T</span>
                  {section.dontList.map((item, i) => (
                    <p key={i} style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.6, color: colors.milk, margin: i === 0 ? 0 : "8px 0 0" }}>
                      {"\u2717"} {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Decision Tree */}
          <div style={{
            marginTop: 24,
            border: `2px solid ${colors.goldenHour}`,
            padding: isMobile ? "24px 20px" : "32px 40px",
            textAlign: "center",
          }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: isMobile ? 14 : 18, letterSpacing: "0.08em", color: colors.goldenHour }}>
              WHEN IN DOUBT
            </span>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 20,
              textAlign: "left",
              maxWidth: 500,
              margin: "20px auto 0",
            }}>
              {[
                "Is it something Barry would say? → Use it.",
                "Would you print it on a timber sign? → It's the right length.",
                "Could a neighbour have taken this photo? → It's on-brand.",
                "Does it need more than one sentence to explain? → Simplify.",
                "Are you using a word from the 'never' list? → Rewrite.",
                "Does it help someone understand Grow, Make, or Gather? → If not, simplify.",
                "Still not sure? → Ask: does this feel like Witta, or like a brochure?",
              ].map((rule, i) => (
                <p key={i} style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.7, color: colors.milk, opacity: 0.7, margin: 0 }}>
                  {rule}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────
   SKETCH PAD COMPONENT
   ───────────────────────────────────── */

function SketchPad({ isMobile }: { isMobile: boolean }) {
  const [prompt, setPrompt] = useState("");
  const [preset, setPreset] = useState("story-illustration");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<{ prompt: string; image: string }[]>([]);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), preset, save: true }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setImages((prev) => [{ prompt: prompt.trim(), image: data.image }, ...prev]);
      setPrompt("");
    } catch {
      setError("Failed to generate. Check that GOOGLE_AI_API_KEY is set.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to see... e.g. 'A Bauhaus-style logo mark for a community kitchen, bold geometric, warm red and cream'"
          rows={3}
          style={{
            fontFamily: fonts.body,
            fontSize: 15,
            color: colors.milk,
            backgroundColor: "rgba(245,240,232,0.05)",
            border: "1px solid rgba(245,240,232,0.15)",
            borderRadius: 0,
            padding: "14px 16px",
            width: "100%",
            boxSizing: "border-box" as const,
            outline: "none",
            resize: "vertical" as const,
          }}
        />
        <div style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            style={{
              fontFamily: fonts.body,
              fontSize: 13,
              color: colors.milk,
              backgroundColor: "rgba(245,240,232,0.08)",
              border: "1px solid rgba(245,240,232,0.15)",
              borderRadius: 0,
              padding: "10px 12px",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="story-illustration">Illustration (4:3)</option>
            <option value="social-card">Social Card (16:9)</option>
            <option value="project-banner">Banner (21:9)</option>
            <option value="pattern">Pattern (1:1)</option>
            <option value="texture">Texture (1:1)</option>
          </select>
          <button
            onClick={generate}
            disabled={loading || !prompt.trim()}
            style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.1em",
              color: colors.shed,
              backgroundColor: loading ? "rgba(242,201,0,0.5)" : colors.goldenHour,
              border: "none",
              padding: "10px 28px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "GENERATING..." : "GENERATE"}
          </button>
        </div>
      </div>

      {error && (
        <p style={{ fontFamily: fonts.body, fontSize: 14, color: colors.crane, marginTop: 16 }}>
          {error}
        </p>
      )}

      {/* Generated images */}
      {images.length > 0 && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
          marginTop: 40,
        }}>
          {images.map((item, i) => (
            <div key={i}>
              <p style={{
                fontFamily: fonts.body,
                fontSize: 13,
                opacity: 0.4,
                margin: "0 0 8px",
                fontStyle: "italic",
              }}>
                "{item.prompt}"
              </p>
              <img
                src={item.image}
                alt={item.prompt}
                style={{
                  width: "100%",
                  maxWidth: 600,
                  display: "block",
                  border: "1px solid rgba(245,240,232,0.1)",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────
   SOCIAL TEMPLATES
   ───────────────────────────────────── */

function SocialTemplates({ isMobile, onImageClick }: {
  isMobile: boolean;
  onImageClick: (src: string, label: string) => void;
}) {
  const [activeTab, setActiveTab] = useState("current");

  const tabs = [
    { id: "current", label: "Current Picks", color: colors.goldenHour },
    { id: "zones", label: "Zone Tiles", color: colors.goldenHour },
    { id: "principles", label: "Principles", color: colors.workshirt },
    { id: "stories", label: "Story Cards", color: colors.canopy },
    { id: "cta", label: "Invites", color: colors.lillyPilly },
    { id: "heritage", label: "Heritage", color: colors.calendula },
    { id: "video", label: "Video", color: colors.crane },
  ];

  const currentAssets = [
    { src: "/images/social/harvest-social-card.jpg", label: "Current share image", use: "Default website, Facebook event, and broad local share image.", caption: "The Harvest opens its gate this Saturday.\n\nA community garden and creative gathering place is taking shape in Witta, on Jinibara Country.\n\nCome see the garden, the milk crate pavilion, the old nursery, and the first shape of the place.\n\nRSVP so we can count people and food:\ntheharvestwitta.com.au/june-20#rsvp" },
    { src: "/images/membership/member-welcome-crates.jpg", label: "Milk crate pavilion", use: "Best object-led post. Use when the story needs a clear visual hook.", caption: "The milk crates are not decoration.\n\nThey are becoming the first pavilion: stacked, carried, borrowed, returned, and built into the shape of the place.\n\nCome see it this Saturday.\n\ntheharvestwitta.com.au/june-20#rsvp" },
    { src: "/images/optimized/seed-house-front-1600.webp", label: "Front building", use: "Plain wayfinding and place proof. Good for local groups.", caption: "The Harvest is the old nursery at 9 Gumland Drive, Witta.\n\nThe gate opens this Saturday from 1pm.\n\nCome after the market, walk the garden, and stay into the evening if you can.\n\ntheharvestwitta.com.au/june-20#rsvp" },
    { src: "/images/optimized/hero-aerial-1400.webp", label: "Garden work", use: "Garden-first proof and practical help asks.", caption: "The garden is the first thing people can understand.\n\nBeds, paths, soil, shade, kids, and the first hands on the place.\n\nCome see what is taking shape." },
    { src: "/images/optimized/barry-5745-1000.webp", label: "Timber and tools", use: "Make thread: timber, tools, repair, and local memory.", caption: "Make is not a program category.\n\nIt is the way the place comes into being: timber, tools, signs, objects, repairs, and useful work done in public." },
  ];

  // Public identity tiles. rendered as HTML compositions
  const zoneTiles = [
    { verb: "GROW", zone: "Garden opening", tagline: "Beds. Paths. Seedlings. Hands in the soil.", color: colors.canopy, img: "/images/optimized/hero-aerial-1400.webp" },
    { verb: "MAKE", zone: "Creative build", tagline: "Timber. Tools. Signs. Art. Hands on the work.", color: colors.crane, img: "/images/optimized/barry-5745-1000.webp" },
    { verb: "GATHER", zone: "Community place", tagline: "Neighbours. Food. Questions. People at the gate.", color: colors.goldenHour, img: "/images/social/harvest-social-card.jpg" },
  ];

  const principleTiles = [
    { principle: "Nothing is permanent.", sub: "Like a gallery. The space is always becoming.", color: colors.crane, img: "/images/compendium/canvas-drawing.jpg" },
    { principle: "Community-built.", sub: "We don't build for people. We build with them.", color: colors.workshirt, img: "/images/membership/member-welcome-crates.jpg" },
    { principle: "Custodianship.", sub: "We build to hand over.", color: colors.canopy, img: "/images/optimized/barry-5764-1000.webp" },
  ];

  const storyCards = [
    { quote: "A place being made in public.", attribution: "The Harvest", img: "/images/optimized/seed-house-front-1600.webp", color: colors.calendula },
    { quote: "The garden is the first thing people understand.", attribution: "The Harvest", img: "/images/optimized/hero-aerial-1400.webp", color: colors.goldenHour },
    { quote: "The old timber is not decoration.", attribution: "The Harvest", img: "/images/optimized/barry-5745-1000.webp", color: colors.canopy },
    { quote: "The first opening is proof, not polish.", attribution: "The Harvest", img: "/images/social/harvest-social-card.jpg", color: colors.crane },
  ];

  const ctaTiles = [
    { cta: "COME GROW\nWITH US", sub: "Hands in the soil. Beds, paths, seedlings.", color: colors.canopy, img: "/images/optimized/hero-aerial-1400.webp" },
    { cta: "COME MAKE\nWITH US", sub: "Build days, art days, signs, timber, objects.", color: colors.crane, img: "/images/optimized/barry-5745-1000.webp" },
    { cta: "COME GATHER\nWITH US", sub: "Tables, crates, food, questions, stories.", color: colors.goldenHour, img: "/images/membership/member-welcome-crates.jpg" },
  ];

  const heritageTiles = [
    { era: "1899", now: "2026", then: "Pit sawyers", future: "Timber and tools", imgThen: "/images/witta/history/teutoburg-pit-sawyers-1899.png", imgNow: "/images/optimized/barry-5745-1000.webp", color: colors.calendula },
    { era: "1899", now: "2026", then: "Cheese making", future: "Food starts simple", imgThen: "/images/witta/history/teutoburg-cheese-making-1899.png", imgNow: "/images/optimized/seed-house-front-1600.webp", color: colors.goldenHour },
    { era: "1899", now: "2026", then: "Farm cottage", future: "Rooms being planned", imgThen: "/images/witta/history/teutoburg-nothling-cottage-1899.png", imgNow: "/images/compendium/MASTER FLOOR PLAN_5.jpeg", color: colors.crane },
    { era: "1931", now: "2026", then: "Bunya pines", future: "Garden opening", imgThen: "/images/witta/history/bunya-pines-witta-1931.png", imgNow: "/images/optimized/hero-aerial-1400.webp", color: colors.canopy },
  ];

  const videoAssets = [
    { src: "/images/compendium/hero-aerial.mp4", poster: "/images/compendium/hero-aerial.jpg", label: "Aerial flyover · site overview", use: "Cover video, reel intro, story background" },
    { src: "/images/compendium/oyster-lease.mp4", poster: "/images/compendium/oyster-lease-poster.jpg", label: "Oyster lease · food provenance", use: "Food story reel, farm-to-table content" },
  ];

  const tileStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    borderRadius: 2,
    border: "1px solid rgba(245,240,232,0.08)",
  };

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto 0" }}>
      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 0,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        borderBottom: "1px solid rgba(245,240,232,0.1)",
        marginBottom: 32,
      }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: isMobile ? 9 : 11,
              letterSpacing: "0.1em",
              color: colors.milk,
              opacity: activeTab === t.id ? 1 : 0.35,
              backgroundColor: "transparent",
              border: "none",
              borderBottom: activeTab === t.id ? `2px solid ${t.color}` : "2px solid transparent",
              padding: isMobile ? "12px 10px" : "14px 18px",
              cursor: "pointer",
              transition: "opacity 0.15s",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CURRENT SOCIAL PICKS ── */}
      {activeTab === "current" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.milk, opacity: 0.4, margin: 0 }}>
              Current real-photo picks with captions. Use these before old launch tiles, concept renders, or generated-looking scene images.
            </p>
            <Link href="/social-planner" style={{
              fontFamily: fonts.display, fontWeight: 700, fontSize: 10, letterSpacing: "0.1em",
              color: colors.shed, backgroundColor: colors.goldenHour,
              padding: "8px 16px", borderRadius: 4, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, marginLeft: 16,
            }}>
              OPEN SOCIAL PLANNER
            </Link>
          </div>
          <div style={{
            padding: "12px 16px",
            backgroundColor: "rgba(242,201,0,0.08)",
            border: `1px solid rgba(242,201,0,0.15)`,
            marginBottom: 24,
          }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", color: colors.goldenHour }}>CURRENT OPEN-DAY ORDER</span>
            <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.milk, opacity: 0.5, margin: "6px 0 0", lineHeight: 1.6 }}>
              Object → response → making → invitation. Use real Harvest media only. Do not use generated images as public proof.
            </p>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}>
            {currentAssets.map((asset) => (
              <div key={asset.src} style={{ ...tileStyle }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                }}>
                  <img
                    src={asset.src}
                    alt={asset.label}
                    style={{ width: "100%", height: "auto", display: "block", cursor: "pointer" }}
                    onClick={() => onImageClick(asset.src, asset.label)}
                  />
                  <div style={{ padding: isMobile ? "16px 16px" : "20px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{
                      fontFamily: fonts.display,
                      fontWeight: 900,
                      fontSize: 14,
                      letterSpacing: "0.08em",
                      color: colors.milk,
                      marginBottom: 4,
                    }}>
                      {asset.label}
                    </div>
                    <div style={{
                      fontFamily: fonts.display,
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      color: colors.goldenHour,
                      opacity: 0.8,
                      marginBottom: 16,
                      lineHeight: 1.5,
                    }}>
                      {asset.use}
                    </div>
                    {asset.caption ? (
                      <>
                        <div style={{
                          fontFamily: fonts.body,
                          fontSize: 13,
                          color: colors.milk,
                          opacity: 0.8,
                          lineHeight: 1.7,
                          whiteSpace: "pre-line",
                          padding: "14px 16px",
                          backgroundColor: "rgba(245,240,232,0.04)",
                          border: "1px solid rgba(245,240,232,0.08)",
                        }}>
                          {asset.caption}
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(asset.caption!)}
                          style={{
                            fontFamily: fonts.display,
                            fontWeight: 700,
                            fontSize: 10,
                            letterSpacing: "0.12em",
                            color: colors.shed,
                            backgroundColor: colors.goldenHour,
                            border: "none",
                            padding: "8px 20px",
                            cursor: "pointer",
                            marginTop: 10,
                            alignSelf: "flex-start",
                            transition: "opacity 0.15s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                          COPY CAPTION
                        </button>
                      </>
                    ) : (
                      <div style={{
                        fontFamily: fonts.body,
                        fontSize: 12,
                        color: colors.milk,
                        opacity: 0.3,
                        fontStyle: "italic",
                      }}>
                        No caption needed. use image as-is.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ZONE TILES ── */}
      {activeTab === "zones" && (
        <div>
          <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.milk, opacity: 0.4, margin: "0 0 8px" }}>
            Each public verb has a colour, a job, and a real image. Use Grow. Make. Gather. as the spine.
          </p>
          <div style={{
            padding: "12px 16px",
            backgroundColor: "rgba(242,201,0,0.08)",
            border: `1px solid rgba(242,201,0,0.15)`,
            marginBottom: 20,
          }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", color: colors.goldenHour }}>CAPTION FORMAT</span>
            <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.milk, opacity: 0.5, margin: "6px 0 0", lineHeight: 1.6 }}>
              [VERB].<br/>[Plain object or action]. [Tagline].<br/>The Harvest. Witta. Garden opening end of June.
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 16,
          }}>
            {zoneTiles.map((tile) => (
              <div key={tile.verb} style={{ ...tileStyle, aspectRatio: "1/1", cursor: "pointer" }} onClick={() => onImageClick(tile.img, `${tile.verb}. ${tile.zone}`)}>
                <img src={tile.img} alt={tile.zone} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to top, ${tile.color}DD 0%, ${tile.color}88 35%, transparent 65%)`,
                }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isMobile ? 16 : 20 }}>
                  <div style={{
                    fontFamily: fonts.display,
                    fontWeight: 900,
                    fontSize: isMobile ? 32 : 40,
                    letterSpacing: "0.08em",
                    color: colors.milk,
                    lineHeight: 1,
                    textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                  }}>
                    {tile.verb}
                  </div>
                  <div style={{
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    color: colors.milk,
                    opacity: 0.8,
                    marginTop: 6,
                  }}>
                    {tile.zone}
                  </div>
                  <div style={{
                    fontFamily: fonts.body,
                    fontSize: 12,
                    color: colors.milk,
                    opacity: 0.6,
                    marginTop: 4,
                  }}>
                    {tile.tagline}
                  </div>
                </div>
                {/* Top corner: THE HARVEST */}
                <div style={{
                  position: "absolute",
                  top: 12,
                  left: 14,
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  color: colors.milk,
                  opacity: 0.6,
                  textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                }}>
                  THE HARVEST
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PRINCIPLES ── */}
      {activeTab === "principles" && (
        <div>
          <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.milk, opacity: 0.4, margin: "0 0 8px" }}>
            Three operating principles. Use as standalone posts, or as a carousel series.
          </p>
          <div style={{
            padding: "12px 16px",
            backgroundColor: "rgba(242,201,0,0.08)",
            border: `1px solid rgba(242,201,0,0.15)`,
            marginBottom: 20,
          }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", color: colors.goldenHour }}>BEST AS A CAROUSEL</span>
            <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.milk, opacity: 0.5, margin: "6px 0 0", lineHeight: 1.6 }}>
              Post all three as one carousel. Caption: "Three rules we build by."<br/>
              Or use individually when the principle is relevant. e.g. "Nothing is permanent" alongside a gallery changeover.
            </p>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}>
            {principleTiles.map((tile) => (
              <div key={tile.principle} style={{ ...tileStyle, cursor: "pointer" }} onClick={() => onImageClick(tile.img, tile.principle)}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                }}>
                  <img src={tile.img} alt={tile.principle} style={{
                    width: "100%",
                    height: isMobile ? 200 : 260,
                    objectFit: "cover",
                    display: "block",
                  }} />
                  <div style={{
                    backgroundColor: tile.color,
                    padding: isMobile ? 24 : 36,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}>
                    <div style={{
                      fontFamily: fonts.display,
                      fontWeight: 900,
                      fontSize: 9,
                      letterSpacing: "0.2em",
                      color: colors.milk,
                      opacity: 0.6,
                      marginBottom: 12,
                    }}>
                      THE HARVEST · PRINCIPLE
                    </div>
                    <div style={{
                      fontFamily: fonts.display,
                      fontWeight: 900,
                      fontSize: isMobile ? 22 : 28,
                      letterSpacing: "0.04em",
                      color: colors.milk,
                      lineHeight: 1.2,
                    }}>
                      {tile.principle}
                    </div>
                    <div style={{
                      fontFamily: fonts.body,
                      fontSize: 14,
                      color: colors.milk,
                      opacity: 0.7,
                      marginTop: 10,
                      lineHeight: 1.6,
                    }}>
                      {tile.sub}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STORY CARDS ── */}
      {activeTab === "stories" && (
        <div>
          <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.milk, opacity: 0.4, margin: "0 0 8px" }}>
            Quote tiles for stories, reels, and carousel posts. The voice of the land and the people.
          </p>
          <div style={{
            padding: "12px 16px",
            backgroundColor: "rgba(242,201,0,0.08)",
            border: `1px solid rgba(242,201,0,0.15)`,
            marginBottom: 20,
          }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", color: colors.goldenHour }}>CAPTION FORMAT</span>
            <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.milk, opacity: 0.5, margin: "6px 0 0", lineHeight: 1.6 }}>
              Let the quote speak. Caption = one line of context, then the link.<br/>
              e.g. "Barry's lived next door for decades. → theharvestwitta.com.au/compendium"
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: 16,
          }}>
            {storyCards.map((card, i) => (
              <div key={i} style={{ ...tileStyle, aspectRatio: "16/9", cursor: "pointer" }} onClick={() => onImageClick(card.img, card.quote)}>
                <img src={card.img} alt={card.quote} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
                }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isMobile ? 16 : 24 }}>
                  <div style={{
                    width: 28,
                    height: 3,
                    backgroundColor: card.color,
                    marginBottom: 12,
                  }} />
                  <div style={{
                    fontFamily: fonts.body,
                    fontStyle: "italic",
                    fontSize: isMobile ? 16 : 19,
                    color: colors.milk,
                    lineHeight: 1.5,
                    textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                  }}>
                    "{card.quote}"
                  </div>
                  <div style={{
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    color: card.color,
                    marginTop: 8,
                  }}>
                    {card.attribution.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA / INVITE TILES ── */}
      {activeTab === "cta" && (
        <div>
          <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.milk, opacity: 0.4, margin: "0 0 8px" }}>
            Story-format tiles (9:16) for Instagram Stories and Facebook Stories. One activity per tile.
          </p>
          <div style={{
            padding: "12px 16px",
            backgroundColor: "rgba(242,201,0,0.08)",
            border: `1px solid rgba(242,201,0,0.15)`,
            marginBottom: 20,
          }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", color: colors.goldenHour }}>ALWAYS ADD</span>
            <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.milk, opacity: 0.5, margin: "6px 0 0", lineHeight: 1.6 }}>
              Garden opening end of June. Witta. Jinibara Country.<br/>
              Learn about The Harvest → theharvestwitta.com.au<br/>
              Add a link sticker pointing to the current public page.
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 16,
          }}>
            {ctaTiles.map((tile, i) => (
              <div key={i} style={{ ...tileStyle, aspectRatio: "9/16", cursor: "pointer" }} onClick={() => onImageClick(tile.img, tile.cta)}>
                <img src={tile.img} alt={tile.cta} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to top, ${tile.color}EE 0%, ${tile.color}99 30%, transparent 60%)`,
                }} />
                {/* Top badge */}
                <div style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 8,
                  letterSpacing: "0.2em",
                  color: colors.milk,
                  opacity: 0.7,
                  textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                }}>
                  THE HARVEST · WITTA
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 18 }}>
                  <div style={{
                    fontFamily: fonts.display,
                    fontWeight: 900,
                    fontSize: 22,
                    letterSpacing: "0.06em",
                    color: colors.milk,
                    lineHeight: 1.15,
                    whiteSpace: "pre-line",
                    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}>
                    {tile.cta}
                  </div>
                  <div style={{
                    fontFamily: fonts.body,
                    fontSize: 11,
                    color: colors.milk,
                    opacity: 0.7,
                    marginTop: 8,
                  }}>
                    {tile.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HERITAGE ── */}
      {activeTab === "heritage" && (
        <div>
          <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.milk, opacity: 0.4, margin: "0 0 8px" }}>
            Then & now split tiles. Witta's heritage paired with The Harvest's vision.
          </p>
          <div style={{
            padding: "12px 16px",
            backgroundColor: "rgba(242,201,0,0.08)",
            border: `1px solid rgba(242,201,0,0.15)`,
            marginBottom: 20,
          }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", color: colors.goldenHour }}>WHEN TO POST</span>
            <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.milk, opacity: 0.5, margin: "6px 0 0", lineHeight: 1.6 }}>
              These are engagement gold. Post as a carousel ("1899 → 2026") or individual posts.<br/>
              Caption: "Timber workers, dairy farmers, red soil. We're not starting from nothing."<br/>
              Best for: slow days between event pushes. Builds depth without selling.
            </p>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}>
            {heritageTiles.map((tile, i) => (
              <div key={i} style={{ ...tileStyle }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  minHeight: isMobile ? 180 : 240,
                }}>
                  {/* Then */}
                  <div style={{ position: "relative" }}>
                    <img src={tile.imgThen} alt={tile.then} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "sepia(0.4) saturate(0.7)" }} />
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                    }} />
                    <div style={{ position: "absolute", bottom: 12, left: 14 }}>
                      <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 24, color: colors.milk, opacity: 0.8, letterSpacing: "0.05em" }}>
                        {tile.era}
                      </div>
                      <div style={{ fontFamily: fonts.body, fontSize: 11, color: colors.milk, opacity: 0.6 }}>
                        {tile.then}
                      </div>
                    </div>
                  </div>
                  {/* Now */}
                  <div style={{ position: "relative" }}>
                    <img src={tile.imgNow} alt={tile.future} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(to top, ${tile.color}BB 0%, transparent 60%)`,
                    }} />
                    <div style={{ position: "absolute", bottom: 12, right: 14, textAlign: "right" }}>
                      <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 24, color: colors.milk, letterSpacing: "0.05em" }}>
                        {tile.now}
                      </div>
                      <div style={{ fontFamily: fonts.body, fontSize: 11, color: colors.milk, opacity: 0.8 }}>
                        {tile.future}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Center arrow */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: colors.milk,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 16,
                  color: colors.shed,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
                  zIndex: 2,
                }}>
                  &rarr;
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VIDEO ── */}
      {activeTab === "video" && (
        <div>
          <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.milk, opacity: 0.4, margin: "0 0 8px" }}>
            Atmospheric video clips. Use as reel backgrounds, story videos, or website headers.
          </p>
          <div style={{
            padding: "12px 16px",
            backgroundColor: "rgba(242,201,0,0.08)",
            border: `1px solid rgba(242,201,0,0.15)`,
            marginBottom: 20,
          }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", color: colors.goldenHour }}>USAGE</span>
            <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.milk, opacity: 0.5, margin: "6px 0 0", lineHeight: 1.6 }}>
              Aerial: loop as Instagram Reel with text overlay + music. No voiceover needed. let the place speak.<br/>
              Oyster lease: archive as earlier food-story material unless it is re-approved for the current campaign.
            </p>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}>
            {videoAssets.map((v, i) => (
              <div key={i} style={{ ...tileStyle }}>
                <video
                  src={v.src}
                  poster={v.poster}
                  controls
                  preload="none"
                  style={{ width: "100%", display: "block" }}
                />
                <div style={{ padding: "12px 16px" }}>
                  <div style={{
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    color: colors.milk,
                  }}>
                    {v.label}
                  </div>
                  <div style={{
                    fontFamily: fonts.body,
                    fontSize: 12,
                    color: colors.milk,
                    opacity: 0.4,
                    marginTop: 4,
                  }}>
                    {v.use}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LaunchContentPlan({ isMobile }: { isMobile: boolean }) {
  const [activeWeek, setActiveWeek] = useState(0);
  const [channel, setChannel] = useState<"facebook" | "instagram" | "newsletter">("facebook");
  const [audienceIndex, setAudienceIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const week = launchContentWeeks[activeWeek];
  const audience = launchAudienceLoops[audienceIndex];
  const channelLabel = channel === "facebook" ? "Facebook" : channel === "instagram" ? "Instagram" : "Newsletter";

  const productionPrompt = `Build The Harvest ${channelLabel} content for ${week.week}, ${week.dates}.

Current public frame:
Witta · Jinibara Country · Garden opening end of June

The Harvest
Grow. Make. Gather.
A community garden and creative gathering place taking shape in Witta.

Week theme:
${week.theme}

Content job:
${week.job}

Channel task:
${week.posts[channel]}

Audience:
${audience.audience}

Audience hook:
${audience.hook}

Proof to use:
${week.proof}
${audience.proof}

CTA:
${week.cta}
${audience.ask}

Rules:
- Use real Harvest photos from Empathy Ledger or approved local assets.
- Check consent before using identifiable people or children.
- Keep one clear action.
- Do not use old room-based brand language as the public spine.
- Do not overpromise food, timing, access, shop, or finished venue features.
- Write like someone standing at the gate.

Return:
1. Best source photos or shot list.
2. ${channelLabel} post/email structure.
3. Draft copy.
4. Alt text or image notes.
5. CTA and link.
6. GHL/Notion record fields.
7. Publish risks to check before scheduling.`;

  const copyPlanPrompt = async () => {
    await navigator.clipboard.writeText(productionPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section id="content" style={{ padding: isMobile ? "60px 24px" : "80px 40px" }}>
      <h2 style={sectionHeadingStyle}>3-WEEK CONTENT PLAN</h2>
      <p style={{ ...sectionDescStyle, maxWidth: 720 }}>
        A launch-readiness content loop for Facebook, Instagram, and newsletter. Each week has a job, proof source, audience angle, and agent prompt.
      </p>

      <div style={{
        maxWidth: 1100,
        margin: "44px auto 0",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "0.85fr 1.15fr",
        gap: 18,
      }}>
        <div style={{ display: "grid", gap: 12 }}>
          {launchContentWeeks.map((item, index) => (
            <button
              key={item.week}
              type="button"
              onClick={() => setActiveWeek(index)}
              style={{
                textAlign: "left",
                border: `1px solid ${activeWeek === index ? colors.goldenHour : "rgba(28,25,23,0.12)"}`,
                backgroundColor: activeWeek === index ? colors.shed : "rgba(255,255,255,0.35)",
                color: activeWeek === index ? colors.milk : colors.shed,
                padding: "18px 20px",
                cursor: "pointer",
              }}
            >
              <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 11, letterSpacing: "0.14em", color: activeWeek === index ? colors.goldenHour : colors.crane }}>
                {item.week.toUpperCase()} · {item.dates.toUpperCase()}
              </span>
              <h3 style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 20, letterSpacing: "0.04em", margin: "8px 0 8px" }}>
                {item.theme}
              </h3>
              <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.55, opacity: 0.68, margin: 0 }}>
                {item.job}
              </p>
            </button>
          ))}
        </div>

        <div style={{
          border: `1px solid rgba(28,25,23,0.12)`,
          backgroundColor: "rgba(255,255,255,0.32)",
          padding: isMobile ? 20 : 28,
        }}>
          <span style={{ ...smallLabelStyle, color: colors.shed, opacity: 0.45 }}>
            {week.week.toUpperCase()} · {week.dates.toUpperCase()}
          </span>
          <h3 style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: isMobile ? 28 : 40,
            lineHeight: 1.05,
            letterSpacing: "0.04em",
            margin: "12px 0 12px",
          }}>
            {week.theme}
          </h3>
          <p style={{ fontFamily: fonts.body, fontSize: 16, lineHeight: 1.7, opacity: 0.72, margin: "0 0 22px" }}>
            {week.job}
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 10,
            marginBottom: 22,
          }}>
            {(["facebook", "instagram", "newsletter"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setChannel(item)}
                style={{
                  border: `1px solid ${channel === item ? colors.shed : "rgba(28,25,23,0.12)"}`,
                  backgroundColor: channel === item ? colors.goldenHour : "transparent",
                  color: colors.shed,
                  padding: "12px 14px",
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                }}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {[
              ["Channel job", week.posts[channel]],
              ["Proof", week.proof],
              ["CTA", week.cta],
            ].map(([label, body]) => (
              <div key={label} style={{ borderTop: `1px solid rgba(28,25,23,0.08)`, paddingTop: 12 }}>
                <strong style={{ fontFamily: fonts.display, fontSize: 11, letterSpacing: "0.12em", opacity: 0.5 }}>{label}</strong>
                <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.6, opacity: 0.72, margin: "5px 0 0" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 1100,
        margin: "18px auto 0",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "0.85fr 1.15fr",
        gap: 18,
      }}>
        <div style={{
          border: `1px solid rgba(28,25,23,0.12)`,
          padding: isMobile ? 20 : 24,
          backgroundColor: colors.shed,
          color: colors.milk,
        }}>
          <span style={{ ...smallLabelStyle, color: colors.goldenHour, opacity: 0.85 }}>AUDIENCE LOOPS</span>
          <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
            {launchAudienceLoops.map((item, index) => (
              <button
                key={item.audience}
                type="button"
                onClick={() => setAudienceIndex(index)}
                style={{
                  textAlign: "left",
                  border: `1px solid ${audienceIndex === index ? colors.goldenHour : "rgba(245,240,232,0.12)"}`,
                  backgroundColor: audienceIndex === index ? "rgba(196,146,42,0.14)" : "rgba(245,240,232,0.04)",
                  color: colors.milk,
                  padding: "13px 14px",
                  cursor: "pointer",
                }}
              >
                <strong style={{ fontFamily: fonts.display, fontSize: 12, letterSpacing: "0.1em" }}>{item.audience}</strong>
                <p style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.45, opacity: 0.58, margin: "5px 0 0" }}>{item.hook}</p>
              </button>
            ))}
          </div>
        </div>

        <div style={{
          border: `1px solid rgba(28,25,23,0.12)`,
          backgroundColor: "rgba(255,255,255,0.35)",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "14px 16px",
            borderBottom: `1px solid rgba(28,25,23,0.08)`,
          }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 11, letterSpacing: "0.14em", color: colors.crane }}>
              CONTENT AGENT PROMPT
            </span>
            <button
              type="button"
              onClick={copyPlanPrompt}
              style={{
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: 10,
                letterSpacing: "0.1em",
                color: colors.shed,
                backgroundColor: colors.goldenHour,
                border: "none",
                padding: "9px 12px",
                cursor: "pointer",
              }}
            >
              {copied ? "COPIED" : "COPY PROMPT"}
            </button>
          </div>
          <pre style={{
            margin: 0,
            padding: "16px",
            maxHeight: 520,
            overflow: "auto",
            whiteSpace: "pre-wrap",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: 12,
            lineHeight: 1.65,
            color: colors.shed,
            opacity: 0.72,
          }}>
            {productionPrompt}
          </pre>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────
   STYLES
   ───────────────────────────────────── */

const smallLabelStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: 10,
  letterSpacing: "0.2em",
  color: colors.milk,
  opacity: 0.5,
  display: "block",
};

const heroLinkStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 11,
  letterSpacing: "0.1em",
  color: colors.shed,
  backgroundColor: colors.goldenHour,
  border: `1px solid ${colors.goldenHour}`,
  padding: "12px 18px",
  textDecoration: "none",
  display: "inline-block",
};

const sectionHeadingStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 28,
  letterSpacing: "0.1em",
  textAlign: "center",
  margin: 0,
};

const sectionDescStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 16,
  lineHeight: 1.7,
  opacity: 0.6,
  textAlign: "center",
  margin: "12px auto 0",
  maxWidth: 500,
};

const tableCellStyle: CSSProperties = {
  padding: "10px 12px 10px 0",
  borderBottom: "1px solid rgba(245,240,232,0.06)",
  fontFamily: fonts.body,
  fontSize: 14,
};
