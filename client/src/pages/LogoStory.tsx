import { type CSSProperties } from "react";
import { colors, fonts } from "../styles/brand";

/* -----------------------------------------------
   THE HARVEST — Logo Story
   A living document of the brand being built.
   The origin, the pieces, the process, where it's going.
   ----------------------------------------------- */

const RAMMED_EARTH = colors.rammedEarth;
const CANOPY       = colors.canopy;
const GOLDEN_HOUR  = colors.goldenHour;
const CRANE        = colors.crane;

interface Piece {
  label: string;
  sublabel: string;
  zone: string;
  color: string;
  shape: "vertical" | "horizontal";
  story: string;
}

const pieces: Piece[] = [
  {
    label: "The Structure",
    sublabel: "Rammed Earth",
    zone: "The Place · 9 Gumland Drive",
    color: RAMMED_EARTH,
    shape: "vertical",
    story:
      "Two posts. The building itself — rammed earth walls that have stood on this ridge for decades. The structure that holds everything together. Always building, always together.",
  },
  {
    label: "The Land",
    sublabel: "Canopy Green",
    zone: "Garden · Grow",
    color: CANOPY,
    shape: "horizontal",
    story:
      "The bottom bar. What was here before us and will be here after. Jinibara Country. The paddocks, the canopy, the soil. The garden where things grow — food, connection, roots.",
  },
  {
    label: "The Heritage",
    sublabel: "Golden Hour",
    zone: "Kitchen · Feed",
    color: GOLDEN_HOUR,
    shape: "horizontal",
    story:
      "The middle bar. Golden hour on the ridge. Timber mills, dairy farms, co-ops. The families who worked this land together and shared what they had. The kitchen where people are fed — food and stories.",
  },
  {
    label: "The Exchange",
    sublabel: "Crane Brown",
    zone: "Art Space · Make",
    color: CRANE,
    shape: "horizontal",
    story:
      "The top bar. Barry's crane, rusted iron, patina of use. What flows through now — artists sharing work, neighbours sharing tables, kids climbing, makers making. The next chapter being written.",
  },
];

interface Direction {
  number: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  accent: string;
}

const directions: Direction[] = [
  {
    number: "01",
    title: "The Seasonal H",
    subtitle: "A logo that lives with the land",
    accent: CANOPY,
    paragraphs: [
      "The H framework is permanent. The two posts never move — they're the building, the constant. But the three bars become swappable slots that change with the seasons.",
      "Summer: the bottom bar is a garden row, green shoots pushing through soil. The middle bar is a long table with plates. The top bar is an open studio window with light pouring through.",
      "Autumn: fallen leaves. A steaming pot. A painted canvas drying.",
      "Winter: dormant soil, dark and quiet. A warm fireplace glow. Hands wrapped around a cup.",
      "Spring: wildflowers pushing up. Seeds in jars. A child's drawing.",
      "Each bar still maps to its zone — garden, kitchen, art space — but the content shifts. The H becomes a living calendar. People return to the site and know what season it is by the logo alone. Like Google Doodles, but slower. Seasonal, not daily. Four versions a year. The land sets the pace.",
    ],
  },
  {
    number: "02",
    title: "The Growing H",
    subtitle: "A logo with a lifecycle",
    accent: GOLDEN_HOUR,
    paragraphs: [
      "The H isn't built — it's grown. The posts are tree trunks. The bars are branches reaching across. The whole mark is alive.",
      "It starts as a seed. Just a small mark in the soil. A dot. The very beginning. Then two thin stems push up — no bars yet, just potential. The posts thicken. The first bar appears at the bottom: a root connection between the two trunks, underground, invisible but essential.",
      "Then the full H. Thick trunks, strong branches. Leaves, texture, life. The colours appear naturally — green at the roots, golden in the heartwood, brown where it meets the sky. Things hang from the bars: produce, art, lanterns, hands.",
      "Then the return. Leaves fall. The bars thin. But the posts remain. Compost feeds the next cycle. The logo has a lifecycle — it breathes. On the website, a slow animation could show it growing, bearing fruit, shedding, regrowing. Not fast. Over sixty seconds maybe. Like watching a plant in timelapse.",
      "The primary logo is the mature state. But the growth sequence becomes the loading animation, the page transition, the scroll reveal. The H literally grows as you explore the site.",
    ],
  },
  {
    number: "03",
    title: "The Alchemical H",
    subtitle: "A logo that transforms what passes through it",
    accent: CRANE,
    paragraphs: [
      "Read the H bottom to top and it's not just a building — it's a transformation.",
      "Bottom bar: raw material. Soil. Clay. Flour. A blank page. Unformed potential. This is what you arrive with.",
      "Middle bar: the process. Heat. Hands. Time. Conversation. The kitchen where raw becomes cooked. The wheel where clay becomes a bowl. The conversation where a stranger becomes a friend.",
      "Top bar: what emerges. Not new — transformed. The patina of use. The crane rust. The well-worn table. The painting that took three attempts. The relationship that took showing up.",
      "The H is a vessel. A kiln. A furnace. A studio. Things enter at the bottom raw and emerge at the top changed. The two posts are the container — the building that holds the process. Without the container, the transformation can't happen.",
      "On the website, the bars could carry subtle textures that tell this story. The bottom bar has an organic, raw grain. The middle bar shimmers gently — heat, energy, process. The top bar has a weathered, beautiful patina. The H tells you what this place does to people.",
    ],
  },
];

export default function LogoStory() {
  return (
    <div style={pageStyle}>
      {/* ===== PART 1: THE ORIGIN ===== */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <p style={eyebrowStyle}>BRAND MARK</p>
        <h1 style={titleStyle}>The Story of the H</h1>
        <p style={subtitleStyle}>Every piece means something. Nothing is decoration.</p>
      </div>

      {/* THE ACTUAL LOGO */}
      <div style={logoContainerStyle}>
        <img
          src="/images/logo-harvest-main.jpg"
          alt="The Harvest — H monogram logo"
          style={logoImageStyle}
        />
      </div>

      {/* Full narrative */}
      <div style={narrativeStyle}>
        <p style={narrativeTextStyle}>
          Not just a letter. A building. A frame you can climb. Something being
          constructed — always. The three bars are the three zones: Garden, Kitchen,
          Art Space. The two posts are the place itself. Rammed earth. Solid.
          Standing on the ridge at Witta, holding it all together.
        </p>
        <p style={narrativeTextStyle}>
          Read it bottom to top and you read the story of this place: the land came
          first, then the people who worked it, then what's happening now. Read it
          as a whole and you see a building — something being made, together, in the
          open.
        </p>
      </div>

      {/* Piece-by-piece breakdown */}
      <div style={{ marginTop: 8 }}>
        <p style={{ ...eyebrowStyle, marginBottom: 24 }}>PIECE BY PIECE</p>

        {pieces.map((piece, i) => (
          <div key={i} style={pieceRowStyle}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{
                width: piece.shape === "vertical" ? 14 : 44,
                height: piece.shape === "vertical" ? 44 : 14,
                borderRadius: 2,
                backgroundColor: piece.color,
                flexShrink: 0,
                marginTop: 2,
              }} />
              <div style={{ flex: 1 }}>
                <div style={pieceLabelStyle}>{piece.label}</div>
                <div style={pieceSubStyle}>
                  {piece.sublabel} <span style={{ opacity: 0.5 }}>· {piece.zone}</span>
                </div>
                <p style={pieceTextStyle}>{piece.story}</p>
              </div>
            </div>
            {i < pieces.length - 1 && <div style={dividerStyle} />}
          </div>
        ))}
      </div>

      {/* Colour reference */}
      <div style={colorSectionStyle}>
        <p style={eyebrowStyle}>BRAND COLOURS IN THE MARK</p>
        <div style={swatchRowStyle}>
          {[
            { name: "Rammed Earth", hex: RAMMED_EARTH, role: "Posts · The building" },
            { name: "Canopy", hex: CANOPY, role: "Bottom bar · The land" },
            { name: "Golden Hour", hex: GOLDEN_HOUR, role: "Middle bar · The heritage" },
            { name: "Crane", hex: CRANE, role: "Top bar · The exchange" },
          ].map((c) => (
            <div key={c.hex} style={{ textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 4, backgroundColor: c.hex, margin: "0 auto 8px" }} />
              <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 11, letterSpacing: "0.06em" }}>{c.name}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 11, opacity: 0.35, marginTop: 2 }}>{c.hex}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 11, opacity: 0.3, marginTop: 2 }}>{c.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== PART 2: THE PROCESS ===== */}
      <div style={processSectionStyle}>
        <p style={eyebrowStyle}>THE PROCESS</p>
        <h2 style={{ ...titleStyle, fontSize: 28, marginBottom: 16 }}>Building the brand in the open</h2>
        <p style={narrativeTextStyle}>
          This page is a living document. The logo didn't arrive finished — it's being
          built the same way everything at The Harvest is built: by doing the work,
          sharing the progress, and letting the place tell us what it needs.
        </p>
        <p style={narrativeTextStyle}>
          Nicholas brings the vision — the principle that every mark has to mean something,
          that simplicity isn't simple, that a brand should feel like opening something
          for the first time. Ben builds it — translating voice notes and sketches and
          half-formed ideas into something you can see and touch and react to.
        </p>
        <p style={narrativeTextStyle}>
          Between us: pencil sketches on paper. Photos of the actual building. AI-generated
          drafts that get closer each time. Conversations about what the three bars really
          mean. Debates about whether the crane colour is right. Screenshots sent at midnight.
          Audio messages recorded while walking the property.
        </p>
        <p style={narrativeTextStyle}>
          The H you see above is where we are today. Below is where it might go.
        </p>
      </div>

      {/* ===== PART 3: WHERE IT COULD GO ===== */}
      <div style={{ marginTop: 16 }}>
        <p style={eyebrowStyle}>WHERE IT COULD GO</p>
        <h2 style={{ ...titleStyle, fontSize: 28, marginBottom: 8 }}>Three directions</h2>
        <p style={{ ...subtitleStyle, marginBottom: 40 }}>
          The H stays. What fills it changes. These aren't alternatives — they're layers
          that could live together.
        </p>

        {directions.map((dir, i) => (
          <div key={dir.number} style={directionCardStyle}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
              <span style={{
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: 32,
                color: dir.accent,
                opacity: 0.4,
                lineHeight: 1,
              }}>
                {dir.number}
              </span>
              <div>
                <h3 style={{
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 22,
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}>
                  {dir.title}
                </h3>
                <p style={{
                  fontFamily: fonts.body,
                  fontSize: 14,
                  opacity: 0.45,
                  margin: "2px 0 0",
                }}>
                  {dir.subtitle}
                </p>
              </div>
            </div>

            {dir.paragraphs.map((p, j) => (
              <p key={j} style={{
                ...pieceTextStyle,
                marginBottom: j < dir.paragraphs.length - 1 ? 12 : 0,
              }}>
                {p}
              </p>
            ))}

            {i < directions.length - 1 && (
              <div style={{ ...dividerStyle, margin: "32px 0" }} />
            )}
          </div>
        ))}
      </div>

      {/* ===== THE GROWING H — LOGO MARKS ===== */}
      <div style={{
        marginTop: 48,
        padding: "40px 0 0",
        borderTop: `1px solid rgba(28,25,23,0.06)`,
      }}>
        <p style={eyebrowStyle}>THE GROWING H</p>
        <h2 style={{ ...titleStyle, fontSize: 28, marginBottom: 8 }}>Six stages of the seed</h2>
        <p style={{ ...subtitleStyle, marginBottom: 40 }}>
          The logo has a lifecycle. It starts as a seed, grows, bears fruit, and returns to the earth.
          Stage 1 is where we are now.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
        }}>
          {[
            { stage: 1, label: "Seed", desc: "The beginning. Two halves cracking open.", file: "/images/logo-stages/stage-01-seed.png" },
            { stage: 2, label: "Shoots", desc: "First growth pushing upward.", file: "/images/logo-stages/stage-02-shoots.png" },
            { stage: 3, label: "Sapling", desc: "Taking shape. First branches.", file: "/images/logo-stages/stage-03-sapling.png" },
            { stage: 4, label: "Mature", desc: "Full form. Strong and established.", file: "/images/logo-stages/stage-04-mature.png" },
            { stage: 5, label: "Fruit", desc: "Bearing fruit. Abundance.", file: "/images/logo-stages/stage-05-fruit.png" },
            { stage: 6, label: "Return", desc: "Shedding. Returning to earth.", file: "/images/logo-stages/stage-06-return.png" },
          ].map((s) => (
            <div key={s.stage} style={{ textAlign: "center" }}>
              <div style={{
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(28,25,23,0.03)",
                borderRadius: 12,
                marginBottom: 12,
                border: s.stage === 1 ? `2px solid ${GOLDEN_HOUR}40` : "1px solid rgba(28,25,23,0.06)",
              }}>
                <img src={s.file} alt={s.label} style={{ width: "70%", height: "auto" }} />
              </div>
              <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 13, letterSpacing: "0.08em" }}>
                {s.label}
              </div>
              <div style={{ fontFamily: fonts.body, fontSize: 12, opacity: 0.4, marginTop: 2 }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== PART 4: THE INVITATION ===== */}
      <div style={{
        marginTop: 48,
        padding: "32px 0",
        borderTop: `1px solid rgba(28,25,23,0.06)`,
        textAlign: "center",
      }}>
        <p style={eyebrowStyle}>WHAT'S NEXT</p>
        <p style={{
          ...narrativeTextStyle,
          maxWidth: 440,
          margin: "16px auto",
          opacity: 0.5,
        }}>
          The seasonal H, the growing H, the alchemical H — they're not separate ideas.
          They're the same logo seen through different lenses. A logo that changes with
          the land, grows like something planted, and transforms what passes through it.
        </p>
        <p style={{
          ...narrativeTextStyle,
          fontStyle: "italic",
          opacity: 0.3,
          marginTop: 24,
        }}>
          This page will keep growing. Come back and see what's changed.
        </p>
      </div>

      {/* Back link */}
      <div style={{ textAlign: "center", padding: "40px 0 24px", opacity: 0.2 }}>
        <a href="/" style={{ fontFamily: fonts.display, fontSize: 11, letterSpacing: "0.1em", color: colors.shed, textDecoration: "none" }}>
          ← BACK TO THE HARVEST
        </a>
      </div>
    </div>
  );
}

/* -----------------------------------------------
   STYLES
   ----------------------------------------------- */

const pageStyle: CSSProperties = {
  backgroundColor: colors.milk,
  color: colors.shed,
  minHeight: "100vh",
  padding: "48px 24px",
  maxWidth: 640,
  margin: "0 auto",
};

const eyebrowStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 11,
  letterSpacing: "0.2em",
  opacity: 0.35,
  margin: "0 0 8px",
};

const titleStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 36,
  letterSpacing: "-0.02em",
  margin: "0 0 8px",
};

const subtitleStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 16,
  opacity: 0.45,
  margin: 0,
};

const logoContainerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  padding: "16px 0 40px",
};

const logoImageStyle: CSSProperties = {
  width: "100%",
  maxWidth: 480,
  borderRadius: 12,
};

const narrativeStyle: CSSProperties = {
  padding: "0 0 32px",
  borderBottom: `1px solid rgba(28,25,23,0.06)`,
};

const narrativeTextStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 16,
  lineHeight: 1.8,
  margin: "0 0 14px",
  opacity: 0.6,
};

const pieceRowStyle: CSSProperties = {
  padding: "0 0 4px",
};

const pieceLabelStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 17,
  margin: 0,
};

const pieceSubStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 13,
  opacity: 0.5,
  margin: "2px 0 8px",
};

const pieceTextStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 15,
  lineHeight: 1.75,
  margin: 0,
  opacity: 0.6,
};

const dividerStyle: CSSProperties = {
  height: 1,
  backgroundColor: "rgba(28,25,23,0.06)",
  margin: "20px 0",
};

const colorSectionStyle: CSSProperties = {
  padding: "32px 0",
  borderTop: `1px solid rgba(28,25,23,0.06)`,
  textAlign: "center",
};

const swatchRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 28,
  flexWrap: "wrap",
  marginTop: 16,
};

const processSectionStyle: CSSProperties = {
  marginTop: 48,
  padding: "40px 0 0",
  borderTop: `1px solid rgba(28,25,23,0.06)`,
};

const directionCardStyle: CSSProperties = {
  padding: "0 0 8px",
};
