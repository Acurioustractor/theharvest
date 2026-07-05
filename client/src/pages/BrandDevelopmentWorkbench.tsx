import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "wouter";
import {
  Check,
  Clipboard,
  FileText,
  Gauge,
  MapPinned,
  PencilRuler,
  RefreshCw,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { colors, fonts, rootStyle } from "@/styles/brand";

type StageId = "open-day" | "debrief" | "rhythm" | "living-system";
type PromptMode = "discovery" | "strategy" | "production" | "review";

const stages: {
  id: StageId;
  label: string;
  timing: string;
  job: string;
  outputs: string[];
  color: string;
}[] = [
  {
    id: "open-day",
    label: "Open-day signal",
    timing: "Now to 20 June",
    job: "Make the public understand enough to come through, ask a question, or bring something useful.",
    outputs: ["/june-20", "6 social posts", "Harvest Note", "question wall", "on-site signs"],
    color: colors.goldenHour,
  },
  {
    id: "debrief",
    label: "Proof and debrief",
    timing: "21 to 27 June",
    job: "Turn the day into memory, evidence, thanks, and the next true step.",
    outputs: ["photo wall", "thank-you note", "recap article", "Notion record", "GHL follow-up"],
    color: colors.workshirt,
  },
  {
    id: "rhythm",
    label: "Operating rhythm",
    timing: "July",
    job: "Make the brand work inside the weekly system, not just in public copy.",
    outputs: ["maker pack", "shelf labels", "Humanitix templates", "WhatsApp norms", "operator card"],
    color: colors.canopy,
  },
  {
    id: "living-system",
    label: "Living system",
    timing: "August onward",
    job: "Stabilise what the place has become and retire what was launch-only.",
    outputs: ["updated DESIGN.md", "member corner", "supporter deck v2", "shop stories", "signage"],
    color: colors.crane,
  },
];

const surfaces = [
  "Website page",
  "GHL email",
  "Social post",
  "Notion page",
  "Deck",
  "Signage",
  "Maker pack",
  "Event template",
  "Staff card",
];

const audiences = [
  "Witta locals",
  "Public visitors",
  "Members",
  "Makers",
  "Producers",
  "Funders",
  "Operators",
  "Volunteers",
  "Jinibara / community lane",
];

const rooms = [
  "Whole-place",
  "Garden",
  "Kitchen",
  "Art Space",
  "Launch",
  "Timber",
  "Dairy",
  "Co-op practice",
  "Witta history",
];

const jobs = [
  "Inform",
  "Invite",
  "Ask",
  "Prove",
  "Record",
  "Sell",
  "Orient",
  "Recruit",
  "Review",
];

const scoreRows = [
  ["Place", "Generic or placeless", "Mentions Witta", "Feels physically from Witta"],
  ["Three rooms", "Missing", "One room visible", "Garden, Kitchen, Art Space relationship is clear"],
  ["Real proof", "Abstract or fake", "Some real material", "Real photos, plans, objects, or stories carry it"],
  ["Voice", "Corporate or vague", "Mostly plain", "Sounds like someone standing at the gate"],
  ["Audience", "Unclear", "Broadly named", "Specific person and action are obvious"],
  ["CTA", "Missing", "Present but soft", "One clear next action"],
  ["Source safety", "Unknown", "Partly checked", "Rights, consent, attribution, and facts are clear"],
  ["Operational truth", "Overpromises", "Mostly accurate", "Matches current operating reality"],
  ["Record", "No home", "Informal memory only", "Decision is recorded in the right place"],
] as const;

const defaultForm = {
  goal: "Make the open day understandable and invite one practical next action.",
  surface: "Website page",
  audience: "Witta locals",
  focus: "Whole-place",
  inputs: "/june-20 page, current launch copy, approved open-day media, question wall, GHL RSVP path.",
  constraints:
    "Public open day on Saturday 20 June 2026. Check insurance, food safety, pizza lead, roster, parking, media rights, and consent.",
  owner: "Ben",
  deadline: "Before next public send",
};

function selectStyle(active: boolean): CSSProperties {
  return {
    width: "100%",
    border: `1px solid ${active ? colors.shed : "rgba(28,25,23,0.18)"}`,
    backgroundColor: active ? colors.shed : "rgba(255,255,255,0.38)",
    color: active ? colors.milk : colors.shed,
    padding: "12px 14px",
    borderRadius: 6,
    fontFamily: fonts.display,
    fontWeight: 800,
    fontSize: 12,
    letterSpacing: "0.04em",
    textAlign: "left",
    cursor: "pointer",
  };
}

function fieldStyle(multiline = false): CSSProperties {
  return {
    width: "100%",
    minHeight: multiline ? 96 : undefined,
    border: `1px solid rgba(28,25,23,0.2)`,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.42)",
    color: colors.shed,
    padding: "12px 14px",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 1.5,
    boxSizing: "border-box",
    resize: multiline ? "vertical" : undefined,
  };
}

function labelStyle(): CSSProperties {
  return {
    display: "block",
    marginBottom: 8,
    fontFamily: fonts.display,
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    opacity: 0.58,
  };
}

export default function BrandDevelopmentWorkbench() {
  const isMobile = useMediaQuery("(max-width: 860px)");
  const [stageId, setStageId] = useState<StageId>("open-day");
  const [mode, setMode] = useState<PromptMode>("discovery");
  const [form, setForm] = useState(defaultForm);
  const [copied, setCopied] = useState<string | null>(null);
  const [scores, setScores] = useState<number[]>(Array(scoreRows.length).fill(1));

  const activeStage = stages.find((stage) => stage.id === stageId) ?? stages[0];
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const verdict =
    totalScore >= 16
      ? "Ready to produce or publish"
      : totalScore >= 12
        ? "Usable after targeted fixes"
        : totalScore >= 7
          ? "Needs a sharper brief"
          : "Restart from source material";

  useEffect(() => {
    const saved = window.localStorage.getItem("harvest-brand-workbench");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Partial<typeof defaultForm> & {
        stageId?: StageId;
        mode?: PromptMode;
        scores?: number[];
      };
      setForm({ ...defaultForm, ...parsed });
      if (parsed.stageId) setStageId(parsed.stageId);
      if (parsed.mode) setMode(parsed.mode);
      if (parsed.scores?.length === scoreRows.length) setScores(parsed.scores);
    } catch {
      window.localStorage.removeItem("harvest-brand-workbench");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "harvest-brand-workbench",
      JSON.stringify({ ...form, stageId, mode, scores })
    );
  }, [form, stageId, mode, scores]);

  const prompt = useMemo(() => {
    const base = `The Harvest is a working community hub in Witta, on Jinibara Country. A former nursery is becoming three public rooms: Garden, Kitchen, Art Space.

Current public frame:
The gate opens. Everyone welcome.
The Harvest is a garden, kitchen, and art space taking shape in Witta.
The first works are asking what this place should hold.

Non-negotiables:
- Use real place material first: photos, plans, drawings, scans, historical images, work stories, objects, tools, timber, milk crates, rammed earth, rusted iron, garden beds, long tables.
- Do not invent Harvest imagery, fake people, fake interiors, fake history, or public proof.
- Do not imply a formal cooperative exists until governance is real.
- Do not publish sensitive stories or images without consent.
- Use Jinibara Country.
- Avoid generic cafe, wellness, venue, startup, council, or abstract community language.
- Keep Garden, Kitchen, and Art Space legible.

Brand review goal:
${form.goal}

Stage:
${activeStage.label} - ${activeStage.timing}

Surface:
${form.surface}

Audience:
${form.audience}

Room or focus:
${form.focus}

Available inputs:
${form.inputs}

Known constraints:
${form.constraints}

Owner:
${form.owner}

Deadline:
${form.deadline}`;

    if (mode === "strategy") {
      return `Act as the Harvest brand strategy team. The lead voice is a sharp Harvest editor: plain, local, useful, and allergic to generic brand language.

Your job is to turn the research and source material into a one-page Harvest brand strategy for this specific surface.

${base}

Use this structure:
1. Surface
2. Audience
3. Job
4. Room / story thread
5. Core message
6. Proof to show
7. Voice rules
8. Visual rules
9. CTA
10. Guardrails
11. Open questions
12. Next production move
13. Record location`;
    }

    if (mode === "production") {
      return `Act as a Harvest production editor.

Turn the approved strategy into a production brief for the actual thing someone needs to build.

${base}

Generate:
1. Build objective
2. Exact content blocks
3. Required assets
4. Copy draft or copy skeleton
5. Visual / layout notes
6. CTA and destination
7. Source, rights, and consent checks
8. Operational checks
9. What not to include
10. Done definition
11. Where to record the final decision`;
    }

    if (mode === "review") {
      return `Act as a Harvest brand reviewer.

Review this surface against the Harvest brand system and the current operating truth.

${base}

Review using:
1. Verified facts
2. Inferences
3. Unknowns
4. Brand scorecard
5. Specific issues to fix
6. Copy changes
7. Visual / asset changes
8. Source / consent / rights changes
9. Operational truth changes
10. Publish / hold decision
11. Decisions to record back into docs or Notion`;
    }

    return `Act as a Harvest brand review team:
- Place-based brand strategist
- Cultural and local-history researcher
- Audience and participation analyst
- Communications editor
- Website / CX reviewer
- Operations and adoption advisor
- Rights, consent, and source-check reviewer
- Plain-language mentor

Your job is to build a structured discovery and research blueprint for The Harvest, not creative assets.

${base}

Generate your response using these sections:
1. Condensed goal
2. Minimum viable review process
3. Ambiguity and alignment gaps
4. Working assumptions
5. Possible outcomes
6. Expert review questions
7. Research and source blueprint
8. Decision gates
9. Where the decision lives`;
  }, [activeStage, form, mode]);

  const decisionRecord = useMemo(() => {
    return `Decision:
[Plain decision.]

Date:
${new Date().toISOString().slice(0, 10)}

Surface:
${form.surface}

Stage:
${activeStage.label}

Reason:
[What evidence made this the right move.]

Source material:
${form.inputs}

Applies to:
[Website / GHL / Notion / social / signage / shop / events / staff tools.]

Does not apply to:
[Where not to generalise this rule.]

Record location:
[DESIGN.md / docs/brand / Notion / GHL / route / operating doc.]

Next review:
[Date or trigger.]`;
  }, [activeStage.label, form.inputs, form.surface]);

  async function copyText(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1600);
  }

  function updateForm(key: keyof typeof defaultForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div style={rootStyle}>
      <header
        style={{
          backgroundColor: colors.shed,
          color: colors.milk,
          padding: isMobile ? "28px 20px 24px" : "36px 40px 32px",
          borderBottom: `6px solid ${activeStage.color}`,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              alignItems: isMobile ? "flex-start" : "center",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 10px",
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  opacity: 0.55,
                  textTransform: "uppercase",
                }}
              >
                Internal working tool
              </p>
              <h1
                style={{
                  margin: 0,
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: isMobile ? 30 : 46,
                  letterSpacing: "0.04em",
                  lineHeight: 1.05,
                }}
              >
                Brand Development Workbench
              </h1>
              <p style={{ maxWidth: 760, margin: "14px 0 0", opacity: 0.75, lineHeight: 1.7 }}>
                Pick the stage, name the surface, build the prompt, score the result, then record the decision.
              </p>
            </div>
            <nav style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/brand-guide" style={headerLinkStyle}>
                Brand guide
              </Link>
              <Link href="/admin/control-room" style={headerLinkStyle}>
                Control room
              </Link>
              <Link href="/june-20" style={headerLinkStyle}>
                June 20
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "20px" : "28px 40px 52px" }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(4, minmax(0, 1fr))",
            gap: 12,
            marginBottom: 22,
          }}
          aria-label="Brand development stage"
        >
          {stages.map((stage) => {
            const active = stage.id === stageId;
            return (
              <button
                key={stage.id}
                onClick={() => setStageId(stage.id)}
                style={{
                  border: `1px solid ${active ? stage.color : "rgba(28,25,23,0.14)"}`,
                  backgroundColor: active ? colors.shed : "rgba(255,255,255,0.36)",
                  color: active ? colors.milk : colors.shed,
                  borderRadius: 8,
                  padding: 18,
                  textAlign: "left",
                  cursor: "pointer",
                  minHeight: 178,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 6,
                    backgroundColor: stage.color,
                    marginBottom: 18,
                  }}
                />
                <p style={{ margin: 0, fontFamily: fonts.display, fontWeight: 900, fontSize: 15 }}>
                  {stage.label}
                </p>
                <p style={{ margin: "6px 0 10px", fontSize: 12, opacity: active ? 0.7 : 0.58 }}>
                  {stage.timing}
                </p>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, opacity: active ? 0.78 : 0.72 }}>
                  {stage.job}
                </p>
              </button>
            );
          })}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.05fr 1.35fr 0.9fr",
            gap: 18,
            alignItems: "start",
          }}
        >
          <div style={panelStyle}>
            <PanelTitle icon={<MapPinned size={18} />} title="Surface Brief" />
            <div style={{ display: "grid", gap: 14 }}>
              <label>
                <span style={labelStyle()}>Goal</span>
                <textarea value={form.goal} onChange={(event) => updateForm("goal", event.target.value)} style={fieldStyle(true)} />
              </label>

              <FieldSelect label="Surface" value={form.surface} options={surfaces} onChange={(value) => updateForm("surface", value)} />
              <FieldSelect label="Audience" value={form.audience} options={audiences} onChange={(value) => updateForm("audience", value)} />
              <FieldSelect label="Room or focus" value={form.focus} options={rooms} onChange={(value) => updateForm("focus", value)} />

              <label>
                <span style={labelStyle()}>Available inputs</span>
                <textarea value={form.inputs} onChange={(event) => updateForm("inputs", event.target.value)} style={fieldStyle(true)} />
              </label>

              <label>
                <span style={labelStyle()}>Constraints</span>
                <textarea
                  value={form.constraints}
                  onChange={(event) => updateForm("constraints", event.target.value)}
                  style={fieldStyle(true)}
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <label>
                  <span style={labelStyle()}>Owner</span>
                  <input value={form.owner} onChange={(event) => updateForm("owner", event.target.value)} style={fieldStyle()} />
                </label>
                <label>
                  <span style={labelStyle()}>Deadline</span>
                  <input value={form.deadline} onChange={(event) => updateForm("deadline", event.target.value)} style={fieldStyle()} />
                </label>
              </div>
            </div>
          </div>

          <div style={panelStyle}>
            <PanelTitle icon={<PencilRuler size={18} />} title="Prompt Builder" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, minmax(0, 1fr))",
                gap: 8,
                marginBottom: 14,
              }}
            >
              {([
                ["discovery", "Discovery"],
                ["strategy", "Strategy"],
                ["production", "Production"],
                ["review", "Review"],
              ] as const).map(([value, label]) => (
                <button key={value} onClick={() => setMode(value)} style={selectStyle(mode === value)}>
                  {label}
                </button>
              ))}
            </div>

            <textarea readOnly value={prompt} style={{ ...fieldStyle(true), minHeight: 520, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }} />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              <button onClick={() => copyText("prompt", prompt)} style={primaryButtonStyle}>
                {copied === "prompt" ? <Check size={16} /> : <Clipboard size={16} />}
                {copied === "prompt" ? "Copied" : "Copy prompt"}
              </button>
              <button
                onClick={() => {
                  setForm(defaultForm);
                  setStageId("open-day");
                  setMode("discovery");
                  setScores(Array(scoreRows.length).fill(1));
                }}
                style={secondaryButtonStyle}
              >
                <RefreshCw size={16} />
                Reset
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            <div style={panelStyle}>
              <PanelTitle icon={<Gauge size={18} />} title="Scorecard" />
              <div style={{ display: "grid", gap: 10 }}>
                {scoreRows.map((row, index) => (
                  <label key={row[0]} style={{ display: "grid", gap: 7 }}>
                    <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 12 }}>{row[0]}</span>
                    <select
                      value={scores[index]}
                      onChange={(event) => {
                        const next = [...scores];
                        next[index] = Number(event.target.value);
                        setScores(next);
                      }}
                      style={fieldStyle()}
                    >
                      <option value={0}>0 - {row[1]}</option>
                      <option value={1}>1 - {row[2]}</option>
                      <option value={2}>2 - {row[3]}</option>
                    </select>
                  </label>
                ))}
              </div>
              <div
                style={{
                  marginTop: 16,
                  padding: 14,
                  borderRadius: 6,
                  backgroundColor: totalScore >= 16 ? "rgba(74,103,65,0.14)" : totalScore >= 12 ? "rgba(196,146,42,0.16)" : "rgba(207,92,30,0.12)",
                  border: `1px solid ${totalScore >= 16 ? "rgba(74,103,65,0.32)" : totalScore >= 12 ? "rgba(196,146,42,0.35)" : "rgba(207,92,30,0.3)"}`,
                }}
              >
                <p style={{ margin: 0, fontFamily: fonts.display, fontWeight: 900, fontSize: 24 }}>
                  {totalScore}/18
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 13 }}>{verdict}</p>
              </div>
            </div>

            <div style={panelStyle}>
              <PanelTitle icon={<FileText size={18} />} title="Decision Record" />
              <textarea
                readOnly
                value={decisionRecord}
                style={{ ...fieldStyle(true), minHeight: 260, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
              />
              <button onClick={() => copyText("record", decisionRecord)} style={{ ...secondaryButtonStyle, marginTop: 12 }}>
                {copied === "record" ? <Check size={16} /> : <Clipboard size={16} />}
                {copied === "record" ? "Copied" : "Copy record"}
              </button>
            </div>
          </div>
        </section>

        <section style={{ ...panelStyle, marginTop: 18 }}>
          <PanelTitle icon={<Check size={18} />} title="Current Stage Outputs" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(5, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {activeStage.outputs.map((output) => (
              <div
                key={output}
                style={{
                  border: "1px solid rgba(28,25,23,0.14)",
                  borderRadius: 6,
                  padding: 14,
                  backgroundColor: "rgba(255,255,255,0.34)",
                  fontFamily: fonts.display,
                  fontWeight: 800,
                  fontSize: 13,
                }}
              >
                {output}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function FieldSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span style={labelStyle()}>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} style={fieldStyle()}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function PanelTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <span
        style={{
          width: 32,
          height: 32,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          backgroundColor: colors.shed,
          color: colors.milk,
        }}
      >
        {icon}
      </span>
      <h2
        style={{
          margin: 0,
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: 14,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

const panelStyle: CSSProperties = {
  border: `1px solid rgba(28,25,23,0.14)`,
  borderRadius: 8,
  backgroundColor: "rgba(245,240,232,0.72)",
  padding: 18,
  boxShadow: "0 12px 30px rgba(28,25,23,0.05)",
};

const headerLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 38,
  border: "1px solid rgba(245,240,232,0.22)",
  borderRadius: 6,
  color: colors.milk,
  textDecoration: "none",
  padding: "0 14px",
  fontFamily: fonts.display,
  fontWeight: 800,
  fontSize: 12,
  letterSpacing: "0.04em",
};

const primaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "none",
  borderRadius: 6,
  backgroundColor: colors.shed,
  color: colors.milk,
  padding: "12px 15px",
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 12,
  cursor: "pointer",
};

const secondaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: `1px solid rgba(28,25,23,0.2)`,
  borderRadius: 6,
  backgroundColor: "rgba(255,255,255,0.36)",
  color: colors.shed,
  padding: "11px 14px",
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 12,
  cursor: "pointer",
};
