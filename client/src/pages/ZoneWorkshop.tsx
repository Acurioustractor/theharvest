import { useState, useEffect, useRef, useCallback, type CSSProperties } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { rootStyle, colors, fonts } from "@/styles/brand";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { zoneData } from "./BauhausZone";

/* ─────────────────────────────────────
   ZONE ORDER + SITE PLAN
   ───────────────────────────────────── */

const zoneOrder = [
  "gallery",
  "kitchen",
  "milkbar",
  "fire",
  "gardens",
  "gather",
  "kids",
  "outdoor-art",
  "residency",
];

/* ─────────────────────────────────────
   TYPES
   ───────────────────────────────────── */

type IdeaBoardItem =
  | { type: "image"; id: string; src: string; label: string; source: "upload" | "ai" | "deck" }
  | { type: "note"; id: string; text: string; createdAt: number }
  | { type: "voice"; id: string; blobUrl: string; duration: number; label: string; createdAt: number };

type LightboxState = { images: { src: string; label: string }[]; index: number } | null;

type BoardPos = { x: number; y: number };

let _idCounter = 0;
function nextId() {
  return `item-${Date.now()}-${++_idCounter}`;
}

/* ─────────────────────────────────────
   CONCEPT DECK CONTENT PER ZONE
   (from TheHarvestConcept.pdf)
   ───────────────────────────────────── */

const deckContent: Record<string, {
  title: string;
  phase: 1 | 2;
  points: string[];
  images: { src: string; caption: string }[];
}> = {
  gallery: {
    title: "Gallery",
    phase: 2,
    points: [
      "A gallery that brings wonderful art, experience and food together",
      "Quarterly artist residency launches with curated dining experiences ($200/head)",
      "Dedicated gallery entrance for intimate, theatrical staging",
      "Artists engage with visitors about their vision and process",
    ],
    images: [
      { src: "/images/compendium/MASTER FLOOR PLAN_5.jpeg", caption: "Gallery pavilion concept (architect)" },
    ],
  },
  kitchen: {
    title: "Commercial Kitchen",
    phase: 2,
    points: [
      "Phase 2 interior fit-out: commercial hospitality infrastructure",
      "Kitchen fit-out to support the milk bar, community meals, and gallery dining experiences",
      "Workshop space preparation for maker programs",
      "Interior finishes including painting and flooring",
    ],
    images: [
      { src: "/images/compendium/MASTER FLOOR PLAN_11.jpeg", caption: "Phase 2 interior plan (building highlighted)" },
    ],
  },
  milkbar: {
    title: "Milk Bar",
    phase: 2,
    points: [
      "Paying tribute to historic milk bars. Experiential design over hospitality efficiency. Minimal staffing needs",
      "Theatrical milk bar with beverage taps (milkshakes, ice latte, ice tea dispensed like brewery). Self-serve model. Cake/slice from local bakers. Retro aesthetic with colorful outdoor tables",
      "Creative concept. One person at checkout. Mid-range pricing tier. Simple to start with not much investment",
    ],
    images: [],
  },
  fire: {
    title: "Timber & Fire Cooking",
    phase: 1,
    points: [
      "Tribute to timber industry. Affordable DIY cooking access. Honest storytelling (e.g. Barry discussing tree destruction and reforestation)",
      "General store for buying produce to cook on fire. Pizza oven. Reclaimed timber materials",
      "Make-your-own fire cooking station (affordable tier). Source materials from local timber",
    ],
    images: [
      { src: "/images/site-plan/inspiration/curved-pavilion.jpeg", caption: "Timber cooking pavilion reference" },
    ],
  },
  gardens: {
    title: "Community Garden",
    phase: 1,
    points: [
      '"Access for all", open 24/7 to encourage community ownership. Currently no public park in Witta for people to gather',
      "Community gardens growing all produce for the venues. Two entry points (large path from road, portal through car park). Regenerative farm-to-table programming",
      "Garden beds throughout (volume planning with gardener Sophie). Ticketed experiences where guests pick vegetables before meals. Open access encourages ownership culture",
    ],
    images: [
      { src: "/images/compendium/MASTER FLOOR PLAN_8.jpeg", caption: "Accessible raised garden bed" },
      { src: "/images/compendium/MASTER FLOOR PLAN_9.jpeg", caption: "Community garden beds with lighting" },
      { src: "/images/site-plan/inspiration/accessible-garden.jpeg", caption: "NDIS-accessible garden reference" },
    ],
  },
  gather: {
    title: "Pavilion (Milk Crate)",
    phase: 1,
    points: [
      "Tribute to dairy/milk industry heritage (with honest storytelling about colonial legacy and using art for advocacy)",
      "Structure constructed from 1,000 milk crates. Community participation project",
      "First residency builds this with schools and young people. Collaborative design exploring regional history",
    ],
    images: [
      { src: "/images/compendium/MASTER FLOOR PLAN_4.jpeg", caption: "Milk crate wall installation" },
      { src: "/images/compendium/MASTER FLOOR PLAN_6.jpeg", caption: "Colorful crate pavilion structure" },
      { src: "/images/site-plan/inspiration/crate-wall.jpeg", caption: "Crate wall reference" },
      { src: "/images/site-plan/inspiration/crate-cube.jpeg", caption: "Crate cube structure" },
      { src: "/images/sketches/milk-crate-pavilion-01.jpg", caption: "Pavilion concept (Gemini)" },
      { src: "/images/sketches/milk-crate-pavilion-02.jpg", caption: "Community build day (Gemini)" },
    ],
  },
  kids: {
    title: "Kids Play Area",
    phase: 1,
    points: [
      "Family-friendly community space. Co-creation principle (kids design their own play spaces)",
      "Integrated play area near pavilions",
      "Community volunteers build. Kids participate in design. Parental responsibility model (legal review needed for fire safety)",
    ],
    images: [
      { src: "/images/compendium/MASTER FLOOR PLAN_7.jpeg", caption: "Natural log climbing structure" },
      { src: "/images/compendium/MASTER FLOOR PLAN_10.jpeg", caption: "Outdoor musical instrument wall" },
      { src: "/images/site-plan/inspiration/log-climbing-frame.jpeg", caption: "Log climbing frame reference" },
    ],
  },
  "outdoor-art": {
    title: "Outdoor Art Space",
    phase: 1,
    points: [
      "Presiding area for makers and artists",
      "Outdoor area for artists to make and display work",
      "Connected to gallery residency program",
    ],
    images: [
      { src: "/images/site-plan/inspiration/pen-sketch-portrait.jpeg", caption: "Artist portrait reference" },
    ],
  },
  residency: {
    title: "Residency #1: Radical Scoops",
    phase: 1,
    points: [
      "Drawing from the region's layered industrial past: Timber, Dairy, Co-operative movements",
      "THE TIMBER INDUSTRY: Fire / Food / Fuel, Heat (Fire)",
      "DAIRY INDUSTRY: The Space Host Makers, Fuel (Milk/Water)",
      "CO-OPERATIVE INDUSTRY: The Space Host Makers, Air (Conversation)",
    ],
    images: [],
  },
};

/* ─────────────────────────────────────
   CONCEPT DECK CAROUSEL
   ───────────────────────────────────── */

function ConceptDeckCarousel({ images, zoneColor, onImageClick }: {
  images: { src: string; caption: string }[];
  zoneColor: string;
  onImageClick: (images: { src: string; label: string }[], index: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el?.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  const lightboxImages = images.map((img) => ({ src: img.src, label: img.caption }));

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: 4,
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => onImageClick(lightboxImages, i)}
            style={{
              flexShrink: 0,
              width: 240,
              scrollSnapAlign: "start",
              cursor: "pointer",
            }}
          >
            <img
              src={img.src}
              alt={img.caption}
              style={{
                width: 240,
                height: 160,
                objectFit: "cover",
                borderRadius: 2,
                display: "block",
                border: `2px solid ${zoneColor}22`,
              }}
            />
            <p style={{
              fontFamily: fonts.body,
              fontSize: 11,
              opacity: 0.4,
              margin: "6px 0 0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 240,
            }}>
              {img.caption}
            </p>
          </div>
        ))}
      </div>
      {/* Scroll arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          style={carouselArrowStyle("left")}
          aria-label="Scroll left"
        >
          &larr;
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          style={carouselArrowStyle("right")}
          aria-label="Scroll right"
        >
          &rarr;
        </button>
      )}
    </div>
  );
}

function carouselArrowStyle(side: "left" | "right"): CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    transform: "translateY(-70%)",
    [side]: -12,
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: "rgba(26,26,26,0.85)",
    color: colors.milk,
    border: "none",
    cursor: "pointer",
    fontFamily: fonts.body,
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  };
}

/* ─────────────────────────────────────
   VOICE RECORDER
   ───────────────────────────────────── */

function VoiceRecorder({ zoneColor, onSave, onClose }: {
  zoneColor: string;
  onSave: (blobUrl: string, duration: number) => void;
  onClose: () => void;
}) {
  const [state, setState] = useState<"idle" | "recording" | "recorded">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef(0);

  const MAX_DURATION = 120;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setState("recorded");
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      startTime.current = Date.now();
      setState("recording");

      timerRef.current = setInterval(() => {
        const sec = Math.floor((Date.now() - startTime.current) / 1000);
        setElapsed(sec);
        if (sec >= MAX_DURATION) {
          recorder.stop();
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 250);
    } catch {
      // Permission denied or no mic
      setState("idle");
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const discard = () => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null);
    setElapsed(0);
    setState("idle");
    onClose();
  };

  const save = () => {
    if (blobUrl) {
      onSave(blobUrl, elapsed);
    }
    setElapsed(0);
    setState("idle");
    onClose();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{
      marginBottom: 16,
      padding: 16,
      border: `1px solid ${zoneColor}44`,
      backgroundColor: `${zoneColor}08`,
      borderRadius: 2,
    }}>
      {state === "idle" && (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={startRecording}
            style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.1em",
              color: colors.milk,
              backgroundColor: colors.crane,
              border: "none",
              padding: "8px 20px",
              cursor: "pointer",
              borderRadius: 2,
            }}
          >
            START RECORDING
          </button>
          <button
            onClick={onClose}
            style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.1em",
              color: colors.shed,
              backgroundColor: "transparent",
              border: "1px solid rgba(26,26,26,0.15)",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            CANCEL
          </button>
        </div>
      )}

      {state === "recording" && (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: colors.crane,
            animation: "pulse 1s ease-in-out infinite",
          }} />
          <span style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: "0.05em",
          }}>
            {formatTime(elapsed)}
          </span>
          <span style={{
            fontFamily: fonts.body,
            fontSize: 12,
            opacity: 0.4,
          }}>
            / {formatTime(MAX_DURATION)}
          </span>
          <button
            onClick={stopRecording}
            style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.1em",
              color: colors.milk,
              backgroundColor: colors.shed,
              border: "none",
              padding: "8px 20px",
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            STOP
          </button>
        </div>
      )}

      {state === "recorded" && blobUrl && (
        <div>
          <audio src={blobUrl} controls style={{ width: "100%", marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={save}
              style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.1em",
                color: colors.milk,
                backgroundColor: colors.shed,
                border: "none",
                padding: "8px 20px",
                cursor: "pointer",
              }}
            >
              SAVE TO BOARD
            </button>
            <button
              onClick={discard}
              style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.1em",
                color: colors.shed,
                backgroundColor: "transparent",
                border: "1px solid rgba(26,26,26,0.15)",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              DISCARD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────
   IDEA BOARD
   ───────────────────────────────────── */

function IdeaBoard({ items, zoneColor, isMobile, onDelete, onImageClick }: {
  items: IdeaBoardItem[];
  zoneColor: string;
  isMobile: boolean;
  onDelete: (id: string) => void;
  onImageClick: (images: { src: string; label: string }[], index: number) => void;
}) {
  const imageItems = items.filter((it): it is Extract<IdeaBoardItem, { type: "image" }> => it.type === "image");

  return (
    <div style={{
      columns: isMobile ? 2 : 3,
      columnGap: isMobile ? 8 : 12,
    }}>
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            style={{
              breakInside: "avoid" as const,
              marginBottom: isMobile ? 8 : 12,
            }}
          >
            {item.type === "image" && (
              <div className="idea-card" style={{
                position: "relative",
                backgroundColor: "rgba(26,26,26,0.04)",
                border: item.source === "ai" ? `2px solid ${zoneColor}44` : "1px solid rgba(26,26,26,0.08)",
                borderRadius: 2,
                overflow: "hidden",
              }}>
                <img
                  src={item.src}
                  alt={item.label}
                  onClick={() => {
                    const idx = imageItems.findIndex((im) => im.id === item.id);
                    onImageClick(
                      imageItems.map((im) => ({ src: im.src, label: im.label })),
                      Math.max(0, idx),
                    );
                  }}
                  style={{
                    width: "100%",
                    display: "block",
                    cursor: "pointer",
                  }}
                />
                <div style={{
                  padding: "6px 8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}>
                  {item.source === "ai" && (
                    <span style={{
                      fontFamily: fonts.display,
                      fontWeight: 700,
                      fontSize: 9,
                      letterSpacing: "0.08em",
                      color: zoneColor,
                      border: `1px solid ${zoneColor}44`,
                      padding: "1px 5px",
                      flexShrink: 0,
                    }}>AI</span>
                  )}
                  <span style={{
                    fontFamily: fonts.body,
                    fontSize: 11,
                    opacity: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}>
                    {item.label}
                  </span>
                </div>
                <button
                  className="idea-delete"
                  onClick={() => onDelete(item.id)}
                  style={deleteButtonStyle}
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            )}

            {item.type === "note" && (
              <div className="idea-card" style={{
                position: "relative",
                padding: "12px 14px",
                border: `1px dashed ${zoneColor}44`,
                backgroundColor: `${zoneColor}0A`,
                borderRadius: 2,
              }}>
                <p style={{
                  fontFamily: fonts.body,
                  fontSize: 13,
                  lineHeight: 1.6,
                  margin: 0,
                  opacity: 0.75,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  {item.text}
                </p>
                <button
                  className="idea-delete"
                  onClick={() => onDelete(item.id)}
                  style={deleteButtonStyle}
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            )}

            {item.type === "voice" && (
              <div className="idea-card" style={{
                position: "relative",
                padding: "12px 14px",
                border: `1px solid ${zoneColor}33`,
                backgroundColor: `${zoneColor}0A`,
                borderRadius: 2,
              }}>
                <div style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  opacity: 0.4,
                  marginBottom: 8,
                }}>
                  VOICE NOTE
                </div>
                <audio src={item.blobUrl} controls style={{ width: "100%", height: 32 }} />
                <span style={{
                  fontFamily: fonts.body,
                  fontSize: 11,
                  opacity: 0.4,
                  display: "block",
                  marginTop: 4,
                }}>
                  {item.label}
                </span>
                <button
                  className="idea-delete"
                  onClick={() => onDelete(item.id)}
                  style={deleteButtonStyle}
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────
   FULLSCREEN MIRO-LIKE BOARD
   ───────────────────────────────────── */

function FullscreenBoard({ items, zoneColor, zoneName, onDelete, onClose, onUpdatePositions, positions, onImageClick }: {
  items: IdeaBoardItem[];
  zoneColor: string;
  zoneName: string;
  onDelete: (id: string) => void;
  onClose: () => void;
  onUpdatePositions: (positions: Record<string, BoardPos>) => void;
  positions: Record<string, BoardPos>;
  onImageClick: (images: { src: string; label: string }[], index: number) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState<string | null>(null);
  const [panning, setPanning] = useState(false);
  const dragStart = useRef<{ x: number; y: number; itemX: number; itemY: number } | null>(null);
  const panStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const imageItems = items.filter((it): it is Extract<IdeaBoardItem, { type: "image" }> => it.type === "image");

  // ESC to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  // Zoom with scroll wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.min(3, Math.max(0.2, z * delta)));
  }, []);

  // Pan: mousedown on background
  const handleBgDown = (e: React.MouseEvent) => {
    if (e.target !== canvasRef.current && e.target !== e.currentTarget) return;
    setPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (panning && panStart.current) {
      setPan({
        x: panStart.current.panX + (e.clientX - panStart.current.x),
        y: panStart.current.panY + (e.clientY - panStart.current.y),
      });
    }
    if (dragging && dragStart.current) {
      const newX = dragStart.current.itemX + (e.clientX - dragStart.current.x) / zoom;
      const newY = dragStart.current.itemY + (e.clientY - dragStart.current.y) / zoom;
      onUpdatePositions({ ...positions, [dragging]: { x: newX, y: newY } });
    }
  }, [panning, dragging, zoom, positions, onUpdatePositions]);

  const handleMouseUp = useCallback(() => {
    setPanning(false);
    setDragging(null);
    dragStart.current = null;
    panStart.current = null;
  }, []);

  const startItemDrag = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const pos = positions[id] || { x: 0, y: 0 };
    setDragging(id);
    dragStart.current = { x: e.clientX, y: e.clientY, itemX: pos.x, itemY: pos.y };
  };

  // Touch support for dragging items
  const handleTouchStart = (id: string, e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    const pos = positions[id] || { x: 0, y: 0 };
    setDragging(id);
    dragStart.current = { x: touch.clientX, y: touch.clientY, itemX: pos.x, itemY: pos.y };
  };

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragging && dragStart.current) {
      const touch = e.touches[0];
      const newX = dragStart.current.itemX + (touch.clientX - dragStart.current.x) / zoom;
      const newY = dragStart.current.itemY + (touch.clientY - dragStart.current.y) / zoom;
      onUpdatePositions({ ...positions, [dragging]: { x: newX, y: newY } });
    }
  }, [dragging, zoom, positions, onUpdatePositions]);

  const handleTouchEnd = useCallback(() => {
    setDragging(null);
    dragStart.current = null;
  }, []);

  const CARD_W = 220;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 900,
        backgroundColor: "#0f0f0f",
        cursor: panning ? "grabbing" : "grab",
        overflow: "hidden",
      }}
      onMouseDown={handleBgDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        background: "linear-gradient(to bottom, rgba(15,15,15,0.95), transparent)",
        pointerEvents: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, pointerEvents: "auto" }}>
          <div style={{ width: 12, height: 12, backgroundColor: zoneColor }} />
          <span style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: 13,
            letterSpacing: "0.1em",
            color: colors.milk,
          }}>
            {zoneName} — IDEA BOARD
          </span>
          <span style={{
            fontFamily: fonts.body,
            fontSize: 12,
            color: colors.milk,
            opacity: 0.4,
            marginLeft: 8,
          }}>
            {items.length} items · scroll to zoom · drag to move
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, pointerEvents: "auto" }}>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.1em",
              color: colors.milk,
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "none",
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            RESET VIEW
          </button>
          <button
            onClick={onClose}
            style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.1em",
              color: colors.milk,
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "none",
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            CLOSE
          </button>
        </div>
      </div>

      {/* Zoom indicator */}
      <div style={{
        position: "absolute",
        bottom: 16,
        right: 20,
        zIndex: 10,
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize: 11,
        color: colors.milk,
        opacity: 0.3,
      }}>
        {Math.round(zoom * 100)}%
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        {items.map((item) => {
          const pos = positions[item.id] || { x: 0, y: 0 };
          const isDragging = dragging === item.id;

          return (
            <div
              key={item.id}
              onMouseDown={(e) => startItemDrag(item.id, e)}
              onTouchStart={(e) => handleTouchStart(item.id, e)}
              style={{
                position: "absolute",
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
                transform: `translate(-50%, -50%)${isDragging ? " scale(1.04)" : ""}`,
                width: CARD_W,
                cursor: isDragging ? "grabbing" : "grab",
                transition: isDragging ? "none" : "box-shadow 0.15s",
                boxShadow: isDragging
                  ? `0 8px 32px rgba(0,0,0,0.5), 0 0 0 2px ${zoneColor}`
                  : "0 2px 12px rgba(0,0,0,0.3)",
                zIndex: isDragging ? 100 : 1,
                userSelect: "none",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              {item.type === "image" && (
                <div className="idea-card" style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: 4,
                  overflow: "hidden",
                  border: item.source === "ai" ? `2px solid ${zoneColor}66` : "1px solid rgba(255,255,255,0.08)",
                  position: "relative",
                }}>
                  <img
                    src={item.src}
                    alt={item.label}
                    draggable={false}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      const idx = imageItems.findIndex((im) => im.id === item.id);
                      onImageClick(
                        imageItems.map((im) => ({ src: im.src, label: im.label })),
                        Math.max(0, idx),
                      );
                    }}
                    style={{
                      width: "100%",
                      display: "block",
                      pointerEvents: "auto",
                    }}
                  />
                  <div style={{ padding: "6px 8px", display: "flex", alignItems: "center", gap: 4 }}>
                    {item.source === "ai" && (
                      <span style={{
                        fontFamily: fonts.display,
                        fontWeight: 700,
                        fontSize: 9,
                        color: zoneColor,
                        border: `1px solid ${zoneColor}44`,
                        padding: "1px 5px",
                      }}>AI</span>
                    )}
                    <span style={{
                      fontFamily: fonts.body,
                      fontSize: 10,
                      color: colors.milk,
                      opacity: 0.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}>
                      {item.label}
                    </span>
                  </div>
                  <button
                    className="idea-delete"
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    style={{ ...deleteButtonStyle, opacity: 0 }}
                    title="Remove"
                  >&times;</button>
                </div>
              )}

              {item.type === "note" && (
                <div className="idea-card" style={{
                  backgroundColor: `${zoneColor}18`,
                  border: `1px dashed ${zoneColor}55`,
                  borderRadius: 4,
                  padding: "14px 16px",
                  position: "relative",
                  minHeight: 60,
                }}>
                  <p style={{
                    fontFamily: fonts.body,
                    fontSize: 13,
                    lineHeight: 1.5,
                    margin: 0,
                    color: colors.milk,
                    opacity: 0.8,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}>
                    {item.text}
                  </p>
                  <button
                    className="idea-delete"
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    style={{ ...deleteButtonStyle, opacity: 0 }}
                    title="Remove"
                  >&times;</button>
                </div>
              )}

              {item.type === "voice" && (
                <div className="idea-card" style={{
                  backgroundColor: `${zoneColor}18`,
                  border: `1px solid ${zoneColor}44`,
                  borderRadius: 4,
                  padding: "14px 16px",
                  position: "relative",
                }}>
                  <div style={{
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    color: colors.milk,
                    opacity: 0.4,
                    marginBottom: 8,
                  }}>
                    VOICE NOTE
                  </div>
                  <audio
                    src={item.blobUrl}
                    controls
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{ width: "100%", height: 28 }}
                  />
                  <span style={{
                    fontFamily: fonts.body,
                    fontSize: 10,
                    color: colors.milk,
                    opacity: 0.4,
                    display: "block",
                    marginTop: 4,
                  }}>
                    {item.label}
                  </span>
                  <button
                    className="idea-delete"
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    style={{ ...deleteButtonStyle, opacity: 0 }}
                    title="Remove"
                  >&times;</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/** Arrange items in a grid layout for initial board positions */
function autoLayoutPositions(items: IdeaBoardItem[], existing: Record<string, BoardPos>): Record<string, BoardPos> {
  const CARD_W = 240;
  const CARD_H = 200;
  const GAP = 24;
  const cols = Math.max(3, Math.ceil(Math.sqrt(items.length)));
  const totalW = cols * (CARD_W + GAP);
  const result = { ...existing };

  let col = 0;
  let row = 0;
  for (const item of items) {
    if (!result[item.id]) {
      result[item.id] = {
        x: col * (CARD_W + GAP) - totalW / 2 + CARD_W / 2,
        y: row * (CARD_H + GAP) - 100,
      };
      col++;
      if (col >= cols) { col = 0; row++; }
    }
  }
  return result;
}

const deleteButtonStyle: CSSProperties = {
  position: "absolute",
  top: 4,
  right: 4,
  width: 22,
  height: 22,
  borderRadius: "50%",
  backgroundColor: "rgba(26,26,26,0.6)",
  color: colors.milk,
  border: "none",
  cursor: "pointer",
  fontFamily: fonts.body,
  fontSize: 14,
  lineHeight: "22px",
  textAlign: "center",
  padding: 0,
  opacity: 0,
  transition: "opacity 0.15s",
};

/* ─────────────────────────────────────
   COMPONENT
   ───────────────────────────────────── */

export default function ZoneWorkshop() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeZone, setActiveZone] = useState(zoneOrder[0]);
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    document.title = "Zone Workshop / The Harvest";
  }, []);

  // Lightbox keyboard nav
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft" && lightbox.index > 0) {
        setLightbox({ ...lightbox, index: lightbox.index - 1 });
      }
      if (e.key === "ArrowRight" && lightbox.index < lightbox.images.length - 1) {
        setLightbox({ ...lightbox, index: lightbox.index + 1 });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox]);

  // Track active zone on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveZone(entry.target.id.replace("zone-", ""));
          }
        }
      },
      { rootMargin: "-30% 0px -65% 0px" }
    );
    for (const id of zoneOrder) {
      const el = document.getElementById(`zone-${id}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(`zone-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openLightbox = useCallback((images: { src: string; label: string }[], index: number) => {
    setLightbox({ images, index });
  }, []);

  // Lightbox touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || !lightbox) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0 && lightbox.index < lightbox.images.length - 1) {
      setLightbox({ ...lightbox, index: lightbox.index + 1 });
    } else if (dx > 0 && lightbox.index > 0) {
      setLightbox({ ...lightbox, index: lightbox.index - 1 });
    }
  };

  return (
    <div style={rootStyle}>
      {/* Pulse animation for voice recorder */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        /* Hide scrollbar on carousel */
        .deck-carousel::-webkit-scrollbar { display: none; }
        /* Show delete button on hover */
        .idea-card:hover .idea-delete { opacity: 1 !important; }
      `}</style>

      {/* Header */}
      <header style={{
        position: "relative",
        color: colors.milk,
        padding: isMobile ? "100px 24px 32px" : "140px 40px 40px",
        textAlign: "center",
        overflow: "hidden",
        minHeight: isMobile ? 360 : 480,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/images/compendium/canvas-drawing-full.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(30,28,24,0.15) 0%, rgba(30,28,24,0.5) 50%, rgba(30,28,24,0.85) 100%)",
          zIndex: 1,
        }} />

        <div style={{ position: "relative", zIndex: 2, textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}>
          <Link href="/brand-guide" style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: "0.15em",
            color: colors.milk,
            opacity: 0.6,
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 16,
          }}>
            &larr; BRAND GUIDE
          </Link>
          <span style={smallLabelStyle}>INTERNAL WORKING DOCUMENT</span>
          <h1 style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: isMobile ? 28 : 44,
            letterSpacing: "0.12em",
            margin: "16px 0 12px",
          }}>
            ZONE WORKSHOP
          </h1>
          <p style={{
            fontFamily: fonts.body,
            fontSize: 16,
            opacity: 0.8,
            margin: 0,
          }}>
            Sketch, plan, and collect ideas for each zone
          </p>
        </div>
      </header>

      {/* Concept Deck + Zone Diagram */}
      <section style={{
        backgroundColor: colors.shed,
        color: colors.milk,
        padding: isMobile ? "40px 24px" : "56px 40px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* PDF download */}
          <div style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 16 : 32,
            marginBottom: 40,
            padding: "24px 28px",
            border: "1px solid rgba(245,240,232,0.1)",
            borderRadius: 4,
          }}>
            <div style={{ flex: 1 }}>
              <span style={{
                ...smallLabelStyle,
                marginBottom: 8,
                display: "block",
              }}>CONCEPT DECK</span>
              <h2 style={{
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: isMobile ? 20 : 24,
                margin: "0 0 8px",
              }}>
                The Harvest Concept
              </h2>
              <p style={{
                fontFamily: fonts.body,
                fontSize: 14,
                opacity: 0.5,
                margin: 0,
              }}>
                Full presentation with zones, personas, phasing, and vision.
              </p>
            </div>
            <a
              href="/TheHarvestConcept.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.1em",
                color: colors.milk,
                border: `1px solid ${colors.milk}`,
                padding: "10px 24px",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              DOWNLOAD PDF
            </a>
          </div>

          {/* Zone diagram */}
          <div>
            <span style={{
              ...smallLabelStyle,
              marginBottom: 16,
              display: "block",
            }}>ZONE MAP</span>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 32,
              alignItems: "start",
            }}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => openLightbox(
                  [{ src: "/images/compendium/canvas-drawing-full.jpg", label: "Site plan with zone locations" }],
                  0,
                )}
              >
                <img
                  src="/images/compendium/canvas-drawing-full.jpg"
                  alt="Site plan with zone locations"
                  style={{
                    width: "100%",
                    borderRadius: 2,
                    border: "1px solid rgba(245,240,232,0.1)",
                    display: "block",
                  }}
                />
                <p style={{
                  fontFamily: fonts.body,
                  fontSize: 12,
                  opacity: 0.3,
                  margin: "8px 0 0",
                }}>
                  Click to expand
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {zoneOrder.map((id, i) => {
                  const zone = zoneData[id];
                  if (!zone) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: "none",
                        border: "1px solid rgba(245,240,232,0.08)",
                        borderRadius: 2,
                        padding: "10px 16px",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = zone.color)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(245,240,232,0.08)")}
                    >
                      <span style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: zone.color,
                        color: colors.shed,
                        fontFamily: fonts.display,
                        fontWeight: 900,
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {i + 1}
                      </span>
                      <div>
                        <span style={{
                          fontFamily: fonts.display,
                          fontWeight: 700,
                          fontSize: 14,
                          color: colors.milk,
                          display: "block",
                        }}>
                          {zone.label}
                        </span>
                        <span style={{
                          fontFamily: fonts.body,
                          fontSize: 12,
                          color: colors.milk,
                          opacity: 0.4,
                        }}>
                          {zone.tagline?.replace(/—/g, ",")}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky zone nav */}
      <nav
        ref={navRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: colors.shed,
          borderBottom: "1px solid rgba(245,240,232,0.08)",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{
          display: "flex",
          gap: 0,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 4px",
          whiteSpace: "nowrap",
        }}>
          {zoneOrder.map((id) => {
            const zone = zoneData[id];
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  color: colors.milk,
                  opacity: activeZone === id ? 1 : 0.3,
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: activeZone === id ? `2px solid ${zone.color}` : "2px solid transparent",
                  padding: isMobile ? "12px 8px" : "14px 14px",
                  cursor: "pointer",
                  transition: "opacity 0.15s, border-color 0.15s",
                  flexShrink: 0,
                }}
              >
                {zone.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Zone sections */}
      {zoneOrder.map((id) => {
        const zone = zoneData[id];
        return (
          <ZoneSection
            key={id}
            zone={zone}
            isMobile={isMobile}
            onImageClick={openLightbox}
          />
        );
      })}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              backgroundColor: "rgba(0,0,0,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {/* Top bar: counter + label + close hint */}
            <div style={{
              position: "absolute",
              top: 16,
              left: 24,
              right: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 1,
            }}>
              <span style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.08em",
                color: colors.milk,
                opacity: 0.7,
              }}>
                {lightbox.images.length > 1
                  ? `${lightbox.index + 1} / ${lightbox.images.length}`
                  : ""}
              </span>
              <span style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.1em",
                color: colors.milk,
                opacity: 0.5,
              }}>
                ESC / CLICK TO CLOSE
              </span>
            </div>

            {/* Label */}
            {lightbox.images[lightbox.index]?.label && (
              <div style={{
                position: "absolute",
                bottom: 20,
                left: 24,
                right: 24,
                textAlign: "center",
                zIndex: 1,
              }}>
                <span style={{
                  fontFamily: fonts.body,
                  fontSize: 14,
                  color: colors.milk,
                  opacity: 0.6,
                }}>
                  {lightbox.images[lightbox.index].label}
                </span>
              </div>
            )}

            {/* Prev button */}
            {lightbox.index > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox({ ...lightbox, index: lightbox.index - 1 });
                }}
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: colors.milk,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 20,
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Previous image"
              >
                &larr;
              </button>
            )}

            {/* Next button */}
            {lightbox.index < lightbox.images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox({ ...lightbox, index: lightbox.index + 1 });
                }}
                style={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: colors.milk,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 20,
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Next image"
              >
                &rarr;
              </button>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={lightbox.images[lightbox.index]?.src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                src={lightbox.images[lightbox.index]?.src}
                alt={lightbox.images[lightbox.index]?.label || ""}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: "92vw",
                  maxHeight: "82vh",
                  objectFit: "contain",
                  cursor: "default",
                }}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────
   ZONE SECTION
   ───────────────────────────────────── */

function ZoneSection({ zone, isMobile, onImageClick }: {
  zone: (typeof zoneData)[string];
  isMobile: boolean;
  onImageClick: (images: { src: string; label: string }[], index: number) => void;
}) {
  const deck = deckContent[zone.id];
  const [sketchPrompt, setSketchPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ideaItems, setIdeaItems] = useState<IdeaBoardItem[]>(() => {
    // Seed with zone photos + concept deck images
    const photoItems: IdeaBoardItem[] = zone.photos.map((p) => ({
      type: "image" as const,
      id: nextId(),
      src: p.src,
      label: p.caption,
      source: "deck" as const,
    }));
    const deckImages: IdeaBoardItem[] = (deck?.images ?? [])
      .filter((d) => !zone.photos.some((p) => p.src === d.src)) // avoid duplicates
      .map((d) => ({
        type: "image" as const,
        id: nextId(),
        src: d.src,
        label: d.caption,
        source: "deck" as const,
      }));
    return [...photoItems, ...deckImages];
  });
  const [showNotePanel, setShowNotePanel] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [boardPositions, setBoardPositions] = useState<Record<string, BoardPos>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSketch = async () => {
    if (!sketchPrompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const fullPrompt = `For a community space zone called "${zone.label}" (${zone.tagline}): ${sketchPrompt.trim()}. Style: architectural sketch, hand-drawn quality, warm earthy tones. Think Bauhaus meets Australian hinterland.`;
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, preset: "story-illustration", save: true }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      // Prefer persistent Supabase URL over ephemeral data URI
      const imgSrc = data.url || data.image;
      setIdeaItems((prev) => [{
        type: "image",
        id: nextId(),
        src: imgSrc,
        label: `AI: ${sketchPrompt.trim()}`,
        source: "ai",
      }, ...prev]);
      setSketchPrompt("");
    } catch {
      setError("Failed to generate. Check that GOOGLE_AI_API_KEY is set.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = () => {
        setIdeaItems((prev) => [{
          type: "image",
          id: nextId(),
          src: reader.result as string,
          label: file.name,
          source: "upload",
        }, ...prev]);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const addNote = (text: string) => {
    setIdeaItems((prev) => [{
      type: "note",
      id: nextId(),
      text,
      createdAt: Date.now(),
    }, ...prev]);
    setShowNotePanel(false);
  };

  const addVoice = (blobUrl: string, duration: number) => {
    const now = new Date();
    setIdeaItems((prev) => [{
      type: "voice",
      id: nextId(),
      blobUrl,
      duration,
      label: `${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} (${duration}s)`,
      createdAt: Date.now(),
    }, ...prev]);
  };

  const deleteItem = (id: string) => {
    setIdeaItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <section
      id={`zone-${zone.id}`}
      style={{
        borderTop: `4px solid ${zone.color}`,
        padding: isMobile ? "48px 24px 64px" : "64px 40px 80px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Zone header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 14,
              height: 14,
              backgroundColor: zone.color,
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.15em",
              opacity: 0.4,
            }}>
              {zone.element} / {zone.verbs}
            </span>
          </div>
          <h2 style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: isMobile ? 28 : 36,
            letterSpacing: "0.08em",
            margin: "0 0 12px",
          }}>
            {zone.label}
          </h2>
          <p style={{
            fontFamily: fonts.body,
            fontSize: isMobile ? 16 : 18,
            lineHeight: 1.7,
            opacity: 0.7,
            margin: "0 0 20px",
            maxWidth: 600,
          }}>
            {zone.tagline}
          </p>
          <p style={{
            fontFamily: fonts.body,
            fontSize: isMobile ? 14 : 15,
            lineHeight: 1.8,
            opacity: 0.55,
            margin: 0,
            maxWidth: 600,
          }}>
            {zone.why}
          </p>
        </div>

        {/* From the Concept Deck */}
        {deck && (
          <div style={{
            marginBottom: 40,
            padding: isMobile ? 20 : 28,
            border: `1px solid ${zone.color}22`,
            backgroundColor: `${zone.color}08`,
            borderRadius: 2,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <h3 style={{
                ...subheadingStyle,
                color: zone.color,
                marginBottom: 0,
              }}>FROM THE CONCEPT DECK</h3>
              <span style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: "0.08em",
                color: deck.phase === 1 ? "#D4A843" : "#6BA3D6",
                border: `1px solid ${deck.phase === 1 ? "#D4A84344" : "#6BA3D644"}`,
                padding: "2px 8px",
                whiteSpace: "nowrap",
              }}>
                PHASE {deck.phase}
              </span>
            </div>
            <ul style={{
              ...listStyle,
              marginBottom: deck.images.length > 0 ? 20 : 0,
            }}>
              {deck.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            {deck.images.length > 0 && (
              <ConceptDeckCarousel
                images={deck.images}
                zoneColor={zone.color}
                onImageClick={onImageClick}
              />
            )}
          </div>
        )}

        {/* Two columns: details + ideas */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 32 : 48,
          marginBottom: 48,
        }}>
          <div>
            <h3 style={subheadingStyle}>WHAT'S PLANNED</h3>
            <ul style={listStyle}>
              {zone.details.map((d, i) => (
                <li key={i}>{d.replace(/—/g, ",")}</li>
              ))}
            </ul>
            {zone.who.length > 0 && (
              <>
                <h3 style={{ ...subheadingStyle, marginTop: 24 }}>WHO</h3>
                {zone.who.map((w, i) => (
                  <p key={i} style={{
                    fontFamily: fonts.body,
                    fontSize: 14,
                    lineHeight: 1.6,
                    opacity: 0.6,
                    margin: i === 0 ? 0 : "4px 0 0",
                  }}>
                    <strong>{w.name}</strong> {w.role.replace(/—/g, ",")}
                  </p>
                ))}
              </>
            )}
          </div>

          <div>
            <h3 style={subheadingStyle}>IDEAS</h3>
            <ul style={listStyle}>
              {zone.ideas.map((idea, i) => (
                <li key={i}>{idea.replace(/—/g, ",")}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sketch generator */}
        <div style={{
          backgroundColor: "rgba(26,26,26,0.04)",
          padding: isMobile ? 20 : 28,
          marginBottom: 32,
        }}>
          <h3 style={subheadingStyle}>SKETCH WITH GEMINI</h3>
          <p style={{
            fontFamily: fonts.body,
            fontSize: 13,
            opacity: 0.5,
            margin: "0 0 16px",
          }}>
            Describe what you're imagining for this zone. Gemini will sketch it in the Harvest style.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <textarea
              value={sketchPrompt}
              onChange={(e) => setSketchPrompt(e.target.value)}
              placeholder={`e.g. "The ${zone.label.toLowerCase()} from above, showing how people move through the space"`}
              rows={2}
              style={{
                fontFamily: fonts.body,
                fontSize: 14,
                color: colors.shed,
                backgroundColor: "white",
                border: "1px solid rgba(26,26,26,0.15)",
                borderRadius: 0,
                padding: "12px 14px",
                width: "100%",
                boxSizing: "border-box" as const,
                outline: "none",
                resize: "vertical" as const,
              }}
            />
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={generateSketch}
                disabled={loading || !sketchPrompt.trim()}
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  color: colors.milk,
                  backgroundColor: loading ? "rgba(26,26,26,0.4)" : colors.shed,
                  border: "none",
                  padding: "10px 24px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "SKETCHING..." : "SKETCH IT"}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  color: colors.shed,
                  backgroundColor: "transparent",
                  border: `1px solid rgba(26,26,26,0.2)`,
                  padding: "10px 24px",
                  cursor: "pointer",
                }}
              >
                UPLOAD SKETCH
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                style={{ display: "none" }}
              />
            </div>
          </div>
          {error && (
            <p style={{ fontFamily: fonts.body, fontSize: 13, color: colors.crane, marginTop: 12 }}>
              {error}
            </p>
          )}
        </div>

        {/* Idea Board */}
        <div>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            flexWrap: "wrap",
            gap: 8,
          }}>
            <h3 style={{ ...subheadingStyle, marginBottom: 0 }}>
              IDEA BOARD{ideaItems.length > 0 ? ` (${ideaItems.length})` : ""}
            </h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { setShowNotePanel(!showNotePanel); setShowVoiceRecorder(false); }}
                style={actionBtnStyle(zone.color, showNotePanel)}
              >
                + NOTE
              </button>
              <button
                onClick={() => { setShowVoiceRecorder(!showVoiceRecorder); setShowNotePanel(false); }}
                style={actionBtnStyle(zone.color, showVoiceRecorder)}
              >
                VOICE
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={actionBtnStyle(zone.color, false)}
              >
                UPLOAD
              </button>
              {ideaItems.length > 0 && (
                <button
                  onClick={() => {
                    setBoardPositions((prev) => autoLayoutPositions(ideaItems, prev));
                    setFullscreen(true);
                  }}
                  style={{
                    ...actionBtnStyle(zone.color, false),
                    borderColor: zone.color,
                    color: zone.color,
                  }}
                >
                  EXPAND
                </button>
              )}
            </div>
          </div>

          {/* Note panel */}
          {showNotePanel && (
            <div style={{
              marginBottom: 16,
              padding: 16,
              border: `1px dashed ${zone.color}44`,
              backgroundColor: `${zone.color}08`,
              borderRadius: 2,
            }}>
              <NoteInput zoneColor={zone.color} onAdd={addNote} onCancel={() => setShowNotePanel(false)} />
            </div>
          )}

          {/* Voice recorder */}
          {showVoiceRecorder && (
            <VoiceRecorder
              zoneColor={zone.color}
              onSave={addVoice}
              onClose={() => setShowVoiceRecorder(false)}
            />
          )}

          {ideaItems.length === 0 ? (
            <div style={{
              padding: "48px 24px",
              textAlign: "center",
              border: "1px dashed rgba(26,26,26,0.12)",
              borderRadius: 2,
            }}>
              <p style={{
                fontFamily: fonts.body,
                fontSize: 14,
                opacity: 0.35,
                margin: 0,
              }}>
                No ideas yet. Sketch something, upload images, add notes, or record voice memos.
              </p>
            </div>
          ) : (
            <IdeaBoard
              items={ideaItems}
              zoneColor={zone.color}
              isMobile={isMobile}
              onDelete={deleteItem}
              onImageClick={onImageClick}
            />
          )}
        </div>
      </div>

      {/* Fullscreen Miro-like board */}
      <AnimatePresence>
        {fullscreen && (
          <FullscreenBoard
            items={ideaItems}
            zoneColor={zone.color}
            zoneName={zone.label}
            onDelete={deleteItem}
            onClose={() => setFullscreen(false)}
            onUpdatePositions={setBoardPositions}
            positions={boardPositions}
            onImageClick={onImageClick}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─────────────────────────────────────
   NOTE INPUT
   ───────────────────────────────────── */

function NoteInput({ zoneColor: _zoneColor, onAdd, onCancel }: {
  zoneColor: string;
  onAdd: (text: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState("");

  return (
    <>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add an idea, note, or observation..."
        rows={3}
        autoFocus
        style={{
          fontFamily: fonts.body,
          fontSize: 14,
          color: colors.shed,
          backgroundColor: "white",
          border: "1px solid rgba(26,26,26,0.15)",
          borderRadius: 0,
          padding: "10px 12px",
          width: "100%",
          boxSizing: "border-box" as const,
          outline: "none",
          resize: "vertical" as const,
          marginBottom: 10,
        }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => { if (text.trim()) { onAdd(text.trim()); } }}
          disabled={!text.trim()}
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.1em",
            color: colors.milk,
            backgroundColor: text.trim() ? colors.shed : "rgba(26,26,26,0.3)",
            border: "none",
            padding: "8px 20px",
            cursor: text.trim() ? "pointer" : "not-allowed",
          }}
        >
          ADD TO BOARD
        </button>
        <button
          onClick={onCancel}
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.1em",
            color: colors.shed,
            backgroundColor: "transparent",
            border: "1px solid rgba(26,26,26,0.15)",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          CANCEL
        </button>
      </div>
    </>
  );
}

/* ─────────────────────────────────────
   STYLES
   ───────────────────────────────────── */

const smallLabelStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: 10,
  letterSpacing: "0.2em",
  color: colors.milk,
  opacity: 0.5,
  display: "block",
};

const subheadingStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 12,
  letterSpacing: "0.12em",
  margin: "0 0 12px",
  opacity: 0.5,
};

const listStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 14,
  lineHeight: 1.8,
  opacity: 0.65,
  margin: 0,
  paddingLeft: 18,
};

function actionBtnStyle(zoneColor: string, active: boolean): CSSProperties {
  return {
    fontFamily: fonts.display,
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: "0.1em",
    color: active ? colors.milk : colors.shed,
    backgroundColor: active ? zoneColor : "transparent",
    border: `1px solid ${active ? zoneColor : "rgba(26,26,26,0.15)"}`,
    padding: "6px 14px",
    cursor: "pointer",
    transition: "all 0.15s",
    borderRadius: 0,
  };
}
