import { useState } from "react";
import { Link } from "wouter";
import type { CSSProperties } from "react";
import { colors, fonts } from "@/styles/brand";

const FOOTER_LINES = [
  "Built on Jinibara Country",
  "10 acres. 6 heritage layers. 1 table.",
  "No tickets. No agenda. No speeches.",
  "Come as you are.",
  "We build to hand over.",
  "The space is always becoming.",
];

interface BauhausFooterProps {
  isMobile: boolean;
}

export default function BauhausFooter({ isMobile }: BauhausFooterProps) {
  const [line] = useState(() => FOOTER_LINES[Math.floor(Math.random() * FOOTER_LINES.length)]);

  return (
    <footer style={{
      backgroundColor: colors.shed,
      padding: isMobile ? "40px 28px" : "48px 40px",
      borderTop: `1px solid rgba(245,240,232,0.08)`,
      textAlign: "center",
    }}>
      <img
        src="/images/wordmark-never-done.png"
        alt="THE HARVEST"
        style={{
          height: 28,
          width: "auto",
          filter: "brightness(0) invert(1)",
          marginBottom: 8,
        }}
      />
      <p style={{
        fontFamily: fonts.body,
        fontSize: 13,
        color: colors.milk,
        opacity: 0.4,
        margin: "0 0 12px",
      }}>
        Witta, Blackall Range. Jinibara Country.
      </p>
      <p style={{
        fontFamily: fonts.body,
        fontStyle: "italic",
        fontSize: 12,
        color: colors.milk,
        opacity: 0.25,
        margin: "0 0 24px",
      }}>
        {line}
      </p>
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: isMobile ? 16 : 24,
        flexWrap: "wrap",
      }}>
        <Link href="/" style={linkStyle}>HOME</Link>
        <Link href="/gather" style={linkStyle}>THE GATHERING</Link>
        <Link href="/compendium" style={linkStyle}>THE STORY</Link>
        <Link href="/contact" style={linkStyle}>CONTACT</Link>
      </div>
    </footer>
  );
}

const linkStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: 12,
  letterSpacing: "0.1em",
  color: colors.milk,
  textDecoration: "none",
  opacity: 0.7,
};
