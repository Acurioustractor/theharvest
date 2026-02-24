import { useEffect, useState } from "react";
import { Link } from "wouter";

/* ─────────────────────────────────────
   ZONE DATA — single source of truth
   ───────────────────────────────────── */

export const zoneData: Record<string, ZoneInfo> = {
  kids: {
    id: "kids",
    label: "KIDS ZONE",
    color: "#F2C900",
    element: "AIR",
    verbs: "CLIMB, BUILD, IMAGINE",
    tagline: "Designed and built by kids — not for them, with them.",
    why: "Every community space puts a playground in and calls it done. We give kids a blank canvas and let them build what they want. Every season, a new group shapes what it becomes. Agency, not equipment.",
    details: [
      "Blank canvas — kids design their own area each season",
      "Work with local schools + homeschool families",
      "Expression of how kids are feeling in the space",
      "Leah runs quarterly design workshops",
    ],
    who: [
      { name: "Leah", role: "Kids area lead — quarterly design workshops" },
    ],
    ideas: [
      "Mud kitchen built by under-10s",
      "Seasonal sculpture trail through the gardens",
      "Sound garden — instruments made from reclaimed materials",
      "Nature play using fallen timber from the property",
      "Art walls that kids paint over each season",
    ],
    photos: [
      { src: "/images/plans/site-plan-colour-labelled.jpeg", caption: "Site plan — kids zone top left" },
    ],
    connections: ["gather", "gardens"],
  },
  fire: {
    id: "fire",
    label: "FIRE & WOOD",
    color: "#E05206",
    element: "FIRE",
    verbs: "COOK, GATHER, WARM",
    tagline: "Pizza oven, open fire, timber pavilion — tribute to the sawmill workers who shaped this ridge.",
    why: "Sawmill workers built this ridge. The pizza oven and open fire are how we remember them. Woodsmoke and bread — no bookings, no pretension. Just fire, dough, and a seat.",
    details: [
      "Pizza oven + open fire cooking (affordable, build-your-own)",
      "Timber pavilion from reclaimed wood",
      "General store / pop-up shop",
      "Fire pit / BBQ area",
      "Chill under the tree zone",
      "Milk crate pavilion — tribute to the dairy industry",
    ],
    who: [
      { name: "Ben + Nic", role: "Residency No. 1 — building the pavilion and fire areas" },
      { name: "Joey", role: "Builder — on site Thursday" },
    ],
    ideas: [
      "Bread course cooked in the pizza oven",
      "Open fire masterclass — seasonal, working with local chefs",
      "Timber pavilion as pop-up shop for local makers",
      "Evening fire circle — storytelling, music, no amplification",
      "Reclaimed timber from the property for all construction",
    ],
    photos: [],
    connections: ["gather", "milkbar", "gardens"],
  },
  gardens: {
    id: "gardens",
    label: "GARDENS",
    color: "#3A6E47",
    element: "EARTH",
    verbs: "GROW, DIG, REST",
    tagline: "A hundred years of soil on this hill. Everything here starts in the ground.",
    why: "Everything served here starts in this soil. A gardener is always tending it, experimenting with what grows in the red volcanic earth. NDIS-accessible. Always open, always growing, always free.",
    details: [
      "Food forests + nursery beds producing for the whole site",
      "NDIS-accessible garden design (Cath)",
      "Gardener residency — seasonal, working with chefs on what to grow",
      "Chill hammock zone + water feature",
      "Mulch station + garden beds along the frontage",
    ],
    who: [
      { name: "Cath", role: "Garden design — NDIS-accessible" },
    ],
    ideas: [
      "Seasonal produce map — what's growing now, what's coming",
      "Community herb spiral near the milk bar",
      "Seed library — take seeds, leave seeds",
      "School group visits — farm to plate education",
      "Composting system visible to visitors",
      "Native food garden — bush tucker guided by First Nations knowledge",
    ],
    photos: [],
    connections: ["fire", "gather", "kids"],
  },
  gather: {
    id: "gather",
    label: "PLAY & GATHER",
    color: "#A64B8A",
    element: "PLAY",
    verbs: "MEET, SIT, SHARE",
    tagline: "The centre of the site. Where paths cross and people meet.",
    why: "The space with no program. Paths converge, people end up here. Free meals, pop-up markets, or just sitting. The best community spaces are the ones you don't have to book.",
    details: [
      "Multi-purpose gathering space — events, markets, community meals",
      "Free community meal on open days (Fri/Sat/Sun)",
      "Shared tables under pergola",
      "Space for pop-up markets — test an idea, find your crowd",
      "Grassed area for events at night",
    ],
    who: [
      { name: "Community", role: "This space is run by whoever shows up" },
    ],
    ideas: [
      "Friday community meal — free, cooked from the garden",
      "Monthly maker market under the pergola",
      "Outdoor cinema on the grass — projector on the building wall",
      "Long table dinners for seasonal celebrations",
      "Morning tea for neighbours — no agenda, just connection",
    ],
    photos: [],
    connections: ["fire", "milkbar", "gardens", "kids"],
  },
  milkbar: {
    id: "milkbar",
    label: "MILK BAR",
    color: "#D62C2C",
    element: "FOOD",
    verbs: "SIP, TASTE, LINGER",
    tagline: "Paying tribute to the milk and dairy industry. Not a boring cafe — very intentional, maybe five items on the menu.",
    why: "Cream runs connected these hinterland towns. The milk bar honours that. Five items on the menu. Rotating residency — milk bar this season, maybe a coffee roastery next. The only permanent thing is the counter.",
    details: [
      "Retro milk bar concept — milkshakes, artisanal offerings",
      "Rotating residency: first season milk bar, then maybe coffee roastery",
      "Cafe for gallery visitors + community",
      "Sabrina managing",
      "Outdoor seating flows into gathering area",
    ],
    who: [
      { name: "Sabrina", role: "Milk bar — managing the space" },
    ],
    ideas: [
      "Local dairy on tap — milkshakes, fresh milk, yoghurt",
      "Five-item menu that changes seasonally",
      "Brookie Bakes-style artisanal baked goods",
      "Counter seating looking into the gallery",
      "Retro signage and playful interiors — commissioned from local artists",
    ],
    photos: [],
    connections: ["gallery", "gather", "kitchen"],
  },
  gallery: {
    id: "gallery",
    label: "GALLERY & STAGE",
    color: "#005EB8",
    element: "ART",
    verbs: "SEE, FEEL, BE MOVED",
    tagline: "The main interior — gallery by day, theater by night. Everything can be bumped out and transformed between seasons.",
    why: "Timber floor. Stage at the back. Fireplace in the middle. Everything can be removed between seasons — gallery one quarter, theatre the next, ceramics workshop after that. The space is always becoming.",
    details: [
      "Timber floor, raised stage with fireplace in the middle",
      "Round tables — warm, cooperative feel",
      "Cold room on display inside the gallery (florist walk-in)",
      "Once-a-month curated ticketed experience",
      "Residency workspace in rammed earth room at back",
      "Bar + two toilets + shared wash station",
    ],
    who: [
      { name: "Artists in residence", role: "Seasonal — three-month residencies" },
      { name: "Ben + Nic", role: "Residency No. 1" },
    ],
    ideas: [
      "Floating tree-house nests above the bar for intimate dining",
      "Fireplace as centrepiece — visible from every seat",
      "Cold room repurposed as walk-in florist/produce display",
      "Height of the roof used — hanging installations, lighting rigs",
      "Stage doubles as exhibition platform and performance space",
      "Noma-style seasonal transformation — cutlery, vibe, everything changes",
    ],
    photos: [],
    connections: ["milkbar", "kitchen", "residency"],
  },
  kitchen: {
    id: "kitchen",
    label: "PREP KITCHEN",
    color: "#D62C2C",
    element: "FOOD",
    verbs: "PREP, PLATE, SERVE",
    tagline: "Not a restaurant kitchen — a prep kitchen. Induction hubs, combi oven, underbench fridges. Under $20K.",
    why: "Not a restaurant kitchen. Induction hubs, combi oven, underbench fridges — under $20K. The pizza oven and open fire do the rest. Open servery into the gallery, so the kitchen is a stage.",
    details: [
      "Commercial induction hubs (no exhaust fan needed)",
      "Combi oven + tabletop fryer",
      "Underbench fridges + stainless steel benches",
      "Dishwasher + grease trap",
      "Open servery to gallery — kitchen as performance",
      "Back entry for service / goods",
    ],
    who: [
      { name: "Rotating chef residency", role: "Seasonal chef working with garden produce" },
    ],
    ideas: [
      "Open servery framed as a 'second stage' — kitchen as theater",
      "Chef's table — 4 seats at the servery for a premium experience",
      "Pantry stocked from the garden — visible, labelled, beautiful",
      "Partner with local commercial kitchen for large event prep",
      "Tabletop fryer for flash-frying — no infrastructure needed",
    ],
    photos: [],
    connections: ["gallery", "milkbar", "gardens"],
  },
  "outdoor-art": {
    id: "outdoor-art",
    label: "OUTDOOR STUDIO",
    color: "#005EB8",
    element: "ART",
    verbs: "MAKE, SHAPE, EXHIBIT",
    tagline: "Pergola area for artists to make and exhibit work outdoors. Rammed earth, large-scale, messy.",
    why: "Some art needs space and mess. Covered but open — rammed earth, large-scale sculpture, anything that doesn't fit inside. Visitors find the work as they walk the garden paths.",
    details: [
      "Covered outdoor workspace for artists",
      "Connected to gallery but separate enough for focused work",
      "Thais designing rammed earth elements",
      "Exhibition space flows into garden paths",
    ],
    who: [
      { name: "Thais", role: "Architect — rammed earth, concepts in progress" },
    ],
    ideas: [
      "Rammed earth demonstration wall — visitors watch it being built",
      "Sculpture trail connecting outdoor studio to gardens",
      "Large-format printmaking or ceramics kiln",
      "Open studio days — public watches artists work",
      "Material sourced from the property — red soil, timber, stone",
    ],
    photos: [],
    connections: ["gallery", "residency"],
  },
  residency: {
    id: "residency",
    label: "ARTIST IN RESIDENCE",
    color: "#F2C900",
    element: "ART",
    verbs: "LIVE, WORK, EXPLORE",
    tagline: "The back room — rammed earth walls, quiet, focused. Where the resident works for a season.",
    why: "Three residents per season — a gardener, a chef, an artist. Back-office handles operations so they can focus on making. Rammed earth room at the back. Quiet. Private. Where the work happens before it goes on stage.",
    details: [
      "Dedicated workspace for seasonal resident",
      "Three residency types: gardener, chef, artist",
      "Ben + Nic are Residency No. 1",
      "Supported by permanent back-office team",
      "Connected to gallery but private enough to make work",
    ],
    who: [
      { name: "Ben + Nic", role: "Residency No. 1 — timber, dairy, co-operative" },
      { name: "Susie", role: "Operations — 3 days/week" },
      { name: "Sophie", role: "Producer — full-time from March" },
    ],
    ideas: [
      "Residency applications open seasonally — call for artists",
      "Each resident documents their process for the compendium",
      "Public talk / open studio at end of each residency",
      "Resident selects what goes in the gallery for their season",
      "Cross-pollination — chef works with gardener, artist responds to both",
    ],
    photos: [],
    connections: ["gallery", "outdoor-art"],
  },
};

export type ZoneInfo = {
  id: string;
  label: string;
  color: string;
  element: string;
  verbs: string;
  tagline: string;
  why: string;
  details: string[];
  who: { name: string; role: string }[];
  ideas: string[];
  photos: { src: string; caption: string }[];
  connections: string[];
};

/* ─────────────────────────────────────
   COMPONENTS
   ───────────────────────────────────── */

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

function GeometricLogo({ size = 40 }: { size?: number }) {
  const s = size;
  return (
    <svg width={s * 2.5} height={s} viewBox="0 0 100 40" fill="none">
      <circle cx="20" cy="20" r="16" fill="var(--bh-blue)" />
      <rect x="30" y="4" width="32" height="32" fill="var(--bh-red)" />
      <polygon points="72,36 88,4 104,36" fill="var(--bh-yellow)" />
    </svg>
  );
}

/* ─────────────────────────────────────
   PAGE
   ───────────────────────────────────── */

export default function BauhausZone({ zoneId }: { zoneId: string }) {
  const zone = zoneData[zoneId || ""];
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Inter:wght@400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [zoneId]);

  if (!zone) {
    return (
      <div style={rootStyle}>
        <div style={{ padding: 80, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--bh-display)", fontSize: 18 }}>Zone not found</p>
          <Link href="/bauhaus" style={{ color: "var(--bh-blue)", fontFamily: "var(--bh-display)", fontSize: 14 }}>Back to The Harvest</Link>
        </div>
      </div>
    );
  }

  const connected = zone.connections.map(id => zoneData[id]).filter(Boolean);

  return (
    <div style={rootStyle}>
      {/* ─── NAV ─── */}
      <nav style={navStyle}>
        <Link href="/bauhaus" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <GeometricLogo size={28} />
          <span style={{ fontFamily: "var(--bh-display)", fontWeight: 900, fontSize: 16, letterSpacing: "0.12em", color: "var(--bh-black)" }}>THE HARVEST</span>
        </Link>
        <Link href="/bauhaus#site-map" style={{ fontFamily: "var(--bh-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", color: "var(--bh-black)", textDecoration: "none" }}>
          BACK TO SITE MAP
        </Link>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ backgroundColor: zone.color, color: "#F4F4F2", padding: isMobile ? "60px 28px 80px" : "80px 48px 120px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--bh-display)", fontWeight: 700, fontSize: 11, letterSpacing: "0.2em", opacity: 0.6, display: "block", marginBottom: 8 }}>
            {zone.element}
          </span>
          <h1 style={{ fontFamily: "var(--bh-display)", fontWeight: 900, fontSize: isMobile ? "clamp(36px, 10vw, 56px)" : "clamp(48px, 6vw, 72px)", letterSpacing: "0.04em", lineHeight: 1, margin: "0 0 16px" }}>
            {zone.label}
          </h1>
          <p style={{ fontFamily: "var(--bh-display)", fontWeight: 700, fontSize: "clamp(12px, 1.4vw, 14px)", letterSpacing: "0.15em", opacity: 0.6, margin: "0 0 24px" }}>
            {zone.verbs}
          </p>
          <p style={{ fontFamily: "var(--bh-body)", fontSize: "clamp(16px, 2vw, 20px)", lineHeight: 1.7, maxWidth: 600, opacity: 0.9, margin: 0 }}>
            {zone.tagline}
          </p>
        </div>
      </section>

      {/* ─── WHY + WHO ─── */}
      <section style={{ backgroundColor: "var(--bh-black)", color: "var(--bh-cream)", padding: isMobile ? "60px 28px" : "100px 48px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--bh-body)", fontSize: "clamp(16px, 1.8vw, 19px)", lineHeight: 1.9, opacity: 0.85, margin: 0 }}>
            {zone.why}
          </p>
        </div>
      </section>

      {/* ─── WHAT'S HERE + IDEAS ─── */}
      <section style={{ backgroundColor: "var(--bh-cream)", padding: isMobile ? "60px 28px" : "100px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 48 : 80 }}>
          {/* Left: what's here */}
          <div>
            <h2 style={{ fontFamily: "var(--bh-display)", fontWeight: 900, fontSize: 14, letterSpacing: "0.12em", margin: "0 0 24px", color: "var(--bh-black)", opacity: 0.4 }}>
              WHAT'S HERE
            </h2>
            {zone.details.map((d, i) => (
              <p key={i} style={{ fontFamily: "var(--bh-body)", fontSize: 15, lineHeight: 1.6, color: "var(--bh-black)", margin: "0 0 12px", paddingLeft: 16, borderLeft: `2px solid ${zone.color}` }}>
                {d}
              </p>
            ))}
          </div>
          {/* Right: ideas */}
          <div>
            <h2 style={{ fontFamily: "var(--bh-display)", fontWeight: 900, fontSize: 14, letterSpacing: "0.12em", margin: "0 0 24px", color: "var(--bh-black)", opacity: 0.4 }}>
              WHAT WE'RE THINKING
            </h2>
            {zone.ideas.map((idea, i) => (
              <p key={i} style={{ fontFamily: "var(--bh-body)", fontSize: 14, lineHeight: 1.6, color: "var(--bh-black)", opacity: 0.65, margin: "0 0 12px", paddingLeft: 16, borderLeft: "2px solid rgba(26,26,26,0.12)" }}>
                {idea}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PHOTOS / MOOD BOARD ─── */}
      {zone.photos.length > 0 && (
        <section style={{ backgroundColor: "var(--bh-black)", padding: isMobile ? "40px 0" : "60px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : `repeat(${Math.min(zone.photos.length, 3)}, 1fr)`, gap: 4 }}>
            {zone.photos.map((photo, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img src={photo.src} alt={photo.caption} style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }} />
                {photo.caption && (
                  <p style={{ fontFamily: "var(--bh-body)", fontSize: 11, opacity: 0.4, margin: 0, padding: "8px 16px", color: "var(--bh-cream)" }}>
                    {photo.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── CONNECTED ZONES ─── */}
      <section style={{ backgroundColor: "var(--bh-cream)", padding: isMobile ? "60px 28px" : "80px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--bh-display)", fontWeight: 900, fontSize: "clamp(16px, 2vw, 20px)", letterSpacing: "0.08em", margin: "0 0 24px", color: "var(--bh-black)", opacity: 0.5 }}>
            CONNECTED ZONES
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : `repeat(${Math.min(connected.length, 3)}, 1fr)`, gap: 12 }}>
            {connected.map((cz) => (
              <Link key={cz.id} href={`/bauhaus/${cz.id}`} style={{
                textDecoration: "none",
                padding: "24px 20px",
                backgroundColor: cz.color,
                color: "#F4F4F2",
                display: "block",
                transition: "opacity 0.2s",
              }}>
                <span style={{ fontFamily: "var(--bh-display)", fontWeight: 700, fontSize: 10, letterSpacing: "0.15em", opacity: 0.6, display: "block", marginBottom: 4 }}>
                  {cz.element}
                </span>
                <span style={{ fontFamily: "var(--bh-display)", fontWeight: 900, fontSize: 18, letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>
                  {cz.label}
                </span>
                <span style={{ fontFamily: "var(--bh-body)", fontSize: 13, opacity: 0.8, lineHeight: 1.5 }}>
                  {cz.tagline}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ backgroundColor: "var(--bh-black)", padding: "40px", borderTop: "3px solid rgba(245,240,232,0.1)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <Link href="/bauhaus" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <GeometricLogo size={20} />
            <span style={{ fontFamily: "var(--bh-display)", fontWeight: 900, fontSize: 13, letterSpacing: "0.12em", color: "var(--bh-cream)" }}>THE HARVEST</span>
          </Link>
          <Link href="/bauhaus#site-map" style={{ fontFamily: "var(--bh-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", color: "var(--bh-cream)", textDecoration: "none", opacity: 0.6 }}>
            SITE MAP
          </Link>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────
   STYLES
   ───────────────────────────────────── */

const rootStyle: React.CSSProperties = {
  // @ts-expect-error -- custom properties
  "--bh-black": "#1A1A1A",
  "--bh-cream": "#F4F4F2",
  "--bh-red": "#D62C2C",
  "--bh-yellow": "#F2C900",
  "--bh-blue": "#005EB8",
  "--bh-orange": "#E05206",
  "--bh-green": "#3A6E47",
  "--bh-indigo": "#2A3B8F",
  "--bh-magenta": "#A64B8A",
  "--bh-display": "'Montserrat', sans-serif",
  "--bh-body": "'Inter', sans-serif",
  fontFamily: "var(--bh-body)",
  color: "var(--bh-black)",
  backgroundColor: "var(--bh-cream)",
  margin: 0,
  padding: 0,
  minHeight: "100vh",
  lineHeight: 1.5,
};

const navStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 40px",
  height: 64,
  backgroundColor: "var(--bh-cream)",
  borderBottom: "3px solid var(--bh-black)",
  position: "sticky",
  top: 0,
  zIndex: 100,
};
