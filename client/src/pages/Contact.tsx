import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import FadeIn from "@/components/FadeIn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { rootStyle, colors, fonts, detailLabelStyle, detailTextStyle, formLabelStyle, formInputStyle } from "@/styles/brand";
import { SiteFooter, SiteNav } from "./HarvestReviewTest";
import { VisitStrip } from "@/components/VisitStrip";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function Contact() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    subscribe: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Contact The Harvest";
    const meta = (name: string, content: string) => {
      let el = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    meta("og:title", "Contact The Harvest");
    meta("og:description", "Questions, ideas, or just want to say hello.");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/contact-form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "", subscribe: false });
    } catch (error) {
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={rootStyle}>
      <SiteNav />

      {/* ─── HERO ─── */}
      <section style={{
        backgroundColor: colors.milk,
        padding: isMobile ? "100px 28px 60px" : "140px 40px 80px",
        textAlign: "center",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: isMobile ? "clamp(32px, 8vw, 48px)" : "clamp(48px, 5vw, 64px)",
            letterSpacing: "0.12em",
            color: colors.shed,
            margin: 0,
          }}>
            GET IN TOUCH
          </h1>
          <p style={{
            fontFamily: fonts.body,
            fontSize: isMobile ? 16 : 18,
            color: colors.shed,
            opacity: 0.6,
            margin: "16px 0 0",
            maxWidth: 540,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.55,
          }}>
            The Harvest is in Witta, on Jinibara Country, at the old nursery. You do not need to book to come and have a look while we find our feet. Use the form below, or one of the paths beneath it.
          </p>
        </motion.div>
      </section>

      {/* ─── FORM / THANK YOU ─── */}
      <section style={{
        backgroundColor: colors.shed,
        padding: isMobile ? "60px 28px" : "80px 40px",
      }}>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              maxWidth: 520,
              margin: "0 auto",
              textAlign: "center",
              padding: isMobile ? "40px 0" : "60px 0",
            }}
          >
            <div style={{
              fontSize: isMobile ? 48 : 64,
              marginBottom: 24,
            }}>
              Thank you
            </div>
            <h2 style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? 24 : 32,
              letterSpacing: "0.08em",
              color: colors.milk,
              margin: "0 0 16px",
            }}>
              MESSAGE RECEIVED
            </h2>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 16 : 18,
              color: colors.milk,
              opacity: 0.7,
              lineHeight: 1.6,
              margin: "0 0 32px",
            }}>
              We've got your message. We read everything. Replies can take a few
              days while we find our feet.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.1em",
                color: colors.shed,
                backgroundColor: colors.goldenHour,
                border: "none",
                padding: "14px 32px",
                cursor: "pointer",
              }}
            >
              SEND ANOTHER MESSAGE
            </button>
          </motion.div>
        ) : (
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <FadeIn>
            <form onSubmit={handleSubmit}>
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 20,
                marginBottom: 20,
              }}>
                <div>
                  <label style={formLabelStyle} htmlFor="name">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Jane Smith"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    style={formInputStyle}
                  />
                </div>
                <div>
                  <label style={formLabelStyle} htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    style={formInputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={formLabelStyle} htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                  required
                  style={formInputStyle}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={formLabelStyle} htmlFor="message">Message</label>
                <textarea
                  id="message"
                  placeholder="Tell us what's on your mind..."
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  required
                  rows={6}
                  style={{ ...formInputStyle, resize: "vertical", minHeight: 150 }}
                />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                }}>
                  <input
                    type="checkbox"
                    checked={formData.subscribe}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subscribe: e.target.checked }))}
                    style={{
                      width: 18,
                      height: 18,
                      accentColor: colors.goldenHour,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{
                    fontFamily: fonts.body,
                    fontSize: 14,
                    color: colors.milk,
                    opacity: 0.7,
                  }}>
                    Keep me in the loop, send me occasional updates
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
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
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          </FadeIn>
        </div>
        )}
      </section>

      {/* ─── DETAILS ─── */}
      <section style={{
        backgroundColor: colors.milk,
        color: colors.shed,
        padding: isMobile ? "60px 28px" : "80px 40px",
      }}>
        <div style={{
          maxWidth: 640,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 36 : 48,
        }}>
          <FadeIn>
            <div>
              <h3 style={detailLabelStyle}>VISIT US</h3>
              <p style={detailTextStyle}>The Harvest</p>
              <p style={detailTextStyle}>9 Gumland Drive</p>
              <p style={detailTextStyle}>Witta QLD 4552</p>
              <p style={{ ...detailTextStyle, opacity: 0.5, fontSize: 14, marginTop: 8 }}>
                Near Maleny, in the Sunshine Coast Hinterland
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div>
              <h3 style={detailLabelStyle}>EMAIL</h3>
              <a href="mailto:hello@theharvestwitta.com.au" style={{
                ...detailTextStyle,
                color: colors.shed,
                textDecoration: "underline",
                textUnderlineOffset: 4,
              }}>
                hello@theharvestwitta.com.au
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div>
              <h3 style={detailLabelStyle}>PHONE</h3>
              <a href="tel:+61422883943" style={{
                ...detailTextStyle,
                color: colors.shed,
                textDecoration: "none",
              }}>
                0422 883 943
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div>
              <h3 style={detailLabelStyle}>VISITS</h3>
              <p style={detailTextStyle}>
                You do not need to book to come and have a look while we find our feet.
              </p>
              <p style={{ ...detailTextStyle, opacity: 0.5, fontSize: 14, marginTop: 8 }}>
                Members hear about open days and events first.{" "}
                <a
                  href="/membership"
                  style={{ color: colors.shed, textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  Membership is free
                </a>.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── MAP ─── */}
      <section style={{
        backgroundColor: colors.milk,
        padding: isMobile ? "0 28px 60px" : "0 40px 80px",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ height: 400, overflow: "hidden" }}>
              <iframe
                title="The Harvest location map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=152.80%2C-26.73%2C152.84%2C-26.70&layer=mapnik&marker=-26.7176%2C152.8178"
              />
            </div>
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=-26.7176,152.8178"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  color: colors.shed,
                  textDecoration: "none",
                  borderBottom: `2px solid ${colors.shed}`,
                  paddingBottom: 2,
                }}
              >
                GET DIRECTIONS
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <VisitStrip />
      <SiteFooter />
    </div>
  );
}
