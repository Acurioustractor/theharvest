import { useState, useEffect, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import BauhausFooter from "@/components/BauhausFooter";

/* ─────────────────────────────────────
   DESIGN TOKENS
   ───────────────────────────────────── */

const C = {
  bg: "#0C0A09",
  bg2: "#1C1917",
  gold: "rgba(217,169,78,1)",
  goldDim: "rgba(217,169,78,0.3)",
  green: "#3A6E47",
  red: "#D62C2C",
  cream: "#F4F4F2",
  creamDim: "rgba(244,244,242,0.5)",
  creamFaint: "rgba(244,244,242,0.12)",
};

/* ─────────────────────────────────────
   HOOKS
   ───────────────────────────────────── */

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

/* ─────────────────────────────────────
   TYPES
   ───────────────────────────────────── */

interface SurveyData {
  yearsInArea: string;
  communityValues: string[];
  whatsMissing: string;
  heardOfHarvest: string;
  wouldUse: string[];
  visitFrequency: string;
  preferredTime: string[];
  skillsToShare: string;
  participationBarriers: string[];
  ageBracket: string;
  name: string;
  email: string;
}

const INITIAL_DATA: SurveyData = {
  yearsInArea: "",
  communityValues: [],
  whatsMissing: "",
  heardOfHarvest: "",
  wouldUse: [],
  visitFrequency: "",
  preferredTime: [],
  skillsToShare: "",
  participationBarriers: [],
  ageBracket: "",
  name: "",
  email: "",
};

/* ─────────────────────────────────────
   OPTIONS
   ───────────────────────────────────── */

const YEARS_OPTIONS = [
  { value: "less-than-1", label: "Less than 1 year" },
  { value: "1-5", label: "1–5 years" },
  { value: "5-20", label: "5–20 years" },
  { value: "20-plus", label: "20+ years" },
  { value: "visitor", label: "Just visiting" },
];

const COMMUNITY_VALUES = [
  "Nature & environment",
  "Food culture",
  "Creative scene",
  "Peace & quiet",
  "Community spirit",
  "Cooperative heritage",
];

const WOULD_USE = [
  "Community garden",
  "Cooking workshops",
  "Art / maker space",
  "Market stalls",
  "Meeting rooms",
  "Kids programs",
  "Live music & events",
  "Co-working space",
];

const VISIT_FREQUENCY = [
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
  { value: "occasionally", label: "Occasionally" },
  { value: "unsure", label: "Not sure yet" },
];

const PREFERRED_TIMES = [
  "Weekday morning",
  "Weekday evening",
  "Saturday",
  "Sunday",
];

const BARRIERS = [
  "Transport",
  "Cost",
  "Time",
  "Don't know about them",
  "Nothing interests me",
  "Health / mobility",
  "Childcare",
];

const AGE_OPTIONS = [
  { value: "under-25", label: "Under 25" },
  { value: "25-44", label: "25–44" },
  { value: "45-64", label: "45–64" },
  { value: "65-plus", label: "65+" },
];

/* ─────────────────────────────────────
   FORM COMPONENTS
   ───────────────────────────────────── */

function RadioGroup({ options, value, onChange, isMobile }: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  isMobile: boolean;
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
      gap: 10,
    }}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          style={{
            padding: "14px 18px",
            background: value === opt.value ? C.gold : "rgba(244,244,242,0.05)",
            border: `1px solid ${value === opt.value ? C.gold : C.creamFaint}`,
            borderRadius: 10,
            color: value === opt.value ? C.bg : C.cream,
            fontFamily: "'Inter', sans-serif",
            fontSize: 15,
            fontWeight: value === opt.value ? 600 : 400,
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function MultiSelect({ options, selected, onChange, isMobile }: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  isMobile: boolean;
}) {
  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter(s => s !== opt)
        : [...selected, opt]
    );
  };

  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
    }}>
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            style={{
              padding: "10px 18px",
              background: active ? C.gold : "rgba(244,244,242,0.05)",
              border: `1px solid ${active ? C.gold : C.creamFaint}`,
              borderRadius: 24,
              color: active ? C.bg : C.cream,
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: active ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function TextArea({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      style={{
        width: "100%",
        padding: 16,
        background: "rgba(244,244,242,0.05)",
        border: `1px solid ${C.creamFaint}`,
        borderRadius: 10,
        color: C.cream,
        fontFamily: "'Inter', sans-serif",
        fontSize: 15,
        lineHeight: 1.5,
        resize: "vertical",
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "14px 16px",
        background: "rgba(244,244,242,0.05)",
        border: `1px solid ${C.creamFaint}`,
        borderRadius: 10,
        color: C.cream,
        fontFamily: "'Inter', sans-serif",
        fontSize: 15,
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
}

function QuestionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: 22,
      fontWeight: 700,
      color: C.cream,
      margin: "0 0 16px",
      lineHeight: 1.3,
    }}>
      {children}
    </p>
  );
}

function QuestionHint({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: 13,
      color: C.creamDim,
      margin: "-8px 0 16px",
    }}>
      {children}
    </p>
  );
}

/* ─────────────────────────────────────
   STEPS
   ───────────────────────────────────── */

function Step1({ data, update, isMobile }: {
  data: SurveyData;
  update: (patch: Partial<SurveyData>) => void;
  isMobile: boolean;
}) {
  return (
    <div>
      <p style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 900,
        fontSize: 12,
        letterSpacing: "0.2em",
        color: C.gold,
        marginBottom: 32,
      }}>YOU & THIS PLACE</p>

      <div style={{ marginBottom: 36 }}>
        <QuestionLabel>How long have you lived in the Witta / Maleny area?</QuestionLabel>
        <RadioGroup
          options={YEARS_OPTIONS}
          value={data.yearsInArea}
          onChange={v => update({ yearsInArea: v })}
          isMobile={isMobile}
        />
      </div>

      <div style={{ marginBottom: 36 }}>
        <QuestionLabel>What do you value most about this community?</QuestionLabel>
        <QuestionHint>Select all that apply</QuestionHint>
        <MultiSelect
          options={COMMUNITY_VALUES}
          selected={data.communityValues}
          onChange={v => update({ communityValues: v })}
          isMobile={isMobile}
        />
      </div>

      <div>
        <QuestionLabel>What's missing — what do you wish existed here?</QuestionLabel>
        <TextArea
          value={data.whatsMissing}
          onChange={v => update({ whatsMissing: v })}
          placeholder="Tell us what you'd love to see..."
        />
      </div>
    </div>
  );
}

function Step2({ data, update, isMobile }: {
  data: SurveyData;
  update: (patch: Partial<SurveyData>) => void;
  isMobile: boolean;
}) {
  return (
    <div>
      <p style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 900,
        fontSize: 12,
        letterSpacing: "0.2em",
        color: C.gold,
        marginBottom: 32,
      }}>THE HARVEST</p>

      <div style={{ marginBottom: 36 }}>
        <QuestionLabel>Have you heard of The Harvest?</QuestionLabel>
        <RadioGroup
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "not-sure", label: "Not sure" },
          ]}
          value={data.heardOfHarvest}
          onChange={v => update({ heardOfHarvest: v })}
          isMobile={isMobile}
        />
      </div>

      <div style={{ marginBottom: 36 }}>
        <QuestionLabel>Which of these would you actually use?</QuestionLabel>
        <QuestionHint>Select all that interest you</QuestionHint>
        <MultiSelect
          options={WOULD_USE}
          selected={data.wouldUse}
          onChange={v => update({ wouldUse: v })}
          isMobile={isMobile}
        />
      </div>

      <div style={{ marginBottom: 36 }}>
        <QuestionLabel>How often would you visit?</QuestionLabel>
        <RadioGroup
          options={VISIT_FREQUENCY}
          value={data.visitFrequency}
          onChange={v => update({ visitFrequency: v })}
          isMobile={isMobile}
        />
      </div>

      <div>
        <QuestionLabel>What day / time works best?</QuestionLabel>
        <QuestionHint>Select all that work for you</QuestionHint>
        <MultiSelect
          options={PREFERRED_TIMES}
          selected={data.preferredTime}
          onChange={v => update({ preferredTime: v })}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}

function Step3({ data, update, isMobile }: {
  data: SurveyData;
  update: (patch: Partial<SurveyData>) => void;
  isMobile: boolean;
}) {
  return (
    <div>
      <p style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 900,
        fontSize: 12,
        letterSpacing: "0.2em",
        color: C.gold,
        marginBottom: 32,
      }}>ABOUT YOU</p>

      <div style={{ marginBottom: 36 }}>
        <QuestionLabel>What skills or knowledge would you share with others?</QuestionLabel>
        <TextArea
          value={data.skillsToShare}
          onChange={v => update({ skillsToShare: v })}
          placeholder="Gardening, cooking, painting, music, woodwork, coding..."
        />
      </div>

      <div style={{ marginBottom: 36 }}>
        <QuestionLabel>What stops you from participating in community activities?</QuestionLabel>
        <QuestionHint>Select all that apply</QuestionHint>
        <MultiSelect
          options={BARRIERS}
          selected={data.participationBarriers}
          onChange={v => update({ participationBarriers: v })}
          isMobile={isMobile}
        />
      </div>

      <div style={{ marginBottom: 36 }}>
        <QuestionLabel>Age bracket</QuestionLabel>
        <RadioGroup
          options={AGE_OPTIONS}
          value={data.ageBracket}
          onChange={v => update({ ageBracket: v })}
          isMobile={isMobile}
        />
      </div>

      <div style={{
        background: "rgba(217,169,78,0.08)",
        border: `1px solid ${C.goldDim}`,
        borderRadius: 12,
        padding: 24,
      }}>
        <QuestionLabel>Stay connected (optional)</QuestionLabel>
        <QuestionHint>We'll only use this to keep you in the loop about The Harvest.</QuestionHint>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TextInput
            value={data.name}
            onChange={v => update({ name: v })}
            placeholder="Your name"
          />
          <TextInput
            value={data.email}
            onChange={v => update({ email: v })}
            placeholder="Your email"
            type="email"
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   PROGRESS BAR
   ───────────────────────────────────── */

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{
      display: "flex",
      gap: 6,
      marginBottom: 40,
    }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 2,
            background: i <= step ? C.gold : C.creamFaint,
            transition: "background 0.3s",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────
   THANK YOU
   ───────────────────────────────────── */

function ThankYou({ isMobile }: { isMobile: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ textAlign: "center", padding: isMobile ? "60px 0" : "100px 0" }}
    >
      <p style={{
        fontSize: 48,
        margin: "0 0 24px",
      }}>&#x2728;</p>
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: isMobile ? 32 : 42,
        fontWeight: 700,
        color: C.cream,
        margin: "0 0 16px",
      }}>Thank you</h2>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 17,
        color: C.creamDim,
        lineHeight: 1.6,
        maxWidth: 480,
        margin: "0 auto 40px",
      }}>
        Your voice matters. We're building The Harvest around what this community
        actually wants — and you just helped shape that.
      </p>
      <a
        href="/"
        style={{
          display: "inline-block",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 900,
          fontSize: 13,
          letterSpacing: "0.15em",
          color: C.bg,
          background: C.gold,
          padding: "14px 36px",
          borderRadius: 8,
          textDecoration: "none",
        }}
      >
        VISIT THE HARVEST
      </a>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */

export default function CommunityPulse() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SurveyData>(INITIAL_DATA);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitMutation = trpc.pulse.submit.useMutation();

  const update = (patch: Partial<SurveyData>) => {
    setData(prev => ({ ...prev, ...patch }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitMutation.mutateAsync({
        ...data,
        email: data.email || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit pulse survey:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const STEPS = [Step1, Step2, Step3];
  const totalSteps = STEPS.length;
  const isLast = step === totalSteps - 1;
  const CurrentStep = STEPS[step];

  return (
    <div style={{
      backgroundColor: C.bg,
      color: C.cream,
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Hero */}
      <section style={{
        padding: isMobile ? "60px 20px 40px" : "80px 40px 60px",
        textAlign: "center",
        background: `radial-gradient(ellipse at 50% 30%, rgba(217,169,78,0.06), transparent 70%)`,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            fontSize: 12,
            letterSpacing: "0.2em",
            color: C.gold,
            marginBottom: 16,
          }}>COMMUNITY PULSE</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? 32 : 48,
            fontWeight: 700,
            color: C.cream,
            lineHeight: 1.15,
            margin: "0 0 16px",
          }}>Help shape what<br />The Harvest becomes</h1>
          <p style={{
            fontSize: 16,
            color: C.creamDim,
            maxWidth: 460,
            margin: "0 auto",
            lineHeight: 1.6,
          }}>
            3 minutes. 10 questions. Your voice helps us build
            something this community actually wants.
          </p>
        </motion.div>
      </section>

      {/* Form */}
      <section style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: isMobile ? "0 20px 60px" : "0 40px 80px",
      }}>
        {submitted ? (
          <ThankYou isMobile={isMobile} />
        ) : (
          <>
            <ProgressBar step={step} total={totalSteps} />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <CurrentStep data={data} update={update} isMobile={isMobile} />
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 48,
              gap: 16,
            }}>
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                disabled={step === 0}
                style={{
                  padding: "14px 28px",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  color: step === 0 ? C.creamFaint : C.cream,
                  background: "transparent",
                  border: `1px solid ${step === 0 ? C.creamFaint : C.creamDim}`,
                  borderRadius: 8,
                  cursor: step === 0 ? "default" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                BACK
              </button>

              {isLast ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    padding: "14px 36px",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 900,
                    fontSize: 13,
                    letterSpacing: "0.15em",
                    color: C.bg,
                    background: submitting ? C.goldDim : C.gold,
                    border: "none",
                    borderRadius: 8,
                    cursor: submitting ? "wait" : "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {submitting ? "SENDING..." : "SUBMIT"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep(s => s + 1)}
                  style={{
                    padding: "14px 36px",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 900,
                    fontSize: 13,
                    letterSpacing: "0.15em",
                    color: C.bg,
                    background: C.gold,
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  NEXT
                </button>
              )}
            </div>
          </>
        )}
      </section>

      <BauhausFooter isMobile={isMobile} />
    </div>
  );
}
