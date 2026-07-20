import { useState, type CSSProperties } from "react";
import { colors, fonts } from "../styles/brand";

/* -----------------------------------------------
   THE HARVEST — Logo System
   The H in "HARVEST" IS the living mark.
   ----------------------------------------------- */

const RAMMED_EARTH = colors.rammedEarth;
const CANOPY       = colors.canopy;
const GOLDEN_HOUR  = colors.goldenHour;
const CRANE        = colors.crane;

/* -- Data -- */

interface Stage {
  id: number;
  label: string;
  desc: string;
  file: string;
  prompt: string;
}

const PROMPT_PREFIX = `Lettermark logo of the capital letter H. Ink-on-paper aesthetic — the strokes feel like they were drawn with a brush or nib on good paper. Wabi-sabi: intentionally impermanent, never quite finished, beautiful in incompleteness. NOT illustrative, NOT cartoon, NOT literal, NOT distressed/grunge. Think calligraphic mark that a master drew once and walked away. Strokes taper, thin at edges, some trails fade before completing. Uses only these exact colors for the structural elements: posts/verticals #B58B70 (warm earth), bottom horizontal #4A6741 (deep green), middle horizontal #C4922A (golden amber), top horizontal #8B4A2A (rusty brown). IMPORTANT: Output as PNG with FULLY TRANSPARENT background — no white, no paper texture, no background at all. Just the ink strokes floating on transparency. No text, no extra elements. The H should be clearly readable as the letter H at any size. Must work at 16px and on a billboard.`;

const stages: Stage[] = [
  {
    id: 1, label: "Seed", file: "/images/logo-stages/stage-01-seed.png",
    desc: "The beginning. Two halves of a seed cracking open in dark soil. Everything starts here — invisible, underground, waiting.",
    prompt: `${PROMPT_PREFIX} STAGE: Seed. The H is barely there — two faint vertical ink strokes in #B58B70 (warm earth), tentative, emerging upward from a single soft seed-like form at the base. The strokes taper to almost nothing at the top, like the first marks of a pen touching paper. No crossbars yet — just the ghost of potential. The seed shape at the bottom carries the faintest hint of #4A6741 (deep green) and #C4922A (golden amber), dormant, as a soft wash. The ink feels fresh, just laid down, still wet. Feels like the very first brushstroke of something that doesn't know what it will become yet. The mark should feel like one confident gesture — a master calligrapher touched brush to paper once and walked away.`,
  },
  {
    id: 2, label: "Shoots", file: "/images/logo-stages/stage-02-shoots.png",
    desc: "First growth pushing upward. Thin, fragile, reaching for light. The posts appear — two stems finding their way.",
    prompt: `${PROMPT_PREFIX} STAGE: Shoots. Two thin vertical strokes in #B58B70 (warm earth) — the posts — drawn with a confident but light hand. They have gentle organic curve, like young stems reaching upward. One faint horizontal ink stroke near the base connects them in #4A6741 (deep green) — the first crossbar forming, barely there, like a root bridge drawn with a nearly dry brush. The verticals are thin, not yet strong. The ink tapers and fades at the extremities. Delicate, young, reaching for light. The mark should feel like two brushstrokes and a whisper — a master calligrapher's hand, light and unhurried.`,
  },
  {
    id: 3, label: "Sapling", file: "/images/logo-stages/stage-03-sapling.png",
    desc: "Taking shape. The first crossbar connects the posts — roots finding each other underground. The structure emerges.",
    prompt: `${PROMPT_PREFIX} STAGE: Sapling. The H is taking clear form — two vertical strokes in #B58B70 (warm earth) with more weight now, drawn with increasing confidence. Two crossbars visible: the bottom in #4A6741 (deep green) is solid, the middle in #C4922A (golden amber) is emerging — a brushstroke that starts strong on the left and fades as it crosses to the right, not quite complete. The top bar in #8B4A2A (rusty brown) is just a whisper — a thin ink trail that suggests where it will eventually appear. The joints where bars meet posts have the slight pooling of ink you get when a brush pauses. The structure is emerging but the ink still carries impermanence.`,
  },
  {
    id: 4, label: "Mature", file: "/images/logo-stages/stage-04-mature.png",
    desc: "Full form. Strong posts, three bars, the colors locked in. This is the H at its most complete — the building standing on the ridge.",
    prompt: `${PROMPT_PREFIX} STAGE: Mature. The most complete the H will ever be, but still carrying ink-on-paper impermanence. Two strong vertical posts in #B58B70 (warm earth), drawn with a confident full brush. Three horizontal bars clearly visible: bottom #4A6741 (deep green), middle #C4922A (golden amber), top #8B4A2A (rusty brown). Even at maturity, the strokes have life — slight taper at the ends, the organic variation of hand-drawn marks. Not perfectly geometric. The ink is richest here, the colours at full saturation. Fully formed but still clearly made by a human hand, still ink on paper, still impermanent. One confident gesture that holds all the parts.`,
  },
  {
    id: 5, label: "Fruit", file: "/images/logo-stages/stage-05-fruit.png",
    desc: "Bearing fruit. Abundance spilling from the bars — produce, art, connection. The H is heavy with what it's grown.",
    prompt: `${PROMPT_PREFIX} STAGE: Fruit. The mature H but heavy with abundance. The brushstrokes are at their thickest and most saturated — the ink pooling with generosity. Posts in #B58B70 (warm earth) at full weight. Three crossbars slightly fuller than mature: bottom #4A6741 (deep green), middle #C4922A (golden amber), top #8B4A2A (rusty brown) — all richer, deeper. Very subtle extensions at the ends of the bars — not literal fruit, but the way ink bleeds slightly when the brush is loaded with too much, the beautiful excess of abundance. Small ink drops or gentle bleeds near the bars suggest things spilling over. Heavy, generous, overflowing. Still elegant, still a mark, but at the moment of maximum giving.`,
  },
  {
    id: 6, label: "Return", file: "/images/logo-stages/stage-06-return.png",
    desc: "Shedding. The bars thin. Leaves fall. But the posts remain — the building endures. Compost feeds the next cycle.",
    prompt: `${PROMPT_PREFIX} STAGE: Return. The H is letting go. The posts remain in #B58B70 (warm earth) — drawn with a steady hand, still solid. But the crossbars are fading: the top #8B4A2A (rusty brown) is barely a ghost, the middle #C4922A (golden amber) lighter, the bottom #4A6741 (deep green) thinning. The brush was running dry. A few small marks drift downward from where the bars were — not literal leaves, but the way ink fragments when a stroke is ending, tiny drops falling. The colours are desaturated, fading toward grey. But the posts hold. The mark is becoming less, gracefully, peacefully — not erased but returning. Making space for the next seed. The most wabi-sabi of all the stages.`,
  },
];

/* -- Wordmark lettering: LOCKED — "Never Done" direction -- */

const LETTERING_PREFIX = `Custom hand-lettered wordmark reading "THE HARVEST" in all uppercase. IMPORTANT: Output as PNG with FULLY TRANSPARENT background — no white, no paper texture, no background at all. Just the ink letterforms floating on transparency. This is NOT a font — it's custom lettering designed for this specific brand. The letters should feel cohesive as a set but carry the specific character described below. The H in HARVEST should be noticeably different from the other letters — it's the living mark, the only letter that changes. Show both lines: "THE" on top (smaller), "HARVEST" below (larger). Black or very dark brown (#1C1917) letterforms.`;

const WORDMARK_LETTERING = {
  name: "Never Done",
  philosophy: "Nothing here is finished. Everything is always becoming.",
  description: "Letters that feel like they're still forming — or gently dissolving. Not broken or distressed, but in process. Strokes that taper into nothing at the edges. Gaps where you expect connections. The suggestion that these letterforms arrived a moment ago and might shift again tomorrow. The beauty of impermanence: not decay, but the honesty of things that are alive and therefore always changing. Wabi-sabi applied to typography — the Japanese understanding that beauty lives in incompleteness, impermanence, and imperfection.",
  prompt: `${LETTERING_PREFIX} DIRECTION: Impermanence / Never Done. Elegant letterforms that feel like they are still being drawn — or are gently fading at the edges. Some strokes taper into nothing before they're complete. Small, intentional gaps appear where strokes would normally connect — the A's crossbar is a breath, not a line. The T's crossbar trails off. But the overall word is still perfectly legible and beautiful. Think of ink on wet paper that stops just before the pen lifts — or a sand drawing at the edge of the tide. NOT distressed, NOT grunge, NOT eroded. This is intentional incompleteness — the Japanese concept of wabi-sabi applied to typography. The letters are at peace with being unfinished. Elegant, quiet, breathtaking in their restraint. The H in HARVEST should be the most "complete" letter — it's the living mark, the heart — while the surrounding letters carry more of the impermanent quality.`,
  image: "/images/wordmark-never-done.png",
};

interface ColorStory {
  label: string;
  hex: string;
  part: string;
  zone: string;
  origin: string;
  story: string;
}

const colorStories: ColorStory[] = [
  {
    label: "Rammed Earth",
    hex: RAMMED_EARTH,
    part: "The Posts",
    zone: "The Place",
    origin: "9 Gumland Drive, Witta",
    story: "The rammed earth walls of the building itself. Not chosen from a palette — sampled from the walls that have stood on this ridge for decades. Two posts, like two hands holding the frame together. The colour of the place. The thing that doesn't move.",
  },
  {
    label: "Canopy",
    hex: CANOPY,
    part: "Bottom Bar",
    zone: "Garden \u00b7 Grow",
    origin: "Jinibara Country \u00b7 Blackall Range",
    story: "What was here before any of us and will be here after. The eucalyptus canopy seen from the ridge. The paddock grass after rain. Jinibara Country — the land this place sits on, borrowed, not owned. The bottom bar because the land is the foundation. Everything grows from it.",
  },
  {
    label: "Golden Hour",
    hex: GOLDEN_HOUR,
    part: "Middle Bar",
    zone: "Gather",
    origin: "Milk crates, shared tables, end-of-June opening",
    story: "Late afternoon on the ridge when the light turns everything to honey. The colour of shared tables, milk crates, food, questions, and people coming through the gate. Golden Hour carries the gathering promise, not a separate kitchen system.",
  },
  {
    label: "Crane",
    hex: CRANE,
    part: "Top Bar",
    zone: "Make",
    origin: "Barry's crane \u00b7 Corrugated iron patina",
    story: "Barry's crane, still standing in the yard. Rusted iron, corrugated patina, the colour of things that have been used hard and carry the marks. Not new, not polished. Crane carries Make: timber, tools, signs, repair, art, and the visible work of shaping the place.",
  },
];

/* -- Earth Layer -- */

const EARTH_PREFIX = `Horizontal decorative underline element for a logo. Ink-on-paper aesthetic matching a wabi-sabi brand identity. This represents the EARTH — soil, roots, mycelium — beneath a hand-lettered wordmark. The element should be roughly 5-6x wider than it is tall — a landscape strip. NOT a rectangle, NOT a straight line. Organic edges, like a cross-section of soil drawn with a loaded brush. Visible within: fine root threads, mycelium network hints, soil texture, tiny stones, organic matter. The stroke should feel like one confident horizontal gesture with a wide brush — thick in the centre, tapering at the edges. IMPORTANT: Output as PNG with FULLY TRANSPARENT background. No text, no other elements. Just the earth strip floating on transparency. Must work at small sizes (underline beneath text) and large sizes (hero element).`;

interface EarthVariant {
  id: string;
  label: string;
  season: string;
  desc: string;
  file: string;
  prompt: string;
  filter: string; // CSS filter for placeholder tinting
}

const earthVariants: EarthVariant[] = [
  {
    id: "base",
    label: "Base Earth",
    season: "Default",
    desc: "Rich, dark earth. Volcanic soil of the Blackall Range. Alive, full, holding everything. The ground state.",
    file: "/images/palette/rammed-earth.jpg",
    prompt: `${EARTH_PREFIX} DEFAULT STATE: Rich, dark earth. Warm brown tones (#3D2B1F to #5C4033). Subtle root threads in lighter brown weaving through. Faint mycelium network visible as very fine light lines — like a neural network in the soil. The ink is loaded, generous, earthy. A few tiny lighter spots suggest mineral deposits or small stones. This is the ground state — alive, full, holding everything. The earth of the Blackall Range, volcanic soil, rich and dark.`,
    filter: "none",
  },
  {
    id: "summer",
    label: "Summer Earth",
    season: "Summer",
    desc: "Dry, warm, cracked. Ochre and amber. The soil baking in hinterland sun. Honest, patient, waiting for rain.",
    file: "/images/palette/calendula.jpg",
    prompt: `${EARTH_PREFIX} SUMMER: Dry, warm earth baking in Queensland sun. Ochre and amber tones (#C4922A to #B58B70). Fine cracks visible in the surface — not broken, just dry. The ink feels drier, the brush strokes showing more paper through them. Root threads are deeper, pulled down looking for water. Mycelium less visible — dormant. The warmth of January on the ridge. Honest, patient, waiting for rain.`,
    filter: "sepia(0.3) saturate(1.3) brightness(1.1) hue-rotate(-5deg)",
  },
  {
    id: "autumn",
    label: "Autumn Earth",
    season: "Autumn",
    desc: "The richest earth — peak compost. Deep chocolate browns to near-black. Everything returning to it. Maximum fertility.",
    file: "/images/palette/rammed-earth.jpg",
    prompt: `${EARTH_PREFIX} AUTUMN: The richest earth — peak compost. Deep chocolate browns to near-black (#2C1810 to #4A3728). Decomposing organic matter visible as darker patches and textures within the stroke. This is the earth at maximum fertility — everything returning to it. Root threads thick and active. Mycelium at its most visible — fine white threads branching. Fallen leaf fragments, seed husks becoming soil. Heavy brush, loaded with ink, generous.`,
    filter: "sepia(0.4) saturate(0.8) brightness(0.8)",
  },
  {
    id: "winter",
    label: "Winter Earth",
    season: "Winter",
    desc: "Cool, structural, mineral earth. Quiet — not dead, dormant. Holding everything for spring.",
    file: "/images/palette/rammed-earth.jpg",
    prompt: `${EARTH_PREFIX} WINTER: Cool, structural, mineral earth. Grey-browns (#6B5B4F to #8B7D6B). The soil is quiet — not dead, dormant. Holding everything for spring. Root threads present but still. Mycelium dormant — very faint ghost lines. The brush stroke is lighter, less saturated — the earth taking a breath. A few small stones more visible now that the organic layer has thinned. The bones of the land showing through. Quiet. Holding.`,
    filter: "saturate(0.35) brightness(0.85) contrast(1.1)",
  },
  {
    id: "spring",
    label: "Spring Earth",
    season: "Spring",
    desc: "Things pushing through. Mycelium network glowing. The soil waking up, remembering what it's for.",
    file: "/images/palette/lilly-pilly.jpg",
    prompt: `${EARTH_PREFIX} SPRING: Things pushing through. Rich dark base (#3D2B1F) but with tiny bright green points breaking the surface — NOT literal plants, but the suggestion of emergence in ink. Small upward marks at the top edge of the stroke, like shoots drawn with the tip of a fine brush in #4A6741 (canopy green). Mycelium network glowing — the finest light threads visible and active, branching, connecting. The soil feels energised, waking up. Root threads reaching upward. The most alive version — the earth remembering what it's for.`,
    filter: "saturate(1.1) brightness(1.05) hue-rotate(10deg)",
  },
];

const seasons = [
  { label: "Summer",  note: "Warm golden light on the ridge. Long tables outside. The garden at full volume.",  filter: "sepia(0.15) saturate(1.2) brightness(1.05)" },
  { label: "Autumn",  note: "Deeper earth, amber and ochre. Harvest time. Things slowing, ripening, falling.",  filter: "sepia(0.3) saturate(0.9) brightness(0.95) hue-rotate(-10deg)" },
  { label: "Winter",  note: "Cool, structural, quiet. The bones of the place. Hands around warm cups.",         filter: "saturate(0.4) brightness(0.9) contrast(1.1)" },
  { label: "Spring",  note: "Fresh green pushing through. Seeds in jars. A child's drawing on the wall.",       filter: "saturate(1.1) brightness(1.05) hue-rotate(15deg)" },
];


/* -----------------------------------------------
   WORDMARK — "Never Done" ink lettering
   Uses the actual generated wordmark image.
   light=true inverts for dark backgrounds.
   ----------------------------------------------- */

function Wordmark({ height = 80, light = false, style }: { height?: number; light?: boolean; style?: CSSProperties }) {
  return (
    <img
      src={WORDMARK_LETTERING.image}
      alt="THE HARVEST"
      style={{
        height,
        width: "auto",
        filter: light ? "brightness(0) invert(1)" : "none",
        ...style,
      }}
    />
  );
}

/* -----------------------------------------------
   LIVE WORDMARK
   The wordmark-no-h image + a stage H composited in.
   The H slot is ~18.5% from left, ~23% top, ~77% tall.
   ----------------------------------------------- */

function LiveWordmark({ hSrc, height = 80, light = false }: { hSrc: string; height?: number; light?: boolean }) {
  // These percentages match the H position in the original 1891x691 image
  const hLeft = 0;          // H starts at left edge
  const hTop = 23;          // % from top where HARVEST line starts
  const hWidth = 18.5;      // % of total width the H occupies
  const hHeight = 77;       // % of total height

  const filterStyle = light ? "brightness(0) invert(1)" : "none";

  return (
    <div style={{
      position: "relative",
      height,
      width: height * (1891 / 691), // maintain aspect ratio
    }}>
      {/* Wordmark without H */}
      <img
        src="/images/wordmark-no-h.png"
        alt="THE _ARVEST"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          filter: filterStyle,
        }}
      />
      {/* Stage H slotted in */}
      <img
        src={hSrc}
        alt="H"
        style={{
          position: "absolute",
          left: `${hLeft}%`,
          top: `${hTop}%`,
          width: `${hWidth}%`,
          height: `${hHeight}%`,
          objectFit: "contain",
          filter: filterStyle,
        }}
      />
    </div>
  );
}

/* -----------------------------------------------
   STACKED LOGO
   H mark on top, wordmark image below.
   ----------------------------------------------- */

function StackedLogo({ hSrc, height = 80, light = false }: { hSrc: string; height?: number; light?: boolean }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: height * 0.2,
    }}>
      <img
        src={hSrc}
        alt="H mark"
        style={{
          height: height * 1.2,
          width: "auto",
          filter: light ? "brightness(0) invert(1)" : "none",
        }}
      />
      <Wordmark height={height * 0.45} light={light} />
    </div>
  );
}


/* -----------------------------------------------
   GROUNDED LOGO
   H mark + wordmark + earth underline stacked.
   The full brand lockup with earth layer.
   ----------------------------------------------- */

function GroundedLogo({
  hSrc,
  earthFilter = "none",
  height = 80,
  light = false,
}: {
  hSrc: string;
  earthFilter?: string;
  height?: number;
  light?: boolean;
}) {
  // Earth placeholder — a CSS-drawn organic soil strip
  // Will be replaced with actual PNG once generated
  const earthHeight = height * 0.12;
  const earthWidth = height * (1891 / 691) * 1.05; // slightly wider than wordmark

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 0,
    }}>
      <StackedLogo hSrc={hSrc} height={height} light={light} />
      <div style={{
        width: earthWidth,
        height: earthHeight,
        marginTop: height * 0.08,
        borderRadius: earthHeight / 2,
        background: light
          ? `linear-gradient(90deg, transparent 0%, rgba(245,240,232,0.15) 15%, rgba(245,240,232,0.35) 35%, rgba(245,240,232,0.4) 50%, rgba(245,240,232,0.35) 65%, rgba(245,240,232,0.15) 85%, transparent 100%)`
          : `linear-gradient(90deg, transparent 0%, rgba(61,43,31,0.2) 15%, rgba(61,43,31,0.5) 35%, rgba(61,43,31,0.65) 50%, rgba(61,43,31,0.5) 65%, rgba(61,43,31,0.2) 85%, transparent 100%)`,
        filter: earthFilter,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Texture hint — tiny root/mycelium lines */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: light
            ? `repeating-linear-gradient(87deg, transparent, transparent 8px, rgba(245,240,232,0.08) 8px, rgba(245,240,232,0.08) 9px)`
            : `repeating-linear-gradient(87deg, transparent, transparent 8px, rgba(61,43,31,0.12) 8px, rgba(61,43,31,0.12) 9px)`,
          borderRadius: earthHeight / 2,
        }} />
      </div>
    </div>
  );
}


/* -----------------------------------------------
   CSS H MARK (pure CSS — for color diagrams)
   ----------------------------------------------- */

function HMark({ size = 120, style }: { size?: number; style?: CSSProperties }) {
  const postW = size * 0.16;
  const barH  = size * 0.10;
  const gap   = size * 0.06;
  const innerW = size - postW * 2 - gap * 2;

  return (
    <div style={{
      position: "relative",
      width: size,
      height: size,
      ...style,
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: postW, height: size, backgroundColor: RAMMED_EARTH, borderRadius: 2 }} />
      <div style={{ position: "absolute", right: 0, top: 0, width: postW, height: size, backgroundColor: RAMMED_EARTH, borderRadius: 2 }} />
      <div style={{ position: "absolute", left: postW + gap, bottom: size * 0.15, width: innerW, height: barH, backgroundColor: CANOPY, borderRadius: 2 }} />
      <div style={{ position: "absolute", left: postW + gap, top: "50%", transform: "translateY(-50%)", width: innerW, height: barH, backgroundColor: GOLDEN_HOUR, borderRadius: 2 }} />
      <div style={{ position: "absolute", left: postW + gap, top: size * 0.15, width: innerW, height: barH, backgroundColor: CRANE, borderRadius: 2 }} />
    </div>
  );
}


/* -----------------------------------------------
   PAGE
   ----------------------------------------------- */

export default function LogoStory() {
  const [activeStage, setActiveStage] = useState(0); // Seed by default
  const [expandedColor, setExpandedColor] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ backgroundColor: colors.milk, color: colors.shed, minHeight: "100vh" }}>

      {/* ===== 0. CURRENT LOGO ===== */}
      <section style={heroStyle}>
        <p style={heroEyebrow}>CURRENT LOGO SYSTEM</p>
        <h1 style={{
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: 56,
          letterSpacing: "0.08em",
          lineHeight: 0.95,
          margin: "0 0 18px",
          textAlign: "center",
        }}>
          THE ROOT WORDMARK
        </h1>
        <p style={{ ...heroTagline, marginTop: 0, marginBottom: 48, opacity: 0.5 }}>
          Witta · Jinibara Country · Garden opening end of June<br />
          Grow. Make. Gather.
        </p>

        {/* Dark on light */}
        <div style={{
          backgroundColor: colors.milk,
          borderRadius: 20,
          padding: "56px 48px",
          marginBottom: 16,
          display: "flex",
          justifyContent: "center",
        }}>
          <img
            src="/images/logo-v1-dark-clean.png"
            alt="The Harvest — dark logo"
            style={{ height: 180, width: "auto", objectFit: "contain" }}
          />
        </div>
        <p style={{ fontFamily: fonts.body, fontSize: 12, opacity: 0.3, textAlign: "center", marginBottom: 32 }}>
          Dark — for light backgrounds
        </p>

        <div style={{
          margin: "0 auto 40px",
          maxWidth: 720,
          padding: "24px 28px",
          border: `1px solid rgba(28,25,23,0.1)`,
          backgroundColor: "rgba(28,25,23,0.03)",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: fonts.body,
            fontSize: 18,
            lineHeight: 1.7,
            margin: 0,
            opacity: 0.72,
          }}>
            The current mark is the approved wordmark with roots. It should support the plain public line:
            a community garden and creative gathering place taking shape in Witta.
          </p>
        </div>

        {/* Dark inverted on dark */}
        <div style={{
          backgroundColor: colors.shed,
          borderRadius: 20,
          padding: "56px 48px",
          marginBottom: 16,
          display: "flex",
          justifyContent: "center",
        }}>
          <img
            src="/images/logo-v1-dark-clean.png"
            alt="The Harvest — white logo"
            style={{ height: 180, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }}
          />
        </div>
        <p style={{ fontFamily: fonts.body, fontSize: 12, opacity: 0.3, textAlign: "center", marginBottom: 32 }}>
          White (inverted) — for dark backgrounds
        </p>

        {/* Colour on light */}
        <div style={{
          backgroundColor: colors.milk,
          borderRadius: 20,
          padding: "56px 48px",
          marginBottom: 16,
          border: `1px solid rgba(28,25,23,0.08)`,
          display: "flex",
          justifyContent: "center",
        }}>
          <img
            src="/images/logo-v1-colour-clean.png"
            alt="The Harvest — colour logo"
            style={{ height: 180, width: "auto", objectFit: "contain" }}
          />
        </div>
        <p style={{ fontFamily: fonts.body, fontSize: 12, opacity: 0.3, textAlign: "center", marginBottom: 32 }}>
          Colour — brand palette variant
        </p>

        {/* Colour on dark */}
        <div style={{
          backgroundColor: colors.shed,
          borderRadius: 20,
          padding: "56px 48px",
          marginBottom: 16,
          display: "flex",
          justifyContent: "center",
        }}>
          <img
            src="/images/logo-v1-colour-clean.png"
            alt="The Harvest — colour logo on dark"
            style={{ height: 180, width: "auto", objectFit: "contain" }}
          />
        </div>
        <p style={{ fontFamily: fonts.body, fontSize: 12, opacity: 0.3, textAlign: "center", marginBottom: 32 }}>
          Colour — on dark
        </p>

        {/* All three side by side */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginTop: 24,
        }}>
          {[
            { src: "/images/logo-v1-dark-clean.png", label: "Dark", bg: colors.milk, border: true, invert: false },
            { src: "/images/logo-v1-dark-clean.png", label: "White", bg: colors.shed, border: false, invert: true },
            { src: "/images/logo-v1-colour-clean.png", label: "Colour", bg: colors.milk, border: true, invert: false },
          ].map((v) => (
            <div key={v.label} style={{
              backgroundColor: v.bg,
              borderRadius: 16,
              padding: "32px 20px",
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              gap: 12,
              border: v.border ? `1px solid rgba(28,25,23,0.08)` : "none",
            }}>
              <img
                src={v.src}
                alt={`Logo — ${v.label}`}
                style={{ height: 80, width: "auto", objectFit: "contain", filter: v.invert ? "brightness(0) invert(1)" : "none" }}
              />
              <span style={{
                fontFamily: fonts.display,
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: "0.1em",
                opacity: 0.4,
                color: v.bg === colors.shed ? colors.milk : colors.shed,
              }}>
                {v.label.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 1. THE STORY ===== */}
      <section style={{
        ...heroStyle,
        backgroundColor: "rgba(28,25,23,0.03)",
        borderTop: `1px solid rgba(28,25,23,0.06)`,
        color: colors.shed,
      }}>
        <p style={{ ...heroEyebrow, opacity: 0.3 }}>CURRENT STORY</p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <img
            src="/images/logo-v1-dark-clean.png"
            alt="The Harvest wordmark with roots"
            style={{ height: 180, width: "auto", maxWidth: "90%", objectFit: "contain" }}
          />
        </div>
        <p style={{ ...heroTagline, color: colors.shed }}>
          The wordmark carries the place.<br />
          The roots keep it from becoming a generic venue brand.
        </p>
      </section>


      {/* ===== 2. THE IDEA ===== */}
      <section style={sectionStyle}>
        <p style={eyebrow}>THE CURRENT IDEA</p>
        <h2 style={sectionTitle}>The mark should feel grown, not decorated.</h2>
        <p style={sectionSub}>
          The Harvest does not need a clever symbol sitting beside the name. It needs a wordmark
          that feels like it comes out of soil, timber, milk crates, and hands on the place.
        </p>
        <p style={{ ...sectionSub, marginTop: 16 }}>
          Current public spine: <strong>Grow. Make. Gather.</strong> The logo should support that
          line quietly. It should not introduce another system people need to learn.
        </p>

        {/* Show the lockup on light and dark */}
        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            backgroundColor: colors.shed,
            borderRadius: 16,
            padding: "48px 32px",
            display: "flex",
            justifyContent: "center",
          }}>
            <img
              src="/images/logo-v1-dark-clean.png"
              alt="The Harvest wordmark on dark"
              style={{ height: 120, width: "auto", maxWidth: "90%", objectFit: "contain", filter: "brightness(0) invert(1)" }}
            />
          </div>
          <div style={{
            backgroundColor: colors.milk,
            borderRadius: 16,
            padding: "48px 32px",
            display: "flex",
            justifyContent: "center",
            border: `1px solid rgba(28,25,23,0.08)`,
          }}>
            <img
              src="/images/logo-v1-dark-clean.png"
              alt="The Harvest wordmark on light"
              style={{ height: 120, width: "auto", maxWidth: "90%", objectFit: "contain" }}
            />
          </div>
        </div>
      </section>


      {/* ===== 3. ARCHIVED STACKED LOGO ===== */}
      <section style={{
        ...sectionStyle,
        maxWidth: "none",
        padding: "72px 24px",
        borderTop: `1px solid rgba(28,25,23,0.06)`,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>ARCHIVED EXPLORATION</p>
          <h2 style={sectionTitle}>Stacked H mark.</h2>
          <p style={sectionSub}>
            This was an early direction for square formats and signage. It is not the current
            production logo. Use the approved root wordmark above unless Ben or Nic explicitly
            revive this exploration.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginTop: 48,
          }}>
            {/* Dark version */}
            <div style={{
              backgroundColor: colors.shed,
              borderRadius: 20,
              padding: "56px 32px 48px",
              display: "flex",
              justifyContent: "center",
            }}>
              <StackedLogo hSrc={stages[0].file} height={100} light />
            </div>
            {/* Light version */}
            <div style={{
              backgroundColor: colors.milk,
              borderRadius: 20,
              padding: "56px 32px 48px",
              display: "flex",
              justifyContent: "center",
              border: `1px solid rgba(28,25,23,0.08)`,
            }}>
              <StackedLogo hSrc={stages[0].file} height={100} />
            </div>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 12,
          }}>
            <span style={{ fontFamily: fonts.body, fontSize: 12, opacity: 0.3 }}>Dark</span>
            <span style={{ fontFamily: fonts.body, fontSize: 12, opacity: 0.15 }}>/</span>
            <span style={{ fontFamily: fonts.body, fontSize: 12, opacity: 0.3 }}>Light</span>
          </div>

          {/* Smaller stacked variants row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginTop: 32,
          }}>
            {[
              { bg: RAMMED_EARTH, label: "Rammed Earth" },
              { bg: CANOPY, label: "Canopy" },
              { bg: colors.hardwood, label: "Hardwood" },
            ].map((v) => (
              <div key={v.label} style={{
                backgroundColor: v.bg,
                borderRadius: 16,
                padding: "36px 20px 28px",
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center",
                gap: 8,
              }}>
                <StackedLogo hSrc={stages[0].file} height={56} light />
                <span style={{
                  fontFamily: fonts.body,
                  fontSize: 10,
                  color: colors.milk,
                  opacity: 0.35,
                  marginTop: 4,
                }}>
                  {v.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ===== 4. THE LIVING H — ARCHIVE ===== */}
      <section style={{
        ...sectionStyle,
        maxWidth: "none",
        padding: "80px 24px",
        backgroundColor: "rgba(28,25,23,0.025)",
        borderTop: `1px solid rgba(28,25,23,0.06)`,
        borderBottom: `1px solid rgba(28,25,23,0.06)`,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>ARCHIVED EXPLORATION · THE LIVING H</p>
          <h2 style={{ ...sectionTitle, fontSize: 36 }}>Useful thinking. Not the current logo.</h2>
          <p style={sectionSub}>
            This lifecycle system helped find the soil, growth, season, and incompleteness ideas.
            It is now archive material. Do not use the changing H stages on the website, signs,
            social assets, or public launch material unless the logo system is reopened.
          </p>

          {/* Stage selector — large pills */}
          <div style={stageNav}>
            {stages.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveStage(i)}
                style={{
                  ...stageBtn,
                  backgroundColor: activeStage === i ? colors.shed : "transparent",
                  color: activeStage === i ? colors.milk : colors.shed,
                  borderColor: activeStage === i ? colors.shed : "rgba(28,25,23,0.15)",
                }}
              >
                {s.id}. {s.label}
              </button>
            ))}
          </div>

          {/* Large display — the star of the show */}
          <div style={stageDisplay}>
            <div style={stageImageWrap}>
              <img
                src={stages[activeStage].file}
                alt={stages[activeStage].label}
                style={{ height: 240, width: "auto", maxWidth: "80%" , objectFit: "contain" }}
              />
            </div>
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <div style={stageLabel}>
                Stage {stages[activeStage].id} — {stages[activeStage].label}
              </div>
              <p style={stageDesc}>{stages[activeStage].desc}</p>
            </div>
          </div>

          {/* Generation prompt */}
          <div style={promptBlock}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={promptLabel}>ARCHIVE PROMPT — {stages[activeStage].label.toUpperCase()}</span>
              <button
                onClick={() => copyPrompt(stages[activeStage].prompt, `stage-${activeStage}`)}
                style={copyBtn}
              >
                {copiedId === `stage-${activeStage}` ? "Copied" : "Copy"}
              </button>
            </div>
            <p style={promptText}>{stages[activeStage].prompt}</p>
          </div>

          {/* The word with the active H */}
          <div style={{
            marginTop: 40,
            padding: "32px 24px",
            backgroundColor: colors.shed,
            borderRadius: 16,
            display: "flex",
            justifyContent: "center",
          }}>
            <LiveWordmark hSrc={stages[activeStage].file} height={56} light />
          </div>
          <p style={{
            fontFamily: fonts.body,
            fontSize: 13,
            opacity: 0.3,
            textAlign: "center",
            marginTop: 12,
          }}>
            Archived wordmark exploration with Stage {stages[activeStage].id}: {stages[activeStage].label}
          </p>

          {/* Wordmark prompt */}
          <div style={{ ...promptBlock, marginTop: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={promptLabel}>ARCHIVE WORDMARK LETTERING PROMPT</span>
              <button
                onClick={() => copyPrompt(WORDMARK_LETTERING.prompt, "wordmark")}
                style={copyBtn}
              >
                {copiedId === "wordmark" ? "Copied" : "Copy"}
              </button>
            </div>
            <p style={promptText}>{WORDMARK_LETTERING.prompt}</p>
          </div>
        </div>
      </section>


      {/* ===== COLOR EXPLORATION — ARCHIVE ===== */}
      <section style={{
        ...sectionStyle,
        maxWidth: "none",
        padding: "80px 24px",
        borderTop: `1px solid rgba(28,25,23,0.06)`,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>ARCHIVED COLOUR EXPLORATION</p>
          <h2 style={sectionTitle}>The seed in colour.</h2>
          <p style={sectionSub}>
            These tests belong to the archived living-H direction. The current colour system still matters,
            but production should use the approved dark, white, or colour root wordmark from the top of this page.
          </p>

          {/* Seed H in brand colors */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginTop: 48,
          }}>
            {[
              { label: "Rammed Earth", hex: RAMMED_EARTH, hue: 0, sat: 0.6, bright: 0.75 },
              { label: "Canopy", hex: CANOPY, hue: 90, sat: 0.5, bright: 0.55 },
              { label: "Golden Hour", hex: GOLDEN_HOUR, hue: 35, sat: 0.8, bright: 0.85 },
              { label: "Crane", hex: CRANE, hue: 15, sat: 0.6, bright: 0.6 },
            ].map((c) => (
              <div key={c.label} style={{ textAlign: "center" }}>
                <div style={{
                  backgroundColor: "rgba(28,25,23,0.03)",
                  borderRadius: 16,
                  padding: "32px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  aspectRatio: "1",
                }}>
                  <img
                    src={stages[0].file}
                    alt={`Seed H — ${c.label}`}
                    style={{
                      width: "70%",
                      height: "auto",
                      filter: `sepia(1) saturate(${c.sat}) brightness(${c.bright}) hue-rotate(${c.hue}deg)`,
                    }}
                  />
                </div>
                <div style={{
                  fontFamily: fonts.display,
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: "0.06em",
                  marginTop: 12,
                }}>
                  {c.label}
                </div>
                <div style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 11,
                  opacity: 0.3,
                  marginTop: 4,
                }}>
                  {c.hex}
                </div>
              </div>
            ))}
          </div>

          {/* Same on dark background */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginTop: 16,
          }}>
            {[
              { label: "Rammed Earth", hue: 0, sat: 0.6, bright: 0.75 },
              { label: "Canopy", hue: 90, sat: 0.5, bright: 0.55 },
              { label: "Golden Hour", hue: 35, sat: 0.8, bright: 0.85 },
              { label: "Crane", hue: 15, sat: 0.6, bright: 0.6 },
            ].map((c) => (
              <div key={c.label} style={{ textAlign: "center" }}>
                <div style={{
                  backgroundColor: colors.shed,
                  borderRadius: 16,
                  padding: "32px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  aspectRatio: "1",
                }}>
                  <img
                    src={stages[0].file}
                    alt={`Seed H — ${c.label} on dark`}
                    style={{
                      width: "70%",
                      height: "auto",
                      filter: `brightness(0) invert(1) sepia(1) saturate(${c.sat}) brightness(${c.bright}) hue-rotate(${c.hue}deg)`,
                    }}
                  />
                </div>
                <div style={{
                  fontFamily: fonts.body,
                  fontSize: 11,
                  opacity: 0.25,
                  marginTop: 8,
                }}>
                  On dark
                </div>
              </div>
            ))}
          </div>

          {/* Full ink (original) for comparison */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            marginTop: 40,
            padding: "40px 24px",
            borderTop: `1px solid rgba(28,25,23,0.06)`,
          }}>
            <div style={{ textAlign: "center" }}>
              <img src={stages[0].file} alt="Seed H — ink" style={{ height: 120, width: "auto" }} />
              <div style={{
                fontFamily: fonts.display,
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: "0.06em",
                marginTop: 12,
              }}>
                Original Ink
              </div>
              <div style={{
                fontFamily: fonts.body,
                fontSize: 12,
                opacity: 0.35,
                marginTop: 4,
              }}>
                The master mark. Colour is the exception.
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ===== THE LETTERING — ARCHIVE: "Never Done" ===== */}
      <section style={sectionStyle}>
        <p style={eyebrow}>ARCHIVED LETTERING EXPLORATION</p>
        <h2 style={sectionTitle}>{WORDMARK_LETTERING.name}.</h2>
        <p style={{
          fontFamily: fonts.body,
          fontSize: 20,
          fontStyle: "italic",
          opacity: 0.45,
          margin: "0 0 20px",
          lineHeight: 1.6,
        }}>
          "{WORDMARK_LETTERING.philosophy}"
        </p>

        {/* The wordmark image — hero moment */}
        <div style={{
          margin: "40px 0",
          borderRadius: 20,
          overflow: "hidden",
          border: `1px solid rgba(28,25,23,0.06)`,
        }}>
          <img
            src={WORDMARK_LETTERING.image}
            alt="THE HARVEST — Never Done wordmark"
            style={{ width: "100%", display: "block" }}
          />
        </div>

        <p style={{
          fontFamily: fonts.body,
          fontSize: 16,
          lineHeight: 1.8,
          opacity: 0.6,
          margin: "0 0 24px",
          maxWidth: 560,
        }}>
          {WORDMARK_LETTERING.description}
        </p>

        <p style={{
          fontFamily: fonts.body,
          fontSize: 15,
          lineHeight: 1.8,
          opacity: 0.5,
          margin: "0 0 32px",
          maxWidth: 560,
        }}>
          This helped define the right feeling: alive, imperfect, not polished. It is not the
          current production wordmark. The approved root wordmark above is the one to use.
        </p>

        {/* Generation prompt */}
        <div style={promptBlock}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={promptLabel}>ARCHIVE GENERATION PROMPT</span>
            <button
              onClick={() => copyPrompt(WORDMARK_LETTERING.prompt, "lettering")}
              style={copyBtn}
            >
              {copiedId === "lettering" ? "Copied" : "Copy"}
            </button>
          </div>
          <p style={promptText}>{WORDMARK_LETTERING.prompt}</p>
        </div>
      </section>


      {/* ===== THE COLORS — DEEP STORY ===== */}
      <section style={{ ...sectionStyle, maxWidth: 760 }}>
        <p style={eyebrow}>THE CURRENT COLOURS</p>
        <h2 style={sectionTitle}>Nothing is decoration. Every colour is a place, a person, a decision.</h2>
        <p style={sectionSub}>
          These aren't brand colours picked from a mood board. Each one was sampled from something
          real: a wall, a tree, a rusted crane, the light at a specific hour. In current public use,
          they support Grow, Make, and Gather. They do not create a separate old room-based
          brand system.
        </p>

        {/* The H diagram */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          margin: "56px 0 48px",
        }}>
          <div style={{ position: "relative" }}>
            <HMark size={180} />
            <div style={{
              position: "absolute", left: "100%", top: 0, marginLeft: 28,
              display: "flex", flexDirection: "column" as const, justifyContent: "space-between", height: "100%",
            }}>
              <div style={colorLabelStyle}><span style={{ ...colorDot, backgroundColor: CRANE }} /> Crane &middot; Top</div>
              <div style={colorLabelStyle}><span style={{ ...colorDot, backgroundColor: GOLDEN_HOUR }} /> Golden Hour &middot; Middle</div>
              <div style={colorLabelStyle}><span style={{ ...colorDot, backgroundColor: CANOPY }} /> Canopy &middot; Bottom</div>
            </div>
            <div style={{
              position: "absolute", right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: 28,
              textAlign: "right" as const,
            }}>
              <div style={colorLabelStyle}>Posts &middot; Rammed Earth <span style={{ ...colorDot, backgroundColor: RAMMED_EARTH }} /></div>
            </div>
          </div>
        </div>

        {/* Color stories — expandable cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {colorStories.map((c, i) => {
            const isOpen = expandedColor === i;
            return (
              <div key={c.hex}>
                <button
                  onClick={() => setExpandedColor(isOpen ? null : i)}
                  style={colorCardHeader}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
                    <div style={{
                      width: 48, height: 48,
                      borderRadius: 8,
                      backgroundColor: c.hex,
                      flexShrink: 0,
                    }} />
                    <div style={{ textAlign: "left" }}>
                      <div style={{
                        fontFamily: fonts.display,
                        fontWeight: 800,
                        fontSize: 16,
                        letterSpacing: "0.02em",
                      }}>
                        {c.label}
                      </div>
                      <div style={{
                        fontFamily: fonts.body,
                        fontSize: 13,
                        opacity: 0.4,
                        marginTop: 2,
                      }}>
                        {c.part} &rarr; {c.zone}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 13,
                      opacity: 0.3,
                    }}>
                      {c.hex}
                    </span>
                    <span style={{
                      fontSize: 18,
                      opacity: 0.3,
                      transition: "transform 0.2s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}>
                      &#9662;
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div style={colorCardBody}>
                    <div style={{
                      fontFamily: fonts.display,
                      fontWeight: 700,
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      opacity: 0.35,
                      marginBottom: 12,
                    }}>
                      ORIGIN: {c.origin}
                    </div>
                    <p style={{
                      fontFamily: fonts.body,
                      fontSize: 15,
                      lineHeight: 1.8,
                      margin: 0,
                      opacity: 0.65,
                    }}>
                      {c.story}
                    </p>
                  </div>
                )}

                {i < colorStories.length - 1 && (
                  <div style={{ height: 1, backgroundColor: "rgba(28,25,23,0.06)" }} />
                )}
              </div>
            );
          })}
        </div>

        <p style={{
          fontFamily: fonts.body,
          fontSize: 14,
          fontStyle: "italic",
          opacity: 0.35,
          textAlign: "center",
          marginTop: 32,
        }}>
          The colours support the current root wordmark and the Grow. Make. Gather. public spine.
        </p>
      </section>


      {/* ===== 5. SEASONAL LAYER — ARCHIVE ===== */}
      <section style={sectionStyle}>
        <p style={eyebrow}>ARCHIVED SEASONAL LAYER</p>
        <h2 style={sectionTitle}>Same thought. Not a production logo system.</h2>
        <p style={sectionSub}>
          The seasonal idea is useful brand memory, but the current production logo does not change
          through seasonal H marks. Use seasons in photography, captions, and colour restraint instead.
        </p>

        <div style={seasonGrid}>
          {seasons.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={seasonCard}>
                <div style={{ filter: s.filter }}>
                  <HMark size={72} />
                </div>
              </div>
              <div style={{
                fontFamily: fonts.display,
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: "0.08em",
                marginTop: 14,
              }}>
                {s.label}
              </div>
              <div style={{
                fontFamily: fonts.body,
                fontSize: 12,
                opacity: 0.4,
                marginTop: 6,
                maxWidth: 160,
                margin: "6px auto 0",
                lineHeight: 1.5,
              }}>
                {s.note}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ===== 6. THE EARTH — ARCHIVE ===== */}
      <section style={{
        ...sectionStyle,
        maxWidth: "none",
        padding: "80px 24px",
        backgroundColor: "rgba(28,25,23,0.025)",
        borderTop: `1px solid rgba(28,25,23,0.06)`,
        borderBottom: `1px solid rgba(28,25,23,0.06)`,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrow}>ARCHIVED EARTH LAYER</p>
          <h2 style={{ ...sectionTitle, fontSize: 36 }}>The ground beneath.</h2>
          <p style={sectionSub}>
            The soil idea survived. The generated underline system did not become the current production
            logo. Treat this as archived exploration. The approved root wordmark already carries the ground.
          </p>

          {/* The concept — grounded lockup */}
          <div style={{
            marginTop: 48,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}>
            <div style={{
              backgroundColor: colors.shed,
              borderRadius: 20,
              padding: "56px 32px 48px",
              display: "flex",
              justifyContent: "center",
            }}>
              <GroundedLogo hSrc={stages[0].file} height={100} light />
            </div>
            <div style={{
              backgroundColor: colors.milk,
              borderRadius: 20,
              padding: "56px 32px 48px",
              display: "flex",
              justifyContent: "center",
              border: `1px solid rgba(28,25,23,0.08)`,
            }}>
              <GroundedLogo hSrc={stages[0].file} height={100} />
            </div>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 12,
          }}>
            <span style={{ fontFamily: fonts.body, fontSize: 12, opacity: 0.3 }}>Dark</span>
            <span style={{ fontFamily: fonts.body, fontSize: 12, opacity: 0.15 }}>/</span>
            <span style={{ fontFamily: fonts.body, fontSize: 12, opacity: 0.3 }}>Light</span>
          </div>

          {/* Seasonal earth variants */}
          <div style={{ marginTop: 56 }}>
            <p style={{ ...eyebrow, marginBottom: 20 }}>SEASONAL VARIANTS</p>
            <p style={{ ...sectionSub, marginBottom: 36 }}>
              These variants are reference material only. Do not use them on current public assets.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 12,
            }}>
              {earthVariants.map((ev) => (
                <div key={ev.id} style={{ textAlign: "center" }}>
                  <div style={{
                    backgroundColor: colors.shed,
                    borderRadius: 16,
                    padding: "32px 12px 28px",
                    display: "flex",
                    justifyContent: "center",
                    aspectRatio: "3/4",
                    alignItems: "center",
                  }}>
                    <GroundedLogo
                      hSrc={stages[0].file}
                      earthFilter={ev.filter}
                      height={48}
                      light
                    />
                  </div>
                  <div style={{
                    fontFamily: fonts.display,
                    fontWeight: 800,
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    marginTop: 12,
                  }}>
                    {ev.season}
                  </div>
                  <div style={{
                    fontFamily: fonts.body,
                    fontSize: 11,
                    opacity: 0.35,
                    marginTop: 4,
                    lineHeight: 1.4,
                    maxWidth: 120,
                    margin: "4px auto 0",
                  }}>
                    {ev.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earth generation prompts */}
          <div style={{ marginTop: 56 }}>
            <p style={{ ...eyebrow, marginBottom: 8 }}>ARCHIVE GENERATION PROMPTS</p>
            <p style={{ ...sectionSub, marginBottom: 24 }}>
              Kept as a record of the exploration. Do not use these prompts for current production.
            </p>

            {/* Shared prefix */}
            <div style={promptBlock}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={promptLabel}>ARCHIVE EARTH PREFIX</span>
                <button
                  onClick={() => copyPrompt(EARTH_PREFIX, "earth-prefix")}
                  style={copyBtn}
                >
                  {copiedId === "earth-prefix" ? "Copied" : "Copy"}
                </button>
              </div>
              <p style={promptText}>{EARTH_PREFIX}</p>
            </div>

            {/* Individual variant prompts */}
            {earthVariants.map((ev) => (
              <div key={ev.id} style={{ ...promptBlock, marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={promptLabel}>ARCHIVE EARTH — {ev.label.toUpperCase()}</span>
                  <button
                    onClick={() => copyPrompt(ev.prompt, `earth-${ev.id}`)}
                    style={copyBtn}
                  >
                    {copiedId === `earth-${ev.id}` ? "Copied" : "Copy"}
                  </button>
                </div>
                <p style={promptText}>{ev.prompt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ===== 7. ARCHIVED LOCKUPS ===== */}
      <section style={{
        ...sectionStyle,
        maxWidth: "none",
        padding: "64px 24px 80px",
        backgroundColor: colors.shed,
        color: colors.milk,
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ ...eyebrow, opacity: 0.25 }}>ARCHIVED LOCKUPS</p>
          <h2 style={{ ...sectionTitle, color: colors.milk }}>
            Six old explorations. One current logo above.
          </h2>
          <p style={{ ...sectionSub, opacity: 0.35 }}>
            These helped the brand find its ground, but they are not the current production system.
            Use the approved root wordmark at the top of this page.
          </p>

          <div style={lockupGrid}>
            {stages.map((s) => (
              <div key={s.id} style={lockupCard}>
                <StackedLogo hSrc={s.file} height={56} light />
                <div style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  opacity: 0.3,
                  marginTop: 12,
                  textAlign: "center" as const,
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Back link */}
      <div style={{ textAlign: "center", padding: "40px 0 48px", opacity: 0.2 }}>
        <a href="/" style={{
          fontFamily: fonts.display,
          fontSize: 11,
          letterSpacing: "0.1em",
          color: colors.shed,
          textDecoration: "none",
        }}>
          &larr; BACK TO THE HARVEST
        </a>
      </div>
    </div>
  );
}


/* -----------------------------------------------
   STYLES
   ----------------------------------------------- */

const heroStyle: CSSProperties = {
  backgroundColor: colors.shed,
  color: colors.milk,
  padding: "80px 24px 64px",
  textAlign: "center",
  overflow: "hidden",
};

const heroEyebrow: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 11,
  letterSpacing: "0.25em",
  opacity: 0.4,
  margin: "0 0 48px",
};

const heroTagline: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 18,
  fontStyle: "italic",
  opacity: 0.35,
  marginTop: 40,
  lineHeight: 1.7,
};

const sectionStyle: CSSProperties = {
  maxWidth: 720,
  margin: "0 auto",
  padding: "72px 24px 56px",
};

const eyebrow: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 11,
  letterSpacing: "0.2em",
  opacity: 0.3,
  margin: "0 0 12px",
};

const sectionTitle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 32,
  letterSpacing: "-0.02em",
  margin: "0 0 14px",
  lineHeight: 1.15,
};

const sectionSub: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 16,
  lineHeight: 1.75,
  opacity: 0.5,
  margin: 0,
  maxWidth: 560,
};

/* -- Stage nav & display -- */
const stageNav: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 36,
};

const stageBtn: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: "0.04em",
  padding: "10px 20px",
  border: "1.5px solid",
  borderRadius: 100,
  cursor: "pointer",
  transition: "all 0.2s",
};

const stageDisplay: CSSProperties = {
  marginTop: 36,
  padding: "56px 24px 48px",
  backgroundColor: "rgba(28,25,23,0.04)",
  borderRadius: 20,
};

const stageImageWrap: CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

const stageLabel: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 20,
  letterSpacing: "0.02em",
};

const stageDesc: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 15,
  lineHeight: 1.7,
  opacity: 0.5,
  marginTop: 8,
  maxWidth: 400,
  marginLeft: "auto",
  marginRight: "auto",
};

/* -- Color section -- */
const colorLabelStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 12,
  opacity: 0.5,
  display: "flex",
  alignItems: "center",
  gap: 6,
  whiteSpace: "nowrap",
};

const colorDot: CSSProperties = {
  display: "inline-block",
  width: 8,
  height: 8,
  borderRadius: "50%",
};

const colorCardHeader: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  padding: "20px 0",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: colors.shed,
  textAlign: "left",
};

const colorCardBody: CSSProperties = {
  padding: "0 0 24px 64px",
};

/* -- Seasonal -- */
const seasonGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 20,
  marginTop: 44,
};

const seasonCard: CSSProperties = {
  backgroundColor: "rgba(28,25,23,0.03)",
  borderRadius: 12,
  padding: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  aspectRatio: "1",
};

/* -- Lockup -- */
const lockupGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 16,
  marginTop: 44,
};

const lockupCard: CSSProperties = {
  padding: "28px 16px 20px",
  backgroundColor: "rgba(245,240,232,0.06)",
  borderRadius: 12,
};

/* -- Prompt blocks -- */
const promptBlock: CSSProperties = {
  marginTop: 24,
  padding: "20px 24px",
  backgroundColor: "rgba(28,25,23,0.04)",
  borderRadius: 12,
  border: "1px solid rgba(28,25,23,0.06)",
};

const promptLabel: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 800,
  fontSize: 10,
  letterSpacing: "0.15em",
  opacity: 0.35,
};

const promptText: CSSProperties = {
  fontFamily: "ui-monospace, 'SF Mono', monospace",
  fontSize: 12,
  lineHeight: 1.7,
  opacity: 0.5,
  margin: 0,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const copyBtn: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.06em",
  padding: "6px 14px",
  border: "1px solid rgba(28,25,23,0.15)",
  borderRadius: 100,
  backgroundColor: "transparent",
  cursor: "pointer",
  color: colors.shed,
};
