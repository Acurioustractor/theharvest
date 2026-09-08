import { useState, type CSSProperties } from "react";
import { colors, fonts } from "@/styles/brand";

/* ─── ASSET DOWNLOADS ─────────────────────────────────────────────
   One place to get the right file. Anyone making a post, a sign or a
   print piece should be able to land here and leave with the asset.
   ---------------------------------------------------------------- */

const logoAssets = [
  {
    file: "/images/logo-harvest-only-clean.png",
    name: "Roots mark",
    px: "1141 x 555",
    use: "The primary mark. Website header and footer, every email, and anywhere the short mark is enough.",
    dark: false,
  },
  {
    file: "/images/logo-v1-dark-clean.png",
    name: "Full lockup, dark",
    px: "1245 x 784",
    use: "THE HARVEST lockup for light backgrounds. Print, signs, documents, standalone placements.",
    dark: false,
  },
  {
    file: "/images/logo-v1-colour-clean.png",
    name: "Full lockup, colour",
    px: "1133 x 749",
    use: "Colour lockup. Posts in Rammed Earth, roots in Canopy, Golden Hour and Crane.",
    dark: false,
  },
  {
    file: "/images/logo-v1-white-clean.png",
    name: "Full lockup, white",
    px: "1245 x 784",
    use: "For dark grounds and over photographs. Put it on a Shed panel, never straight onto a busy image.",
    dark: true,
  },
  {
    file: "/images/logo-facebook-profile.png",
    name: "Square avatar",
    px: "512 x 512",
    use: "Facebook, Instagram, Mighty and Google Business Profile profile pictures.",
    dark: false,
  },
  {
    file: "/images/the-harvest-witta-logo.png",
    name: "Small wordmark",
    px: "360 x 227",
    use: "Low resolution, screen only. Do not print this one.",
    dark: false,
  },
];

export function AssetDownloads({ isMobile }: { isMobile: boolean }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyHex = (hex: string) => {
    void navigator.clipboard.writeText(hex);
    setCopied(hex);
    window.setTimeout(() => setCopied(null), 1200);
  };

  return (
    <section id="downloads" style={{ padding: isMobile ? "60px 24px" : "80px 40px" }}>
      <h2 style={sectionHeadingStyle}>DOWNLOAD</h2>
      <p style={sectionDescStyle}>
        Every logo file, the whole pack, and the colours ready to paste. If you are
        making a post, a label or a print piece, take it from here so it matches.
      </p>

      {/* Whole pack */}
      <div style={{
        maxWidth: 1000,
        margin: "40px auto 0",
        padding: isMobile ? "24px 20px" : "28px 32px",
        backgroundColor: colors.shed,
        color: colors.milk,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: 20,
      }}>
        <div>
          <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 18, letterSpacing: "0.06em" }}>
            The whole logo pack
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.6, marginTop: 8, opacity: 0.75 }}>
            Six files and a note on which to use where. Send this link to a printer,
            a designer or anyone making something with our name on it.
          </div>
        </div>
        <a
          href="/the-harvest-logo-pack.zip"
          download
          style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: 13,
            letterSpacing: "0.14em",
            color: colors.shed,
            backgroundColor: colors.goldenHour,
            padding: "14px 24px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          DOWNLOAD PACK
        </a>
      </div>

      {/* Individual logos */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
        gap: 16,
        maxWidth: 1000,
        margin: "16px auto 0",
      }}>
        {logoAssets.map((asset) => (
          <div key={asset.file} style={{
            border: `1px solid rgba(26,26,26,0.12)`,
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{
              height: 130,
              backgroundColor: asset.dark ? colors.shed : colors.milk,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}>
              <img
                src={asset.file}
                alt={asset.name}
                loading="lazy"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              />
            </div>
            <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 13, letterSpacing: "0.12em" }}>
                {asset.name.toUpperCase()}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 11, opacity: 0.5, marginTop: 4 }}>
                {asset.px}
              </div>
              <div style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.55, marginTop: 10, flex: 1 }}>
                {asset.use}
              </div>
              <a
                href={asset.file}
                download
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  color: colors.shed,
                  marginTop: 14,
                  textDecoration: "underline",
                }}
              >
                DOWNLOAD PNG
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Colours, click to copy */}
      <div style={{ maxWidth: 1000, margin: "48px auto 0" }}>
        <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.16em", opacity: 0.5 }}>
          COLOURS, CLICK TO COPY
        </span>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)",
          gap: 8,
          marginTop: 16,
        }}>
          {[
            { name: "Shed", hex: colors.shed },
            { name: "Milk", hex: colors.milk },
            { name: "Rammed Earth", hex: colors.rammedEarth },
            { name: "Golden Hour", hex: colors.goldenHour },
            { name: "Workshirt", hex: colors.workshirt },
            { name: "Calendula", hex: colors.calendula },
            { name: "Canopy", hex: colors.canopy },
            { name: "Hardwood", hex: colors.hardwood },
            { name: "Lilly Pilly", hex: colors.lillyPilly },
            { name: "Crane", hex: colors.crane },
          ].map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => copyHex(c.hex)}
              aria-label={`Copy ${c.name}, ${c.hex}`}
              style={{
                backgroundColor: colors.milk,
                color: colors.shed,
                border: `1px solid rgba(26,26,26,0.18)`,
                padding: 0,
                textAlign: "left",
                cursor: "pointer",
                fontFamily: fonts.display,
                overflow: "hidden",
              }}
            >
              <div style={{ height: 56, backgroundColor: c.hex }} />
              <div style={{ padding: "10px 12px 12px" }}>
                <div style={{ fontWeight: 900, fontSize: 11, letterSpacing: "0.12em" }}>
                  {c.name.toUpperCase()}
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 12, marginTop: 5 }}>
                  {copied === c.hex ? "copied" : c.hex}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Print reality and retired files */}
      <div style={{
        maxWidth: 1000,
        margin: "40px auto 0",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
        gap: 16,
      }}>
        <div style={{ padding: isMobile ? "20px" : "24px 28px", border: `2px solid ${colors.calendula}` }}>
          <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.16em", color: colors.calendula }}>
            BEFORE YOU PRINT BIG
          </span>
          <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.65, marginTop: 14, marginBottom: 0 }}>
            There is no vector master. Every file here is a PNG, and the largest is
            1245 pixels wide. That prints clean to about 105mm across at 300dpi, or
            about 210mm on a large-format sign viewed from a distance. A gate sign
            with 100mm letters needs the mark redrawn as vector artwork first. Ask
            before you send anything bigger than a page to a printer.
          </p>
        </div>
        <div style={{ padding: isMobile ? "20px" : "24px 28px", border: `1px solid rgba(26,26,26,0.2)` }}>
          <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.16em", opacity: 0.5 }}>
            RETIRED, DO NOT USE
          </span>
          <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.65, marginTop: 14, marginBottom: 0 }}>
            The old wooden H sketch (logo-harvest-full.png) and the three-circle mono
            mark (logo-mono-v1.png). Neither is in the pack. The wooden H file stays
            on the server only because older GoHighLevel email templates still link
            it. Add no new references to either.
          </p>
        </div>
      </div>
    </section>
  );
}

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
  textAlign: "center",
  maxWidth: 640,
  margin: "16px auto 0",
  opacity: 0.7,
};
