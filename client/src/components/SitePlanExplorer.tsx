import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

/* ─── Real ideas from planning conversations ─── */

interface IdeaNote {
  id: string;
  text: string;
  source: string; // who said it / which conversation
  category: "structure" | "food" | "garden" | "community" | "design" | "experience";
  /** Optional milk crate grid pattern (rows of booleans) */
  crateGrid?: boolean[][];
}

const IDEA_NOTES: IdeaNote[] = [
  {
    id: "scaffold-pavilion",
    text: "Scaffold structure under the pecan trees — not a marquee, not permanent. Timber and steel. Markets, music, cinema nights.",
    source: "Nic, site walkthrough",
    category: "structure",
  },
  {
    id: "shed-cladding",
    text: "Clad the shed with rusted iron, copper lights. About $10K. First thing people see when they arrive.",
    source: "Nic, site walkthrough",
    category: "structure",
  },
  {
    id: "oyster-shells",
    text: "Collect the shells from oyster pop-ups — use them for rammed earth flooring. Every event literally builds the place.",
    source: "Thais, Day 2 planning",
    category: "design",
  },
  {
    id: "wind-chime",
    text: "Big wind chime from the crane — community members weld their own metal objects onto it. Spanners, tractor parts, old tools.",
    source: "Nic, site walkthrough",
    category: "community",
  },
  {
    id: "fifty-chairs",
    text: "Everyone brings one chair. 50 random chairs as art. No matching furniture — that's the point.",
    source: "Nic, site walkthrough",
    category: "community",
  },
  {
    id: "free-soup",
    text: "Free community meal — soup each day. Anyone welcome. A reason to show up even if you can't afford anything.",
    source: "Nic, notes",
    category: "food",
  },
  {
    id: "living-tables",
    text: "Tables with herbs growing from the centre. Pick your own garnish. The table is alive.",
    source: "Thais, Thursday night",
    category: "garden",
  },
  {
    id: "milk-crates",
    text: "Milk crate structures — pavilion walls, seating, garden beds. Cheap, modular, everyone can build with them.",
    source: "Thais, Thursday night",
    category: "structure",
  },
  {
    id: "kids-fairy-garden",
    text: "Kids area with climbing structures and a fairy garden. Little doors in tree trunks. Imagination space.",
    source: "Thais, Thursday night",
    category: "experience",
  },
  {
    id: "earth-cooking",
    text: "Open fire cooking area. Earth cooking, Aboriginal cookout, hangi pit. Different cultures bring different methods.",
    source: "Nic & Thais, Friday morning",
    category: "food",
  },
  {
    id: "gallery-not-museum",
    text: "Nothing is super permanent. Like an art gallery — exhibitions come, people love them, they evolve, new ones take their place.",
    source: "Nic, site walkthrough",
    category: "design",
  },
  {
    id: "lowering-truss",
    text: "Lowering truss system in the main building — pull it down for intimate dinners, raise it up for events and stage mode.",
    source: "Nic, site walkthrough",
    category: "structure",
  },
  {
    id: "pizza-oven-wheels",
    text: "Pizza oven on wheels. Activates as a pizza place one night, a barbecue the next. Mobile, flexible.",
    source: "Thais, Friday morning",
    category: "food",
  },
  {
    id: "seed-tunnel",
    text: "Seed tunnel or cocoon structure near the entrance. Walk through a living archway to arrive.",
    source: "Thais, Thursday night",
    category: "garden",
  },
  {
    id: "hammock-pockets",
    text: "Hammock pockets hanging under the trees. Find a quiet spot and disappear for a while.",
    source: "Thais, Thursday night",
    category: "experience",
  },
  {
    id: "ndis-garden-beds",
    text: "NDIS-accessible raised garden beds. Wheelchair height. Designed by Cath so everyone can get their hands in soil.",
    source: "Cath, via planning",
    category: "garden",
  },
  {
    id: "welcome-portal",
    text: "Entrance portal made from welded tractor parts, spanners, old tools. Spelling out 'Welcome' or 'The Harvest'.",
    source: "Nic, notes",
    category: "design",
  },
  {
    id: "immersive-dining",
    text: "$600/ticket immersive dining experience. Seasonal. 12 seats. The kitchen is a stage and the chef is the performer.",
    source: "Nic, Day 2 planning",
    category: "food",
  },
  {
    id: "community-postbox",
    text: "Community post office with offering slots. Leave something, take something. Seeds, preserves, notes, art.",
    source: "Thais, Thursday night",
    category: "community",
  },
  {
    id: "green-roof",
    text: "Green roof with pumpkins growing over the shed. Edible architecture.",
    source: "Thais, site walkthrough",
    category: "garden",
  },
  {
    id: "alice-wonderland",
    text: "Alice in Wonderland design principle — things are a little bit unexpected. A door that's too small. A chair that's too big.",
    source: "Thais, Thursday night",
    category: "design",
  },
  {
    id: "artist-residence",
    text: "Three artists in residence who work in the spaces. Ask them: what would you need to have a dream maker space?",
    source: "Nic, notes",
    category: "community",
  },
  {
    id: "fruit-icecream",
    text: "Free ice cream made from community fruit trees. Pomegranate, mango, lilly pilly. The garden feeds the dessert.",
    source: "Nic, site walkthrough",
    category: "food",
  },
  {
    id: "round-forms",
    text: "First Nations circular design — round tables, round gathering spaces, round garden beds. No straight lines where you can avoid them.",
    source: "Thais, Day 2 planning",
    category: "design",
  },
  {
    id: "three-materials",
    text: "Three material themes: timber industry, dairy/milk, and food. Every surface tells the story of the region.",
    source: "Thais, Thursday night",
    category: "design",
  },
];

const CATEGORY_COLORS: Record<IdeaNote["category"], { bg: string; border: string; text: string }> = {
  structure: { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-800" },
  food: { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-800" },
  garden: { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-800" },
  community: { bg: "bg-sky-50", border: "border-sky-300", text: "text-sky-800" },
  design: { bg: "bg-violet-50", border: "border-violet-300", text: "text-violet-800" },
  experience: { bg: "bg-rose-50", border: "border-rose-300", text: "text-rose-800" },
};

const CATEGORY_LABELS: Record<IdeaNote["category"], string> = {
  structure: "Structure",
  food: "Food & Drink",
  garden: "Garden",
  community: "Community",
  design: "Design",
  experience: "Experience",
};

const STORAGE_KEY = "harvest-idea-board-positions";
const CUSTOM_NOTES_KEY = "harvest-idea-board-custom";

interface PlacedNote {
  id: string;
  /** Position as percentage of canvas width/height (0-100) */
  x: number;
  y: number;
}

/* ─── Crate Grid Renderer ─── */

const CRATE_ROWS = 6;
const CRATE_COLS = 8;

function CrateGridPreview({ grid, size = 6, onCanvas = false }: { grid: boolean[][]; size?: number; onCanvas?: boolean }) {
  const w = size;
  const h = Math.round(size * 0.75); // crates are wider than tall
  return (
    <div className="inline-grid" style={{ gridTemplateColumns: `repeat(${CRATE_COLS}, ${w}px)`, gap: `${Math.max(1, size / 8)}px` }}>
      {grid.flatMap((row, r) =>
        row.map((on, c) => (
          <div
            key={`${r}-${c}`}
            style={{ width: w, height: h }}
            className={on ? "" : ""}
          >
            {on ? (
              <div
                className="w-full h-full rounded-[1px] relative"
                style={{
                  background: "linear-gradient(145deg, #f472b6, #db2777)",
                  boxShadow: onCanvas
                    ? `inset 1px 1px 0 rgba(255,255,255,0.3), inset -1px -1px 0 rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.3)`
                    : `inset 1px 1px 0 rgba(255,255,255,0.3), inset -1px -1px 0 rgba(0,0,0,0.15)`,
                }}
              >
                {/* Inner crate holes */}
                {size >= 5 && (
                  <div className="absolute inset-[1px] grid grid-cols-2 grid-rows-2 gap-[0.5px]">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="rounded-[0.5px]" style={{ background: "rgba(0,0,0,0.15)" }} />
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )),
      )}
    </div>
  );
}

function emptyGrid(): boolean[][] {
  return Array.from({ length: CRATE_ROWS }, () => Array(CRATE_COLS).fill(false));
}

/* ─── Component ─── */

interface SitePlanExplorerProps {
  className?: string;
}

export default function SitePlanExplorer({ className }: SitePlanExplorerProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(60);
  const [activeCategory, setActiveCategory] = useState<IdeaNote["category"] | "all">("all");
  const [newIdeaText, setNewIdeaText] = useState("");
  const [crateGrid, setCrateGrid] = useState<boolean[][]>(emptyGrid);
  const [crateName, setCrateName] = useState("");
  const [customNotes, setCustomNotes] = useState<IdeaNote[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_NOTES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [placedNotes, setPlacedNotes] = useState<PlacedNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    noteId: string;
    offsetX: number;
    offsetY: number;
    ghost: HTMLDivElement | null;
  } | null>(null);

  // Persist placed notes + custom notes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(placedNotes));
    } catch { /* ignore */ }
  }, [placedNotes]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_NOTES_KEY, JSON.stringify(customNotes));
    } catch { /* ignore */ }
  }, [customNotes]);

  const allNotes = [...IDEA_NOTES, ...customNotes];
  const placedIds = new Set(placedNotes.map((n) => n.id));

  const poolNotes = allNotes.filter(
    (n) => !placedIds.has(n.id) && (activeCategory === "all" || n.category === activeCategory),
  );

  const addCustomIdea = () => {
    const text = newIdeaText.trim();
    if (!text) return;
    const id = "custom-" + Date.now();
    setCustomNotes((prev) => [
      ...prev,
      { id, text, source: "Community idea", category: "community" },
    ]);
    setNewIdeaText("");
  };

  const toggleCrate = (row: number, col: number) => {
    setCrateGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = !next[row][col];
      return next;
    });
  };

  const hasCrates = crateGrid.some((row) => row.some(Boolean));

  const addCrateStructure = () => {
    if (!hasCrates) return;
    const name = crateName.trim() || "Crate Structure";
    const id = "crate-" + Date.now();
    setCustomNotes((prev) => [
      ...prev,
      {
        id,
        text: name,
        source: "Milk crate builder",
        category: "structure",
        crateGrid: crateGrid.map((r) => [...r]),
      },
    ]);
    setCrateGrid(emptyGrid());
    setCrateName("");
  };

  /* ─── Drag handling ─── */

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, noteId: string) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();

      // Create a ghost element for dragging
      const ghost = document.createElement("div");
      ghost.className = target.className + " fixed pointer-events-none z-[9999] shadow-xl opacity-90 rotate-1";
      ghost.style.width = rect.width + "px";
      ghost.innerHTML = target.innerHTML;
      ghost.style.left = e.clientX - (e.clientX - rect.left) + "px";
      ghost.style.top = e.clientY - (e.clientY - rect.top) + "px";
      document.body.appendChild(ghost);

      dragRef.current = {
        noteId,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        ghost,
      };
    },
    [],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current?.ghost) return;
      const { offsetX, offsetY, ghost } = dragRef.current;
      ghost.style.left = e.clientX - offsetX + "px";
      ghost.style.top = e.clientY - offsetY + "px";
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const { noteId, ghost } = dragRef.current;
      if (ghost) {
        document.body.removeChild(ghost);
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        dragRef.current = null;
        return;
      }

      const canvasRect = canvas.getBoundingClientRect();
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;

      // Check if dropped on canvas
      if (x >= 0 && x <= canvasRect.width && y >= 0 && y <= canvasRect.height) {
        const pctX = (x / canvasRect.width) * 100;
        const pctY = (y / canvasRect.height) * 100;

        setPlacedNotes((prev) => {
          const filtered = prev.filter((n) => n.id !== noteId);
          return [...filtered, { id: noteId, x: pctX, y: pctY }];
        });
      } else {
        // Dropped outside canvas — remove from placed if it was there
        setPlacedNotes((prev) => prev.filter((n) => n.id !== noteId));
      }

      dragRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  /* ─── Touch handling ─── */

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, noteId: string) => {
      const touch = e.touches[0];
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();

      const ghost = document.createElement("div");
      ghost.className = target.className + " fixed pointer-events-none z-[9999] shadow-xl opacity-90 rotate-1";
      ghost.style.width = rect.width + "px";
      ghost.innerHTML = target.innerHTML;
      ghost.style.left = touch.clientX - (touch.clientX - rect.left) + "px";
      ghost.style.top = touch.clientY - (touch.clientY - rect.top) + "px";
      document.body.appendChild(ghost);

      dragRef.current = {
        noteId,
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
        ghost,
      };
    },
    [],
  );

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!dragRef.current?.ghost) return;
      e.preventDefault();
      const touch = e.touches[0];
      const { offsetX, offsetY, ghost } = dragRef.current;
      ghost.style.left = touch.clientX - offsetX + "px";
      ghost.style.top = touch.clientY - offsetY + "px";
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!dragRef.current) return;
      const { noteId, ghost } = dragRef.current;
      if (ghost) {
        document.body.removeChild(ghost);
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        dragRef.current = null;
        return;
      }

      const touch = e.changedTouches[0];
      const canvasRect = canvas.getBoundingClientRect();
      const x = touch.clientX - canvasRect.left;
      const y = touch.clientY - canvasRect.top;

      if (x >= 0 && x <= canvasRect.width && y >= 0 && y <= canvasRect.height) {
        const pctX = (x / canvasRect.width) * 100;
        const pctY = (y / canvasRect.height) * 100;

        setPlacedNotes((prev) => {
          const filtered = prev.filter((n) => n.id !== noteId);
          return [...filtered, { id: noteId, x: pctX, y: pctY }];
        });
      } else {
        setPlacedNotes((prev) => prev.filter((n) => n.id !== noteId));
      }

      dragRef.current = null;
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const clearAll = () => {
    setPlacedNotes([]);
    setCustomNotes([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CUSTOM_NOTES_KEY);
  };

  const categories = ["all", ...Object.keys(CATEGORY_LABELS)] as const;

  return (
    <div className={cn("", className)}>
      {/* ─── Controls ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOverlay}
              onChange={(e) => setShowOverlay(e.target.checked)}
              className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-stone-600">Show architect plan</span>
          </label>
          {showOverlay && (
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={10}
                max={100}
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                className="w-24 accent-amber-600 h-1"
              />
              <span className="text-xs text-stone-400 font-mono w-8">{overlayOpacity}%</span>
            </div>
          )}
        </div>
        {placedNotes.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2"
          >
            Clear all notes
          </button>
        )}
      </div>

      {/* ─── Split layout: photo left, notes right ─── */}
      <div className="grid lg:grid-cols-5 gap-5 items-start">
        {/* Canvas (photo + overlay + placed notes) — 3 cols, sticky */}
        <div className="lg:col-span-3 lg:sticky lg:top-24">
          <div
            ref={canvasRef}
            className="relative aspect-square rounded-xl overflow-hidden shadow-lg bg-stone-900 cursor-crosshair select-none"
          >
            {/* Aerial photo */}
            <img
              src="/images/site-plan/cropped/photo.png"
              alt="Aerial view of The Harvest site"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />

            {/* Architect plan overlay */}
            {showOverlay && (
              <img
                src="/images/site-plan/cropped/masterplan.png"
                alt="Master plan overlay"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                style={{ opacity: overlayOpacity / 100 }}
                draggable={false}
              />
            )}

            {/* Placed sticky notes on canvas */}
            {placedNotes.map((placed) => {
              const note = allNotes.find((n) => n.id === placed.id);
              if (!note) return null;
              const colors = CATEGORY_COLORS[note.category];
              const isCrate = !!note.crateGrid;
              return (
                <div
                  key={placed.id}
                  className={cn(
                    "absolute cursor-grab active:cursor-grabbing transition-shadow hover:shadow-lg",
                    isCrate
                      ? "p-1"
                      : cn("w-36 p-2 rounded-md border shadow-md", colors.bg, colors.border),
                  )}
                  style={{
                    left: `${placed.x}%`,
                    top: `${placed.y}%`,
                    transform: `translate(-50%, -50%) rotate(${(placed.id.charCodeAt(0) % 7) - 3}deg)`,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, placed.id)}
                  onTouchStart={(e) => handleTouchStart(e, placed.id)}
                >
                  {note.crateGrid ? (
                    <>
                      <CrateGridPreview grid={note.crateGrid} size={5} onCanvas />
                      <p className="text-[8px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-1 font-medium text-center">{note.text}</p>
                    </>
                  ) : (
                    <>
                      <p className={cn("text-[10px] leading-snug font-medium", colors.text)}>
                        {note.text}
                      </p>
                      <p className="text-[8px] text-stone-400 mt-1 italic">{note.source}</p>
                    </>
                  )}
                </div>
              );
            })}

            {/* Drop hint */}
            {placedNotes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/40 backdrop-blur-sm rounded-xl px-6 py-4 text-center max-w-xs">
                  <p className="text-white/80 text-sm font-medium">Drag ideas onto the photo</p>
                  <p className="text-white/50 text-xs mt-1">Place them where you think they belong</p>
                </div>
              </div>
            )}
          </div>

          {/* Count below canvas */}
          {placedNotes.length > 0 && (
            <p className="text-center text-stone-400 text-xs mt-3">
              {placedNotes.length} idea{placedNotes.length !== 1 ? "s" : ""} placed &middot; drag off photo to remove
            </p>
          )}
        </div>

        {/* Note pool — 2 cols, scrollable alongside the sticky photo */}
        <div className="lg:col-span-2">
          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {categories.map((cat) => {
              const isAll = cat === "all";
              const colors = isAll ? null : CATEGORY_COLORS[cat as IdeaNote["category"]];
              const count = isAll
                ? allNotes.filter((n) => !placedIds.has(n.id)).length
                : allNotes.filter((n) => n.category === cat && !placedIds.has(n.id)).length;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as IdeaNote["category"] | "all")}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border",
                    activeCategory === cat
                      ? isAll
                        ? "bg-stone-800 text-white border-stone-800"
                        : cn(colors!.bg, colors!.border, colors!.text)
                      : "bg-white text-stone-400 border-stone-200 hover:border-stone-300",
                  )}
                >
                  {isAll ? "All" : CATEGORY_LABELS[cat as IdeaNote["category"]]}
                  {count > 0 && (
                    <span className="ml-1 opacity-60">{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            {poolNotes.map((note) => {
              const colors = CATEGORY_COLORS[note.category];
              const isCustom = note.id.startsWith("custom-") || note.id.startsWith("crate-");
              return (
                <div
                  key={note.id}
                  className={cn(
                    "p-3 rounded-lg border-2 border-dashed cursor-grab active:cursor-grabbing select-none transition-all hover:shadow-md hover:border-solid relative group",
                    colors.bg,
                    colors.border,
                  )}
                  onMouseDown={(e) => {
                    if ((e.target as HTMLElement).closest("[data-delete]")) return;
                    handleMouseDown(e, note.id);
                  }}
                  onTouchStart={(e) => {
                    if ((e.target as HTMLElement).closest("[data-delete]")) return;
                    handleTouchStart(e, note.id);
                  }}
                >
                  {isCustom && (
                    <button
                      data-delete
                      onClick={() => {
                        setCustomNotes((prev) => prev.filter((n) => n.id !== note.id));
                        setPlacedNotes((prev) => prev.filter((n) => n.id !== note.id));
                      }}
                      className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-stone-200 text-stone-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  )}
                  {note.crateGrid ? (
                    <div className="flex items-center gap-3">
                      <CrateGridPreview grid={note.crateGrid} size={6} />
                      <div>
                        <p className={cn("text-xs font-bold", colors.text)}>{note.text}</p>
                        <p className="text-[10px] text-stone-400 italic">Milk crate build</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={cn("text-xs leading-snug font-medium", colors.text)}>
                        {note.text}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-1.5 italic">{note.source}</p>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {poolNotes.length === 0 && placedNotes.length > 0 && (
            <p className="text-center text-stone-400 text-sm py-6 italic">
              All ideas placed. Drag them off the photo to return them here.
            </p>
          )}

          {/* ─── Add your own idea ─── */}
          <div className="mt-6 pt-4 border-t border-stone-200">
            <p className="text-xs text-stone-500 font-medium mb-2">Add your own idea</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addCustomIdea();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={newIdeaText}
                onChange={(e) => setNewIdeaText(e.target.value)}
                placeholder="What would you love to see here?"
                className="flex-1 px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!newIdeaText.trim()}
                className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                Add
              </button>
            </form>
          </div>

          {/* ─── Milk Crate Builder ─── */}
          <div className="mt-4 pt-4 border-t border-stone-200">
            <p className="text-xs text-stone-500 font-medium mb-2">Milk Crate Builder</p>
            <p className="text-[10px] text-stone-400 mb-3">Click cells to place crates, name your structure, then add it to the board.</p>
            <div
              className="inline-grid gap-px p-2 bg-stone-100 rounded-lg mb-3"
              style={{ gridTemplateColumns: `repeat(${CRATE_COLS}, 1fr)` }}
            >
              {crateGrid.flatMap((row, r) =>
                row.map((on, c) => (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => toggleCrate(r, c)}
                    className="w-7 h-5 rounded-[1px] transition-all relative overflow-hidden"
                    style={on ? {
                      background: "linear-gradient(145deg, #f472b6, #db2777)",
                      boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.3), inset -1px -1px 0 rgba(0,0,0,0.15)",
                    } : {
                      background: "#f5f5f4",
                      border: "1px solid #d6d3d1",
                    }}
                  >
                    {on && (
                      <div className="absolute inset-[2px] grid grid-cols-2 grid-rows-2 gap-[1px]">
                        {[0,1,2,3].map(i => (
                          <div key={i} className="rounded-[0.5px]" style={{ background: "rgba(0,0,0,0.15)" }} />
                        ))}
                      </div>
                    )}
                  </button>
                )),
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={crateName}
                onChange={(e) => setCrateName(e.target.value)}
                placeholder="Name it (e.g. Garden Pavilion)"
                className="flex-1 px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-400"
              />
              <button
                onClick={addCrateStructure}
                disabled={!hasCrates}
                className="px-4 py-2 rounded-lg bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                Add
              </button>
            </div>
            {hasCrates && (
              <button
                onClick={() => setCrateGrid(emptyGrid())}
                className="text-[10px] text-stone-400 hover:text-stone-600 underline underline-offset-2 mt-2"
              >
                Clear grid
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
