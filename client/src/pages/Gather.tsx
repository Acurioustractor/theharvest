import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import BauhausFooter from "@/components/BauhausFooter";
import FadeIn from "@/components/FadeIn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { rootStyle, colors, fonts, detailLabelStyle, detailTextStyle, formLabelStyle, formInputStyle } from "@/styles/brand";
import { trpc } from "@/lib/trpc";

export default function Gather() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [eoiData, setEoiData] = useState({
    name: "",
    email: "",
    excitement: "",
    source: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const eoiMutation = trpc.eoi.submit.useMutation({
    onSuccess: () => setSubmitted(true),
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
    meta("og:description", "Oysters, a milk crate pavilion, and the beginning of something. 9 Gumland Drive, Witta.");
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

  return (
    <div style={rootStyle}>

      {/* ─── 1. HERO ─── */}
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
            Saturday 7 March 2026, from 11am
          </p>
          <p style={{
            fontFamily: fonts.body,
            fontWeight: 400,
            fontSize: isMobile ? 14 : 16,
            margin: "12px 0 0",
            opacity: 0.6,
          }}>
            9 Gumland Drive, Witta
          </p>
          <p style={{
            fontFamily: fonts.body,
            fontWeight: 400,
            fontSize: isMobile ? 14 : 16,
            margin: "24px 0 0",
            opacity: 0.7,
            fontStyle: "italic",
          }}>
            Come as you are. Bring something to share.
          </p>
        </div>
      </section>

      {/* ─── 2. THE INVITATION ─── */}
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
              No tickets. No agenda. No speeches. Just food, music, and the people who show up. This is how it begins. Not with a grand opening, but with a table.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── 3. WHAT'S HAPPENING — Color bands ─── */}
      {([
        {
          word: "FEED",
          color: colors.red,
          textColor: colors.cream,
          lines: [
            "Oysters fresh from Minjerribah.",
            "Shaun Fisher. Quandamooka man, oyster farmer, the first person to say yes.",
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

      {/* ─── 4. PRACTICAL DETAILS ─── */}
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
                <p style={detailTextStyle}>From 11am</p>
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
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div>
                <h3 style={detailLabelStyle}>WHAT TO BRING</h3>
                <p style={detailTextStyle}>A chair or picnic blanket</p>
                <p style={detailTextStyle}>BYO drinks (we'll have water and coffee)</p>
                <p style={detailTextStyle}>Something to share (food, story, skill)</p>
                <p style={detailTextStyle}>Kids, dogs (on leads), neighbours</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div>
                <h3 style={detailLabelStyle}>WHAT WE'RE PROVIDING</h3>
                <p style={detailTextStyle}>Oysters — pay what you feel</p>
                <p style={detailTextStyle}>Pizza from the trailer</p>
                <p style={detailTextStyle}>Music, fire, good light</p>
                <p style={{ ...detailTextStyle, opacity: 0.5, fontSize: 14, marginTop: 8 }}>
                  Free entry. Come and go as you please.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── 5. EOI FORM ─── */}
      <section style={{
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
              margin: "0 0 40px",
            }}>
              No commitment, just helps us know how many oysters to shuck.
            </p>
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
                  See you on March 7.
                </p>
                <p style={{
                  fontFamily: fonts.body,
                  fontSize: 16,
                  opacity: 0.6,
                }}>
                  We'll be in touch closer to the day.
                </p>
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
                    <label style={formLabelStyle} htmlFor="eoi-name">Your Name</label>
                    <input
                      id="eoi-name"
                      type="text"
                      placeholder="Jane Smith"
                      value={eoiData.name}
                      onChange={(e) => setEoiData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                      style={formInputStyle}
                    />
                  </div>
                  <div>
                    <label style={formLabelStyle} htmlFor="eoi-email">Email</label>
                    <input
                      id="eoi-email"
                      type="email"
                      placeholder="jane@example.com"
                      value={eoiData.email}
                      onChange={(e) => setEoiData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      style={formInputStyle}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={formLabelStyle} htmlFor="eoi-excitement">
                    What excites you most about The Harvest?
                  </label>
                  <textarea
                    id="eoi-excitement"
                    placeholder="Tell us in a sentence or two..."
                    value={eoiData.excitement}
                    onChange={(e) => setEoiData((prev) => ({ ...prev, excitement: e.target.value }))}
                    rows={3}
                    style={{ ...formInputStyle, resize: "vertical", minHeight: 80 }}
                  />
                </div>

                <div style={{ marginBottom: 32 }}>
                  <label style={formLabelStyle} htmlFor="eoi-source">
                    How did you hear about us?
                  </label>
                  <select
                    id="eoi-source"
                    value={eoiData.source}
                    onChange={(e) => setEoiData((prev) => ({ ...prev, source: e.target.value }))}
                    style={{
                      ...formInputStyle,
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23F4F4F2' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                      paddingRight: 40,
                    }}
                  >
                    <option value="" style={{ color: colors.black }}>Select...</option>
                    <option value="Word of mouth" style={{ color: colors.black }}>Word of mouth</option>
                    <option value="Social media" style={{ color: colors.black }}>Social media</option>
                    <option value="Local paper" style={{ color: colors.black }}>Local paper</option>
                    <option value="A friend sent me the link" style={{ color: colors.black }}>A friend sent me the link</option>
                    <option value="Other" style={{ color: colors.black }}>Other</option>
                  </select>
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

      {/* ─── 6. REGIONAL ARTS CONTEXT ─── */}
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

      {/* ─── FOOTER ─── */}
      <BauhausFooter isMobile={isMobile} />
    </div>
  );
}
