import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type HotspotZone, defaultZones } from "@/components/FloorPlanViewer";

interface Layer {
  id: string;
  label: string;
  imageSrc?: string;
  color?: string;
}

interface SitePlanExplorerProps {
  layers?: Layer[];
  zones?: HotspotZone[];
  className?: string;
}

const defaultLayers: Layer[] = [
  { id: "current", label: "Current State", color: "bg-stone-200" },
  { id: "stage1", label: "Stage 1: Outdoor Activation", color: "bg-amber-100" },
  { id: "stage2", label: "Stage 2: Building Fit-Out", color: "bg-emerald-100" },
  { id: "master", label: "Master Plan", color: "bg-sky-100" },
];

export default function SitePlanExplorer({
  layers = defaultLayers,
  zones = defaultZones,
  className,
}: SitePlanExplorerProps) {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(1);
  const [opacity, setOpacity] = useState(50);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<HotspotZone | null>(null);

  const baseLayer = layers[0];
  const overlayLayer = layers[selectedLayerIndex];
  const activeData = zones.find((z) => z.id === activeZone);

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Base layer */}
      <div className="absolute inset-0">
        {baseLayer.imageSrc ? (
          <img
            src={baseLayer.imageSrc}
            alt={baseLayer.label}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={cn("w-full h-full", baseLayer.color)} />
        )}
      </div>

      {/* Overlay layer */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ opacity: opacity / 100 }}
      >
        {overlayLayer.imageSrc ? (
          <img
            src={overlayLayer.imageSrc}
            alt={overlayLayer.label}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={cn("w-full h-full", overlayLayer.color)} />
        )}
      </div>

      {/* Grid overlay for placeholder */}
      {!baseLayer.imageSrc && !overlayLayer.imageSrc && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="site-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#site-grid)" className="text-stone-400" />
          </svg>
        </div>
      )}

      {/* Hotspot zones */}
      <div className="absolute inset-0">
        {zones.map((zone) => (
          <button
            key={zone.id}
            className={cn(
              "absolute border-2 rounded-lg transition-all duration-200 cursor-pointer group",
              activeZone === zone.id || selectedZone?.id === zone.id
                ? "border-amber-500 bg-amber-500/20"
                : "border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-500/70"
            )}
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.width}%`,
              height: `${zone.height}%`,
            }}
            onMouseEnter={() => setActiveZone(zone.id)}
            onMouseLeave={() => setActiveZone(null)}
            onClick={() => setSelectedZone(selectedZone?.id === zone.id ? null : zone)}
            aria-label={`View details for ${zone.name}`}
          >
            <span
              className={cn(
                "absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold transition-all",
                activeZone === zone.id || selectedZone?.id === zone.id
                  ? "bg-amber-500 text-white"
                  : "bg-white/90 text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-800"
              )}
            >
              {zone.name}
            </span>
          </button>
        ))}

        {/* Hover tooltip (desktop) */}
        {activeData && !selectedZone && (
          <div
            className="hidden md:block absolute z-20 pointer-events-none"
            style={{
              left: `${Math.min(activeData.x + activeData.width / 2, 65)}%`,
              top: `${Math.max(activeData.y - 2, 0)}%`,
              transform: "translateX(-50%) translateY(-100%)",
            }}
          >
            <div className="bg-white rounded-lg shadow-xl border border-stone-200 p-3 min-w-[200px] max-w-[280px]">
              <h4 className="font-serif font-bold text-stone-800 text-sm">{activeData.name}</h4>
              <p className="text-xs text-stone-500 mt-1">{activeData.description}</p>
              {activeData.capacity && (
                <p className="text-xs text-amber-600 font-medium mt-1">
                  Capacity: {activeData.capacity}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected zone detail panel */}
      {selectedZone && (
        <div className="absolute top-4 right-4 z-30 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-stone-200">
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif font-bold text-stone-800 text-lg">{selectedZone.name}</h3>
                <p className="text-stone-600 text-sm mt-1">{selectedZone.description}</p>
              </div>
              <button
                onClick={() => setSelectedZone(null)}
                className="p-1 rounded-full hover:bg-stone-200 text-stone-400 shrink-0 ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {selectedZone.capacity && (
              <div className="mt-3">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-medium text-sm">
                  {selectedZone.capacity}
                </span>
              </div>
            )}
            <div className="mt-3">
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Planned Use</p>
              <p className="text-sm text-stone-700 mt-1">{selectedZone.plannedUse}</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls bar */}
      <div className="absolute bottom-0 inset-x-0 z-20 bg-white/80 backdrop-blur-md border-t border-stone-200/50">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-3">
          {/* Layer pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {layers.map((layer, index) => (
              <Button
                key={layer.id}
                variant={selectedLayerIndex === index ? "default" : "outline"}
                size="sm"
                className={cn(
                  "text-xs",
                  selectedLayerIndex === index
                    ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                    : "bg-white/70 hover:bg-white border-stone-300 text-stone-700"
                )}
                onClick={() => {
                  if (index === 0) {
                    // Selecting base layer: set overlay to next layer, opacity to 0
                    setSelectedLayerIndex(1);
                    setOpacity(0);
                  } else {
                    setSelectedLayerIndex(index);
                    setOpacity(100);
                  }
                }}
              >
                {layer.label}
              </Button>
            ))}
          </div>

          {/* Opacity slider */}
          <div className="flex items-center gap-3 max-w-md mx-auto">
            <span className="text-xs text-stone-500 shrink-0 w-16 text-right">
              {layers[0].label.split(":")[0]}
            </span>
            <Slider
              value={[opacity]}
              onValueChange={(v) => setOpacity(v[0])}
              min={0}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-stone-500 shrink-0 w-16">
              {overlayLayer.label.split(":")[0]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
