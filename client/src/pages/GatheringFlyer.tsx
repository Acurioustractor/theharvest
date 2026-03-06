import { Headphones, Paintbrush, MessageCircle, Printer } from "lucide-react";

export default function GatheringFlyer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

        @page {
          size: A4;
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
          .flyer-page {
            box-shadow: none !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      {/* Download button — hidden when printing */}
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
          Download PDF
        </button>
      </div>

      {/* Screen wrapper — centres the flyer on screen */}
      <div style={{
        minHeight: "100vh",
        background: "#e8e4dc",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 20px",
      }} className="no-print-wrapper">

        {/* A4 flyer */}
        <div
          className="flyer-page"
          style={{
            width: "210mm",
            minHeight: "297mm",
            background: "#F5F0E8",
            fontFamily: "Inter, sans-serif",
            color: "#1C1917",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header — logo */}
          <div style={{
            padding: "20px 0 12px",
            display: "flex",
            justifyContent: "center",
            background: "#F5F0E8",
          }}>
            <img
              src="/images/wordmark-never-done.png"
              alt="The Harvest"
              style={{ height: 48 }}
            />
          </div>

          {/* Hero — aerial photo with overlay */}
          <div style={{
            position: "relative",
            height: "44%",
            overflow: "hidden",
          }}>
            <img
              src="/images/compendium/hero-aerial.jpg"
              alt="Aerial view of The Harvest property"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 40%",
                display: "block",
              }}
            />
            {/* Dark overlay */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(28,25,23,0.25) 0%, rgba(28,25,23,0.6) 100%)",
            }} />
            {/* Text overlay */}
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              color: "#F5F0E8",
              padding: "0 20px",
            }}>
              <div style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 52,
                fontWeight: 800,
                letterSpacing: "0.08em",
                lineHeight: 1.1,
                textTransform: "uppercase",
                marginBottom: 16,
                textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}>
                The Gathering
              </div>
              <div style={{
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: "0.04em",
                marginBottom: 8,
                textShadow: "0 1px 8px rgba(0,0,0,0.4)",
              }}>
                Saturday 7 March · 11 am – 4 pm
              </div>
              <div style={{
                fontSize: 16,
                fontWeight: 500,
                opacity: 0.95,
                textShadow: "0 1px 6px rgba(0,0,0,0.4)",
              }}>
                9 Gumland Drive, Witta · Free · 10 min from Maleny
              </div>
            </div>
          </div>

          {/* Three columns — LISTEN / MAKE / SHARE */}
          <div style={{
            display: "flex",
            gap: 0,
            padding: "24px 28px 16px",
          }}>
            {[
              {
                icon: Headphones,
                title: "Listen",
                desc: "Live music from local artists. Settle in, soak it up.",
              },
              {
                icon: Paintbrush,
                title: "Make",
                desc: "Drop-in creative stations for kids and adults. No skill needed.",
              },
              {
                icon: MessageCircle,
                title: "Share",
                desc: "Stories, ideas, a yarn over food. This is how it starts.",
              },
            ].map((col) => (
              <div key={col.title} style={{
                flex: 1,
                textAlign: "center",
                padding: "0 12px",
              }}>
                <col.icon
                  size={28}
                  strokeWidth={1.8}
                  style={{ color: "#C4922A", marginBottom: 8 }}
                />
                <div style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                  color: "#1C1917",
                }}>
                  {col.title}
                </div>
                <div style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "#44403C",
                }}>
                  {col.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{
            margin: "0 40px",
            borderTop: "1.5px solid #C4922A",
            opacity: 0.4,
          }} />

          {/* Featured highlights */}
          <div style={{
            padding: "16px 40px 12px",
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#C4922A",
              marginBottom: 12,
            }}>
              On the Day
            </div>
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: 32,
              flexWrap: "wrap",
              fontSize: 13,
              lineHeight: 1.6,
              color: "#1C1917",
            }}>
              {[
                { label: "Oysters", detail: "by Shaun Fisher\n(Mununjali, Gorenpul Man)" },
                { label: "Drinks", detail: "by Flight Bar\nWitta" },
                { label: "Coffee", detail: "Fresh brewed\non site" },
                { label: "Music", detail: "Live local\nartists" },
              ].map((item) => (
                <div key={item.label} style={{
                  minWidth: 100,
                  textAlign: "center",
                }}>
                  <div style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    marginBottom: 2,
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: "#57534E",
                    whiteSpace: "pre-line",
                  }}>
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What to bring */}
          <div style={{
            padding: "12px 48px 16px",
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#4A6741",
              marginBottom: 8,
            }}>
              What to Bring
            </div>
            <div style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: "#44403C",
              fontStyle: "italic",
            }}>
              A chair or blanket. A story, a skill, a question.
              <br />
              Or nothing at all.
            </div>
          </div>

          {/* Spacer to push footer down */}
          <div style={{ flex: 1 }} />

          {/* Footer */}
          <div style={{
            background: "#1C1917",
            color: "#F5F0E8",
            padding: "16px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12,
          }}>
            <div style={{ opacity: 0.7 }}>
              Built on Jinibara Country
            </div>
            <div style={{
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}>
              theharvest.org.au/gather
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
