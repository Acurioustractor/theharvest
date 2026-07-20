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
    tagline: "Designed and built by kids. Not for them, with them.",
    why: "Every community space puts a playground in and calls it done. We want to give kids a blank canvas and let them build what they want, season by season. Agency, not equipment.",
    details: [
      "The kids area is still finding its shape",
      "The garden around it grows through regular work days, and kids are welcome",
      "You do not need to book to come and have a look while we find our feet",
    ],
    who: [
      { name: "Kids and families", role: "The idea is that kids lead the design, with help" },
    ],
    ideas: [
      "Kids design their own area each season, a blank canvas",
      "Working with local schools and homeschool families",
      "Mud kitchen built by under-10s",
      "Sound garden: instruments made from reclaimed materials",
      "Nature play using fallen timber from the property",
      "Art walls that kids paint over each season",
    ],
    photos: [
      { src: "/images/plans/site-plan-colour-labelled.jpeg", caption: "Site plan: kids zone top left" },
    ],
    connections: ["gather", "gardens"],
  },
  fire: {
    id: "fire",
    label: "FIRE & WOOD",
    color: "#E05206",
    element: "FIRE",
    verbs: "COOK, GATHER, WARM",
    tagline: "Pizza oven, open fire, timber pavilion: a tribute to the timber and dairy story of this place.",
    why: "The pizza oven and open fire are how we remember the people who worked this land. Woodsmoke and bread. No bookings, no pretension. Just fire, dough and a seat.",
    details: [
      "This corner is still taking shape",
      "Events that happen here land on the members page first",
      "You do not need to book to come and have a look while we find our feet",
    ],
    who: [
      { name: "Susie + Joey", role: "Community stewards, looking after the place day to day" },
    ],
    ideas: [
      "Pizza oven and open fire cooking, kept affordable",
      "A timber pavilion from reclaimed wood",
      "Bread baked in the pizza oven",
      "Evening fire circle: storytelling, music, no amplification",
      "Reclaimed timber from the property for construction",
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
    tagline: "Red volcanic soil on this hill. Everything here starts in the ground.",
    why: "Everything served here will start in this soil. The garden grows through regular work days, and anyone is welcome to join one. Always open, always growing, always free.",
    details: [
      "The garden is growing now, through regular work days",
      "Members hear first when a work day is coming up",
      "You do not need to book to come and have a look while we find our feet",
    ],
    who: [
      { name: "Susie + Joey", role: "Community stewards, tending the place day to day" },
    ],
    ideas: [
      "Food forests and nursery beds producing for the whole site",
      "Accessible garden design",
      "Seasonal produce map: what's growing now, what's coming",
      "Seed library: take seeds, leave seeds",
      "Composting system visible to visitors",
      "Native food garden: bush tucker guided by First Nations knowledge",
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
    why: "The space with no program. Paths converge, people end up here. The best community spaces are the ones you don't have to book.",
    details: [
      "Events land on the members page first. Members hear first, every time",
      "Membership is free",
      "You do not need to book to come and have a look while we find our feet",
    ],
    who: [
      { name: "Community", role: "This space is run by whoever shows up" },
    ],
    ideas: [
      "Community meals cooked from the garden",
      "Maker markets under the pergola",
      "Outdoor cinema on the grass: projector on the building wall",
      "Long table dinners for seasonal celebrations",
      "Morning tea for neighbours: no agenda, just connection",
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
    tagline: "A tribute to the dairy story of this place. Not a boring cafe: small, intentional, still to come.",
    why: "Dairy shaped these hinterland towns, and the milk bar idea honours that. It would be a future sublicenced operation, and it is not open yet. Small menu, a counter to linger at, nothing more than it needs to be.",
    details: [
      "Not open yet: a future sublicenced operation, still taking shape",
      "The first shelves of the shop are being shaped with local makers and growers",
      "An expression of interest starts a proper conversation",
    ],
    who: [],
    ideas: [
      "Local dairy on tap: milkshakes, fresh milk, yoghurt",
      "A short menu that changes seasonally",
      "Baked goods from local makers",
      "Counter seating looking into the gallery",
      "Retro signage and playful interiors, made with local artists",
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
    tagline: "The main interior: gallery by day, theatre by night. Everything can be bumped out and transformed between seasons.",
    why: "Timber floor. Stage at the back. Fireplace in the middle. The idea is a room that can be cleared and remade between seasons: gallery one season, theatre the next, workshop after that. The art space is still finding its shape.",
    details: [
      "The art space is finding its shape",
      "Events held here land on the members page first",
      "You do not need to book to come and have a look while we find our feet",
    ],
    who: [
      { name: "Artists", role: "The idea is that artists shape this space" },
    ],
    ideas: [
      "Curated exhibitions and performances as the program forms",
      "Fireplace as centrepiece, visible from every seat",
      "Cold room repurposed as walk-in florist/produce display",
      "Height of the roof used: hanging installations, lighting rigs",
      "Stage doubles as exhibition platform and performance space",
      "Seasonal transformation: the whole room changes with the program",
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
    tagline: "Not a restaurant kitchen: a simple prep kitchen, part of a future sublicenced operation.",
    why: "Not a restaurant kitchen. A simple prep space, with an open servery into the gallery so the kitchen is part of the room. It belongs to a future sublicenced operation and is not running yet.",
    details: [
      "Not running yet: part of a future sublicenced operation",
      "The idea: simple prep equipment rather than a full restaurant fit-out",
      "Open servery to the gallery, so cooking happens in view of the room",
    ],
    who: [],
    ideas: [
      "Open servery framed as a second stage: kitchen as theatre",
      "A few seats at the servery",
      "Pantry stocked from the garden: visible, labelled, beautiful",
      "Partnering with a local commercial kitchen for large event prep",
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
    tagline: "A covered outdoor area for artists to make and exhibit work. Large-scale, messy, open to the garden.",
    why: "Some art needs space and mess. Covered but open: large-scale sculpture, rammed earth, anything that doesn't fit inside. Visitors find the work as they walk the garden paths.",
    details: [
      "The outdoor studio is still finding its shape",
      "The art space around it is finding its shape too",
      "You do not need to book to come and have a look while we find our feet",
    ],
    who: [],
    ideas: [
      "Covered outdoor workspace for artists",
      "Rammed earth demonstration wall: visitors watch it being built",
      "Sculpture trail connecting outdoor studio to gardens",
      "Large-format printmaking or ceramics kiln",
      "Open studio days: the public watches artists work",
      "Material sourced from the property: red soil, timber, stone",
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
    tagline: "The back room: rammed earth walls, quiet, focused. Where a resident could work for a season.",
    why: "The idea is simple: give a maker a quiet room and a season, and let the work happen before it goes on stage. The residency is still forming. No dates, no call-out yet.",
    details: [
      "The residency is still forming",
      "Members hear first when applications open",
      "The art space is finding its shape",
    ],
    who: [
      { name: "Ben + Nic", role: "Co-founders, shaping the residency idea" },
    ],
    ideas: [
      "Seasonal residencies for growers, cooks and artists",
      "Each resident documents their process for the compendium",
      "Public talk or open studio at the end of each residency",
      "Resident selects what goes in the gallery for their season",
      "Cross-pollination: cook works with gardener, artist responds to both",
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
        <Link href="/bauhaus" style={{ fontFamily: "var(--bh-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", color: "var(--bh-black)", textDecoration: "none" }}>
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
              WHAT'S HERE NOW
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
              WHAT'S FORMING
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
          <Link href="/bauhaus" style={{ fontFamily: "var(--bh-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", color: "var(--bh-cream)", textDecoration: "none", opacity: 0.6 }}>
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
