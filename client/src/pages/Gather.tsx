import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import BauhausFooter from "@/components/BauhausFooter";
import FadeIn from "@/components/FadeIn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { rootStyle, colors, fonts, detailLabelStyle, detailTextStyle, formLabelStyle, formInputStyle } from "@/styles/brand";
import { trpc } from "@/lib/trpc";

const GATHERING_DATE = new Date("2026-03-07T11:00:00+10:00");

const SUCCESS_MESSAGES = [
  { headline: "You're in. See you March 7.", sub: "We'll send you a few details before the day. Where to park, what's happening, who else is coming." },
  { headline: "Spot saved. Bring your appetite.", sub: "Shaun's shucking oysters, pizza's firing, and we'll have a seat for you." },
  { headline: "Done. Now tell a friend.", sub: "The best gatherings happen when neighbours bring neighbours." },
];

const INTEREST_OPTIONS = [
  { id: "kids-play", label: "Kids play area" },
  { id: "cafe", label: "Cafe" },
  { id: "garden", label: "Garden" },
  { id: "pop-up-events", label: "Pop up events" },
  { id: "art-exhibitions", label: "Art exhibitions" },
  { id: "something-else", label: "Something else" },
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
  const [eoiData, setEoiData] = useState({
    name: "",
    email: "",
    excitement: "",
    source: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [successMsg] = useState(() => SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]);
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [otherText, setOtherText] = useState("");
  const [pollSubmitted, setPollSubmitted] = useState(false);
  const [pollCounts, setPollCounts] = useState<Record<string, number>>({});
  const [pollTotal, setPollTotal] = useState(0);
  const [shared, setShared] = useState(false);

  const countdown = useCountdown(GATHERING_DATE);
  const isPast = countdown === null;

  const eoiMutation = trpc.eoi.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const eoiCountQuery = trpc.eoi.count.useQuery(undefined, {
    staleTime: 60_000,
  });

  const pollResultsQuery = trpc.interestPoll.results.useQuery(undefined, {
    staleTime: 30_000,
  });

  const pollVoteMutation = trpc.interestPoll.vote.useMutation({
    onSuccess: () => {
      pollResultsQuery.refetch();
    },
  });

  useEffect(() => {
    if (pollResultsQuery.data) {
      setPollCounts(pollResultsQuery.data.counts ?? {});
      setPollTotal(pollResultsQuery.data.total ?? 0);
    }
  }, [pollResultsQuery.data]);

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
    meta("og:description", "Oysters, a milk crate pavilion, and the beginning of something. 9 Gumland Drive, Witta.");

    if (window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, []);

  const handleEoiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    eoiMutation.mutate({
      name: eoiData.name,
      email: eoiData.email,
      excitement: eoiData.excitement || undefined,
      source: eoiData.source || undefined,
    });
  };

  const toggleInterest = (id: string) => {
    if (pollSubmitted) return;
    setSelectedInterests(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handlePollSubmit = () => {
    if (selectedInterests.size === 0 || pollSubmitted) return;
    pollVoteMutation.mutate({
      interests: Array.from(selectedInterests),
      other: selectedInterests.has("something-else") ? otherText || undefined : undefined,
    });
    setPollSubmitted(true);
  };

  const handleShare = async () => {
    const shareData = {
      title: "The Harvest -First Gathering",
      text: "I'm going to The Harvest's First Gathering. March 7, Witta. Free entry, oysters, music, building things together.",
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
          backgroundColor: "rgba(0,0,0,0.40)",
          zIndex: 1,
        }} />
        <div style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: colors.cream,
          padding: "0 24px",
        }}>
          <h1 style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: isMobile ? "clamp(32px, 9vw, 52px)" : "clamp(52px, 5.5vw, 76px)",
            letterSpacing: "0.14em",
            margin: 0,
            lineHeight: 1.1,
          }}>
            FIRST GATHERING
          </h1>
          <p style={{
            fontFamily: fonts.body,
            fontWeight: 400,
            fontSize: isMobile ? 18 : 24,
            letterSpacing: "0.12em",
            margin: "28px 0 0",
            opacity: 0.9,
          }}>
            Saturday 7 March, 11am – 4pm
          </p>
          <p style={{
            fontFamily: fonts.body,
            fontWeight: 400,
            fontSize: isMobile ? 13 : 15,
            margin: "8px 0 0",
            opacity: 0.5,
          }}>
            Come for an hour or stay for the day
          </p>
          <p style={{
            fontFamily: fonts.body,
            fontWeight: 400,
            fontSize: isMobile ? 14 : 16,
            margin: "12px 0 0",
            opacity: 0.6,
          }}>
            9 Gumland Drive, Witta &middot; Free entry
          </p>

          {/* Countdown Timer */}
          {countdown && !countdown.isUnder24h && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{
                marginTop: 32,
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

          {isPast ? (
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
          ) : (
            <p style={{
              fontFamily: fonts.body,
              fontWeight: 400,
              fontSize: isMobile ? 16 : 18,
              margin: "28px 0 0",
              opacity: 0.8,
              fontStyle: "italic",
            }}>
              Come as you are.
            </p>
          )}

          {!isPast && (
            <a
              href="#rsvp"
              style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.1em",
                color: colors.black,
                backgroundColor: colors.yellow,
                padding: "16px 40px",
                textDecoration: "none",
                display: "inline-block",
                marginTop: 28,
              }}
            >
              SAVE MY SPOT
            </a>
          )}
        </div>
      </section>

      {/* --- 2. THE INVITATION --- */}
      <section style={{
        backgroundColor: colors.black,
        color: colors.cream,
        padding: isMobile ? "80px 28px" : "120px 40px",
      }}>
        <div style={{
          maxWidth: 600,
          margin: "0 auto",
          textAlign: "center",
        }}>
          <FadeIn>
            <p style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.2em",
              opacity: 0.5,
              marginBottom: 24,
            }}>
              THE INVITATION
            </p>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 18 : 22,
              lineHeight: 1.9,
              opacity: 0.85,
              margin: 0,
            }}>
              No tickets. No agenda. No speeches. Just food, music, and the people who show up. Come see the place for yourself. This is how it begins.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* --- 3. WHAT'S HAPPENING -Color bands --- */}
      {([
        {
          word: "FEED",
          color: colors.red,
          textColor: colors.cream,
          lines: [
            "Oysters fresh from Minjerribah.",
            "",
            "Shaun Fisher, Quandamooka man and oyster farmer, was the first person to say yes to this place. We're honoured he's bringing his harvest to ours.",
            "",
            "Pizza from the trailer. BYO picnic.",
          ],
        },
        {
          word: "BUILD",
          color: colors.yellow,
          textColor: colors.black,
          lines: [
            "Milk crate pavilion.",
            "Bring your hands. We'll build it together.",
            "",
            "This is the launch of our Regional Arts Australia project, exploring the dairy, timber and co-op heritage of this ridge.",
          ],
        },
        {
          word: "GATHER",
          color: colors.blue,
          textColor: colors.cream,
          lines: [
            "Drinks. Music. Kids welcome. Dogs on leads.",
            "Everyone shares a table.",
            "",
            "Come for an hour or stay all afternoon. No pressure, no program.",
          ],
        },
      ] as const).map((band) => (
        <section key={band.word} style={{
          backgroundColor: band.color,
          color: band.textColor,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: isMobile ? "40vh" : "45vh",
        }}>
          <div style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: isMobile ? "60px 28px" : "80px 40px",
          }}>
            <FadeIn>
              <h2 style={{
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: "clamp(44px, 9vw, 100px)",
                letterSpacing: "0.08em",
                margin: 0,
                lineHeight: 1,
              }}>
                {band.word}
              </h2>
              <div style={{
                fontFamily: fonts.body,
                fontWeight: 400,
                fontSize: isMobile ? 15 : 18,
                lineHeight: 1.8,
                margin: "24px auto 0",
                opacity: 0.85,
                maxWidth: 480,
              }}>
                {band.lines.map((line, i) =>
                  line === "" ? <br key={i} /> : <p key={i} style={{ margin: "4px 0" }}>{line}</p>
                )}
              </div>
            </FadeIn>
          </div>
        </section>
      ))}

      {/* --- INTEREST POLL --- */}
      {!isPast && (
        <section style={{
          backgroundColor: colors.black,
          color: colors.cream,
          padding: isMobile ? "60px 28px" : "80px 40px",
        }}>
          <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
            <FadeIn>
              <h3 style={{
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: isMobile ? 20 : 26,
                letterSpacing: "0.06em",
                margin: "0 0 8px",
              }}>
                WHAT EXCITES YOU MOST?
              </h3>
              <p style={{
                fontFamily: fonts.body,
                fontSize: 14,
                opacity: 0.5,
                margin: "0 0 32px",
              }}>
                Pick as many as you like. Helps us know what to build first.
              </p>

              {pollSubmitted ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left" }}>
                    {INTEREST_OPTIONS.filter(o => o.id !== "something-else").map((opt) => {
                      const dbCount = pollCounts[opt.id] ?? 0;
                      const count = dbCount + (selectedInterests.has(opt.id) ? 1 : 0);
                      const allCounts = INTEREST_OPTIONS
                        .filter(o => o.id !== "something-else")
                        .map(o => (pollCounts[o.id] ?? 0) + (selectedInterests.has(o.id) ? 1 : 0));
                      const maxCount = Math.max(1, ...allCounts);
                      const pct = Math.round((count / maxCount) * 100);
                      return (
                        <div key={opt.id}>
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontFamily: fonts.display,
                            fontWeight: 700,
                            fontSize: 12,
                            letterSpacing: "0.05em",
                            marginBottom: 4,
                          }}>
                            <span style={{ opacity: selectedInterests.has(opt.id) ? 1 : 0.6 }}>{opt.label}</span>
                            <span style={{ opacity: 0.5 }}>{count}</span>
                          </div>
                          <div style={{
                            height: 4,
                            backgroundColor: "rgba(244,244,242,0.1)",
                            overflow: "hidden",
                          }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              style={{
                                height: "100%",
                                backgroundColor: selectedInterests.has(opt.id) ? colors.yellow : "rgba(244,244,242,0.4)",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p style={{
                    fontFamily: fonts.body,
                    fontSize: 13,
                    opacity: 0.4,
                    marginTop: 20,
                  }}>
                    {pollTotal + 1} {pollTotal + 1 === 1 ? "person has" : "people have"} voted
                  </p>
                </motion.div>
              ) : (
                <>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
                    gap: 10,
                  }}>
                    {INTEREST_OPTIONS.map((opt) => {
                      const isSelected = selectedInterests.has(opt.id);
                      return (
                        <motion.button
                          key={opt.id}
                          onClick={() => toggleInterest(opt.id)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            fontFamily: fonts.display,
                            fontWeight: 700,
                            fontSize: 12,
                            letterSpacing: "0.05em",
                            color: isSelected ? colors.black : colors.cream,
                            backgroundColor: isSelected ? colors.yellow : "transparent",
                            border: `1px solid ${isSelected ? colors.yellow : "rgba(244,244,242,0.2)"}`,
                            padding: "14px 12px",
                            cursor: "pointer",
                            transition: "background-color 0.2s, color 0.2s",
                          }}
                        >
                          {opt.label}
                        </motion.button>
                      );
                    })}
                  </div>

                  {selectedInterests.has("something-else") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      style={{ marginTop: 12 }}
                    >
                      <input
                        type="text"
                        placeholder="Tell us what you'd love to see"
                        value={otherText}
                        onChange={(e) => setOtherText(e.target.value)}
                        style={{
                          ...formInputStyle,
                          width: "100%",
                        }}
                      />
                    </motion.div>
                  )}

                  <motion.button
                    onClick={handlePollSubmit}
                    disabled={selectedInterests.size === 0}
                    whileHover={selectedInterests.size > 0 ? { scale: 1.02 } : {}}
                    whileTap={selectedInterests.size > 0 ? { scale: 0.98 } : {}}
                    style={{
                      fontFamily: fonts.display,
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: "0.08em",
                      color: selectedInterests.size > 0 ? colors.black : colors.cream,
                      backgroundColor: selectedInterests.size > 0 ? colors.yellow : "transparent",
                      border: `1px solid ${selectedInterests.size > 0 ? colors.yellow : "rgba(244,244,242,0.15)"}`,
                      padding: "14px 32px",
                      cursor: selectedInterests.size > 0 ? "pointer" : "default",
                      marginTop: 20,
                      opacity: selectedInterests.size > 0 ? 1 : 0.3,
                      transition: "all 0.2s",
                    }}
                  >
                    SUBMIT
                  </motion.button>
                </>
              )}
            </FadeIn>
          </div>
        </section>
      )}

      {/* --- 4. PRACTICAL DETAILS --- */}
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
            <h2 style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? 28 : 36,
              letterSpacing: "0.06em",
              margin: "0 0 48px",
              textAlign: "center",
            }}>
              DETAILS
            </h2>
          </FadeIn>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 36 : 48,
          }}>
            <FadeIn delay={0.1}>
              <div>
                <h3 style={detailLabelStyle}>WHEN</h3>
                <p style={detailTextStyle}>Saturday 7 March</p>
                <p style={detailTextStyle}>11am – 4pm</p>
                <p style={{ ...detailTextStyle, opacity: 0.5, fontSize: 14 }}>
                  Come for an hour or stay for the day
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div>
                <h3 style={detailLabelStyle}>WHERE</h3>
                <p style={detailTextStyle}>The Harvest</p>
                <p style={detailTextStyle}>9 Gumland Drive, Witta QLD 4552</p>
                <p style={{ ...detailTextStyle, opacity: 0.5, fontSize: 14 }}>
                  10 minutes from Maleny
                </p>
                <a
                  href="https://maps.google.com/?q=9+Gumland+Drive+Witta+QLD+4552"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    color: colors.black,
                    opacity: 0.6,
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(0,0,0,0.2)",
                    paddingBottom: 2,
                    display: "inline-block",
                    marginTop: 8,
                  }}
                >
                  OPEN IN MAPS &rarr;
                </a>
                <p style={{ ...detailTextStyle, opacity: 0.4, fontSize: 13, marginTop: 8 }}>
                  Follow the signs from the gate. Parking on grass.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div>
                <h3 style={detailLabelStyle}>WHAT TO BRING</h3>
                <p style={detailTextStyle}>A chair or picnic blanket</p>
                <p style={detailTextStyle}>BYO drinks (we'll have water and coffee)</p>
                <p style={detailTextStyle}>Something to share. Food, story, skill. Or nothing. Either's fine.</p>
                <p style={detailTextStyle}>Kids, dogs (on leads), neighbours</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div>
                <h3 style={detailLabelStyle}>WHAT WE'RE PROVIDING</h3>
                <p style={detailTextStyle}>Oysters, pay what you feel</p>
                <p style={detailTextStyle}>Pizza from the trailer</p>
                <p style={detailTextStyle}>Music, fire, good light</p>
                <p style={{ ...detailTextStyle, fontWeight: 600, marginTop: 8 }}>
                  Free entry. Come and go as you please.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- 5. EOI FORM --- */}
      <section id="rsvp" style={{
        backgroundColor: colors.black,
        color: colors.cream,
        padding: isMobile ? "80px 28px" : "100px 40px",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? 24 : 32,
              letterSpacing: "0.06em",
              margin: "0 0 12px",
              textAlign: "center",
            }}>
              LET US KNOW YOU'RE COMING
            </h2>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 14 : 16,
              opacity: 0.6,
              textAlign: "center",
              margin: "0 0 12px",
            }}>
              No commitment. It just helps Shaun know how many to shuck.
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

                {/* Share Button */}
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.08em",
                    color: colors.cream,
                    backgroundColor: "transparent",
                    border: `1px solid rgba(244,244,242,0.3)`,
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
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 20,
                  marginBottom: 20,
                }}>
                  <div>
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
                  <div>
                    <label style={formLabelStyle} htmlFor="eoi-email">EMAIL</label>
                    <input
                      id="eoi-email"
                      type="email"
                      placeholder="Best email for updates"
                      value={eoiData.email}
                      onChange={(e) => setEoiData((prev) => ({ ...prev, email: e.target.value }))}
                      required
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
                    color: colors.black,
                    backgroundColor: colors.yellow,
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
                    color: colors.red,
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

      {/* --- POST-EVENT GALLERY PLACEHOLDER --- */}
      {isPast && (
        <section style={{
          backgroundColor: colors.cream,
          color: colors.black,
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

      {/* --- 6. REGIONAL ARTS CONTEXT --- */}
      <section style={{
        backgroundColor: colors.cream,
        color: colors.black,
        padding: isMobile ? "80px 28px" : "100px 40px",
      }}>
        <div style={{
          maxWidth: 560,
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
              marginBottom: 16,
            }}>
              REGIONAL ARTS AUSTRALIA
            </span>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 15 : 17,
              lineHeight: 1.9,
              opacity: 0.7,
              margin: "0 0 24px",
            }}>
              This gathering is the first chapter of a project exploring the dairy, timber and co-op heritage of the Blackall Range. Through photography, oral histories, and building things from recycled materials.
            </p>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 15 : 17,
              lineHeight: 1.9,
              opacity: 0.7,
              margin: "0 0 32px",
            }}>
              We're looking for stories, old equipment, photographs, and anyone who remembers. If that's you, get in touch.
            </p>
            <Link href="/contact" style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.1em",
              color: colors.black,
              textDecoration: "none",
              borderBottom: `2px solid ${colors.black}`,
              paddingBottom: 2,
            }}>
              GET IN TOUCH
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <BauhausFooter isMobile={isMobile} />
    </div>
  );
}
