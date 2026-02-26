import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import BauhausFooter from "@/components/BauhausFooter";
import FadeIn from "@/components/FadeIn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { rootStyle, colors, fonts, formLabelStyle, formInputStyle } from "@/styles/brand";
import { trpc } from "@/lib/trpc";

const GATHERING_DATE = new Date("2026-03-07T11:00:00+10:00");

const SUCCESS_MESSAGES = [
  { headline: "You're in. See you March 7.", sub: "We'll send you a few details before the day. Where to park, what's happening, who else is coming." },
  { headline: "Spot saved. Bring your curiosity.", sub: "We'll have a seat and a conversation waiting for you." },
  { headline: "Done. Now tell a friend.", sub: "The best gatherings happen when neighbours bring neighbours." },
];

function useCountdown(target: Date) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, isUnder24h: days === 0 };
}

function AnimatedCount({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target <= 0) return;
    const duration = 1200;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const id = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(id);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(id);
  }, [target]);
  return <>{count}</>;
}

export default function Gather() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [eoiData, setEoiData] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [successMsg] = useState(() => SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]);
  const [shared, setShared] = useState(false);

  const [localsDayData, setLocalsDayData] = useState({ name: "", email: "", phone: "", alsoSaturday: false });
  const [localsDaySubmitted, setLocalsDaySubmitted] = useState(false);

  const countdown = useCountdown(GATHERING_DATE);
  const isPast = countdown === null;

  const eoiMutation = trpc.eoi.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const localsDayMutation = trpc.eoi.submitLocalsDay.useMutation({
    onSuccess: () => setLocalsDaySubmitted(true),
  });

  const eoiCountQuery = trpc.eoi.count.useQuery(undefined, {
    staleTime: 60_000,
  });

  useEffect(() => {
    document.title = "First Gathering / Saturday 7 March | The Harvest";
    const meta = (name: string, content: string) => {
      let el = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    meta("og:title", "First Gathering / Saturday 7 March");
    meta("og:description", "Local history, making things together, and imagining what this place becomes. 9 Gumland Drive, Witta.");

    if (window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, []);

  const handleEoiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eoiData.email && !eoiData.phone) return;
    eoiMutation.mutate({
      name: eoiData.name,
      email: eoiData.email || undefined,
      phone: eoiData.phone || undefined,
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: "The Harvest / First Gathering",
      text: "I'm going to The Harvest's First Gathering. March 7, Witta. Local history, making things together, and imagining what this place becomes.",
      url: "https://theharvestwitta.com.au/gather",
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShared(true);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setShared(true);
      }
    } catch {
      // User cancelled share
    }
  };

  const rsvpCount = eoiCountQuery.data?.count ?? 0;

  return (
    <div style={rootStyle}>

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
          backgroundColor: "rgba(0,0,0,0.35)",
          zIndex: 1,
        }} />
        <div style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: colors.milk,
          padding: "0 24px",
        }}>
          <Link href="/" style={{ textDecoration: "none", color: colors.milk }}>
            <span style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.4em",
              opacity: 0.6,
              display: "block",
              marginBottom: 24,
            }}>
              THE HARVEST
            </span>
          </Link>
          <h1 style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: isMobile ? "clamp(36px, 10vw, 56px)" : "clamp(56px, 6vw, 80px)",
            letterSpacing: "0.14em",
            margin: 0,
            lineHeight: 1.1,
          }}>
            FIRST GATHERING
          </h1>
          <p style={{
            fontFamily: fonts.body,
            fontStyle: "italic",
            fontSize: isMobile ? 18 : 24,
            margin: "28px auto 0",
            maxWidth: 600,
            opacity: 0.9,
          }}>
            Saturday 7 March, 11am - 4pm
          </p>
          <p style={{
            fontFamily: fonts.body,
            fontSize: isMobile ? 14 : 16,
            margin: "8px 0 0",
            opacity: 0.6,
          }}>
            9 Gumland Drive, Witta. Free.
          </p>

          {/* Countdown */}
          {countdown && !countdown.isUnder24h && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{
                marginTop: 40,
                display: "flex",
                justifyContent: "center",
                gap: isMobile ? 16 : 24,
              }}
            >
              {[
                { value: countdown.days, label: "days" },
                { value: countdown.hours, label: "hours" },
                { value: countdown.minutes, label: "min" },
                { value: countdown.seconds, label: "sec" },
              ].map((unit) => (
                <div key={unit.label} style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: fonts.display,
                    fontWeight: 900,
                    fontSize: isMobile ? 28 : 40,
                    lineHeight: 1,
                  }}>
                    {unit.value}
                  </div>
                  <div style={{
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    opacity: 0.5,
                    marginTop: 4,
                  }}>
                    {unit.label.toUpperCase()}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {countdown?.isUnder24h && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: isMobile ? 20 : 28,
                letterSpacing: "0.06em",
                margin: "32px 0 0",
              }}
            >
              Tomorrow. See you there.
            </motion.p>
          )}

          {isPast && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontFamily: fonts.body,
                fontStyle: "italic",
                fontSize: isMobile ? 16 : 18,
                margin: "28px 0 0",
                opacity: 0.8,
              }}
            >
              We gathered. Here's what happened.
            </motion.p>
          )}

          {!isPast && (
            <a
              href="#rsvp"
              style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.1em",
                color: colors.shed,
                backgroundColor: colors.goldenHour,
                padding: "16px 40px",
                textDecoration: "none",
                display: "inline-block",
                marginTop: 32,
              }}
            >
              SAVE MY SPOT
            </a>
          )}
        </div>
      </section>

      {/* --- 2. THE INVITATION --- */}
      <section style={{
        backgroundColor: colors.milk,
        color: colors.shed,
        padding: isMobile ? "100px 28px" : "160px 40px",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <span style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.4em",
              color: colors.goldenHour,
              display: "block",
              marginBottom: 32,
            }}>
              REGIONAL ARTS FELLOWSHIP
            </span>
            <blockquote style={{
              fontFamily: fonts.body,
              fontStyle: "italic",
              fontSize: isMobile ? "clamp(22px, 5vw, 32px)" : "clamp(28px, 3vw, 38px)",
              lineHeight: 1.4,
              margin: "0 0 40px",
            }}>
              "What happens when you bring creative practice into a place shaped by generations?"
            </blockquote>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 17 : 20,
              lineHeight: 1.9,
              opacity: 0.8,
              maxWidth: 680,
              margin: "0 auto 24px",
            }}>
              Witta sits on land shaped by generations. Jinibara Country first, then cedar-getters, dairy farmers, timber workers, and the cooperative movement that defined this hinterland. Through a Regional Arts Australia fellowship, we're exploring what happens when you bring creative practice into a place with that kind of history.
            </p>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 17 : 20,
              lineHeight: 1.9,
              opacity: 0.8,
              maxWidth: 680,
              margin: "0 auto",
            }}>
              This gathering is the beginning. No tickets. No speeches. Just neighbours on the lawn, oysters from Moreton Bay, drinks from{" "}
              <a
                href="https://flightbarwitta.com.au/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: colors.shed, fontWeight: 600, textDecoration: "none", borderBottom: `1px solid rgba(0,0,0,0.3)` }}
              >
                Flight Bar Witta
              </a>
              , and an open question: what would you build here?
            </p>
          </FadeIn>
        </div>
      </section>

      {/* --- 3. LISTEN / MAKE / SHARE --- */}
      <section style={{
        backgroundColor: colors.shed,
        color: colors.milk,
        padding: isMobile ? "80px 28px" : "140px 40px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <FadeIn>
            <h2 style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? 36 : 48,
              letterSpacing: "0.1em",
              margin: "0 0 64px",
              textAlign: "center",
            }}>
              ON THE DAY
            </h2>
          </FadeIn>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
            gap: isMobile ? 48 : 64,
          }}>
            {[
              {
                title: "LISTEN",
                desc: "Stories from the ridge. Local history. The land beneath us and the people who shaped it.",
                image: "/images/sketch-listen.png",
              },
              {
                title: "MAKE",
                desc: "Build something together. Hands-on, collaborative, open. Bring an idea or just bring your hands.",
                image: "/images/sketch-make.png",
              },
              {
                title: "SHARE",
                desc: "Food, fire, and the question: what would you build here?",
                image: "/images/sketch-share.png",
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: isMobile ? 160 : 200,
                    height: isMobile ? 160 : 200,
                    margin: "0 auto 32px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `1px solid rgba(245,240,232,0.1)`,
                  }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <h3 style={{
                    fontFamily: fonts.display,
                    fontWeight: 900,
                    fontSize: 24,
                    letterSpacing: "0.1em",
                    margin: "0 0 16px",
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontFamily: fonts.body,
                    fontSize: 17,
                    lineHeight: 1.8,
                    opacity: 0.75,
                    margin: 0,
                    maxWidth: 300,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}>
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. SHAUN FISHER --- */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        color: colors.milk,
        padding: isMobile ? "100px 28px" : "160px 40px",
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
          maxWidth: 700,
          margin: "0 auto",
          textAlign: "center",
        }}>
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
              FROM SEA COUNTRY
            </span>
            <p style={{
              fontFamily: fonts.body,
              fontStyle: "italic",
              fontSize: isMobile ? "clamp(22px, 5vw, 30px)" : "clamp(26px, 3vw, 36px)",
              lineHeight: 1.5,
              margin: "0 0 32px",
            }}>
              Shaun Fisher, a Mununjali, Gorenpul Man, grows oysters from his leases in Moreton Bay on Quandamooka Country. Where food, culture, and community meet on sea country.
            </p>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 16 : 18,
              lineHeight: 1.8,
              opacity: 0.75,
              margin: 0,
            }}>
              He's bringing his harvest to share.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* --- 5. DETAILS GRID --- */}
      <section style={{
        backgroundColor: colors.milk,
        color: colors.shed,
        padding: isMobile ? "80px 28px" : "120px 40px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? 32 : 44,
              letterSpacing: "0.1em",
              margin: "0 0 64px",
              textAlign: "center",
            }}>
              DETAILS
            </h2>
          </FadeIn>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 40 : 64,
          }}>
            <FadeIn delay={0.1}>
              <div>
                <h3 style={{
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  margin: "0 0 12px",
                  opacity: 0.5,
                }}>WHEN</h3>
                <p style={{ fontFamily: fonts.body, fontSize: 17, lineHeight: 1.8, margin: "0 0 4px" }}>Saturday 7 March</p>
                <p style={{ fontFamily: fonts.body, fontSize: 17, lineHeight: 1.8, margin: "0 0 4px" }}>11am - 4pm</p>
                <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.8, opacity: 0.5, margin: 0 }}>Come for an hour or stay for the day</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div>
                <h3 style={{
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  margin: "0 0 12px",
                  opacity: 0.5,
                }}>WHERE</h3>
                <p style={{ fontFamily: fonts.body, fontSize: 17, lineHeight: 1.8, margin: "0 0 4px" }}>The Harvest</p>
                <p style={{ fontFamily: fonts.body, fontSize: 17, lineHeight: 1.8, margin: "0 0 4px" }}>9 Gumland Drive, Witta QLD 4552</p>
                <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.8, opacity: 0.5, margin: "0 0 8px" }}>10 minutes from Maleny</p>
                <a
                  href="https://maps.google.com/?q=9+Gumland+Drive+Witta+QLD+4552"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    color: colors.goldenHour,
                    textDecoration: "none",
                  }}
                >
                  OPEN IN MAPS &rarr;
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div>
                <h3 style={{
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  margin: "0 0 12px",
                  opacity: 0.5,
                }}>BRING</h3>
                <p style={{ fontFamily: fonts.body, fontSize: 17, lineHeight: 1.8, margin: "0 0 4px" }}>A chair or blanket.</p>
                <p style={{ fontFamily: fonts.body, fontSize: 17, lineHeight: 1.8, margin: 0 }}>A story, a skill, a question. Or nothing at all.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div>
                <h3 style={{
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  margin: "0 0 12px",
                  opacity: 0.5,
                }}>PROVIDING</h3>
                <p style={{ fontFamily: fonts.body, fontSize: 17, lineHeight: 1.8, margin: "0 0 4px" }}>
                  Oysters from Moreton Bay. Drinks by{" "}
                  <a
                    href="https://flightbarwitta.com.au/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: colors.shed, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(0,0,0,0.3)" }}
                  >
                    Flight Bar Witta
                  </a>
                  .
                </p>
                <p style={{ fontFamily: fonts.body, fontSize: 17, lineHeight: 1.8, margin: 0 }}>Coffee. Water. Music. Good light. The lawn.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- RSVP FORM --- */}
      <section id="rsvp" style={{
        backgroundColor: colors.shed,
        color: colors.milk,
        padding: isMobile ? "80px 28px" : "120px 40px",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? 28 : 36,
              letterSpacing: "0.08em",
              margin: "0 0 12px",
              textAlign: "center",
            }}>
              SAVE YOUR SPOT
            </h2>
            <p style={{
              fontFamily: fonts.body,
              fontStyle: "italic",
              fontSize: isMobile ? 15 : 17,
              opacity: 0.6,
              textAlign: "center",
              margin: "0 0 12px",
            }}>
              Saturday 7 March. It helps us know how many to expect.
            </p>
            {rsvpCount > 0 && !submitted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  fontFamily: fonts.body,
                  fontSize: isMobile ? 14 : 16,
                  opacity: 0.5,
                  textAlign: "center",
                  margin: "0 0 32px",
                }}
              >
                <strong style={{ fontFamily: fonts.display, fontWeight: 700 }}>
                  <AnimatedCount target={rsvpCount} />
                </strong>{" "}
                neighbours coming so far
              </motion.p>
            )}
            {rsvpCount === 0 && !submitted && <div style={{ marginBottom: 32 }} />}
          </FadeIn>

          {submitted ? (
            <FadeIn>
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: isMobile ? 22 : 28,
                  letterSpacing: "0.04em",
                  margin: "0 0 12px",
                }}>
                  {successMsg.headline}
                </p>
                <p style={{
                  fontFamily: fonts.body,
                  fontSize: 16,
                  lineHeight: 1.7,
                  opacity: 0.6,
                  margin: "0 0 32px",
                }}>
                  {successMsg.sub}
                </p>
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.08em",
                    color: colors.milk,
                    backgroundColor: "transparent",
                    border: `1px solid rgba(245,240,232,0.3)`,
                    padding: "14px 32px",
                    cursor: "pointer",
                  }}
                >
                  {shared ? "LINK COPIED" : "TELL A NEIGHBOUR?"}
                </motion.button>
              </div>
            </FadeIn>
          ) : (
            <FadeIn delay={0.1}>
              <form onSubmit={handleEoiSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={formLabelStyle} htmlFor="eoi-name">YOUR NAME</label>
                  <input
                    id="eoi-name"
                    type="text"
                    placeholder="What do people call you?"
                    value={eoiData.name}
                    onChange={(e) => setEoiData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    style={formInputStyle}
                  />
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 20,
                  marginBottom: 20,
                }}>
                  <div>
                    <label style={formLabelStyle} htmlFor="eoi-email">EMAIL</label>
                    <input
                      id="eoi-email"
                      type="email"
                      placeholder="Best email for updates"
                      value={eoiData.email}
                      onChange={(e) => setEoiData((prev) => ({ ...prev, email: e.target.value }))}
                      style={formInputStyle}
                    />
                  </div>
                  <div>
                    <label style={formLabelStyle} htmlFor="eoi-phone">PHONE</label>
                    <input
                      id="eoi-phone"
                      type="tel"
                      placeholder="For text updates"
                      value={eoiData.phone}
                      onChange={(e) => setEoiData((prev) => ({ ...prev, phone: e.target.value }))}
                      style={formInputStyle}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={eoiMutation.isPending}
                  style={{
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: "0.1em",
                    color: colors.shed,
                    backgroundColor: colors.goldenHour,
                    border: "none",
                    padding: "16px 0",
                    width: "100%",
                    cursor: eoiMutation.isPending ? "not-allowed" : "pointer",
                    opacity: eoiMutation.isPending ? 0.6 : 1,
                  }}
                >
                  {eoiMutation.isPending ? "SENDING..." : "COUNT ME IN"}
                </button>

                {eoiMutation.isError && (
                  <p style={{
                    fontFamily: fonts.body,
                    fontSize: 14,
                    color: colors.calendula,
                    textAlign: "center",
                    marginTop: 16,
                  }}>
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </FadeIn>
          )}
        </div>
      </section>

      {/* --- 6. LOCALS DAY --- */}
      <section style={{
        backgroundColor: colors.hardwood,
        color: colors.milk,
        padding: isMobile ? "80px 28px" : "120px 40px",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
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
              THE DAY BEFORE
            </span>
            <h2 style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? 32 : 44,
              letterSpacing: "0.1em",
              margin: "0 0 24px",
            }}>
              LOCALS DAY
            </h2>
            <p style={{
              fontFamily: fonts.body,
              fontStyle: "italic",
              fontSize: isMobile ? 18 : 22,
              lineHeight: 1.6,
              margin: "0 0 16px",
              opacity: 0.9,
            }}>
              Friday 6 March, afternoon
            </p>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 17 : 19,
              lineHeight: 1.8,
              opacity: 0.8,
              margin: "0 0 48px",
            }}>
              A smaller, quieter start. Come meet the neighbours, walk the site, build something from milk crates, and help us think about what a community space for Witta could look like.
            </p>
          </FadeIn>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
            gap: 32,
            marginBottom: 48,
          }}>
            {[
              { label: "MEET", desc: "Introduce yourself. Hear what your neighbours are thinking." },
              { label: "MAKE", desc: "Build something from milk crates. A pavilion, a seat, a sculpture." },
              { label: "VISION", desc: "Share your ideas. What would you want here? What does Witta need?" },
            ].map((item, i) => (
              <FadeIn key={item.label} delay={0.1 * (i + 1)}>
                <div>
                  <h3 style={{
                    fontFamily: fonts.display,
                    fontWeight: 900,
                    fontSize: 16,
                    letterSpacing: "0.12em",
                    margin: "0 0 10px",
                  }}>
                    {item.label}
                  </h3>
                  <p style={{
                    fontFamily: fonts.body,
                    fontSize: 15,
                    lineHeight: 1.7,
                    opacity: 0.65,
                    margin: 0,
                  }}>
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <div style={{
              borderTop: `1px solid rgba(245,240,232,0.15)`,
              paddingTop: 32,
              maxWidth: 420,
              margin: "0 auto",
            }}>
              {localsDaySubmitted ? (
                <div>
                  <p style={{
                    fontFamily: fonts.display,
                    fontWeight: 900,
                    fontSize: 20,
                    letterSpacing: "0.04em",
                    margin: "0 0 8px",
                  }}>
                    {localsDayData.alsoSaturday ? "You're in for Friday and Saturday." : "You're in for Friday."}
                  </p>
                  <p style={{
                    fontFamily: fonts.body,
                    fontSize: 15,
                    opacity: 0.5,
                    margin: 0,
                  }}>
                    We'll send you the details before the day.
                  </p>
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!localsDayData.email && !localsDayData.phone) return;
                  localsDayMutation.mutate({ name: localsDayData.name, email: localsDayData.email || undefined, phone: localsDayData.phone || undefined });
                  if (localsDayData.alsoSaturday) {
                    eoiMutation.mutate({ name: localsDayData.name, email: localsDayData.email || undefined, phone: localsDayData.phone || undefined });
                  }
                }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: 12,
                    marginBottom: 12,
                  }}>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={localsDayData.name}
                      onChange={(e) => setLocalsDayData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                      style={formInputStyle}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={localsDayData.email}
                      onChange={(e) => setLocalsDayData((prev) => ({ ...prev, email: e.target.value }))}
                      style={formInputStyle}
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone (email or phone needed)"
                    value={localsDayData.phone}
                    onChange={(e) => setLocalsDayData((prev) => ({ ...prev, phone: e.target.value }))}
                    style={{ ...formInputStyle, marginBottom: 4 }}
                  />
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                    cursor: "pointer",
                    fontFamily: fonts.body,
                    fontSize: 14,
                    opacity: 0.7,
                  }}>
                    <input
                      type="checkbox"
                      checked={localsDayData.alsoSaturday}
                      onChange={(e) => setLocalsDayData((prev) => ({ ...prev, alsoSaturday: e.target.checked }))}
                      style={{ width: 18, height: 18, cursor: "pointer" }}
                    />
                    Also sign me up for Saturday's gathering
                  </label>
                  <button
                    type="submit"
                    disabled={localsDayMutation.isPending}
                    style={{
                      fontFamily: fonts.display,
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: "0.1em",
                      color: colors.shed,
                      backgroundColor: colors.goldenHour,
                      border: "none",
                      padding: "14px 0",
                      width: "100%",
                      cursor: localsDayMutation.isPending ? "not-allowed" : "pointer",
                      opacity: localsDayMutation.isPending ? 0.6 : 1,
                    }}
                  >
                    {localsDayMutation.isPending ? "SENDING..." : "COUNT ME IN"}
                  </button>
                  {localsDayMutation.isError && (
                    <p style={{
                      fontFamily: fonts.body,
                      fontSize: 14,
                      color: colors.calendula,
                      textAlign: "center",
                      marginTop: 12,
                    }}>
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- POST-EVENT GALLERY PLACEHOLDER --- */}
      {isPast && (
        <section style={{
          backgroundColor: colors.milk,
          color: colors.shed,
          padding: isMobile ? "80px 28px" : "100px 40px",
          textAlign: "center",
        }}>
          <FadeIn>
            <h2 style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? 24 : 32,
              letterSpacing: "0.06em",
              margin: "0 0 16px",
            }}>
              GALLERY
            </h2>
            <p style={{
              fontFamily: fonts.body,
              fontSize: 16,
              opacity: 0.6,
              maxWidth: 400,
              margin: "0 auto",
            }}>
              Photos from the day are coming soon. Check back or follow us for updates.
            </p>
          </FadeIn>
        </section>
      )}

      {/* --- FOOTER --- */}
      <BauhausFooter isMobile={isMobile} />
    </div>
  );
}
