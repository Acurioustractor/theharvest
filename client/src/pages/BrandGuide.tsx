import { useState, useEffect, useRef, type CSSProperties } from "react";
import { Link } from "wouter";
import { rootStyle, colors, fonts } from "@/styles/brand";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/* ─────────────────────────────────────
   DATA
   ───────────────────────────────────── */

const chapters = [
  { id: "threes", label: "The Threes" },
  { id: "rooms", label: "The Rooms" },
  { id: "principles", label: "Principles" },
  { id: "writing", label: "Writing Style" },
  { id: "gallery", label: "Visual Library" },
  { id: "sketchpad", label: "Sketch Pad" },
  { id: "social", label: "Social Kit" },
  { id: "palette", label: "Palette" },
  { id: "typography", label: "Typography" },
];

const threes = [
  {
    label: "Art. Food. Community.",
    type: "Tagline",
    items: [
      { word: "Art", desc: "Making, expressing, creating meaning", color: colors.red },
      { word: "Food", desc: "Growing, cooking, sharing a table", color: colors.yellow },
      { word: "Community", desc: "Gathering, belonging, building together", color: colors.blue },
    ],
  },
  {
    label: "Art Space. Kitchen. Garden.",
    type: "The Rooms",
    items: [
      { word: "Art Space", desc: "Gallery, studio, maker workshop", color: colors.red },
      { word: "Kitchen", desc: "Commercial kitchen, shared meals, food projects", color: colors.yellow },
      { word: "Garden", desc: "Growing food, gathering outdoors, kids area", color: colors.green },
    ],
  },
  {
    label: "Make. Feed. Grow.",
    type: "Verbs",
    items: [
      { word: "Make", desc: "What you do in the Art Space", color: colors.red },
      { word: "Feed", desc: "What you do in the Kitchen", color: colors.yellow },
      { word: "Grow", desc: "What you do in the Garden", color: colors.green },
    ],
  },
  {
    label: "Feed. Build. Gather.",
    type: "Event (current Gather page)",
    items: [
      { word: "Feed", desc: "Oysters, pizza, shared food", color: colors.yellow },
      { word: "Build", desc: "Milk crate pavilion, hands-on", color: colors.orange },
      { word: "Gather", desc: "Music, drinks, kids, dogs, neighbours", color: colors.blue },
    ],
  },
];

const rooms = [
  {
    name: "The Art Space",
    color: colors.red,
    verb: "Make",
    tagline: "Art",
    what: "Gallery wall. Maker workshop. Studio residencies. Exhibition space.",
    who: "Artists, makers, kids, schools, anyone who wants to try something",
    spirit: "The space is always becoming. Nothing is permanent, like a gallery.",
    questions: [
      "Is this a gallery? A studio? A workshop? All three?",
      "How do residencies work, open to public or private?",
      "What's the first exhibition?",
    ],
  },
  {
    name: "The Kitchen",
    color: colors.yellow,
    textColor: colors.black,
    verb: "Feed",
    tagline: "Food",
    what: "Commercial kitchen. Shared meals. Food preservation. Cooking classes.",
    who: "Home cooks, food entrepreneurs, neighbours, families",
    spirit: "Food is how we sustain each other. The table is where community happens.",
    questions: [
      "Commercial kitchen for rent, or community-run?",
      "Regular meal nights? Weekly? Monthly?",
      "Food entrepreneur incubator angle?",
    ],
  },
  {
    name: "The Garden",
    color: colors.green,
    verb: "Grow",
    tagline: "Community",
    what: "Food garden. Kids area. Outdoor gathering space. Fire pit.",
    who: "Families, homeschoolers, gardeners, neighbours",
    spirit: "We don't build for people. We build with them. Kids build the kids area.",
    questions: [
      "Communal garden or individual plots?",
      "How does the kids area get co-designed?",
      "Fire pit, permanent or seasonal?",
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

const imageGallery: { category: string; images: { src: string; label: string }[] }[] = [
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
    category: "Inspiration",
    images: [
      { src: "/images/site-plan/inspiration/pen-sketch-portrait.jpeg", label: "Pen sketch portrait" },
      { src: "/images/site-plan/inspiration/crate-wall.jpeg", label: "Crate wall" },
      { src: "/images/site-plan/inspiration/curved-pavilion.jpeg", label: "Curved pavilion" },
      { src: "/images/site-plan/inspiration/crate-cube.jpeg", label: "Crate cube" },
      { src: "/images/site-plan/inspiration/log-climbing-frame.jpeg", label: "Log climbing frame" },
      { src: "/images/site-plan/inspiration/accessible-garden.jpeg", label: "Accessible garden" },
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

/* ─────────────────────────────────────
   COMPONENT
   ───────────────────────────────────── */

export default function BrandGuide() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [lightbox, setLightbox] = useState<{ src: string; label: string } | null>(null);
  const [activeChapter, setActiveChapter] = useState("threes");
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
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={rootStyle}>
      {/* Header */}
      <header style={{
        backgroundColor: colors.black,
        color: colors.cream,
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
          Aligning the threes, the rooms, the language
        </p>
      </header>

      {/* Sticky chapter nav */}
      <nav
        ref={navRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: colors.black,
          borderBottom: "1px solid rgba(244,244,242,0.08)",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{
          display: "flex",
          gap: 0,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 8px",
          whiteSpace: "nowrap",
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
                color: colors.cream,
                opacity: activeChapter === ch.id ? 1 : 0.35,
                backgroundColor: "transparent",
                border: "none",
                borderBottom: activeChapter === ch.id ? `2px solid ${colors.yellow}` : "2px solid transparent",
                padding: isMobile ? "12px 10px" : "14px 16px",
                cursor: "pointer",
                transition: "opacity 0.15s, border-color 0.15s",
                flexShrink: 0,
              }}
            >
              {ch.label.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* ─── THE THREES ─── */}
      <section id="threes" style={{ padding: isMobile ? "60px 24px" : "80px 40px" }}>
        <h2 style={sectionHeadingStyle}>THE THREES</h2>
        <p style={sectionDescStyle}>
          Four ways we've been saying "three things". Which one is the front door?
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
              <span style={{ ...smallLabelStyle, color: colors.black, opacity: 0.4 }}>
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
          <span style={{ ...smallLabelStyle, color: colors.black, opacity: 0.4 }}>
            HOW THEY MAP
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
                {["Tagline", "Room", "Verb", "Color", "Event"].map((h) => (
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
                { tagline: "Art", room: "Art Space", verb: "Make", color: colors.red, event: "Build" },
                { tagline: "Food", room: "Kitchen", verb: "Feed", color: colors.yellow, event: "Feed" },
                { tagline: "Community", room: "Garden", verb: "Grow", color: colors.green, event: "Gather" },
              ].map((row) => (
                <tr key={row.tagline}>
                  <td style={tableCellStyle}>{row.tagline}</td>
                  <td style={tableCellStyle}>{row.room}</td>
                  <td style={tableCellStyle}>{row.verb}</td>
                  <td style={tableCellStyle}>
                    <div style={{
                      width: 16,
                      height: 16,
                      backgroundColor: row.color,
                      display: "inline-block",
                      verticalAlign: "middle",
                    }} />
                  </td>
                  <td style={tableCellStyle}>{row.event}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── THE ROOMS ─── */}
      <section id="rooms" style={{
        backgroundColor: colors.black,
        color: colors.cream,
        padding: isMobile ? "60px 24px" : "80px 40px",
      }}>
        <h2 style={{ ...sectionHeadingStyle, color: colors.cream }}>THE ROOMS</h2>
        <p style={{ ...sectionDescStyle, color: colors.cream, opacity: 0.6 }}>
          Three zones. Each has a name, a verb, a color, and an open question.
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
                  backgroundColor: "rgba(244,244,242,0.05)",
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
            color: colors.black,
            backgroundColor: colors.yellow,
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
            color: colors.cream,
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
        backgroundColor: colors.black,
        color: colors.cream,
        padding: isMobile ? "60px 24px" : "80px 40px",
      }}>
        <h2 style={{ ...sectionHeadingStyle, color: colors.cream }}>WRITING STYLE</h2>
        <p style={{ ...sectionDescStyle, color: colors.cream, opacity: 0.6 }}>
          Barry's story as published on the Empathy Ledger. This is the voice and tone we're aiming for. Matter-of-fact, grounded, no flourish.
        </p>

        <div style={{
          maxWidth: 700,
          margin: "48px auto 0",
        }}>
          <Collapsible title="Barry's Article" defaultOpen={false}>
            <div style={{
              borderLeft: `3px solid ${colors.red}`,
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
                  color: colors.yellow,
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
              backgroundColor: "rgba(244,244,242,0.05)",
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
          All sketches, drawings, plans, photos, and inspiration in one place. Click any image to view fullscreen.
        </p>

        <div style={{ maxWidth: 1100, margin: "40px auto 0" }}>
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
              color: colors.cream,
              opacity: 0.6,
            }}>
              {lightbox.label}
            </span>
            <span style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.1em",
              color: colors.cream,
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
        backgroundColor: colors.black,
        color: colors.cream,
        padding: isMobile ? "60px 24px" : "80px 40px",
      }}>
        <h2 style={{ ...sectionHeadingStyle, color: colors.cream }}>SKETCH PAD</h2>
        <p style={{ ...sectionDescStyle, color: colors.cream, opacity: 0.6 }}>
          Use Gemini to conceptualize. Describe what you're thinking and it'll draw it.
        </p>

        <SketchPad isMobile={isMobile} />
      </section>

      {/* ─── SOCIAL KIT ─── */}
      <section id="social" style={{
        backgroundColor: colors.black,
        color: colors.cream,
        padding: isMobile ? "60px 24px" : "80px 40px",
      }}>
        <h2 style={{ ...sectionHeadingStyle, color: colors.cream }}>SOCIAL KIT</h2>
        <p style={{ ...sectionDescStyle, color: colors.cream, opacity: 0.6 }}>
          Ready-to-use templates and ideas. Screenshot these, adapt in Canva, or use as-is.
        </p>

        <SocialTemplates isMobile={isMobile} onImageClick={(src, label) => setLightbox({ src, label })} />
      </section>

      {/* ─── COLOR PALETTE ─── */}
      <section id="palette" style={{ padding: isMobile ? "60px 24px" : "80px 40px" }}>
        <h2 style={sectionHeadingStyle}>PALETTE</h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0,
          maxWidth: 900,
          margin: "32px auto 0",
        }}>
          {Object.entries(colors).map(([name, hex]) => (
            <div key={name} style={{
              flex: isMobile ? "1 1 50%" : "1 1 0",
              minWidth: isMobile ? "50%" : 0,
              backgroundColor: hex,
              padding: "32px 20px",
              color: name === "yellow" || name === "cream" || name === "orange" ? colors.black : colors.cream,
            }}>
              <span style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.12em",
                display: "block",
              }}>
                {name.toUpperCase()}
              </span>
              <span style={{
                fontFamily: "monospace",
                fontSize: 12,
                opacity: 0.6,
                display: "block",
                marginTop: 4,
              }}>
                {hex}
              </span>
            </div>
          ))}
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
            <span style={{ ...smallLabelStyle, color: colors.black, opacity: 0.4 }}>
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
            <span style={{ ...smallLabelStyle, color: colors.black, opacity: 0.4 }}>
              BODY / INTER
            </span>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 16 : 18,
              lineHeight: 1.8,
              margin: "8px 0 0",
            }}>
              Art is how we make sense of being alive. Food is how we sustain each other. Community is what happens when those two things share a table.
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
            color: colors.cream,
            backgroundColor: "rgba(244,244,242,0.05)",
            border: "1px solid rgba(244,244,242,0.15)",
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
              color: colors.cream,
              backgroundColor: "rgba(244,244,242,0.08)",
              border: "1px solid rgba(244,244,242,0.15)",
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
              color: colors.black,
              backgroundColor: loading ? "rgba(242,201,0,0.5)" : colors.yellow,
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
        <p style={{ fontFamily: fonts.body, fontSize: 14, color: colors.red, marginTop: 16 }}>
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
                  border: "1px solid rgba(244,244,242,0.1)",
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
  const [activeTab, setActiveTab] = useState("zones");

  const tabs = [
    { id: "zones", label: "Zone Tiles", color: colors.yellow },
    { id: "principles", label: "Principles", color: colors.blue },
    { id: "stories", label: "Story Cards", color: colors.green },
    { id: "cta", label: "Invites", color: colors.magenta },
    { id: "heritage", label: "Heritage", color: colors.orange },
    { id: "video", label: "Video", color: colors.red },
  ];

  // Zone identity tiles — rendered as HTML compositions
  const zoneTiles = [
    { verb: "MAKE", zone: "The Art Space", tagline: "Gallery. Studio. Workshop.", color: colors.red, img: "/images/harvest-make.jpg" },
    { verb: "FEED", zone: "The Kitchen", tagline: "Cook. Share. Gather around the table.", color: colors.yellow, img: "/images/harvest-eat.jpg" },
    { verb: "GROW", zone: "The Garden", tagline: "Plant. Harvest. Open 24/7.", color: colors.green, img: "/images/harvest-grow.jpg" },
    { verb: "FIRE", zone: "Timber & Fire", tagline: "Cook on flame. Reclaimed timber. DIY.", color: colors.orange, img: "/images/site-plan/inspiration/curved-pavilion.jpeg" },
    { verb: "BUILD", zone: "The Pavilion", tagline: "1,000 milk crates. Built by community.", color: colors.blue, img: "/images/site-plan/inspiration/crate-wall.jpeg" },
    { verb: "PLAY", zone: "Kids Area", tagline: "Co-designed by children.", color: colors.magenta, img: "/images/site-plan/inspiration/log-climbing-frame.jpeg" },
    { verb: "SEE", zone: "The Gallery", tagline: "Art meets food. Residency launches.", color: colors.red, img: "/images/compendium/MASTER FLOOR PLAN_5.jpeg" },
    { verb: "CREATE", zone: "Outdoor Art", tagline: "Make in the open air.", color: colors.indigo, img: "/images/site-plan/inspiration/pen-sketch-portrait.jpeg" },
    { verb: "GATHER", zone: "Community", tagline: "Music. Food. Dogs. Neighbours.", color: colors.blue, img: "/images/harvest-gather.jpg" },
  ];

  const principleTiles = [
    { principle: "Nothing is permanent.", sub: "Like a gallery. The space is always becoming.", color: colors.red, img: "/images/compendium/canvas-drawing.jpg" },
    { principle: "Community-built.", sub: "We don't build for people. We build with them.", color: colors.blue, img: "/images/site-plan/inspiration/crate-cube.jpeg" },
    { principle: "Custodianship.", sub: "We build to hand over.", color: colors.green, img: "/images/compendium/barry/IMG_5764.jpg" },
  ];

  const storyCards = [
    { quote: "This was all timber country.", attribution: "Barry", img: "/images/compendium/barry/IMG_5745.jpg", color: colors.orange },
    { quote: "We used to all know each other.", attribution: "Barry", img: "/images/compendium/barry/IMG_5727.jpg", color: colors.yellow },
    { quote: "The dogs know this land better than anyone.", attribution: "Barry", img: "/images/compendium/barry/IMG_5819.jpg", color: colors.green },
    { quote: "Art is how we make sense of being alive.", attribution: "The Harvest", img: "/images/compendium/canvas-drawing-dark.jpg", color: colors.red },
    { quote: "Food is how we sustain each other.", attribution: "The Harvest", img: "/images/harvest-eat.jpg", color: colors.yellow },
    { quote: "Community is what happens when those two things share a table.", attribution: "The Harvest", img: "/images/harvest-gather.jpg", color: colors.blue },
  ];

  const ctaTiles = [
    { cta: "COME COOK\nWITH FIRE", sub: "Pizza. Flame. Reclaimed timber.", color: colors.orange, img: "/images/site-plan/inspiration/curved-pavilion.jpeg" },
    { cta: "COME PLANT\nWITH US", sub: "Community garden. Open to all.", color: colors.green, img: "/images/site-plan/inspiration/accessible-garden.jpeg" },
    { cta: "COME BUILD\nWITH US", sub: "1,000 milk crates. One pavilion.", color: colors.blue, img: "/images/site-plan/inspiration/crate-wall.jpeg" },
    { cta: "COME MAKE\nWITH US", sub: "Art. Clay. Print. Whatever you want.", color: colors.red, img: "/images/harvest-make.jpg" },
    { cta: "COME GATHER\nWITH US", sub: "Food. Music. Kids. Dogs. Everyone.", color: colors.yellow, img: "/images/harvest-gather.jpg" },
  ];

  const heritageTiles = [
    { era: "1899", now: "2026", then: "Pit sawyers", future: "Fire cooking station", imgThen: "/images/witta/history/teutoburg-pit-sawyers-1899.png", imgNow: "/images/site-plan/inspiration/curved-pavilion.jpeg", color: colors.orange },
    { era: "1899", now: "2026", then: "Cheese making", future: "Community kitchen", imgThen: "/images/witta/history/teutoburg-cheese-making-1899.png", imgNow: "/images/harvest-eat.jpg", color: colors.yellow },
    { era: "1899", now: "2026", then: "Farm cottage", future: "Art gallery + kitchen", imgThen: "/images/witta/history/teutoburg-nothling-cottage-1899.png", imgNow: "/images/compendium/MASTER FLOOR PLAN_5.jpeg", color: colors.red },
    { era: "1931", now: "2026", then: "Bunya pines", future: "Community garden", imgThen: "/images/witta/history/bunya-pines-witta-1931.png", imgNow: "/images/site-plan/inspiration/accessible-garden.jpeg", color: colors.green },
  ];

  const videoAssets = [
    { src: "/images/compendium/hero-aerial.mp4", poster: "/images/compendium/hero-aerial.jpg", label: "Aerial flyover — site overview", use: "Cover video, reel intro, story background" },
    { src: "/images/compendium/oyster-lease.mp4", poster: "/images/compendium/oyster-lease-poster.jpg", label: "Oyster lease — food provenance", use: "Food story reel, farm-to-table content" },
  ];

  const tileStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    borderRadius: 2,
    border: "1px solid rgba(244,244,242,0.08)",
  };

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto 0" }}>
      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 0,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        borderBottom: "1px solid rgba(244,244,242,0.1)",
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
              color: colors.cream,
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

      {/* ── ZONE TILES ── */}
      {activeTab === "zones" && (
        <div>
          <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.cream, opacity: 0.4, margin: "0 0 20px" }}>
            Post one per day for 9 days. Each zone has a verb, a color, and a photo. Screenshot or recreate in Canva.
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 16,
          }}>
            {zoneTiles.map((tile) => (
              <div key={tile.verb} style={{ ...tileStyle, aspectRatio: "1/1", cursor: "pointer" }} onClick={() => onImageClick(tile.img, `${tile.verb} — ${tile.zone}`)}>
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
                    color: colors.cream,
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
                    color: colors.cream,
                    opacity: 0.8,
                    marginTop: 6,
                  }}>
                    {tile.zone}
                  </div>
                  <div style={{
                    fontFamily: fonts.body,
                    fontSize: 12,
                    color: colors.cream,
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
                  color: colors.cream,
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
          <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.cream, opacity: 0.4, margin: "0 0 20px" }}>
            Three operating principles. Use as standalone posts, or as a carousel series.
          </p>
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
                      color: colors.cream,
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
                      color: colors.cream,
                      lineHeight: 1.2,
                    }}>
                      {tile.principle}
                    </div>
                    <div style={{
                      fontFamily: fonts.body,
                      fontSize: 14,
                      color: colors.cream,
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
          <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.cream, opacity: 0.4, margin: "0 0 20px" }}>
            Quote tiles for stories, reels, and carousel posts. The voice of the land and the people.
          </p>
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
                    color: colors.cream,
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
                    — {card.attribution.toUpperCase()}
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
          <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.cream, opacity: 0.4, margin: "0 0 20px" }}>
            Call-to-action tiles for event promotion. Each one focuses on a different activity.
          </p>
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
                  color: colors.cream,
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
                    color: colors.cream,
                    lineHeight: 1.15,
                    whiteSpace: "pre-line",
                    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}>
                    {tile.cta}
                  </div>
                  <div style={{
                    fontFamily: fonts.body,
                    fontSize: 11,
                    color: colors.cream,
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
          <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.cream, opacity: 0.4, margin: "0 0 20px" }}>
            Then & now split tiles. Witta's heritage paired with The Harvest's vision.
          </p>
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
                      <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 24, color: colors.cream, opacity: 0.8, letterSpacing: "0.05em" }}>
                        {tile.era}
                      </div>
                      <div style={{ fontFamily: fonts.body, fontSize: 11, color: colors.cream, opacity: 0.6 }}>
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
                      <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 24, color: colors.cream, letterSpacing: "0.05em" }}>
                        {tile.now}
                      </div>
                      <div style={{ fontFamily: fonts.body, fontSize: 11, color: colors.cream, opacity: 0.8 }}>
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
                  backgroundColor: colors.cream,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 16,
                  color: colors.black,
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
          <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.cream, opacity: 0.4, margin: "0 0 20px" }}>
            Atmospheric video clips. Use as reel backgrounds, story videos, or website headers.
          </p>
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
                    color: colors.cream,
                  }}>
                    {v.label}
                  </div>
                  <div style={{
                    fontFamily: fonts.body,
                    fontSize: 12,
                    color: colors.cream,
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

/* ─────────────────────────────────────
   STYLES
   ───────────────────────────────────── */

const smallLabelStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: 10,
  letterSpacing: "0.2em",
  color: colors.cream,
  opacity: 0.5,
  display: "block",
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
  borderBottom: "1px solid rgba(244,244,242,0.06)",
  fontFamily: fonts.body,
  fontSize: 14,
};
