import type { CSSProperties } from "react";

/* ─────────────────────────────────────
   COLOR PALETTE
   ───────────────────────────────────── */

export const colors = {
  black: "#1A1A1A",
  cream: "#F4F4F2",
  red: "#D62C2C",
  yellow: "#F2C900",
  blue: "#005EB8",
  orange: "#E05206",
  green: "#3A6E47",
  indigo: "#2A3B8F",
  magenta: "#A64B8A",
} as const;

/* ─────────────────────────────────────
   FONTS
   ───────────────────────────────────── */

export const fonts = {
  display: "'Montserrat', sans-serif",
  body: "'Inter', sans-serif",
} as const;

/* ─────────────────────────────────────
   ROOT STYLE (CSS custom properties + base)
   ───────────────────────────────────── */

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

/* ─────────────────────────────────────
   SHARED STYLE OBJECTS
   ───────────────────────────────────── */

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
  border: `1px solid rgba(244,244,242,0.2)`,
  borderRadius: 0,
  padding: "14px 16px",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
};
