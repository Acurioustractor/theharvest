import { useState, useEffect, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { setPageSeo } from "@/lib/seo";
import { SiteFooter, SiteNav } from "./HarvestReviewTest";

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
  creamDim: "rgba(245,240,232,0.75)",
  creamFaint: "rgba(245,240,232,0.12)",
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

function RadioGroup({ id, name, labelledBy, options, value, onChange, isMobile }: {
  id: string;
  name: string;
  labelledBy: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  isMobile: boolean;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) return;

    event.preventDefault();
    const offset = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (index + offset + options.length) % options.length;
    const nextOption = options[nextIndex];
    onChange(nextOption.value);
    document.getElementById(`${id}-${nextOption.value}`)?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
        gap: 10,
      }}
    >
      {options.map((opt, index) => (
        <button
          key={opt.value}
          id={`${id}-${opt.value}`}
          name={name}
          value={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          tabIndex={value === opt.value || (!value && index === 0) ? 0 : -1}
          onClick={() => onChange(opt.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          style={{
            padding: "14px 18px",
            background: value === opt.value ? C.gold : "rgba(245,240,232,0.05)",
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

function MultiSelect({ id, name, labelledBy, describedBy, options, selected, onChange, isMobile }: {
  id: string;
  name: string;
  labelledBy: string;
  describedBy?: string;
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

  const getOptionId = (option: string) =>
    `${id}-${option.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            id={getOptionId(opt)}
            name={name}
            value={opt}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(opt)}
            style={{
              padding: "10px 18px",
              background: active ? C.gold : "rgba(245,240,232,0.05)",
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

function TextArea({ id, name, value, onChange, placeholder }: {
  id: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      id={id}
      name={name}
      autoComplete="off"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      style={{
        width: "100%",
        padding: 16,
        background: "rgba(245,240,232,0.05)",
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

function TextInput({ id, name, label, autoComplete, value, onChange, placeholder, type = "text" }: {
  id: string;
  name: string;
  label: string;
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      id={id}
      name={name}
      aria-label={label}
      autoComplete={autoComplete}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "14px 16px",
        background: "rgba(245,240,232,0.05)",
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

const questionLabelStyle: CSSProperties = {
  display: "block",
  fontFamily: "'Playfair Display', serif",
  fontSize: 22,
  fontWeight: 700,
  color: C.cream,
  margin: "0 0 16px",
  lineHeight: 1.3,
};

function QuestionLabel({ children, id, htmlFor }: {
  children: React.ReactNode;
  id?: string;
  htmlFor?: string;
}) {
  if (htmlFor) {
    return <label id={id} htmlFor={htmlFor} style={questionLabelStyle}>{children}</label>;
  }

  return <p id={id} style={questionLabelStyle}>{children}</p>;
}

function QuestionHint({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <p id={id} style={{
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
        <QuestionLabel id="pulse-years-label">How long have you lived in the Witta / Maleny area?</QuestionLabel>
        <RadioGroup
          id="pulse-years"
          name="yearsInArea"
          labelledBy="pulse-years-label"
          options={YEARS_OPTIONS}
          value={data.yearsInArea}
          onChange={v => update({ yearsInArea: v })}
          isMobile={isMobile}
        />
      </div>

      <div style={{ marginBottom: 36 }}>
        <QuestionLabel id="pulse-community-values-label">What do you value most about this community?</QuestionLabel>
        <QuestionHint id="pulse-community-values-hint">Select all that apply</QuestionHint>
        <MultiSelect
          id="pulse-community-values"
          name="communityValues"
          labelledBy="pulse-community-values-label"
          describedBy="pulse-community-values-hint"
          options={COMMUNITY_VALUES}
          selected={data.communityValues}
          onChange={v => update({ communityValues: v })}
          isMobile={isMobile}
        />
      </div>

      <div>
        <QuestionLabel htmlFor="pulse-whats-missing">What's missing? What do you wish existed here?</QuestionLabel>
        <TextArea
          id="pulse-whats-missing"
          name="whatsMissing"
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
        <QuestionLabel id="pulse-visited-label">Have you visited The Harvest yet?</QuestionLabel>
        <RadioGroup
          id="pulse-visited"
          name="heardOfHarvest"
          labelledBy="pulse-visited-label"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "Not yet" },
            { value: "not-sure", label: "Didn't know it was open" },
          ]}
          value={data.heardOfHarvest}
          onChange={v => update({ heardOfHarvest: v })}
          isMobile={isMobile}
        />
      </div>

      <div style={{ marginBottom: 36 }}>
        <QuestionLabel id="pulse-would-use-label">Which of these would you actually use?</QuestionLabel>
        <QuestionHint id="pulse-would-use-hint">Select all that interest you</QuestionHint>
        <MultiSelect
          id="pulse-would-use"
          name="wouldUse"
          labelledBy="pulse-would-use-label"
          describedBy="pulse-would-use-hint"
          options={WOULD_USE}
          selected={data.wouldUse}
          onChange={v => update({ wouldUse: v })}
          isMobile={isMobile}
        />
      </div>

      <div style={{ marginBottom: 36 }}>
        <QuestionLabel id="pulse-frequency-label">How often would you visit?</QuestionLabel>
        <RadioGroup
          id="pulse-frequency"
          name="visitFrequency"
          labelledBy="pulse-frequency-label"
          options={VISIT_FREQUENCY}
          value={data.visitFrequency}
          onChange={v => update({ visitFrequency: v })}
          isMobile={isMobile}
        />
      </div>

      <div>
        <QuestionLabel id="pulse-preferred-time-label">What day / time works best?</QuestionLabel>
        <QuestionHint id="pulse-preferred-time-hint">Select all that work for you</QuestionHint>
        <MultiSelect
          id="pulse-preferred-time"
          name="preferredTime"
          labelledBy="pulse-preferred-time-label"
          describedBy="pulse-preferred-time-hint"
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
        <QuestionLabel htmlFor="pulse-skills">What skills or knowledge would you share with others?</QuestionLabel>
        <TextArea
          id="pulse-skills"
          name="skillsToShare"
          value={data.skillsToShare}
          onChange={v => update({ skillsToShare: v })}
          placeholder="Gardening, cooking, painting, music, woodwork, coding..."
        />
      </div>

      <div style={{ marginBottom: 36 }}>
        <QuestionLabel id="pulse-barriers-label">What stops you from participating in community activities?</QuestionLabel>
        <QuestionHint id="pulse-barriers-hint">Select all that apply</QuestionHint>
        <MultiSelect
          id="pulse-barriers"
          name="participationBarriers"
          labelledBy="pulse-barriers-label"
          describedBy="pulse-barriers-hint"
          options={BARRIERS}
          selected={data.participationBarriers}
          onChange={v => update({ participationBarriers: v })}
          isMobile={isMobile}
        />
      </div>

      <div style={{ marginBottom: 36 }}>
        <QuestionLabel id="pulse-age-label">Age bracket</QuestionLabel>
        <RadioGroup
          id="pulse-age"
          name="ageBracket"
          labelledBy="pulse-age-label"
          options={AGE_OPTIONS}
          value={data.ageBracket}
          onChange={v => update({ ageBracket: v })}
          isMobile={isMobile}
        />
      </div>

      <div
        role="group"
        aria-labelledby="pulse-contact-label"
        aria-describedby="pulse-contact-hint"
        style={{
          background: "rgba(217,169,78,0.08)",
          border: `1px solid ${C.goldDim}`,
          borderRadius: 12,
          padding: 24,
        }}
      >
        <QuestionLabel id="pulse-contact-label">Stay connected (optional)</QuestionLabel>
        <QuestionHint id="pulse-contact-hint">Add your name if you want email follow-up from The Harvest.</QuestionHint>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TextInput
            id="pulse-name"
            name="name"
            label="Your name"
            autoComplete="name"
            value={data.name}
            onChange={v => update({ name: v })}
            placeholder="Your name"
          />
          <TextInput
            id="pulse-email"
            name="email"
            label="Your email"
            autoComplete="email"
            value={data.email}
            onChange={v => update({ email: v })}
            placeholder="Your email"
            type="email"
          />
          <p style={{ fontSize: 12, color: C.creamFaint, lineHeight: 1.5 }}>
            If you add your name and email, your answers are linked to you so we can follow
            up. Leave both blank to answer anonymously. See our{" "}
            <a href="/privacy" style={{ color: C.creamFaint, textDecoration: "underline" }}>
              privacy page
            </a>{" "}
            for details.
          </p>
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
    <div
      role="progressbar"
      aria-label="Survey progress"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step + 1}
      style={{
        display: "flex",
        gap: 6,
        marginBottom: 40,
      }}
    >
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
        margin: "0 auto 20px",
      }}>
        A human reads every response. If you left your email, we will get back
        to you.
      </p>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 15,
        color: C.creamDim,
        lineHeight: 1.6,
        maxWidth: 480,
        margin: "0 auto 40px",
      }}>
        Come see the place for yourself. We fire the pizza oven on Friday from
        3pm to 8pm with a community movie night, and Saturday from 12pm to 8pm.
        No booking needed. Weeks can vary, and members hear the dates first.
      </p>
      <a
        href="/membership"
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
        BECOME A MEMBER (IT'S FREE)
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

  useEffect(() => {
    setPageSeo({
      title: "Harvest Pulse · The Harvest Witta",
      description:
        "Tell The Harvest what is working, what is missing and what would help the community garden and gathering place take shape in Witta.",
      path: "/pulse",
    });
  }, []);

  const update = (patch: Partial<SurveyData>) => {
    setData(prev => ({ ...prev, ...patch }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (data.email && !data.name.trim()) {
        toast.error("Add your name before using email follow-up.");
        return;
      }
      await submitMutation.mutateAsync({
        ...data,
        email: data.email || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit pulse survey:", err);
      toast.error("That didn't send. Try again, or reach us via the contact page.");
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
      <SiteNav />
      {/* Hero */}
      <section style={{
        padding: isMobile ? "110px 20px 40px" : "140px 40px 60px",
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

      <SiteFooter />
    </div>
  );
}
