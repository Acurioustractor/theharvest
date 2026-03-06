import { Printer } from "lucide-react";

/**
 * 6x4 inch (152mm x 102mm) postcard flyer for the First Gathering.
 * Print at "Actual Size" / 100% scale on 6x4 photo paper.
 */
export default function GatheringPostcard() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Inter:wght@400;500;600&display=swap');

        @page {
          size: 152mm 102mm;
          margin: 0;
        }

        @media print {
          html, body {
            margin: 0;
            padding: 0;
            background: none;
          }
          .no-print {
            display: none !important;
          }
          .postcard {
            box-shadow: none !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* Print button */}
      <div className="no-print" style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 100,
      }}>
        <button
          onClick={() => window.print()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            background: "#1C1917",
            color: "#F5F0E8",
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          <Printer size={18} />
          Print 6x4
        </button>
      </div>

      {/* Screen wrapper */}
      <div style={{
        minHeight: "100vh",
        background: "#e8e4dc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}>

        {/* 6x4 postcard — full bleed photo with text overlay */}
        <div
          className="postcard"
          style={{
            width: "152mm",
            height: "102mm",
            fontFamily: "Inter, sans-serif",
            color: "#F5F0E8",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
            position: "relative",
          }}
        >
          {/* Full bleed background photo */}
          <img
            src="/images/compendium/seed-house-front.jpg"
            alt="The Harvest — rammed earth building, Witta"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 60%",
              display: "block",
            }}
          />

          {/* Dark overlay — gradient from top */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(28,25,23,0.85) 0%, rgba(28,25,23,0.55) 50%, rgba(28,25,23,0.15) 85%, rgba(28,25,23,0.4) 100%)",
          }} />

          {/* Content overlay — centred */}
          <div style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "6mm 8mm 4mm",
            textAlign: "center",
          }}>
            {/* Logo — centred, bigger */}
            <img
              src="/images/logo-v1-dark-clean.png"
              alt="The Harvest"
              style={{
                height: 40,
                filter: "brightness(0) invert(1)",
                marginBottom: 6,
              }}
            />

            {/* Title */}
            <div style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: "0.05em",
              lineHeight: 1.0,
              textTransform: "uppercase",
              marginBottom: 8,
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}>
              Witta Gathering
            </div>

            {/* Date & time */}
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.03em",
              lineHeight: 1.4,
              color: "#C4922A",
              marginBottom: 5,
            }}>
              Saturday 7 March · 11 am – 4 pm
            </div>

            {/* Location */}
            <div style={{
              fontSize: 9.5,
              lineHeight: 1.5,
              color: "rgba(245,240,232,0.85)",
              marginBottom: 8,
            }}>
              9 Gumland Drive, Witta · 10 min from Maleny · Free
            </div>

            {/* What's on tags */}
            <div style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 6,
            }}>
              {["Oysters", "Music", "Making", "Stories"].map((item) => (
                <div
                  key={item}
                  style={{
                    fontSize: 7.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "3px 7px",
                    border: "1px solid rgba(196,146,42,0.6)",
                    borderRadius: 3,
                    color: "#C4922A",
                    background: "rgba(28,25,23,0.3)",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Bring line */}
            <div style={{
              fontSize: 8.5,
              fontStyle: "italic",
              color: "rgba(245,240,232,0.6)",
              lineHeight: 1.5,
            }}>
              Bring a chair or blanket. Or nothing at all.
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Footer */}
            <div style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              fontSize: 7,
              color: "rgba(245,240,232,0.45)",
              letterSpacing: "0.02em",
            }}>
              <span>Jinibara Country</span>
              <span style={{ fontWeight: 600, color: "rgba(245,240,232,0.6)" }}>
                theharvestwitta.com.au
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
