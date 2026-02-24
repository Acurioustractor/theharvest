import type { CSSProperties } from "react";

/* -----------------------------------------------
   COLOR PALETTE
   Drawn from the Blackall Range itself:
   the rammed earth walls, Barry's shed, golden hour light,
   raw milk, hinterland canopy, hardwood beams,
   and the Lilly Pilly at the front gate.
   ----------------------------------------------- */

export const colors = {
  // -- Named after the place --
  shed:        "#1C1917",  // Barry's shed interior, dark timber shadow
  milk:        "#F5F0E8",  // Raw milk, aged paper, sandstone render
  rammedEarth: "#B58B70",  // The rammed earth walls of The Harvest building
  goldenHour:  "#C4922A",  // Late afternoon on the ridge, honey timber
  workshirt:   "#3B5563",  // Barry's navy work shirt, hinterland dusk
  calendula:   "#CF5C1E",  // Calendula in the garden beds, warm permaculture orange
  canopy:      "#4A6741",  // Paddock green, ridge eucalyptus canopy
  hardwood:    "#3D3832",  // Blackbutt beams, shed framing, dark bark
  lillyPilly:  "#6B3040",  // Syzygium new growth, the tree at the front of The Harvest
  crane:       "#8B4A2A",  // Rusted iron on Barry's crane, corrugated iron patina

  // -- Aliases (backward-compatible) --
  black:   "#1C1917",
  cream:   "#F5F0E8",
  red:     "#8B4A2A",
  yellow:  "#C4922A",
  blue:    "#3B5563",
  orange:  "#CF5C1E",
  green:   "#4A6741",
  indigo:  "#3D3832",
  magenta: "#6B3040",
} as const;

/* -----------------------------------------------
   FONTS
   ----------------------------------------------- */

export const fonts = {
  display: "'Montserrat', sans-serif",
  body: "'Inter', sans-serif",
} as const;

/* -----------------------------------------------
   ROOT STYLE (CSS custom properties + base)
   ----------------------------------------------- */

export const rootStyle: CSSProperties = {
  // @ts-expect-error -- custom properties
  "--bh-black": colors.black,
  "--bh-cream": colors.cream,
  "--bh-red": colors.red,
  "--bh-yellow": colors.yellow,
  "--bh-blue": colors.blue,
  "--bh-orange": colors.orange,
  "--bh-green": colors.green,
  "--bh-indigo": colors.indigo,
  "--bh-magenta": colors.magenta,
  "--bh-display": fonts.display,
  "--bh-body": fonts.body,
  fontFamily: fonts.body,
  color: colors.black,
  backgroundColor: colors.cream,
  margin: 0,
  padding: 0,
  minHeight: "100vh",
  lineHeight: 1.5,
};

/* -----------------------------------------------
   SHARED STYLE OBJECTS
   ----------------------------------------------- */

export const detailLabelStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 12,
  letterSpacing: "0.15em",
  margin: "0 0 12px",
  opacity: 0.5,
};

export const detailTextStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 16,
  lineHeight: 1.7,
  margin: "4px 0",
};

export const formLabelStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.12em",
  color: colors.cream,
  opacity: 0.6,
  display: "block",
  marginBottom: 8,
};

export const formInputStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 16,
  color: colors.cream,
  backgroundColor: "transparent",
  border: `1px solid rgba(245,240,232,0.2)`,
  borderRadius: 0,
  padding: "14px 16px",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
};
