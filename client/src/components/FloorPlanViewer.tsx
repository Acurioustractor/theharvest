import { useState } from "react";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HotspotZone {
  id: string;
  name: string;
  description: string;
  capacity?: string;
  plannedUse: string;
  /** Percentage-based coordinates so they scale with the image */
  x: number; // % from left
  y: number; // % from top
  width: number; // % width
  height: number; // % height
}

interface FloorPlanViewerProps {
  imageSrc?: string;
  imageAlt?: string;
  zones?: HotspotZone[];
  className?: string;
}

export const defaultZones: HotspotZone[] = [
  {
    id: "pavilion",
    name: "The Pavilion",
    description: "Scaffold and timber structure under mature pecan trees — covered outdoor gathering space with flexible layout.",
    capacity: "100+ standing, 40 seated",
    plannedUse: "Weekend markets, live music, community gatherings, pop-up dining, art exhibitions, movie nights",
    x: 5,
    y: 8,
    width: 40,
    height: 38,
  },
  {
    id: "shed",
    name: "The Shed",
    description: "Existing metal structure with power and water. Clad with rusted iron, copper lights — retail and serving space.",
    capacity: "Retail + servery",
    plannedUse: "Oyster shack, deli counter, pizza prep, pop-up food service. Stage 1 priority (~$10K fit-out)",
    x: 5,
    y: 50,
    width: 25,
    height: 22,
  },
  {
    id: "garden",
    name: "The Gardens",
    description: "Excellent soil from decades of nursery use. Existing produce: tomatoes, pomegranate, coffee, taro, herbs, lilly pillies.",
    capacity: "Open air",
    plannedUse: "Market garden for restaurant produce, raised beds, community volunteering, kids gardening programs",
    x: 32,
    y: 50,
    width: 30,
    height: 44,
  },
  {
    id: "main-building",
    name: "Main Building",
    description: "Rammed earth construction — naturally cool in summer, warm in winter. Cold room, multiple rooms, high ceilings.",
    capacity: "30-40 seated",
    plannedUse: "Stage 2: modular restaurant/event space with lowering truss system, open fire kitchen, servery to gardens",
    x: 48,
    y: 8,
    width: 30,
    height: 38,
  },
  {
    id: "classroom",
    name: "The Classroom",
    description: "Self-contained wing with seed store, reception area, and air-conditioned studio space.",
    capacity: "20 participants",
    plannedUse: "Bookable education space: pottery, Pilates, cooking classes, design workshops, community courses",
    x: 80,
    y: 8,
    width: 17,
    height: 38,
  },
  {
    id: "lawn",
    name: "The Lawn",
    description: "Open grassed area adjoining the wine bar next door — natural overflow and picnic space.",
    capacity: "60+ on blankets",
    plannedUse: "Picnic blanket dining, oyster pop-ups, kids play area, overflow event space",
    x: 65,
    y: 55,
    width: 32,
    height: 38,
  },
];

export default function FloorPlanViewer({
  imageSrc,
  imageAlt = "The Harvest Floor Plan",
  zones = defaultZones,
  className,
}: FloorPlanViewerProps) {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<HotspotZone | null>(null);

  const activeData = zones.find((z) => z.id === activeZone);

  return (
    <Card className={cn("overflow-hidden border-0 shadow-lg", className)}>
      <div className="relative select-none">
        {/* Floor plan image or placeholder */}
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full aspect-[4/3] bg-stone-100 flex items-center justify-center relative">
            {/* Placeholder grid */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" className="text-stone-400" />
              </svg>
            </div>
            <p className="text-stone-400 text-sm font-medium z-10 bg-white/80 px-4 py-2 rounded-full">
              Architect sketch coming soon — hover zones to explore
            </p>
          </div>
        )}

        {/* Hotspot zones */}
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
            {/* Zone label */}
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
        <div className="p-5 border-t border-stone-200 bg-stone-50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-serif font-bold text-stone-800 text-lg">{selectedZone.name}</h3>
              <p className="text-stone-600 text-sm mt-1">{selectedZone.description}</p>
            </div>
            <button
              onClick={() => setSelectedZone(null)}
              className="p-1 rounded-full hover:bg-stone-200 text-stone-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {selectedZone.capacity && (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-medium">
                {selectedZone.capacity}
              </span>
            )}
          </div>
          <div className="mt-3">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Planned Use</p>
            <p className="text-sm text-stone-700 mt-1">{selectedZone.plannedUse}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
