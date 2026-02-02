import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  MapPin, Plus, Minus, RotateCcw, Layers, X, Eye, EyeOff,
  ChevronRight, ChevronLeft, Camera, Trash2, Play, Pause, Search,
  Filter,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// --- Data types ---

export interface Layer {
  id: string;
  label: string;
  imageSrc: string;
  opacity?: number;
  visible?: boolean;
}

export interface LayerGroupTransform {
  offsetX?: number;  // % shift left(-)/right(+), default 0
  offsetY?: number;  // % shift up(-)/down(+), default 0
  scale?: number;    // relative to master, default 1
}

export interface LayerGroup {
  id: string;
  label: string;
  layers: Layer[];
  transform?: LayerGroupTransform;
}

export interface InfoPoint {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  icon?: string;
  color?: string;
  gallery?: { src: string; caption?: string }[];
  tags?: string[];
}

interface SitePlanCanvasProps {
  groups: LayerGroup[];
  infoPoints: InfoPoint[];
  title?: string;
  defaultGroupId?: string;
}

// --- Helpers ---

function resolveColor(color?: string): string {
  switch (color) {
    case "red": return "#ef4444";
    case "blue": return "#3b82f6";
    case "green": return "#22c55e";
    case "purple": return "#a855f7";
    case "amber":
    default: return "#f59e0b";
  }
}

function getDistancePx(a: InfoPoint, b: InfoPoint, containerW: number, containerH: number): number {
  const dx = ((a.x - b.x) / 100) * containerW;
  const dy = ((a.y - b.y) / 100) * containerH;
  return Math.sqrt(dx * dx + dy * dy);
}

// Simple greedy clustering
function clusterPoints(points: InfoPoint[], radiusPx: number, containerW: number, containerH: number) {
  const used = new Set<string>();
  const clusters: { center: { x: number; y: number }; points: InfoPoint[] }[] = [];
  const singles: InfoPoint[] = [];

  for (const p of points) {
    if (used.has(p.id)) continue;
    const nearby = points.filter(
      (q) => !used.has(q.id) && q.id !== p.id && getDistancePx(p, q, containerW, containerH) < radiusPx
    );
    if (nearby.length > 0) {
      const group = [p, ...nearby];
      group.forEach((g) => used.add(g.id));
      const cx = group.reduce((s, g) => s + g.x, 0) / group.length;
      const cy = group.reduce((s, g) => s + g.y, 0) / group.length;
      clusters.push({ center: { x: cx, y: cy }, points: group });
    } else {
      used.add(p.id);
      singles.push(p);
    }
  }
  return { clusters, singles };
}

// --- Component ---

export default function SitePlanCanvas({
  groups,
  infoPoints,
  title = "Site Plan",
  defaultGroupId,
}: SitePlanCanvasProps) {
  // Active group tab
  const [activeGroupId, setActiveGroupId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("group") || defaultGroupId || groups[0]?.id || "";
  });

  const activeGroup = useMemo(
    () => groups.find((g) => g.id === activeGroupId) || groups[0],
    [groups, activeGroupId]
  );

  const activeTransform = useMemo(() => activeGroup?.transform, [activeGroup]);

  // Layer state — init from ALL groups' layers (preserves toggles across tab switches)
  const [layerState, setLayerState] = useState<
    Record<string, { visible: boolean; opacity: number }>
  >(() => {
    const state: Record<string, { visible: boolean; opacity: number }> = {};
    for (const group of groups) {
      for (const layer of group.layers) {
        state[layer.id] = {
          visible: layer.visible !== false,
          opacity: layer.opacity ?? 100,
        };
      }
    }
    return state;
  });

  // Zoom & pan — start fitted to viewport
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialFit = useRef(false);
  const baseZoom = useRef(1); // zoom level that = "100%" (fit to screen)
  const [imageDims, setImageDims] = useState<{ w: number; h: number } | null>(null);

  // Fit image to viewport on first load
  // The Morpholio Trace canvas is square (4096×4096) but the actual content
  // occupies A3 landscape ratio (~1190×842), sitting in the lower ~70% of the canvas.
  // We fit to the content area so the drawing fills the screen.
  const CONTENT_RATIO = 841.89 / 1190.55; // A3 landscape height/width from Morpholio
  useEffect(() => {
    if (hasInitialFit.current) return;
    const firstLayer = activeGroup?.layers[0];
    if (!firstLayer) return;
    const img = new Image();
    img.onload = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const natW = img.naturalWidth;
      const natH = img.naturalHeight;
      setImageDims({ w: natW, h: natH });

      // Estimate content bounds within the square canvas
      const contentW = natW;
      const contentH = natW * CONTENT_RATIO; // actual drawing height
      const fitZoom = Math.min(vw / contentW, vh / contentH);
      // Center on the content area (which sits at the bottom of the canvas)
      const contentTop = natH - contentH;
      const centeredX = (vw - contentW * fitZoom) / 2;
      const centeredY = (vh - contentH * fitZoom) / 2 - contentTop * fitZoom;
      baseZoom.current = fitZoom;
      setZoom(fitZoom);
      setPan({ x: centeredX, y: centeredY });
      hasInitialFit.current = true;
    };
    img.src = firstLayer.imageSrc;
  }, [activeGroup]);

  // Touch zoom
  const lastTouchDist = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);

  // Info point sidebar
  const [selectedPoint, setSelectedPoint] = useState<InfoPoint | null>(null);
  const [lightboxImages, setLightboxImages] = useState<
    { src: string; caption?: string }[] | null
  >(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Layer panel
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [opacityLayerId, setOpacityLayerId] = useState<string | null>(null);

  // Hover tooltip
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  // --- Feature: Tag filter ---
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilterBar, setShowFilterBar] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    infoPoints.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [infoPoints]);

  const filteredPoints = useMemo(() => {
    if (activeFilters.length === 0) return infoPoints;
    return infoPoints.filter((p) =>
      activeFilters.some((f) => p.tags?.includes(f))
    );
  }, [infoPoints, activeFilters]);

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // --- Feature: Stage timeline slider ---
  const stageTags = useMemo(() => {
    return allTags.filter((t) => t.startsWith("stage-")).sort();
  }, [allTags]);
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const stageFilteredPoints = useMemo(() => {
    if (!activeStage) return filteredPoints;
    return filteredPoints.filter((p) => p.tags?.includes(activeStage));
  }, [filteredPoints, activeStage]);

  // --- Feature: Guided tour ---
  const [tourActive, setTourActive] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTour = useCallback(() => {
    setTourActive(true);
    setTourIndex(0);
    setShowLayerPanel(false);
    setShowFilterBar(false);
  }, []);

  const stopTour = useCallback(() => {
    setTourActive(false);
    if (tourTimerRef.current) clearTimeout(tourTimerRef.current);
  }, []);

  const panToPoint = useCallback(
    (point: InfoPoint, opts?: { zoom?: number; select?: boolean }) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const targetZoom = opts?.zoom ?? 1;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const imgX = (point.x / 100) * rect.width;
      const imgY = (point.y / 100) * rect.height;
      setPan({
        x: cx - imgX * targetZoom,
        y: cy - imgY * targetZoom,
      });
      setZoom(targetZoom);
      if (opts?.select !== false) setSelectedPoint(point);
    },
    []
  );

  // Auto-advance tour
  useEffect(() => {
    if (!tourActive) return;
    const pts = stageFilteredPoints.length > 0 ? stageFilteredPoints : filteredPoints;
    if (pts.length === 0) { stopTour(); return; }
    const point = pts[tourIndex % pts.length];
    panToPoint(point, { zoom: 0.8 });

    tourTimerRef.current = setTimeout(() => {
      const nextIdx = tourIndex + 1;
      if (nextIdx >= pts.length) {
        stopTour();
      } else {
        setTourIndex(nextIdx);
      }
    }, 6000);

    return () => { if (tourTimerRef.current) clearTimeout(tourTimerRef.current); };
  }, [tourActive, tourIndex, stageFilteredPoints, filteredPoints, panToPoint, stopTour]);

  // --- Feature: Build-up animation ---
  const [buildActive, setBuildActive] = useState(false);
  const [buildIndex, setBuildIndex] = useState(-1); // -1 = not started, 0..n = which layer is revealing
  const buildTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startBuild = useCallback(() => {
    // Hide all layers first, then reveal one by one
    const newState = { ...layerState };
    for (const layer of activeGroup.layers) {
      newState[layer.id] = { ...newState[layer.id], visible: false };
    }
    setLayerState(newState);
    setBuildActive(true);
    setBuildIndex(0);
    setShowLayerPanel(false);
    setSelectedPoint(null);
  }, [activeGroup, layerState]);

  const stopBuild = useCallback(() => {
    setBuildActive(false);
    setBuildIndex(-1);
    if (buildTimerRef.current) clearTimeout(buildTimerRef.current);
  }, []);

  // Auto-advance build
  useEffect(() => {
    if (!buildActive || buildIndex < 0) return;
    const layers = activeGroup.layers;
    if (buildIndex >= layers.length) {
      stopBuild();
      return;
    }

    // Reveal this layer
    const layer = layers[buildIndex];
    setLayerState((prev) => ({
      ...prev,
      [layer.id]: { ...prev[layer.id], visible: true },
    }));

    buildTimerRef.current = setTimeout(() => {
      setBuildIndex((i) => i + 1);
    }, 1500);

    return () => { if (buildTimerRef.current) clearTimeout(buildTimerRef.current); };
  }, [buildActive, buildIndex, activeGroup, stopBuild]);

  // --- Feature: Deep-link ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const groupParam = params.get("group");
    if (groupParam && groups.some((g) => g.id === groupParam)) {
      setActiveGroupId(groupParam);
    }
    const pointId = params.get("point");
    if (pointId) {
      const point = infoPoints.find((p) => p.id === pointId);
      if (point) {
        setTimeout(() => panToPoint(point, { zoom: 0.8 }), 300);
      }
    }
  }, [infoPoints, groups, panToPoint]);

  // --- Feature: Before/After comparison slider ---
  const [compareLayerId, setCompareLayerId] = useState<string | null>(null);
  const [comparePosition, setComparePosition] = useState(50);
  const compareRef = useRef<HTMLDivElement>(null);
  const isDraggingCompare = useRef(false);

  const handleCompareMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    isDraggingCompare.current = true;
  }, []);

  useEffect(() => {
    if (!compareLayerId) return;
    const handleMove = (e: MouseEvent) => {
      if (!isDraggingCompare.current || !compareRef.current) return;
      const rect = compareRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      setComparePosition(x);
    };
    const handleUp = () => { isDraggingCompare.current = false; };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [compareLayerId]);

  // Annotations
  const [noteText, setNoteText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const annotationsQuery = trpc.sitePlan.annotations.useQuery(
    { pointId: selectedPoint?.id ?? "" },
    {
      enabled: !!selectedPoint,
      refetchInterval: 5000, // Real-time-ish: poll every 5s for collaborative updates
    }
  );
  const addNoteMutation = trpc.sitePlan.addNote.useMutation({
    onSuccess: () => {
      setNoteText("");
      annotationsQuery.refetch();
    },
  });
  const uploadPhotoMutation = trpc.sitePlan.uploadPhoto.useMutation({
    onSuccess: () => {
      annotationsQuery.refetch();
    },
  });
  const deleteMutation = trpc.sitePlan.delete.useMutation({
    onSuccess: () => {
      annotationsQuery.refetch();
    },
  });

  const handleAddNote = () => {
    if (!selectedPoint || !noteText.trim()) return;
    addNoteMutation.mutate({ pointId: selectedPoint.id, content: noteText.trim() });
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPoint) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadPhotoMutation.mutate({
        pointId: selectedPoint.id,
        fileName: file.name,
        base64Data: base64,
        contentType: file.type,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Lock body scroll when mounted
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // --- Feature: Keyboard navigation ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxImages) { setLightboxImages(null); return; }
        if (tourActive) { stopTour(); return; }
        if (selectedPoint) { setSelectedPoint(null); return; }
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const pts = filteredPoints;
        if (pts.length === 0) return;
        const currentIdx = selectedPoint ? pts.findIndex((p) => p.id === selectedPoint.id) : -1;
        const next = pts[(currentIdx + 1) % pts.length];
        setSelectedPoint(next);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const pts = filteredPoints;
        if (pts.length === 0) return;
        const currentIdx = selectedPoint ? pts.findIndex((p) => p.id === selectedPoint.id) : 0;
        const prev = pts[(currentIdx - 1 + pts.length) % pts.length];
        setSelectedPoint(prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPoint, filteredPoints, lightboxImages, tourActive, stopTour]);

  // --- Zoom helpers ---

  const clampZoom = (z: number) => Math.min(3, Math.max(0.25, z));

  const zoomTo = useCallback(
    (newZoom: number, centerX?: number, centerY?: number) => {
      const clamped = clampZoom(newZoom);
      if (centerX !== undefined && centerY !== undefined) {
        const scale = clamped / zoom;
        setPan({
          x: centerX - scale * (centerX - pan.x),
          y: centerY - scale * (centerY - pan.y),
        });
      }
      setZoom(clamped);
    },
    [zoom, pan]
  );

  const resetView = useCallback(() => {
    const bz = baseZoom.current;
    const firstLayer = activeGroup?.layers[0];
    if (!firstLayer || bz === 1) { setZoom(1); setPan({ x: 0, y: 0 }); return; }
    const img = new Image();
    img.onload = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const contentW = img.naturalWidth;
      const contentH = img.naturalWidth * CONTENT_RATIO;
      const contentTop = img.naturalHeight - contentH;
      const centeredX = (vw - contentW * bz) / 2;
      const centeredY = (vh - contentH * bz) / 2 - contentTop * bz;
      setZoom(bz);
      setPan({ x: centeredX, y: centeredY });
    };
    img.src = firstLayer.imageSrc;
  }, [activeGroup]);

  // --- Mouse wheel zoom ---

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = clampZoom(zoom + delta);
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const scale = newZoom / zoom;
      setPan({
        x: cx - scale * (cx - pan.x),
        y: cy - scale * (cy - pan.y),
      });
      setZoom(newZoom);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [zoom, pan]);

  // --- Mouse drag pan ---

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    },
    [pan]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPan({
        x: dragStart.current.panX + dx,
        y: dragStart.current.panY + dy,
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // --- Touch handling ---

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
        dragStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          panX: pan.x,
          panY: pan.y,
        };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist.current = Math.sqrt(dx * dx + dy * dy);
        lastTouchCenter.current = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
      }
    },
    [pan]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const dx = e.touches[0].clientX - dragStart.current.x;
        const dy = e.touches[0].clientY - dragStart.current.y;
        setPan({
          x: dragStart.current.panX + dx,
          y: dragStart.current.panY + dy,
        });
      } else if (
        e.touches.length === 2 &&
        lastTouchDist.current !== null &&
        lastTouchCenter.current !== null
      ) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const scale = dist / lastTouchDist.current;
        const newZoom = clampZoom(zoom * scale);

        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const cx = lastTouchCenter.current.x - rect.left;
          const cy = lastTouchCenter.current.y - rect.top;
          const s = newZoom / zoom;
          setPan({
            x: cx - s * (cx - pan.x),
            y: cy - s * (cy - pan.y),
          });
        }

        setZoom(newZoom);
        lastTouchDist.current = dist;
      }
    },
    [isDragging, zoom, pan]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    lastTouchDist.current = null;
    lastTouchCenter.current = null;
  }, []);

  // --- Double click zoom ---

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const newZoom = zoom < 0.6 ? 1 : 0.35;
      zoomTo(newZoom, cx, cy);
    },
    [zoom, zoomTo]
  );

  // --- Layer helpers ---

  const toggleLayerVisibility = (id: string) => {
    setLayerState((prev) => ({
      ...prev,
      [id]: { ...prev[id], visible: !prev[id].visible },
    }));
  };

  const setLayerOpacity = (id: string, opacity: number) => {
    setLayerState((prev) => ({
      ...prev,
      [id]: { ...prev[id], opacity },
    }));
  };

  // --- Pin click (prevent pan from triggering) ---

  const dragDistance = useRef(0);

  useEffect(() => {
    if (!isDragging) return;
    const track = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      dragDistance.current = Math.sqrt(dx * dx + dy * dy);
    };
    window.addEventListener("mousemove", track);
    return () => window.removeEventListener("mousemove", track);
  }, [isDragging]);

  const handlePinClick = useCallback(
    (point: InfoPoint, e: React.MouseEvent) => {
      e.stopPropagation();
      if (dragDistance.current < 5) {
        setSelectedPoint(point);
        // Update URL without navigation
        const url = new URL(window.location.href);
        url.searchParams.set("group", activeGroupId);
        url.searchParams.set("point", point.id);
        window.history.replaceState({}, "", url.toString());
      }
    },
    [activeGroupId]
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      dragDistance.current = 0;
      handleMouseDown(e);
    },
    [handleMouseDown]
  );

  // --- Feature: Point clustering ---
  const displayPoints = useMemo(() => {
    const pts = stageFilteredPoints;
    // Only cluster when zoomed out
    if (zoom >= 1) return { clusters: [], singles: pts };
    const containerW = containerRef.current?.clientWidth || 1000;
    const containerH = containerRef.current?.clientHeight || 800;
    const radius = 60 / zoom; // cluster radius grows as you zoom out
    return clusterPoints(pts, radius, containerW, containerH);
  }, [stageFilteredPoints, zoom]);

  // --- Feature: Sidebar animation key ---
  const [sidebarKey, setSidebarKey] = useState(0);
  useEffect(() => {
    if (selectedPoint) setSidebarKey((k) => k + 1);
  }, [selectedPoint?.id]);

  // Close sidebar clears deep-link
  const closeSidebar = useCallback(() => {
    setSelectedPoint(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("point");
    window.history.replaceState({}, "", url.toString());
  }, []);

  // Switch group tab
  const switchGroup = useCallback((groupId: string) => {
    setActiveGroupId(groupId);
    setCompareLayerId(null);
    const url = new URL(window.location.href);
    url.searchParams.set("group", groupId);
    window.history.replaceState({}, "", url.toString());
  }, []);

  // --- Render ---

  return (
    <div className="fixed inset-0 bg-stone-900 overflow-hidden select-none z-[100]">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-8 w-8"
            onClick={() => window.history.back()}
          >
            <X className="h-4 w-4" />
          </Button>
          <h1 className="text-white font-serif text-lg font-semibold drop-shadow-md">
            {title}
          </h1>
        </div>
        <div className="pointer-events-auto flex items-center gap-1">
          {/* Tour button */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-white hover:bg-white/20 gap-2",
              tourActive && "bg-amber-500/30"
            )}
            onClick={tourActive ? stopTour : startTour}
          >
            {tourActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="hidden sm:inline">{tourActive ? "Stop Tour" : "Tour"}</span>
          </Button>
          {/* Build-up animation */}
          {activeGroup.layers.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-white hover:bg-white/20 gap-2",
                buildActive && "bg-amber-500/30"
              )}
              onClick={buildActive ? stopBuild : startBuild}
            >
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">{buildActive ? "Stop" : "Build"}</span>
            </Button>
          )}
          {/* Filter toggle */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-white hover:bg-white/20 gap-2",
              showFilterBar && "bg-white/20"
            )}
            onClick={() => setShowFilterBar(!showFilterBar)}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
            {activeFilters.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </Button>
          {/* Layers */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 gap-2"
            onClick={() => setShowLayerPanel(!showLayerPanel)}
          >
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Layers</span>
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      {showFilterBar && (
        <div className="absolute top-14 left-0 right-0 z-20 px-4 py-2 bg-black/50 backdrop-blur-sm pointer-events-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Search className="h-3.5 w-3.5 text-white/60 shrink-0" />
            {allTags.map((tag) => (
              <button
                key={tag}
                className={cn(
                  "px-3 py-1 text-xs rounded-full whitespace-nowrap transition-all",
                  activeFilters.includes(tag)
                    ? "bg-amber-500 text-white"
                    : "bg-white/15 text-white/80 hover:bg-white/25"
                )}
                onClick={() => toggleFilter(tag)}
              >
                {tag}
              </button>
            ))}
            {activeFilters.length > 0 && (
              <button
                className="px-3 py-1 text-xs rounded-full bg-red-500/50 text-white hover:bg-red-500/70 whitespace-nowrap"
                onClick={() => setActiveFilters([])}
              >
                Clear all
              </button>
            )}
          </div>
          {/* Stage timeline slider */}
          {stageTags.length > 1 && (
            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/10">
              <span className="text-[10px] text-white/50 uppercase tracking-wider shrink-0">Stage</span>
              <div className="flex items-center gap-1">
                <button
                  className={cn(
                    "px-2 py-0.5 text-[11px] rounded transition-all",
                    !activeStage ? "bg-amber-500 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
                  )}
                  onClick={() => setActiveStage(null)}
                >
                  All
                </button>
                {stageTags.map((stage) => (
                  <button
                    key={stage}
                    className={cn(
                      "px-2 py-0.5 text-[11px] rounded transition-all",
                      activeStage === stage ? "bg-amber-500 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
                    )}
                    onClick={() => setActiveStage(activeStage === stage ? null : stage)}
                  >
                    {stage.replace("stage-", "Stage ")}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Layer toggle panel */}
      {showLayerPanel && (
        <div className="absolute top-14 right-4 z-20 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-stone-200 p-3 w-64 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Layers
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowLayerPanel(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1">
            {activeGroup.layers.map((layer) => {
              const state = layerState[layer.id];
              return (
                <div key={layer.id}>
                  <div className="flex items-center gap-2">
                    <Toggle
                      pressed={state?.visible}
                      onPressedChange={() => toggleLayerVisibility(layer.id)}
                      size="sm"
                      className="h-8 px-3 text-xs flex-1 justify-start gap-2 data-[state=on]:bg-amber-100 data-[state=on]:text-amber-800"
                    >
                      {state?.visible ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                      {layer.label}
                    </Toggle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() =>
                        setOpacityLayerId(
                          opacityLayerId === layer.id ? null : layer.id
                        )
                      }
                    >
                      <span className="text-[10px] text-stone-400">
                        {state?.opacity ?? 100}%
                      </span>
                    </Button>
                  </div>
                  {opacityLayerId === layer.id && (
                    <div className="px-2 py-1">
                      <Slider
                        value={[state?.opacity ?? 100]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={([v]) => setLayerOpacity(layer.id, v)}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Before/After comparison */}
          {activeGroup.layers.length > 1 && (
            <div className="mt-3 pt-3 border-t border-stone-200">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                Compare
              </span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                <button
                  className={cn(
                    "px-2 py-0.5 text-[11px] rounded transition-all",
                    !compareLayerId ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                  )}
                  onClick={() => setCompareLayerId(null)}
                >
                  Off
                </button>
                {activeGroup.layers.slice(1).map((layer) => (
                  <button
                    key={layer.id}
                    className={cn(
                      "px-2 py-0.5 text-[11px] rounded transition-all",
                      compareLayerId === layer.id ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                    )}
                    onClick={() => setCompareLayerId(compareLayerId === layer.id ? null : layer.id)}
                  >
                    {layer.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Canvas area */}
      <div
        ref={containerRef}
        className={cn(
          "absolute inset-0 overflow-hidden",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleCanvasMouseDown}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={cn(
            "will-change-transform origin-top-left transition-transform",
            isDragging ? "duration-75" : "duration-500 ease-in-out"
          )}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {/* Layer images */}
          <div
            ref={compareRef}
            className="relative bg-white rounded-lg shadow-2xl"
            style={imageDims ? { width: imageDims.w, height: imageDims.h } : undefined}
          >
            {/* Per-group transform wrapper for layer images */}
            <div
              className="relative w-full h-full"
              style={activeTransform ? {
                transform: `translate(${activeTransform.offsetX ?? 0}%, ${activeTransform.offsetY ?? 0}%) scale(${activeTransform.scale ?? 1})`,
                transformOrigin: "center center",
              } : undefined}
            >
              {activeGroup.layers.map((layer, layerIdx) => {
                const state = layerState[layer.id];
                if (!state?.visible) return null;

                // Before/After compare mode: clip the comparison layer
                const isCompareLayer = compareLayerId === layer.id;
                const clipStyle: React.CSSProperties = isCompareLayer
                  ? { clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }
                  : {};

                return (
                  <img
                    key={layer.id}
                    src={layer.imageSrc}
                    alt={layer.label}
                    className="block max-w-none pointer-events-none transition-opacity duration-700 ease-in-out"
                    style={{
                      position: layerIdx === 0 ? "relative" : "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      opacity: isCompareLayer ? 1 : (state.opacity ?? 100) / 100,
                      ...clipStyle,
                    }}
                    draggable={false}
                  />
                );
              })}
            </div>

            {/* Before/After drag handle */}
            {compareLayerId && (
              <div
                className="absolute top-0 bottom-0 z-20 cursor-col-resize"
                style={{ left: `${comparePosition}%`, transform: "translateX(-50%)" }}
                onMouseDown={handleCompareMouseDown}
              >
                <div className="w-1 h-full bg-white shadow-lg" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <ChevronLeft className="h-3 w-3 text-stone-600" />
                  <ChevronRight className="h-3 w-3 text-stone-600" />
                </div>
              </div>
            )}

            {/* Cluster badges */}
            {displayPoints.clusters.map((cluster, ci) => (
              <div
                key={`cluster-${ci}`}
                className="absolute"
                style={{
                  left: `${cluster.center.x}%`,
                  top: `${cluster.center.y}%`,
                  transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                  transformOrigin: "center",
                  zIndex: 10,
                }}
              >
                <button
                  className="w-10 h-10 rounded-full bg-amber-500 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Zoom into cluster
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (rect) {
                      const cx = rect.width / 2;
                      const cy = rect.height / 2;
                      const imgX = (cluster.center.x / 100) * rect.width;
                      const imgY = (cluster.center.y / 100) * rect.height;
                      setZoom(1.5);
                      setPan({ x: cx - imgX * 1.5, y: cy - imgY * 1.5 });
                    }
                  }}
                >
                  {cluster.points.length}
                </button>
              </div>
            ))}

            {/* Individual info point pins */}
            {displayPoints.singles.map((point) => (
              <div
                key={point.id}
                className="absolute"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: `translate(-50%, -100%) scale(${1 / zoom})`,
                  transformOrigin: "bottom center",
                  zIndex: selectedPoint?.id === point.id ? 15 : 10,
                }}
              >
                <button
                  className={cn(
                    "relative group cursor-pointer transition-transform hover:scale-110",
                    "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 rounded-full",
                    selectedPoint?.id === point.id && "scale-125"
                  )}
                  onClick={(e) => handlePinClick(point, e)}
                  onMouseEnter={() => setHoveredPoint(point.id)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                    style={{ backgroundColor: resolveColor(point.color) }}
                  >
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  {/* Pulse animation */}
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-30"
                    style={{
                      backgroundColor: resolveColor(point.color),
                      animationDuration: "2s",
                    }}
                  />
                </button>
                {/* Tooltip */}
                {hoveredPoint === point.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap pointer-events-none">
                    {point.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Build-up progress indicator */}
      {buildActive && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-black/70 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10">
          <div className="text-white/90 text-sm font-medium text-center mb-2">
            {buildIndex < activeGroup.layers.length
              ? activeGroup.layers[buildIndex]?.label
              : "Complete"}
          </div>
          <div className="flex gap-1.5">
            {activeGroup.layers.map((layer, i) => (
              <div
                key={layer.id}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i <= buildIndex ? "bg-amber-500 w-6" : "bg-white/20 w-3"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Group tab bar (bottom center) */}
      {groups.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-xl px-1.5 py-1.5 border border-white/10">
          {groups.map((group) => (
            <button
              key={group.id}
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap",
                activeGroupId === group.id
                  ? "bg-amber-500 text-white shadow-md"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
              onClick={() => switchGroup(group.id)}
            >
              {group.label}
            </button>
          ))}
        </div>
      )}

      {/* Zoom controls (bottom right) */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-1.5">
        <Button
          size="icon"
          className="h-11 w-11 bg-white hover:bg-stone-100 text-stone-800 shadow-xl border border-stone-300 rounded-xl"
          onClick={() => zoomTo(zoom + 0.25)}
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="h-11 w-11 bg-white hover:bg-stone-100 text-stone-800 shadow-xl border border-stone-300 rounded-xl"
          onClick={() => zoomTo(zoom - 0.25)}
        >
          <Minus className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="h-11 w-11 bg-white hover:bg-stone-100 text-stone-800 shadow-xl border border-stone-300 rounded-xl"
          onClick={resetView}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      {/* Bottom left: zoom level + point count */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2">
        <div className="text-white text-xs font-mono bg-black/60 px-2.5 py-1 rounded-lg">
          {Math.round((zoom / baseZoom.current) * 100)}%
        </div>
        {activeFilters.length > 0 && (
          <div className="text-white text-xs bg-amber-500/80 px-2.5 py-1 rounded-lg">
            {stageFilteredPoints.length}/{infoPoints.length} points
          </div>
        )}
      </div>

      {/* Mini-map (bottom left, above zoom indicator) */}
      <div className="absolute bottom-16 left-6 z-20 w-32 h-24 bg-black/70 rounded-lg border border-white/20 overflow-hidden">
        {/* Show first visible layer as thumbnail */}
        {activeGroup.layers[0] && (
          <img
            src={activeGroup.layers[0].imageSrc}
            alt="mini-map"
            className="w-full h-full object-cover opacity-60"
            draggable={false}
          />
        )}
        {/* Dots for points */}
        {stageFilteredPoints.map((p) => (
          <div
            key={p.id}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: resolveColor(p.color),
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
        {/* Viewport rectangle */}
        <div
          className="absolute border border-amber-400 rounded-sm pointer-events-none"
          style={{
            left: `${Math.max(0, Math.min(100, 50 - (pan.x / (containerRef.current?.clientWidth || 1)) * 50 / zoom))}%`,
            top: `${Math.max(0, Math.min(100, 50 - (pan.y / (containerRef.current?.clientHeight || 1)) * 50 / zoom))}%`,
            width: `${Math.min(100, 100 / zoom)}%`,
            height: `${Math.min(100, 100 / zoom)}%`,
          }}
        />
      </div>

      {/* Tour progress indicator */}
      {tourActive && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-3">
          <span className="text-white text-xs font-medium">
            {tourIndex + 1} / {(stageFilteredPoints.length > 0 ? stageFilteredPoints : filteredPoints).length}
          </span>
          <div className="flex gap-1">
            {(stageFilteredPoints.length > 0 ? stageFilteredPoints : filteredPoints).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === tourIndex ? "bg-amber-400 scale-125" : i < tourIndex ? "bg-amber-400/50" : "bg-white/30"
                )}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20"
            onClick={stopTour}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Info point detail sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 sm:w-96 z-40 bg-white shadow-2xl border-l border-stone-200 transition-transform duration-300 ease-in-out flex flex-col",
          selectedPoint ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedPoint && (
          <div key={sidebarKey} className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-100 animate-in fade-in slide-in-from-right-2 duration-300">
              <h2 className="text-lg font-serif font-semibold text-stone-900 truncate pr-2">
                {selectedPoint.label}
              </h2>
              <div className="flex items-center gap-1 shrink-0">
                {/* Prev/Next navigation */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    const pts = filteredPoints;
                    const idx = pts.findIndex((p) => p.id === selectedPoint.id);
                    const prev = pts[(idx - 1 + pts.length) % pts.length];
                    setSelectedPoint(prev);
                  }}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    const pts = filteredPoints;
                    const idx = pts.findIndex((p) => p.id === selectedPoint.id);
                    const next = pts[(idx + 1) % pts.length];
                    setSelectedPoint(next);
                  }}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={closeSidebar}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Description */}
              <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75">
                {selectedPoint.description}
              </p>

              {/* Gallery */}
              {selectedPoint.gallery && selectedPoint.gallery.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Inspiration
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedPoint.gallery.map((img, i) => (
                      <button
                        key={i}
                        className="aspect-square rounded-lg overflow-hidden bg-stone-100 hover:ring-2 hover:ring-amber-400 transition-all cursor-pointer"
                        onClick={() => {
                          setLightboxImages(selectedPoint.gallery!);
                          setLightboxIndex(i);
                        }}
                      >
                        <img
                          src={img.src}
                          alt={img.caption || `Inspiration ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedPoint.tags && selectedPoint.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200">
                  {selectedPoint.tags.map((tag) => (
                    <button
                      key={tag}
                      className={cn(
                        "px-2 py-0.5 text-xs font-medium rounded-full transition-colors",
                        activeFilters.includes(tag)
                          ? "bg-amber-500 text-white"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      )}
                      onClick={() => toggleFilter(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Notes & Photos */}
              <div className="border-t border-stone-200 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-300">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                  Notes & Photos
                </h3>

                {/* Existing annotations */}
                {annotationsQuery.data && annotationsQuery.data.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {annotationsQuery.data.map((ann, i) => (
                      <div
                        key={ann.id}
                        className="group flex items-start gap-2 p-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors animate-in fade-in slide-in-from-bottom-1 duration-200"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        {ann.type === "photo" ? (
                          <button
                            className="shrink-0 w-12 h-12 rounded overflow-hidden bg-stone-200"
                            onClick={() => {
                              setLightboxImages([{ src: ann.content, caption: ann.caption ?? undefined }]);
                              setLightboxIndex(0);
                            }}
                          >
                            <img
                              src={ann.content}
                              alt={ann.caption || "Photo"}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ) : (
                          <span className="shrink-0 text-stone-400 mt-0.5 text-sm">📝</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-stone-700 break-words">
                            {ann.type === "photo" ? (ann.caption || ann.content.split("/").pop()) : ann.content}
                          </p>
                          {ann.createdAt && (
                            <p className="text-[10px] text-stone-400 mt-0.5">
                              {new Date(ann.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <button
                          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-stone-400 hover:text-red-500"
                          onClick={() => deleteMutation.mutate({ id: ann.id })}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {annotationsQuery.isLoading && (
                  <p className="text-xs text-stone-400 mb-3">Loading...</p>
                )}

                {/* Add note */}
                <textarea
                  className="w-full border border-stone-200 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-400"
                  rows={2}
                  placeholder="Add a note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddNote();
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    disabled={!noteText.trim() || addNoteMutation.isPending}
                    onClick={handleAddNote}
                  >
                    {addNoteMutation.isPending ? "Adding..." : "Add Note"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadPhoto}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs gap-1"
                    disabled={uploadPhotoMutation.isPending}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-3.5 w-3.5" />
                    {uploadPhotoMutation.isPending ? "Uploading..." : "Photo"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar footer: point counter */}
            <div className="px-4 py-2 border-t border-stone-100 text-[10px] text-stone-400 flex justify-between">
              <span>
                {filteredPoints.findIndex((p) => p.id === selectedPoint.id) + 1} of {filteredPoints.length}
              </span>
              <span className="text-stone-300">←→ to navigate · Esc to close</span>
            </div>
          </div>
        )}
      </div>

      {/* Gallery lightbox */}
      <Dialog
        open={!!lightboxImages}
        onOpenChange={(open) => !open && setLightboxImages(null)}
      >
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-black/95 border-none z-50">
          {lightboxImages && (
            <div className="relative w-full aspect-video flex items-center justify-center">
              <Carousel
                className="w-full h-full"
                opts={{ startIndex: lightboxIndex }}
              >
                <CarouselContent>
                  {lightboxImages.map((img, i) => (
                    <CarouselItem
                      key={i}
                      className="flex items-center justify-center h-full"
                    >
                      <div className="relative w-full h-full flex flex-col items-center justify-center p-4 gap-2">
                        <img
                          src={img.src}
                          alt={img.caption || `Photo ${i + 1}`}
                          className="max-h-[70vh] max-w-full object-contain rounded-md"
                        />
                        {img.caption && (
                          <p className="text-white/70 text-sm text-center">
                            {img.caption}
                          </p>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 text-white border-none" />
                <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 text-white border-none" />
              </Carousel>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
