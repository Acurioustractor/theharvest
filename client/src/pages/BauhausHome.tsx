import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import BauhausFooter from "@/components/BauhausFooter";
import FadeIn from "@/components/FadeIn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { rootStyle, colors, fonts } from "@/styles/brand";

const GATHERING_DATE = new Date("2026-03-07T11:00:00+10:00");

function useCountdownDays(target: Date) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;
  return Math.ceil(diff / 86400000);
}

const zones = [
  {
    title: "GROW",
    desc: "Garden, soil, seasonal rhythms.",
    image: "/images/sketch-garden.png",
  },
  {
    title: "MAKE",
    desc: "Art, creative practice, residencies.",
    image: "/images/sketch-art.png",
  },
  {
    title: "FEED",
    desc: "Shared tables, local produce, good conversation.",
    image: "/images/sketch-food.png",
  },
];

const events = [
  {
    tag: "Community",
    date: "Friday 6 March, afternoon",
    title: "LOCALS DAY",
    desc: "Meet the neighbours, build with milk crates, share your vision for this space. Just locals.",
    href: "/gather",
  },
  {
    tag: "Event",
    date: "Saturday 7 March, 11am - 4pm",
    title: "FIRST GATHERING",
    desc: "Local history, making things together, oysters from Moreton Bay, drinks from Flight Bar. 9 Gumland Drive, Witta. Free.",
    href: "/gather",
  },
  {
    tag: "Fellowship",
    date: "12-month fellowship",
    title: "RADICAL SCOOPS",
    desc: "A Regional Arts Australia creative residency connecting agriculture, food, and community on Kabi Kabi and Jinibara Country.",
    href: "https://regionalarts.com.au/resources/radical-scoops",
  },
];

export default function BauhausHome() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [scrollVisible, setScrollVisible] = useState(false);
  const daysLeft = useCountdownDays(GATHERING_DATE);

  useEffect(() => {
    document.title = "The Harvest - Witta, Sunshine Coast Hinterland";
    const meta = (name: string, content: string) => {
      let el = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    meta("og:title", "The Harvest - Witta, Sunshine Coast Hinterland");
    meta("og:description", "A community space for garden, art, and food. Witta, Sunshine Coast Hinterland. Jinibara Country.");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setScrollVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={rootStyle}>

      {/* --- GATHERING COUNTDOWN BANNER --- */}
      {daysLeft !== null && (
        <Link href="/gather#rsvp" style={{ textDecoration: "none" }}>
          <motion.div
            initial={{ y: -40 }}
            animate={{ y: 0 }}
            transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              backgroundColor: colors.goldenHour,
              color: colors.shed,
              textAlign: "center",
              padding: "10px 20px",
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: isMobile ? 12 : 14,
              letterSpacing: "0.08em",
              cursor: "pointer",
            }}
          >
            FIRST GATHERING IN {daysLeft} {daysLeft === 1 ? "DAY" : "DAYS"} / SAVE YOUR SPOT
          </motion.div>
        </Link>
      )}

      {/* --- 1. HERO --- */}
      <section style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <video
          src="/images/compendium/hero-aerial.mp4"
          autoPlay muted loop playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.30)",
          zIndex: 1,
        }} />
        <div style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: colors.milk,
          padding: "0 24px",
        }}>
          <img
            src="/images/logo-harvest-only-clean.png"
            alt="THE HARVEST"
            style={{
              height: isMobile ? "clamp(80px, 20vw, 120px)" : "clamp(120px, 14vw, 180px)",
              width: "auto",
              display: "block",
              margin: "0 auto",
              filter: "brightness(0) invert(1)",
            }}
          />
          <p style={{
            fontFamily: fonts.body,
            fontStyle: "italic",
            fontSize: isMobile ? 18 : 24,
            margin: "32px auto 0",
            maxWidth: 800,
            opacity: 0.9,
          }}>
            Grow. Make. Feed.<br />A community space on Jinibara Country, Witta.
          </p>
        </div>
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollVisible ? 0.6 : 0 }}
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            bottom: 48,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: "0.3em",
            color: colors.milk,
          }}>
            SCROLL
          </span>
          <motion.svg
            width="16" height="24" viewBox="0 0 16 24"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M8 4v16M3 15l5 5 5-5" stroke={colors.milk} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </motion.svg>
        </motion.div>
      </section>

      {/* --- 2. ZONE CARDS --- */}
      <section style={{
        padding: isMobile ? "80px 28px" : "140px 40px",
        maxWidth: 1440,
        margin: "0 auto",
        width: "100%",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
          gap: isMobile ? 48 : 64,
        }}>
          {zones.map((zone, i) => (
            <FadeIn key={zone.title} delay={i * 0.1}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <img
                  src={zone.image}
                  alt={zone.title}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "contain",
                    marginBottom: 24,
                  }}
                />
                <h3 style={{
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 24,
                  letterSpacing: "0.1em",
                  margin: "0 0 12px",
                }}>
                  {zone.title}
                </h3>
                <p style={{
                  fontFamily: fonts.body,
                  fontSize: 18,
                  opacity: 0.7,
                  lineHeight: 1.7,
                  margin: 0,
                  maxWidth: 320,
                }}>
                  {zone.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* --- 3. WHAT'S ON --- */}
      <section style={{
        backgroundColor: colors.shed,
        color: colors.milk,
        padding: isMobile ? "80px 28px" : "140px 40px",
      }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", width: "100%" }}>
          <FadeIn>
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "flex-end",
              justifyContent: "space-between",
              marginBottom: 64,
              gap: 24,
            }}>
              <h2 style={{
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: isMobile ? 36 : 48,
                letterSpacing: "0.1em",
                margin: 0,
              }}>
                WHAT'S ON
              </h2>
              <Link href="/gather" style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.2em",
                color: colors.milk,
                textDecoration: "none",
                borderBottom: `1px solid rgba(245,240,232,0.3)`,
                paddingBottom: 8,
              }}>
                VIEW FULL PROGRAM
              </Link>
            </div>
          </FadeIn>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
            gap: 32,
          }}>
            {events.map((event, i) => (
              <FadeIn key={event.title} delay={i * 0.1}>
                <Link
                  href={event.href}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: 32,
                    border: "1px solid rgba(245,240,232,0.1)",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    textDecoration: "none",
                    color: colors.milk,
                    transition: "border-color 0.3s",
                    minHeight: 240,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${colors.goldenHour}80`)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(245,240,232,0.1)")}
                >
                  <span style={{
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: colors.goldenHour,
                    marginBottom: 16,
                  }}>
                    {event.tag.toUpperCase()}
                  </span>
                  <p style={{
                    fontFamily: fonts.body,
                    fontSize: 14,
                    opacity: 0.6,
                    margin: "0 0 8px",
                  }}>
                    {event.date}
                  </p>
                  <h4 style={{
                    fontFamily: fonts.display,
                    fontWeight: 900,
                    fontSize: 20,
                    margin: "0 0 16px",
                    letterSpacing: "0.02em",
                  }}>
                    {event.title}
                  </h4>
                  <p style={{
                    fontFamily: fonts.body,
                    fontSize: 16,
                    opacity: 0.75,
                    lineHeight: 1.7,
                    margin: 0,
                    flex: 1,
                  }}>
                    {event.desc}
                  </p>
                  <span style={{
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    marginTop: 24,
                    opacity: 0.8,
                  }}>
                    DETAILS +
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. RADICAL SCOOPS --- */}
      <section style={{
        backgroundColor: colors.milk,
        color: colors.shed,
        padding: isMobile ? "100px 28px" : "180px 40px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <span style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.4em",
              color: colors.goldenHour,
              marginBottom: 32,
              display: "block",
            }}>
              REGIONAL ARTS FELLOWSHIP
            </span>
            <blockquote style={{
              fontFamily: fonts.body,
              fontStyle: "italic",
              fontSize: isMobile ? "clamp(24px, 5vw, 36px)" : "clamp(28px, 3.5vw, 42px)",
              lineHeight: 1.4,
              margin: "0 0 48px",
            }}>
              "A place where those from every facet of the arts and sciences could get together."
            </blockquote>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 18 : 21,
              opacity: 0.8,
              lineHeight: 1.8,
              maxWidth: 720,
              margin: "0 auto 48px",
            }}>
              The Harvest is part of Radical Scoops, a 12-month creative residency through Regional Arts Australia. Witta sits on land shaped by generations. Jinibara Country first, then cedar-getters, dairy farmers, timber workers, and the cooperative movement that defined this hinterland. We are exploring what happens when you bring creative practice into a place with that kind of history.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <a
              href="https://regionalarts.com.au/resources/radical-scoops"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                border: `2px solid ${colors.shed}`,
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.2em",
                padding: "20px 48px",
                color: colors.shed,
                textDecoration: "none",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.shed;
                e.currentTarget.style.color = colors.milk;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = colors.shed;
              }}
            >
              LEARN MORE AT REGIONAL ARTS AUSTRALIA
            </a>
          </FadeIn>
        </div>
      </section>

      {/* --- 5. CLOSE --- */}
      <section style={{
        backgroundColor: colors.hardwood,
        color: colors.milk,
        padding: isMobile ? "80px 28px" : "120px 40px",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <span style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.3em",
              opacity: 0.5,
              display: "block",
              marginBottom: 24,
            }}>
              GET IN TOUCH
            </span>
            <p style={{
              fontFamily: fonts.body,
              fontStyle: "italic",
              fontSize: isMobile ? 24 : 32,
              lineHeight: 1.5,
              margin: "0 0 48px",
            }}>
              Come by. Say hello. Bring something to share.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <a
              href="mailto:hello@theharvestwitta.com.au"
              style={{
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: isMobile ? 20 : 28,
                color: colors.milk,
                textDecoration: "none",
                borderBottom: `2px solid ${colors.goldenHour}`,
                paddingBottom: 8,
                display: "inline-block",
                marginBottom: 24,
              }}
            >
              hello@theharvestwitta.com.au
            </a>
            <p style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.2em",
              opacity: 0.8,
              margin: 0,
            }}>
              9 GUMLAND DRIVE, WITTA QLD 4552
            </p>
          </FadeIn>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <BauhausFooter isMobile={isMobile} />
    </div>
  );
}
