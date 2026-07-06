import { useEffect } from "react";
import { Link } from "wouter";
import { Ear, Hammer, UtensilsCrossed } from "lucide-react";
import BauhausFooter from "@/components/BauhausFooter";
import FadeIn from "@/components/FadeIn";
import { VisitStrip } from "@/components/VisitStrip";
import { SiteNav } from "./HarvestReviewTest";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { rootStyle, colors, fonts } from "@/styles/brand";

export default function Gather() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    document.title = "Gather | The Harvest";
    const meta = (name: string, content: string) => {
      let el = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    meta("og:title", "Gather | The Harvest");
    meta("og:description", "Community gatherings at The Harvest. 9 Gumland Drive, Witta, Sunshine Coast Hinterland.");

    if (window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, []);

  return (
    <div style={rootStyle}>
      <SiteNav />

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
          <Link href="/" style={{ textDecoration: "none", display: "block", marginBottom: 24 }}>
            <img
              src="/images/logo-harvest-only-clean.png"
              alt="THE HARVEST"
              style={{
                height: 32,
                width: "auto",
                filter: "brightness(0) invert(1)",
                opacity: 0.6,
                display: "block",
                margin: "0 auto",
              }}
            />
          </Link>
          <h1 style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: isMobile ? "clamp(36px, 10vw, 56px)" : "clamp(56px, 6vw, 80px)",
            letterSpacing: "0.14em",
            margin: 0,
            lineHeight: 1.1,
          }}>
            GATHER
          </h1>
          <p style={{
            fontFamily: fonts.body,
            fontStyle: "italic",
            fontSize: isMobile ? 18 : 24,
            margin: "28px auto 0",
            maxWidth: 600,
            opacity: 0.9,
          }}>
            Community gatherings at The Harvest
          </p>
          <p style={{
            fontFamily: fonts.body,
            fontSize: isMobile ? 14 : 16,
            margin: "8px 0 0",
            opacity: 0.6,
          }}>
            9 Gumland Drive, Witta
          </p>
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
              Our first gathering brought neighbours to the lawn with oysters from Moreton Bay, drinks from{" "}
              <a
                href="https://flightbarwitta.com.au/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: colors.shed, fontWeight: 600, textDecoration: "none", borderBottom: `1px solid rgba(0,0,0,0.3)` }}
              >
                Flight Bar Witta
              </a>
              , and an open question: what would you build here? In June 2026 The Harvest opened with a first members and makers day, and more gatherings will follow. New dates land with{" "}
              <Link href="/membership" style={{ color: colors.shed, fontWeight: 600, textDecoration: "none", borderBottom: `1px solid rgba(0,0,0,0.3)` }}>
                members
              </Link>{" "}
              first. Got an answer to the question?{" "}
              <Link href="/get-involved?form=idea" style={{ color: colors.shed, fontWeight: 600, textDecoration: "none", borderBottom: `1px solid rgba(0,0,0,0.3)` }}>
                Tell us
              </Link>
              .
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
              WHAT WE DO
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
                icon: Ear,
              },
              {
                title: "MAKE",
                desc: "Build something together. Hands-on, collaborative, open. Bring an idea or just bring your hands.",
                icon: Hammer,
              },
              {
                title: "SHARE",
                desc: "Food, fire, and the question: what would you build here?",
                icon: UtensilsCrossed,
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: isMobile ? 100 : 120,
                    height: isMobile ? 100 : 120,
                    margin: "0 auto 32px",
                    borderRadius: "50%",
                    border: `1px solid rgba(245,240,232,0.15)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <item.icon
                      size={isMobile ? 40 : 48}
                      strokeWidth={1.2}
                      color={colors.milk}
                      style={{ opacity: 0.7 }}
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
              He has brought his harvest to share at our gatherings.
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
              THE FIRST GATHERING
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
                }}>WHEN IT WAS</h3>
                <p style={{ fontFamily: fonts.body, fontSize: 17, lineHeight: 1.8, margin: "0 0 4px" }}>Saturday 7 March 2026</p>
                <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.8, opacity: 0.5, margin: 0 }}>An open afternoon on the lawn</p>
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
                }}>WHAT PEOPLE BROUGHT</h3>
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
                }}>ON THE TABLE</h3>
                <p style={{ fontFamily: fonts.body, fontSize: 17, lineHeight: 1.8, margin: "0 0 4px" }}>
                  Simple food and drinks, with local friends like{" "}
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
                <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.8, opacity: 0.5, margin: "8px 0 0" }}>
                  The next dates land with{" "}
                  <Link href="/membership" style={{ color: colors.shed, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(0,0,0,0.3)" }}>
                    members
                  </Link>{" "}
                  first. Membership is free.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- WHAT TO EXPECT --- */}
      <section id="what-to-expect" style={{
        backgroundColor: colors.milk,
        color: colors.shed,
        padding: isMobile ? "80px 28px" : "120px 40px",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? "clamp(24px, 6vw, 32px)" : "clamp(32px, 3vw, 40px)",
              letterSpacing: "0.08em",
              textAlign: "center",
              margin: "0 0 16px",
            }}>
              WHAT GATHERINGS ARE LIKE
            </h2>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 15 : 17,
              lineHeight: 1.7,
              textAlign: "center",
              opacity: 0.6,
              margin: "0 0 48px",
            }}>
              9 Gumland Drive, Witta. New dates land with{" "}
              <Link href="/membership" style={{ color: colors.shed, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(0,0,0,0.3)" }}>
                members
              </Link>{" "}
              first.
            </p>
          </FadeIn>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 32 : 40,
          }}>
            <FadeIn delay={0.1}>
              <div>
                <h3 style={{
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 14,
                  letterSpacing: "0.12em",
                  color: colors.goldenHour,
                  margin: "0 0 12px",
                }}>
                  THE FEEL
                </h3>
                <p style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 1.7, margin: 0, opacity: 0.8 }}>
                  Relaxed, open-air, on the property. You hear what is happening in the garden and at The Harvest, meet your neighbours, and see the place for yourself. No tickets, no schedule.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div>
                <h3 style={{
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 14,
                  letterSpacing: "0.12em",
                  color: colors.goldenHour,
                  margin: "0 0 12px",
                }}>
                  FOOD & DRINK
                </h3>
                <p style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 1.7, margin: 0, opacity: 0.8 }}>
                  Food is shared. Bring something along if you'd like: a plate, a bottle, whatever feels right.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div>
                <h3 style={{
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 14,
                  letterSpacing: "0.12em",
                  color: colors.goldenHour,
                  margin: "0 0 12px",
                }}>
                  WHAT TO BRING
                </h3>
                <p style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 1.7, margin: 0, opacity: 0.8 }}>
                  A rug or camp chair. Sun protection. Your kids, your dog, your curiosity.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div>
                <h3 style={{
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 14,
                  letterSpacing: "0.12em",
                  color: colors.goldenHour,
                  margin: "0 0 12px",
                }}>
                  PARKING & ACCESS
                </h3>
                <p style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 1.7, margin: 0, opacity: 0.8 }}>
                  Park on Gumland Drive (plenty of space along the road). Walk in through the main gate. Look for the signs. If you get lost, call Nic on 0424 054 113 or Ben on 0431 590 498.
                </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3}>
            <div style={{ textAlign: "center", marginTop: 48 }}>
              <Link href="/photo-wall" style={{ textDecoration: "none" }}>
                <span style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  color: colors.milk,
                  backgroundColor: colors.shed,
                  padding: "14px 32px",
                  display: "inline-block",
                  cursor: "pointer",
                }}>
                  VISIT THE PHOTO WALL
                </span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- PHOTO WALL CTA --- */}
      <section style={{
        backgroundColor: colors.shed,
        color: colors.milk,
        padding: isMobile ? "80px 28px" : "120px 40px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? 28 : 36,
              letterSpacing: "0.08em",
              margin: "0 0 12px",
            }}>
              PHOTO WALL
            </h2>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 15 : 17,
              opacity: 0.6,
              margin: "0 0 32px",
              lineHeight: 1.7,
            }}>
              Browse and share photos from our gatherings.
            </p>
            <Link href="/photo-wall" style={{ textDecoration: "none" }}>
              <span style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.1em",
                color: colors.shed,
                backgroundColor: colors.goldenHour,
                padding: "16px 40px",
                display: "inline-block",
                cursor: "pointer",
              }}>
                VISIT THE PHOTO WALL
              </span>
            </Link>
          </FadeIn>
        </div>
      </section>

      <VisitStrip />

      {/* --- FOOTER --- */}
      <BauhausFooter isMobile={isMobile} />
    </div>
  );
}
