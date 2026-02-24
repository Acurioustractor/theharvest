import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";

/* ─────────────────────────────────────
   DESIGN TOKENS
   ───────────────────────────────────── */

const C = {
  bg: "#0C0A09",
  gold: "rgba(217,169,78,1)",
  goldDim: "rgba(217,169,78,0.3)",
  cream: "#F4F4F2",
  creamDim: "rgba(245,240,232,0.5)",
  creamFaint: "rgba(245,240,232,0.12)",
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

const EMOJIS = [
  { value: 4, emoji: "\uD83D\uDE0D", label: "Loved it" },
  { value: 3, emoji: "\uD83D\uDE0A", label: "Good" },
  { value: 2, emoji: "\uD83D\uDE10", label: "Okay" },
  { value: 1, emoji: "\uD83D\uDE15", label: "Not great" },
];

const RETURN_OPTIONS = [
  { value: "definitely", label: "Definitely" },
  { value: "probably", label: "Probably" },
  { value: "not-sure", label: "Not sure" },
];

export default function EventFeedback({ eventId }: { eventId?: string }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [rating, setRating] = useState<number | null>(null);
  const [bestPart, setBestPart] = useState("");
  const [wouldReturn, setWouldReturn] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitMutation = trpc.feedback.submit.useMutation();

  const handleSubmit = async () => {
    if (!rating || !wouldReturn) return;
    setSubmitting(true);
    try {
      await submitMutation.mutateAsync({
        eventId: eventId ? parseInt(eventId, 10) : undefined,
        rating,
        bestPart: bestPart || undefined,
        wouldReturn,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      backgroundColor: C.bg,
      color: C.cream,
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p style={{ fontSize: 48, margin: "0 0 16px" }}>&#x1F64F;</p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28,
              fontWeight: 700,
              color: C.cream,
              margin: "0 0 12px",
            }}>Thanks for the feedback!</h2>
            <p style={{
              fontSize: 15,
              color: C.creamDim,
              lineHeight: 1.6,
            }}>
              This helps us make every event better.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              fontSize: 12,
              letterSpacing: "0.2em",
              color: C.gold,
              marginBottom: 16,
            }}>QUICK FEEDBACK</p>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? 28 : 36,
              fontWeight: 700,
              color: C.cream,
              margin: "0 0 40px",
            }}>How was it?</h1>

            {/* Rating */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              marginBottom: 36,
            }}>
              {EMOJIS.map(e => (
                <button
                  key={e.value}
                  type="button"
                  onClick={() => setRating(e.value)}
                  style={{
                    width: 64,
                    height: 64,
                    fontSize: 32,
                    background: rating === e.value ? C.goldDim : "rgba(245,240,232,0.05)",
                    border: `2px solid ${rating === e.value ? C.gold : C.creamFaint}`,
                    borderRadius: 16,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    transform: rating === e.value ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {e.emoji}
                </button>
              ))}
            </div>

            {/* Best part */}
            <div style={{ marginBottom: 28, textAlign: "left" }}>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 700,
                color: C.cream,
                margin: "0 0 10px",
              }}>What was the best part?</p>
              <p style={{
                fontSize: 13,
                color: C.creamDim,
                margin: "-2px 0 10px",
              }}>Optional</p>
              <textarea
                value={bestPart}
                onChange={e => setBestPart(e.target.value)}
                placeholder="Tell us..."
                rows={2}
                style={{
                  width: "100%",
                  padding: 14,
                  background: "rgba(245,240,232,0.05)",
                  border: `1px solid ${C.creamFaint}`,
                  borderRadius: 10,
                  color: C.cream,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  resize: "none",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Would return */}
            <div style={{ marginBottom: 36, textAlign: "left" }}>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 700,
                color: C.cream,
                margin: "0 0 10px",
              }}>Would you come back?</p>
              <div style={{ display: "flex", gap: 10 }}>
                {RETURN_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setWouldReturn(opt.value)}
                    style={{
                      flex: 1,
                      padding: "12px 8px",
                      background: wouldReturn === opt.value ? C.gold : "rgba(245,240,232,0.05)",
                      border: `1px solid ${wouldReturn === opt.value ? C.gold : C.creamFaint}`,
                      borderRadius: 10,
                      color: wouldReturn === opt.value ? C.bg : C.cream,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      fontWeight: wouldReturn === opt.value ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!rating || !wouldReturn || submitting}
              style={{
                width: "100%",
                padding: "16px",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: 14,
                letterSpacing: "0.15em",
                color: (!rating || !wouldReturn) ? C.creamDim : C.bg,
                background: (!rating || !wouldReturn) ? "rgba(245,240,232,0.08)" : C.gold,
                border: "none",
                borderRadius: 10,
                cursor: (!rating || !wouldReturn) ? "default" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {submitting ? "SENDING..." : "SEND FEEDBACK"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
