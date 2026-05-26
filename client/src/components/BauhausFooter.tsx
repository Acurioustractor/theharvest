import { useState } from "react";
import { Link } from "wouter";
import type { CSSProperties } from "react";
import { Facebook, Instagram } from "lucide-react";
import { colors, fonts, formInputStyle } from "@/styles/brand";
import { trpc } from "@/lib/trpc";

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
  const [nlName, setNlName] = useState("");
  const [nlEmail, setNlEmail] = useState("");
  const [nlDone, setNlDone] = useState(false);
  const [nlError, setNlError] = useState("");

  const nlMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => setNlDone(true),
    onError: (err) => setNlError(err.message || "Something went wrong"),
  });

  const handleNlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNlError("");
    if (!nlName.trim() || !nlEmail.trim()) return;
    const [firstName, ...rest] = nlName.trim().split(/\s+/);
    nlMutation.mutate({
      email: nlEmail.trim(),
      firstName,
      lastName: rest.join(" ") || undefined,
      source: "Harvest | Footer Follow",
      interests: ["community"],
      member: false,
    });
  };

  return (
    <footer id="footer" style={{
      backgroundColor: colors.shed,
      padding: isMobile ? "40px 28px" : "48px 40px",
      borderTop: `1px solid rgba(245,240,232,0.08)`,
      textAlign: "center",
    }}>
      {/* Community day teaser + main paths */}
      <div style={{
        maxWidth: 480,
        margin: "0 auto 32px",
        padding: "0 0 28px",
        borderBottom: `1px solid rgba(245,240,232,0.08)`,
      }}>
        <p style={{
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: 11,
          letterSpacing: "0.15em",
          color: colors.goldenHour,
          margin: "0 0 6px",
        }}>
          NEXT COMMUNITY DAY · LATE JUNE
        </p>
        <p style={{
          fontFamily: fonts.body,
          fontSize: 13,
          color: colors.milk,
          opacity: 0.5,
          margin: "0 0 14px",
          lineHeight: 1.5,
        }}>
          A community open day around the end of June 2026. Date being confirmed. Become a member to hear first.
        </p>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 12,
        }}>
          <Link href="/membership" style={smallActionStyle}>BECOME A MEMBER</Link>
          <Link href="/what-is-the-harvest" style={smallActionStyle}>WHAT IS THE HARVEST?</Link>
          <Link href="/works" style={smallActionStyle}>SEE THE WORKS</Link>
        </div>
      </div>

      {/* Newsletter signup */}
      <div style={{
        maxWidth: 480,
        margin: "0 auto 32px",
        padding: "0 0 28px",
        borderBottom: `1px solid rgba(245,240,232,0.08)`,
      }}>
        <p style={{
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: 11,
          letterSpacing: "0.15em",
          color: colors.goldenHour,
          margin: "0 0 6px",
        }}>
          FOLLOW ALONG
        </p>
        {nlDone ? (
          <p style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 16,
            color: colors.milk,
            margin: 0,
          }}>
            You're following along.
          </p>
        ) : (
          <>
            <p style={{
              fontFamily: fonts.body,
              fontSize: 13,
              color: colors.milk,
              opacity: 0.5,
              margin: "0 0 12px",
              lineHeight: 1.5,
            }}>
              The occasional note from the place: stories from the land, what's coming up, and real ways to help. No commitment.
            </p>
            <form onSubmit={handleNlSubmit} style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 8,
              alignItems: "stretch",
            }}>
              <input
                type="text"
                placeholder="Your name"
                value={nlName}
                onChange={e => setNlName(e.target.value)}
                required
                style={{
                  ...formInputStyle,
                  fontSize: 14,
                  padding: "10px 14px",
                  flex: 1,
                }}
              />
              <input
                type="email"
                placeholder="Your email"
                value={nlEmail}
                onChange={e => setNlEmail(e.target.value)}
                required
                style={{
                  ...formInputStyle,
                  fontSize: 14,
                  padding: "10px 14px",
                  flex: 1,
                }}
              />
              <button
                type="submit"
                disabled={nlMutation.isPending}
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: colors.shed,
                  backgroundColor: colors.goldenHour,
                  border: "none",
                  padding: "10px 20px",
                  cursor: nlMutation.isPending ? "wait" : "pointer",
                  opacity: nlMutation.isPending ? 0.6 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {nlMutation.isPending ? "..." : "KEEP ME POSTED"}
              </button>
            </form>
            {nlError && (
              <p style={{ fontFamily: fonts.body, fontSize: 12, color: colors.calendula, margin: "8px 0 0", opacity: 0.8 }}>
                {nlError}
              </p>
            )}
          </>
        )}
      </div>

      <img
        src="/images/logo-harvest-only-clean.png"
        alt="THE HARVEST"
        style={{
          height: 36,
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
        gap: 20,
        marginBottom: 20,
      }}>
        <a href="https://www.facebook.com/profile.php?id=61587776558599" target="_blank" rel="noopener noreferrer" style={{ color: colors.milk, opacity: 0.5, transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}>
          <Facebook size={20} />
        </a>
        <a href="https://www.instagram.com/theharvestwitta" target="_blank" rel="noopener noreferrer" style={{ color: colors.milk, opacity: 0.5, transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}>
          <Instagram size={20} />
        </a>
      </div>
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: isMobile ? 16 : 24,
        flexWrap: "wrap",
      }}>
        <Link href="/" style={linkStyle}>HOME</Link>
        <Link href="/what-is-the-harvest" style={linkStyle}>WHAT IS THE HARVEST?</Link>
        <Link href="/works" style={linkStyle}>WORKS</Link>
        <Link href="/membership" style={linkStyle}>MEMBERSHIP</Link>
        <Link href="/people" style={linkStyle}>PEOPLE</Link>
        <Link href="/blog" style={linkStyle}>JOURNAL</Link>
        <Link href="/contact" style={linkStyle}>CONTACT</Link>
        <Link href="/social" style={linkStyle}>FOLLOW</Link>
      </div>
    </footer>
  );
}

const smallActionStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: 10,
  letterSpacing: "0.1em",
  color: colors.goldenHour,
  textDecoration: "none",
  borderBottom: `1px solid ${colors.goldenHour}`,
  paddingBottom: 2,
  opacity: 0.75,
};

const linkStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: 12,
  letterSpacing: "0.1em",
  color: colors.milk,
  textDecoration: "none",
  opacity: 0.7,
};
