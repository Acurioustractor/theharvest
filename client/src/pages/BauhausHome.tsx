import { useEffect, useState, useCallback, type CSSProperties } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import BauhausFooter from "@/components/BauhausFooter";
import FadeIn from "@/components/FadeIn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { rootStyle, colors, fonts } from "@/styles/brand";

const GATHERING_DATE = new Date("2026-03-07T11:00:00+10:00");

const barryImages = [
  { src: "/images/compendium/barry/IMG_5764.jpg", caption: "Barry at golden hour" },
  { src: "/images/compendium/barry/IMG_5777.jpg", caption: "Looking out" },
  { src: "/images/compendium/barry/IMG_5745.jpg", caption: "On the workbench telling stories" },
  { src: "/images/compendium/barry/IMG_5819.jpg", caption: "With the Blue Heelers" },
];

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

export default function BauhausHome() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [scrollVisible, setScrollVisible] = useState(false);
  const [currentBarryPhoto, setCurrentBarryPhoto] = useState(0);
  const [tractorTooltip, setTractorTooltip] = useState(false);
  const [tractorX, setTractorX] = useState(-40);

  const daysLeft = useCountdownDays(GATHERING_DATE);

  useEffect(() => {
    document.title = "The Harvest / Art. Food. Community.";
    const meta = (name: string, content: string) => {
      let el = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    meta("og:title", "The Harvest / Art. Food. Community.");
    meta("og:description", "A community space forming in Witta, Sunshine Coast Hinterland. Jinibara Country.");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setScrollVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const nextBarryPhoto = useCallback(() => {
    setCurrentBarryPhoto((prev) => (prev + 1) % barryImages.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextBarryPhoto, 6000);
    return () => clearInterval(interval);
  }, [nextBarryPhoto]);

  // Tractor scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setTractorX(-40 + scrollPct * (window.innerWidth + 40));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
              backgroundColor: colors.yellow,
              color: colors.black,
              textAlign: "center",
              padding: "10px 20px",
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: isMobile ? 12 : 14,
              letterSpacing: "0.08em",
              cursor: "pointer",
            }}
          >
            FIRST GATHERING IN {daysLeft} {daysLeft === 1 ? "DAY" : "DAYS"} &mdash; SAVE YOUR SPOT
          </motion.div>
        </Link>
      )}

      {/* --- 1. THE OPENING --- */}
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
          color: colors.cream,
        }}>
          <h1 style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: isMobile ? "clamp(36px, 10vw, 56px)" : "clamp(56px, 6vw, 80px)",
            letterSpacing: "0.18em",
            margin: 0,
            lineHeight: 1.1,
          }}>
            THE HARVEST
          </h1>
          <p style={{
            fontFamily: fonts.body,
            fontWeight: 400,
            fontSize: isMobile ? 16 : 20,
            letterSpacing: "0.3em",
            margin: "24px 0 0",
            opacity: 0.9,
          }}>
            Art. Food. Community.
          </p>
          <p style={{
            fontFamily: fonts.body,
            fontWeight: 400,
            fontSize: isMobile ? 12 : 14,
            margin: "16px 0 0",
            opacity: 0.5,
          }}>
            Witta, Sunshine Coast Hinterland. Jinibara Country.
          </p>
        </div>
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollVisible ? 0.6 : 0 }}
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            bottom: 40,
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
            letterSpacing: "0.2em",
            color: colors.cream,
          }}>
            SCROLL
          </span>
          <motion.svg
            width="16" height="24" viewBox="0 0 16 24"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M8 4v16M3 15l5 5 5-5" stroke={colors.cream} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </motion.svg>
        </motion.div>
      </section>

      {/* --- 2. THE STATEMENT + PRINCIPLES --- */}
      <section style={{
        backgroundColor: colors.black,
        color: colors.cream,
        padding: isMobile ? "96px 28px" : "140px 40px",
      }}>
        <div style={{
          maxWidth: 640,
          margin: "0 auto",
          textAlign: "center",
        }}>
          {/* The Quote */}
          <FadeIn>
            <blockquote style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? "clamp(18px, 4.5vw, 24px)" : "clamp(22px, 2.2vw, 28px)",
              lineHeight: 1.8,
              fontStyle: "italic",
              margin: 0,
              opacity: 0.9,
            }}>
              "Art is how we make sense of being alive. Food is how we sustain each other. Community is what happens when those two things share a table."
            </blockquote>
          </FadeIn>

          {/* Divider */}
          <hr style={{
            border: "none",
            borderTop: "1px solid rgba(244,244,242,0.1)",
            margin: "48px auto",
            maxWidth: 120,
          }} />

          {/* The Principles -centered, stacked */}
          <div>
            <FadeIn delay={0.15}>
              <div style={principleStyle}>
                <strong style={principleBoldStyle}>Nothing is permanent.</strong>
                <br />
                Like a gallery. The space is always becoming.
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div style={{ ...principleStyle, marginTop: 48 }}>
                <strong style={principleBoldStyle}>Community-built.</strong>
                <br />
                We don't build for people. We build with them.
              </div>
            </FadeIn>
            <FadeIn delay={0.45}>
              <div style={{ ...principleStyle, marginTop: 48 }}>
                <strong style={principleBoldStyle}>Custodianship.</strong>
                <br />
                We build to hand over.
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- 2B. WHAT IS THIS? --- */}
      <section style={{
        backgroundColor: colors.cream,
        color: colors.black,
        padding: isMobile ? "80px 28px" : "100px 40px",
      }}>
        <div style={{
          maxWidth: 640,
          margin: "0 auto",
        }}>
          <FadeIn>
            <span style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.2em",
              opacity: 0.4,
              display: "block",
              marginBottom: 20,
              textAlign: "center",
            }}>
              RIGHT NOW
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? "clamp(22px, 6vw, 30px)" : "clamp(26px, 2.8vw, 34px)",
              letterSpacing: "0.04em",
              lineHeight: 1.3,
              margin: "0 0 28px",
              textAlign: "center",
            }}>
              The Harvest is a 10-acre site in Witta, on Jinibara Country.
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 15 : 17,
              lineHeight: 1.9,
              opacity: 0.7,
              margin: "0 0 20px",
            }}>
              It's not finished. It's not a venue yet. Right now it's a paddock, a shed, a few big ideas, and a growing group of people who want to build something together.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 15 : 17,
              lineHeight: 1.9,
              opacity: 0.7,
              margin: "0 0 20px",
            }}>
              We're imagining three zones: a <strong>garden</strong> to grow in, a <strong>kitchen</strong> to feed from, and an <strong>art space</strong> to make in. But what those become depends on who shows up and what they bring.
            </p>
          </FadeIn>
          <FadeIn delay={0.25}>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 14 : 15,
              lineHeight: 1.8,
              opacity: 0.5,
              margin: "0 0 36px",
            }}>
              If you're a grower, a maker, a cook, an artist, a builder, a thinker, a neighbour. There's a seat at this table. Come along to a gathering, bring an idea, or just come see the place.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}>
              <Link href="/gather#rsvp" style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.1em",
                color: colors.cream,
                backgroundColor: colors.black,
                padding: "14px 32px",
                textDecoration: "none",
                display: "inline-block",
              }}>
                COME TO A GATHERING
              </Link>
              <Link href="/contact" style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.1em",
                color: colors.black,
                backgroundColor: "transparent",
                border: `2px solid ${colors.black}`,
                padding: "12px 32px",
                textDecoration: "none",
                display: "inline-block",
              }}>
                GET INVOLVED
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- 3. WHAT'S HAPPENING -Event CTA (oyster video background) --- */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        color: colors.cream,
        padding: isMobile ? "100px 28px" : "140px 40px",
      }}>
        <video
          src="/images/compendium/oyster-lease.mp4"
          poster="/images/compendium/oyster-lease-poster.jpg"
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
          backgroundColor: "rgba(0,0,0,0.55)",
          zIndex: 1,
        }} />
        <div style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 640,
          margin: "0 auto",
          textAlign: "center",
        }}>
          <FadeIn>
            <span style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.2em",
              opacity: 0.6,
              display: "block",
              marginBottom: 16,
            }}>
              WHAT'S HAPPENING
            </span>
            <h2 style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? "clamp(28px, 7vw, 40px)" : "clamp(36px, 4vw, 52px)",
              letterSpacing: "0.08em",
              margin: "0 0 20px",
              lineHeight: 1.1,
            }}>
              FIRST GATHERING
            </h2>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 16 : 20,
              letterSpacing: "0.06em",
              opacity: 0.8,
              margin: "0 0 28px",
            }}>
              Saturday 7 March, 11am – 4pm
            </p>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 15 : 18,
              lineHeight: 1.8,
              opacity: 0.8,
              margin: "0 0 36px",
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              Oysters from Minjerribah. A milk crate pavilion we'll build together. The launch of something we've been working toward.
            </p>
            <Link href="/gather#rsvp" style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.1em",
              color: colors.black,
              backgroundColor: colors.yellow,
              padding: "16px 40px",
              textDecoration: "none",
              display: "inline-block",
            }}>
              SAVE MY SPOT
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* --- 4. HERITAGE PROJECT --- */}
      <section style={{
        backgroundColor: colors.cream,
        color: colors.black,
        padding: isMobile ? "80px 28px" : "100px 40px",
      }}>
        <div style={{
          maxWidth: 640,
          margin: "0 auto",
          textAlign: "center",
        }}>
          <FadeIn>
            <span style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.2em",
              opacity: 0.4,
              display: "block",
              marginBottom: 20,
            }}>
              SUPPORTED BY REGIONAL ARTS AUSTRALIA
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? "clamp(22px, 6vw, 32px)" : "clamp(28px, 3vw, 38px)",
              letterSpacing: "0.06em",
              lineHeight: 1.2,
              margin: "0 0 24px",
            }}>
              DAIRY, TIMBER &amp; CO-OP
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 15 : 17,
              lineHeight: 1.9,
              opacity: 0.7,
              margin: "0 0 16px",
            }}>
              This ridge has three heritage stories: the dairy farmers who worked the land, the timber workers who milled the cedar, and the co-operatives that held it all together. We've been funded to explore these stories through photography, oral history, and community-built installations.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 14 : 15,
              lineHeight: 1.8,
              opacity: 0.5,
              margin: "0 0 32px",
            }}>
              This is the first chapter of a longer project. Collecting what's here before it's gone, and making something from it together.
            </p>
          </FadeIn>
          <FadeIn delay={0.25}>
            <Link href="/compendium" style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.1em",
              color: colors.cream,
              backgroundColor: colors.black,
              padding: "14px 36px",
              textDecoration: "none",
              display: "inline-block",
            }}>
              EXPLORE THE PROJECT
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* --- 5. STORIES FROM THE RIDGE -Barry --- */}
      <section style={{
        position: "relative",
        minHeight: isMobile ? "70vh" : "80vh",
        overflow: "hidden",
        backgroundColor: colors.black,
        color: colors.cream,
      }}>
        {/* Crossfading background photos */}
        {barryImages.map((img, i) => (
          <motion.div
            key={img.src}
            style={{ position: "absolute", inset: 0 }}
            initial={false}
            animate={{ opacity: currentBarryPhoto === i ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <img
              src={img.src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>
        ))}

        {/* Gradient overlays */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: isMobile
            ? "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.5), rgba(0,0,0,0.3))"
            : "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.6), rgba(0,0,0,0.15))",
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent, transparent)",
        }} />

        {/* Content */}
        <div style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: isMobile ? "flex-end" : "center",
          minHeight: isMobile ? "70vh" : "80vh",
        }}>
          <div style={{
            padding: isMobile ? "0 28px 60px" : "80px 40px",
            maxWidth: 540,
          }}>
            <FadeIn>
              <span style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.2em",
                opacity: 0.5,
                display: "block",
                marginBottom: 20,
              }}>
                STORIES FROM THE RIDGE
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <blockquote style={{
                fontFamily: fonts.body,
                fontSize: isMobile ? "clamp(18px, 4.5vw, 24px)" : 24,
                lineHeight: 1.7,
                fontStyle: "italic",
                margin: 0,
                opacity: 0.9,
              }}>
                "Timber workers, dairy farmers, red soil. We're not starting from nothing."
              </blockquote>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.15em",
                opacity: 0.5,
                margin: "20px 0 0",
              }}>
                BARRY RODGERIG, WITTA SINCE 1972
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p style={{
                fontFamily: fonts.body,
                fontSize: isMobile ? 15 : 17,
                lineHeight: 1.9,
                opacity: 0.7,
                margin: "28px 0 0",
              }}>
                Barry's shed is full of machines that built this hinterland. Log trucks, dairy equipment, engines from the war. Every rusted blade is a chapter. The land remembers what was here before.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <Link href="/compendium" style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.1em",
                color: colors.cream,
                textDecoration: "none",
                borderBottom: `1px solid rgba(244,244,242,0.3)`,
                paddingBottom: 2,
                display: "inline-block",
                marginTop: 28,
              }}>
                Read the full story &rarr;
              </Link>
            </FadeIn>
          </div>
        </div>

        {/* Photo counter */}
        <AnimatePresence mode="wait">
          <motion.span
            key={currentBarryPhoto}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              bottom: isMobile ? 20 : 24,
              right: isMobile ? 20 : 32,
              zIndex: 10,
              fontFamily: "monospace",
              fontSize: 12,
              color: "rgba(244,244,242,0.35)",
            }}
          >
            {currentBarryPhoto + 1}/{barryImages.length}
          </motion.span>
        </AnimatePresence>
      </section>

      {/* --- 6. THE CLOSE --- */}
      <section style={{
        backgroundColor: colors.indigo,
        color: colors.cream,
        padding: isMobile ? "80px 28px" : "100px 40px",
      }}>
        <div style={{
          maxWidth: 640,
          margin: "0 auto",
          textAlign: "center",
        }}>
          <FadeIn>
            <p style={{
              fontFamily: fonts.body,
              fontStyle: "italic",
              fontSize: isMobile ? 18 : 22,
              lineHeight: 1.7,
              opacity: 0.85,
              margin: "0 0 12px",
            }}>
              Come by. Say hello. Bring something to share.
            </p>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 14 : 16,
              opacity: 0.5,
              margin: "0 0 40px",
            }}>
              hello@theharvestwitta.com.au
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: isMobile ? 16 : 24,
              flexWrap: "wrap",
            }}>
              <Link href="/contact" style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.1em",
                color: colors.black,
                backgroundColor: colors.yellow,
                padding: "14px 36px",
                textDecoration: "none",
                display: "inline-block",
              }}>
                GET IN TOUCH
              </Link>
              <Link href="/compendium" style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.1em",
                color: colors.cream,
                backgroundColor: "transparent",
                border: `1px solid rgba(244,244,242,0.3)`,
                padding: "14px 36px",
                textDecoration: "none",
                display: "inline-block",
              }}>
                THE STORY
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- TRACTOR EASTER EGG --- */}
      <div
        onClick={() => setTractorTooltip(!tractorTooltip)}
        style={{
          position: "fixed",
          bottom: 8,
          left: tractorX,
          zIndex: 50,
          cursor: "pointer",
          opacity: 0.15,
          transition: "opacity 0.3s",
          userSelect: "none",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.6"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.15"; }}
        title="A Curious Tractor"
      >
        {tractorTooltip ? (
          <span style={{
            fontFamily: fonts.body,
            fontSize: 11,
            color: colors.cream,
            backgroundColor: colors.black,
            padding: "6px 12px",
            position: "absolute",
            bottom: 28,
            left: 0,
            whiteSpace: "nowrap",
            opacity: 1,
          }}>
            A Curious Tractor - preparing ground, not controlling what grows
          </span>
        ) : null}
        <img src="/images/icon-tractor.png" alt="" style={{ width: 32, height: 22 }} />
      </div>

      {/* --- FOOTER --- */}
      <BauhausFooter isMobile={isMobile} />
    </div>
  );
}

/* ─────────────────────────────────────
   STYLES
   ───────────────────────────────────── */

const principleStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 17,
  lineHeight: 1.8,
  opacity: 0.8,
  textAlign: "center",
};

const principleBoldStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  letterSpacing: "0.02em",
};
