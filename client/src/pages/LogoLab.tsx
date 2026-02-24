import { useState, useCallback, type CSSProperties } from "react";
import { colors, fonts } from "../styles/brand";

/* -----------------------------------------------
   LOGO LAB — Image Generation Playground
   Test prompts, compare outputs, pick winners
   for the Growing H logo stages.
   ----------------------------------------------- */

interface GeneratedImage {
  id: string;
  prompt: string;
  image: string; // data URI
  url?: string;
  timestamp: number;
  stage?: number;
}

const STAGE_PRESETS: { stage: number; label: string; prompt: string }[] = [
  {
    stage: 1,
    label: "Seed",
    prompt:
      "Flat minimalist logo mark on pure white background. The letter H formed from two seeds just beginning to crack open, with the faintest hint of a root tendril connecting them as the crossbar. Monochrome, single weight line work. Simple, iconic, would work at 16px favicon size. No text, no extra decoration.",
  },
  {
    stage: 2,
    label: "Shoots",
    prompt:
      "Flat minimalist logo mark on pure white background. The letter H formed from two thin shoots growing upward, connected by a single delicate horizontal tendril as the crossbar. Slightly more defined than a seed — early growth energy. Monochrome, clean vector style. No text, no extra decoration.",
  },
  {
    stage: 3,
    label: "Sapling",
    prompt:
      "Flat minimalist logo mark on pure white background. The letter H formed from two young saplings with their first small branches. The crossbar is a sturdy horizontal branch connecting them. Starting to look like a recognisable H shape. Monochrome, clean lines. No text, no extra decoration.",
  },
  {
    stage: 4,
    label: "Mature",
    prompt:
      "Flat minimalist logo mark on pure white background. A fully formed organic letter H made from two mature tree trunks with three horizontal connecting bars (like shelves or branches). Rich detail in the bark texture but still reads as a clean logo. Monochrome. No text, no extra decoration.",
  },
  {
    stage: 5,
    label: "Fruit",
    prompt:
      "Flat minimalist logo mark on pure white background. The letter H formed from two abundant trees, with hanging fruit, lanterns, or small objects dangling from the crossbars — suggesting harvest, celebration, and community gathering. Decorative but balanced. Monochrome. No text, no extra decoration.",
  },
  {
    stage: 6,
    label: "Return",
    prompt:
      "Flat minimalist logo mark on pure white background. The letter H with thinning, graceful bars. Some fallen leaves at the base, a sense of release and return to earth. The shape is still recognisable but lighter, more open, suggesting completion and renewal. Monochrome. No text, no extra decoration.",
  },
];

const ASPECT_RATIOS = ["1:1", "4:3", "16:9", "3:4"] as const;

export default function LogoLab() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [enlargedId, setEnlargedId] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const generate = useCallback(
    async (customPrompt?: string, stage?: number) => {
      const p = customPrompt || prompt;
      if (!p.trim()) return;
      setGenerating(true);
      setError(null);
      try {
        const res = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: p, aspectRatio, save: true }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `HTTP ${res.status}`);
        }
        const data = await res.json();
        const newImage: GeneratedImage = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          prompt: p,
          image: data.image,
          url: data.url,
          timestamp: Date.now(),
          stage: stage ?? activeStage ?? undefined,
        };
        setImages((prev) => [newImage, ...prev]);
      } catch (err: any) {
        setError(err.message || "Generation failed");
      } finally {
        setGenerating(false);
      }
    },
    [prompt, aspectRatio, activeStage],
  );

  const downloadImage = useCallback((img: GeneratedImage) => {
    const a = document.createElement("a");
    a.href = img.image;
    const stageSuffix = img.stage ? `-stage-${String(img.stage).padStart(2, "0")}` : "";
    a.download = `logo-lab${stageSuffix}-${img.id}.png`;
    a.click();
  }, []);

  const enlarged = enlargedId ? images.find((i) => i.id === enlargedId) : null;

  return (
    <div style={pageStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <a href="/growing-h" style={backLinkStyle}>
          &larr; Growing H
        </a>
        <img
          src="/images/logo-harvest-seed.png"
          alt="The Harvest — seed mark"
          style={{ width: 90, height: "auto", marginBottom: 12 }}
        />
        <h1 style={titleStyle}>Logo Lab</h1>
        <p style={subtitleStyle}>Generate, compare, and pick logo marks for The Harvest</p>
      </header>

      {/* Stage presets */}
      <section style={sectionStyle}>
        <div style={sectionLabelStyle}>STAGE PRESETS</div>
        <div style={presetsGridStyle}>
          {STAGE_PRESETS.map((preset) => (
            <button
              key={preset.stage}
              onClick={() => {
                setPrompt(preset.prompt);
                setActiveStage(preset.stage);
              }}
              style={{
                ...presetButtonStyle,
                borderColor: activeStage === preset.stage ? colors.goldenHour : "rgba(245,240,232,0.15)",
                color: activeStage === preset.stage ? colors.goldenHour : colors.milk,
              }}
            >
              <span style={presetNumberStyle}>{String(preset.stage).padStart(2, "0")}</span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Prompt input */}
      <section style={sectionStyle}>
        <div style={sectionLabelStyle}>PROMPT</div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the logo you want to generate..."
          rows={4}
          style={textareaStyle}
        />

        <div style={controlsRowStyle}>
          <div style={ratioGroupStyle}>
            {ASPECT_RATIOS.map((r) => (
              <button
                key={r}
                onClick={() => setAspectRatio(r)}
                style={{
                  ...ratioButtonStyle,
                  backgroundColor: aspectRatio === r ? colors.goldenHour : "transparent",
                  color: aspectRatio === r ? colors.shed : colors.milk,
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => generate()}
            disabled={generating || !prompt.trim()}
            style={{
              ...generateButtonStyle,
              opacity: generating || !prompt.trim() ? 0.4 : 1,
            }}
          >
            {generating ? "Generating..." : "Generate"}
          </button>
        </div>

        {error && <div style={errorStyle}>{error}</div>}
      </section>

      {/* Gallery */}
      {images.length > 0 && (
        <section style={sectionStyle}>
          <div style={sectionLabelStyle}>
            GALLERY ({images.length} image{images.length !== 1 ? "s" : ""})
          </div>
          <div style={galleryGridStyle}>
            {images.map((img) => (
              <div key={img.id} style={galleryCardStyle}>
                <div
                  style={galleryImageWrapStyle}
                  onClick={() => setEnlargedId(img.id)}
                >
                  <img src={img.image} alt={img.prompt.slice(0, 60)} style={galleryImageStyle} />
                </div>
                <div style={galleryMetaStyle}>
                  {img.stage && (
                    <span style={stageTagStyle}>
                      Stage {img.stage}
                    </span>
                  )}
                  <span style={timestampStyle}>
                    {new Date(img.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p style={galleryPromptStyle}>{img.prompt.slice(0, 120)}...</p>
                <div style={galleryActionsStyle}>
                  <button onClick={() => downloadImage(img)} style={actionButtonStyle}>
                    Download
                  </button>
                  <button
                    onClick={() => {
                      setPrompt(img.prompt);
                      setActiveStage(img.stage ?? null);
                    }}
                    style={actionButtonStyle}
                  >
                    Reuse prompt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {images.length === 0 && !generating && (
        <div style={emptyStateStyle}>
          <p style={{ opacity: 0.3, fontSize: 48, margin: 0 }}>H</p>
          <p style={{ opacity: 0.4 }}>Pick a stage preset or write your own prompt to start generating</p>
        </div>
      )}

      {/* Lightbox */}
      {enlarged && (
        <div style={lightboxOverlayStyle} onClick={() => setEnlargedId(null)}>
          <div style={lightboxContentStyle} onClick={(e) => e.stopPropagation()}>
            <img src={enlarged.image} alt="" style={lightboxImageStyle} />
            <div style={lightboxMetaStyle}>
              {enlarged.stage && <span style={stageTagStyle}>Stage {enlarged.stage}</span>}
              <p style={{ margin: "8px 0 0", opacity: 0.6, fontSize: 13 }}>{enlarged.prompt}</p>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button onClick={() => downloadImage(enlarged)} style={actionButtonStyle}>
                  Download
                </button>
                <button onClick={() => setEnlargedId(null)} style={actionButtonStyle}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== STYLES ===== */

const pageStyle: CSSProperties = {
  backgroundColor: colors.shed,
  color: colors.milk,
  fontFamily: fonts.body,
  minHeight: "100vh",
  padding: "40px 24px 80px",
  maxWidth: 1100,
  margin: "0 auto",
};

const headerStyle: CSSProperties = {
  marginBottom: 40,
};

const backLinkStyle: CSSProperties = {
  color: colors.milk,
  opacity: 0.4,
  textDecoration: "none",
  fontSize: 13,
  fontFamily: fonts.display,
  letterSpacing: "0.05em",
};

const titleStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 48,
  margin: "12px 0 8px",
  letterSpacing: "-0.02em",
};

const subtitleStyle: CSSProperties = {
  opacity: 0.5,
  fontSize: 16,
  margin: 0,
};

const sectionStyle: CSSProperties = {
  marginBottom: 40,
};

const sectionLabelStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 800,
  fontSize: 11,
  letterSpacing: "0.15em",
  opacity: 0.4,
  marginBottom: 16,
};

const presetsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: 10,
};

const presetButtonStyle: CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(245,240,232,0.15)",
  borderRadius: 6,
  padding: "12px 16px",
  color: colors.milk,
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  textAlign: "left",
  display: "flex",
  flexDirection: "column",
  gap: 4,
  transition: "border-color 0.2s",
};

const presetNumberStyle: CSSProperties = {
  fontSize: 11,
  opacity: 0.4,
  letterSpacing: "0.1em",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: "rgba(245,240,232,0.05)",
  border: "1px solid rgba(245,240,232,0.15)",
  borderRadius: 6,
  color: colors.milk,
  fontFamily: fonts.body,
  fontSize: 15,
  padding: "14px 16px",
  resize: "vertical",
  outline: "none",
  lineHeight: 1.6,
};

const controlsRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 12,
  gap: 16,
  flexWrap: "wrap",
};

const ratioGroupStyle: CSSProperties = {
  display: "flex",
  gap: 6,
};

const ratioButtonStyle: CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(245,240,232,0.2)",
  borderRadius: 4,
  padding: "6px 12px",
  fontSize: 12,
  fontFamily: fonts.display,
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.2s",
};

const generateButtonStyle: CSSProperties = {
  backgroundColor: colors.goldenHour,
  color: colors.shed,
  border: "none",
  borderRadius: 6,
  padding: "12px 32px",
  fontFamily: fonts.display,
  fontWeight: 800,
  fontSize: 14,
  letterSpacing: "0.05em",
  cursor: "pointer",
  transition: "opacity 0.2s",
};

const errorStyle: CSSProperties = {
  marginTop: 12,
  padding: "10px 14px",
  backgroundColor: "rgba(207,92,30,0.15)",
  border: `1px solid ${colors.calendula}`,
  borderRadius: 6,
  color: colors.calendula,
  fontSize: 13,
};

const galleryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 16,
};

const galleryCardStyle: CSSProperties = {
  backgroundColor: "rgba(245,240,232,0.04)",
  border: "1px solid rgba(245,240,232,0.1)",
  borderRadius: 8,
  overflow: "hidden",
};

const galleryImageWrapStyle: CSSProperties = {
  cursor: "pointer",
  backgroundColor: "rgba(255,255,255,0.03)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 200,
};

const galleryImageStyle: CSSProperties = {
  width: "100%",
  height: "auto",
  display: "block",
};

const galleryMetaStyle: CSSProperties = {
  padding: "10px 14px 0",
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const stageTagStyle: CSSProperties = {
  backgroundColor: colors.goldenHour,
  color: colors.shed,
  fontSize: 10,
  fontFamily: fonts.display,
  fontWeight: 800,
  letterSpacing: "0.08em",
  padding: "3px 8px",
  borderRadius: 3,
};

const timestampStyle: CSSProperties = {
  fontSize: 11,
  opacity: 0.3,
  fontFamily: fonts.display,
};

const galleryPromptStyle: CSSProperties = {
  padding: "6px 14px",
  fontSize: 12,
  opacity: 0.4,
  lineHeight: 1.5,
  margin: 0,
};

const galleryActionsStyle: CSSProperties = {
  padding: "8px 14px 14px",
  display: "flex",
  gap: 8,
};

const actionButtonStyle: CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(245,240,232,0.2)",
  borderRadius: 4,
  color: colors.milk,
  fontSize: 11,
  fontFamily: fonts.display,
  fontWeight: 700,
  padding: "6px 12px",
  cursor: "pointer",
  opacity: 0.7,
};

const emptyStateStyle: CSSProperties = {
  textAlign: "center",
  padding: "80px 20px",
  fontFamily: fonts.display,
};

const lightboxOverlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.85)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: 24,
};

const lightboxContentStyle: CSSProperties = {
  maxWidth: 800,
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
};

const lightboxImageStyle: CSSProperties = {
  maxWidth: "100%",
  maxHeight: "70vh",
  objectFit: "contain",
  borderRadius: 8,
};

const lightboxMetaStyle: CSSProperties = {
  padding: "12px 0",
  color: colors.milk,
};
