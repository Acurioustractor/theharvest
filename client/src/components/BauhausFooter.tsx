import { useState } from "react";
import { Link } from "wouter";
import type { CSSProperties, FormEvent } from "react";
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
  const [photoName, setPhotoName] = useState("");
  const [photoEmail, setPhotoEmail] = useState("");
  const [photoContactId, setPhotoContactId] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [nlEmail, setNlEmail] = useState("");
  const [nlDone, setNlDone] = useState(false);
  const [nlError, setNlError] = useState("");

  const photoWallMutation = trpc.photoWall.submit.useMutation({
    onSuccess: (data) => {
      if (data.contactId) setPhotoContactId(data.contactId);
    },
    onError: (err) => setPhotoError(err.message || "Something went wrong"),
  });

  const nlMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => setNlDone(true),
    onError: (err) => setNlError(err.message || "Something went wrong"),
  });

  const handlePhotoSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPhotoError("");
    if (!photoName.trim() || !photoEmail.trim()) return;
    photoWallMutation.mutate({
      firstName: photoName.trim(),
      email: photoEmail.trim(),
    });
  };

  const handleNlSubmit = (e: FormEvent) => {
    e.preventDefault();
    setNlError("");
    if (!nlEmail.trim()) return;
    nlMutation.mutate({ email: nlEmail.trim(), source: "gathering-footer" });
  };

  return (
    <footer id="footer" style={{
      backgroundColor: colors.shed,
      padding: isMobile ? "40px 28px" : "48px 40px",
      borderTop: `1px solid rgba(245,240,232,0.08)`,
      textAlign: "center",
    }}>
      {/* Photo Wall signup */}
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
          PHOTO WALL
        </p>
        {photoContactId ? (
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 16,
              color: colors.milk,
              margin: "0 0 4px",
            }}>
              You're in, {photoName}!
            </p>
            <p style={{
              fontFamily: fonts.body,
              fontSize: 13,
              color: colors.milk,
              opacity: 0.5,
              margin: "0 0 12px",
              lineHeight: 1.5,
            }}>
              Show this QR code at the photo wall to get your portrait taken.
              <br />
              We'll send your photos to {photoEmail} after the event.
            </p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(`${window.location.origin}/photo-wall/checkin?id=${photoContactId}`)}&size=200x200`}
              alt="QR code for photo wall check-in"
              width={200}
              height={200}
              style={{ borderRadius: 8, background: "#fff", padding: 8 }}
            />
            <div style={{ marginTop: 16 }}>
              <Link href="/photo-wall" style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.1em",
                color: colors.goldenHour,
                textDecoration: "none",
                opacity: 0.7,
              }}>
                LEARN MORE ABOUT THE PHOTO WALL →
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p style={{
              fontFamily: fonts.body,
              fontSize: 13,
              color: colors.milk,
              opacity: 0.5,
              margin: "0 0 6px",
              lineHeight: 1.5,
            }}>
              Get a free portrait taken at the gathering.
              <br />
              Sign up and we'll email your photos afterwards.
            </p>
            <Link href="/photo-wall" style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.1em",
              color: colors.goldenHour,
              textDecoration: "none",
              opacity: 0.6,
            }}>
              WHAT'S THE PHOTO WALL? →
            </Link>
            <form onSubmit={handlePhotoSubmit} style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 8,
              alignItems: "stretch",
              marginTop: 14,
            }}>
              <input
                type="text"
                placeholder="First name"
                value={photoName}
                onChange={e => setPhotoName(e.target.value)}
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
                placeholder="Email"
                value={photoEmail}
                onChange={e => setPhotoEmail(e.target.value)}
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
                disabled={photoWallMutation.isPending}
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: colors.shed,
                  backgroundColor: colors.goldenHour,
                  border: "none",
                  padding: "10px 20px",
                  cursor: photoWallMutation.isPending ? "wait" : "pointer",
                  opacity: photoWallMutation.isPending ? 0.6 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {photoWallMutation.isPending ? "..." : "SIGN UP"}
              </button>
            </form>
            {photoError && (
              <p style={{ fontFamily: fonts.body, fontSize: 12, color: colors.calendula, margin: "8px 0 0", opacity: 0.8 }}>
                {photoError}
              </p>
            )}
          </>
        )}
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
          STAY IN THE LOOP
        </p>
        {nlDone ? (
          <p style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 16,
            color: colors.milk,
            margin: 0,
          }}>
            You're on the list!
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
              Get updates on what's happening at The Harvest.
            </p>
            <form onSubmit={handleNlSubmit} style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 8,
              alignItems: "stretch",
            }}>
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
                {nlMutation.isPending ? "..." : "SUBSCRIBE"}
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
        <Link href="/gather" style={linkStyle}>THE GATHERING</Link>
        <Link href="/compendium" style={linkStyle}>THE STORY</Link>
        <Link href="/contact" style={linkStyle}>CONTACT</Link>
        <Link href="/social" style={linkStyle}>FOLLOW</Link>
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
