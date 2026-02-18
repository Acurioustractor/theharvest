import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import BauhausFooter from "@/components/BauhausFooter";
import FadeIn from "@/components/FadeIn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { rootStyle, colors, fonts, detailLabelStyle, detailTextStyle, formLabelStyle, formInputStyle } from "@/styles/brand";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

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

  useEffect(() => {
    document.title = "Get In Touch — The Harvest";
    const meta = (name: string, content: string) => {
      let el = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    meta("og:title", "Get In Touch — The Harvest");
    meta("og:description", "Questions, ideas, or just want to say hello.");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/contact-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send message");
      }

      toast.success("Message sent!", {
        description: "We'll get back to you as soon as we can.",
      });

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

      {/* ─── HERO ─── */}
      <section style={{
        backgroundColor: colors.cream,
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
            color: colors.black,
            margin: 0,
          }}>
            GET IN TOUCH
          </h1>
          <p style={{
            fontFamily: fonts.body,
            fontSize: isMobile ? 16 : 18,
            color: colors.black,
            opacity: 0.6,
            margin: "16px 0 0",
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            Have a question, want to get involved, or just want to say hello? We'd love to hear from you.
          </p>
        </motion.div>
      </section>

      {/* ─── FORM ─── */}
      <section style={{
        backgroundColor: colors.black,
        padding: isMobile ? "60px 28px" : "80px 40px",
      }}>
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
                      accentColor: colors.yellow,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{
                    fontFamily: fonts.body,
                    fontSize: 14,
                    color: colors.cream,
                    opacity: 0.7,
                  }}>
                    Keep me in the loop — send me occasional updates
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
                  color: colors.black,
                  backgroundColor: colors.yellow,
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
      </section>

      {/* ─── DETAILS ─── */}
      <section style={{
        backgroundColor: colors.cream,
        color: colors.black,
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
                10 minutes from Maleny, in the Sunshine Coast Hinterland
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div>
              <h3 style={detailLabelStyle}>EMAIL</h3>
              <a href="mailto:hello@theharvestwitta.com.au" style={{
                ...detailTextStyle,
                color: colors.black,
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
                color: colors.black,
                textDecoration: "none",
              }}>
                0422 883 943
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div>
              <h3 style={detailLabelStyle}>HOURS</h3>
              <p style={detailTextStyle}>Wed–Fri: 8am – 3pm</p>
              <p style={detailTextStyle}>Saturday: 7am – 2pm</p>
              <p style={detailTextStyle}>Sunday: 8am – 2pm</p>
              <p style={{ ...detailTextStyle, opacity: 0.4 }}>Mon–Tue: Closed</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── MAP ─── */}
      <section style={{
        backgroundColor: colors.cream,
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
                  color: colors.black,
                  textDecoration: "none",
                  borderBottom: `2px solid ${colors.black}`,
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
      <BauhausFooter isMobile={isMobile} />
    </div>
  );
}
