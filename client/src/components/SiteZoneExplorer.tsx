import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteZone {
  id: string;
  name: string;
  now: string;
  becoming: string;
  status: "active" | "in-progress" | "planned";
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SiteZoneExplorerProps {
  className?: string;
  compact?: boolean;
}

const statusConfig = {
  active: {
    label: "Active",
    border: "border-emerald-500",
    borderHover: "border-emerald-400",
    bg: "bg-emerald-500/10",
    bgHover: "bg-emerald-500/20",
    badge: "bg-emerald-500/20 text-emerald-300",
    dot: "bg-emerald-500",
  },
  "in-progress": {
    label: "In Progress",
    border: "border-amber-500",
    borderHover: "border-amber-400",
    bg: "bg-amber-500/10",
    bgHover: "bg-amber-500/20",
    badge: "bg-amber-500/20 text-amber-300",
    dot: "bg-amber-500",
  },
  planned: {
    label: "Planned",
    border: "border-stone-400",
    borderHover: "border-stone-300",
    bg: "bg-stone-400/10",
    bgHover: "bg-stone-400/20",
    badge: "bg-stone-400/20 text-stone-300",
    dot: "bg-stone-400",
  },
};

const zones: SiteZone[] = [
  {
    id: "main-building",
    name: "Main Building",
    now: "Rammed earth building — naturally cool in summer, warm in winter. Cold room, multiple rooms, high ceilings.",
    becoming: "Modular restaurant with open fire kitchen, art gallery walls, lowering truss system for lighting and performance. The Classroom wing becomes a bookable workshop space for pottery, cooking, and design. \"Gallery, not museum\" — everything rotates.",
    status: "in-progress",
    x: 53.2,
    y: 13.1,
    width: 26.3,
    height: 39.8,
  },
  {
    id: "garden-area",
    name: "Garden Area",
    now: "Decades of rich nursery soil, established plants — tomatoes, pomegranate, Brazilian coffee, taro, herbs, lilly pillies, pecan trees. Greenhouses and shade house structures.",
    becoming: "Market gardens feeding the kitchen, CSA memberships, kids edible garden beds, NDIS-accessible raised beds. Living tables with herbs growing through. Compost station visible to visitors — the cycle is the point.",
    status: "in-progress",
    x: 23.1,
    y: 7.2,
    width: 30.8,
    height: 49.2,
  },
  {
    id: "front-lawn",
    name: "Front Lawn",
    now: "Open grass area with mature pecan trees and driveway loop.",
    becoming: "Scaffold pavilion under the pecan trees (14m x 9m), communal long table seating 30, pop-up dining and markets. Kids zone with climbing structures and fairy garden. 50 mismatched community chairs. Free soup Fridays.",
    status: "planned",
    x: 23,
    y: 63.3,
    width: 26.7,
    height: 17.8,
  },
  {
    id: "parking",
    name: "Parking / Driveway",
    now: "20–30 gravel car parks shared with wine bar next door.",
    becoming: "Visitor parking with clear paths to the entry. Service access separated from customer flow. Overflow parking on grass for big events. Wheelchair-accessible pathways.",
    status: "active",
    x: 49.8,
    y: 52.5,
    width: 33.9,
    height: 32.3,
  },
  {
    id: "road-frontage",
    name: "Road Frontage",
    now: "Road-facing edge — 2,000+ cars pass every weekend on the way to Kenilworth. Easy to miss currently.",
    becoming: "Wind chime crane sculpture — community contributes metal objects. Rusted laser-cut \"The Harvest\" sign. Entry portal from welded tractor parts. Fences removed to create flow, not barriers. You hear the site before you see it.",
    status: "planned",
    x: 11.1,
    y: 15.2,
    width: 12,
    height: 55,
  },
];

export default function SiteZoneExplorer({
  className,
  compact = false,
}: SiteZoneExplorerProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<SiteZone | null>(null);

  const hoveredData = zones.find((z) => z.id === hoveredZone);

  return (
    <div className={cn("", className)}>
      {/* Desktop: interactive overlay map */}
      <div className="hidden md:block">
        <div className="relative select-none bg-stone-900 rounded-2xl overflow-hidden">
          <img
            src="/images/site-plan/cropped/photo-wide.jpg"
            alt="Aerial photo of The Harvest site — rammed earth building, nursery, paddocks, and driveway"
            className="w-full h-auto block"
          />

          {zones.map((zone) => {
            const config = statusConfig[zone.status];
            const isActive =
              hoveredZone === zone.id || selectedZone?.id === zone.id;

            return (
              <button
                key={zone.id}
                className={cn(
                  "absolute border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer group",
                  isActive
                    ? `${config.borderHover} ${config.bgHover}`
                    : `${config.border}/50 ${config.bg} hover:${config.bgHover}`
                )}
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`,
                }}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => {
                  if (compact) return;
                  setSelectedZone(
                    selectedZone?.id === zone.id ? null : zone
                  );
                }}
                aria-label={`View details for ${zone.name}`}
              >
                <span
                  className={cn(
                    "absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs font-semibold transition-all whitespace-nowrap",
                    isActive
                      ? "bg-white/90 text-stone-800"
                      : "bg-black/50 text-white/90 group-hover:bg-white/90 group-hover:text-stone-800"
                  )}
                >
                  {zone.name}
                </span>
              </button>
            );
          })}

          {hoveredData && !selectedZone && (
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                left: `${Math.min(hoveredData.x + hoveredData.width / 2, 70)}%`,
                top: `${Math.max(hoveredData.y - 2, 0)}%`,
                transform: "translateX(-50%) translateY(-100%)",
              }}
            >
              <div className="bg-stone-800 rounded-lg shadow-xl border border-stone-700 p-3 min-w-[200px] max-w-[280px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className="font-serif font-bold text-white text-sm">
                    {hoveredData.name}
                  </h4>
                  <span
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                      statusConfig[hoveredData.status].badge
                    )}
                  >
                    {statusConfig[hoveredData.status].label}
                  </span>
                </div>
                <p className="text-xs text-stone-400">{hoveredData.now}</p>
                {!compact && (
                  <p className="text-xs text-stone-500 mt-1 italic">
                    Click to see what's coming
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          {(["active", "in-progress", "planned"] as const).map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  statusConfig[status].dot
                )}
              />
              <span className="text-xs text-stone-500">
                {statusConfig[status].label}
              </span>
            </div>
          ))}
        </div>

        {/* Selected zone detail panel */}
        {!compact && selectedZone && (
          <div className="mt-4 p-5 rounded-xl bg-stone-800 border border-stone-700">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-white text-lg">
                  {selectedZone.name}
                </h3>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    statusConfig[selectedZone.status].badge
                  )}
                >
                  {statusConfig[selectedZone.status].label}
                </span>
              </div>
              <button
                onClick={() => setSelectedZone(null)}
                className="p-1 rounded-full hover:bg-stone-700 text-stone-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">
                  Right now
                </p>
                <p className="text-sm text-stone-300">{selectedZone.now}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-amber-500/70 uppercase tracking-wider mb-1">
                  What's coming
                </p>
                <p className="text-sm text-stone-300">
                  {selectedZone.becoming}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile: static image + tappable zone list */}
      <div className="md:hidden">
        <div className="rounded-xl overflow-hidden bg-stone-900">
          <img
            src="/images/site-plan/cropped/photo-wide.jpg"
            alt="Aerial photo of The Harvest site"
            className="w-full h-auto block"
          />
        </div>

        <div className="mt-4 space-y-3">
          {zones.map((zone) => {
            const config = statusConfig[zone.status];
            const isOpen = selectedZone?.id === zone.id;

            return (
              <button
                key={zone.id}
                onClick={() =>
                  compact
                    ? undefined
                    : setSelectedZone(isOpen ? null : zone)
                }
                className={cn(
                  "w-full text-left rounded-xl border transition-all",
                  isOpen
                    ? "bg-stone-800 border-stone-600"
                    : "bg-stone-800/50 border-stone-700/50 active:bg-stone-800"
                )}
              >
                <div className="flex items-center gap-3 p-4">
                  <div className={cn("h-3 w-3 rounded-full shrink-0", config.dot)} />
                  <h4 className="font-serif font-bold text-white text-sm flex-1">
                    {zone.name}
                  </h4>
                  <span
                    className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0",
                      config.badge
                    )}
                  >
                    {config.label}
                  </span>
                </div>
                {isOpen && !compact && (
                  <div className="px-4 pb-4 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">
                        Right now
                      </p>
                      <p className="text-sm text-stone-300 leading-relaxed">{zone.now}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-amber-500/70 uppercase tracking-wider mb-1">
                        What's coming
                      </p>
                      <p className="text-sm text-stone-300 leading-relaxed">{zone.becoming}</p>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
