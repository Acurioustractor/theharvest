import { useState } from "react";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KeyPoint {
  id: string;
  name: string;
  description: string;
  plannedUse: string;
  /** Percentage-based coordinates — centre of the pin */
  x: number;
  y: number;
}

// Keep old interface for backwards compat (Vision.tsx passes zones={[]})
export interface HotspotZone {
  id: string;
  name: string;
  description: string;
  capacity?: string;
  plannedUse: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FloorPlanViewerProps {
  imageSrc?: string;
  imageAlt?: string;
  zones?: HotspotZone[];
  keyPoints?: KeyPoint[];
  className?: string;
}

export const defaultKeyPoints: KeyPoint[] = [
  {
    id: "kitchen",
    name: "Kitchen & Service",
    description: "The cold room and staff room wing becomes the heart of food production — open fire kitchen with servery window looking out to gardens.",
    plannedUse: "Open fire cooking, cold storage, prep area, service corridor behind bar. Chefs access the garden directly to pick produce. \"This kitchen is a stage.\"",
    x: 36.8,
    y: 48.7,
  },
  {
    id: "restaurant",
    name: "Restaurant & Gallery",
    description: "The large central hall (formerly Mail Order / Receive & Pack) — rammed earth walls, high ceilings, natural light. The biggest space in the building.",
    plannedUse: "Modular restaurant with lowering truss system for lighting and performance. Art gallery walls with flexible rail hanging. Seasonal shows — summer, winter, autumn, spring. Everything on wheels for quick changeovers. 30–40 seated.",
    x: 54.3,
    y: 54.8,
  },
  {
    id: "cafe",
    name: "Cafe & Bar",
    description: "Near the garden-side entry — the first thing visitors encounter. Bar area with large window into the kitchen for visual connection.",
    plannedUse: "Bar with high table seating along walls, lounge-style couches, table lamps. \"Homefeel\" atmosphere — residential furniture, not commercial. Servery to the gardens and pavilion area outside.",
    x: 38.9,
    y: 38.3,
  },
  {
    id: "classroom",
    name: "The Classroom",
    description: "Self-contained right wing (formerly Seed Pack & Seed Store) — separate entry, air-conditioned studio space. 20-person capacity.",
    plannedUse: "Bookable education space: pottery, cooking classes, Pilates, design workshops, community courses. Multi-medium artist residencies — designers, chefs, sound designers, lighting designers rotating through.",
    x: 68.1,
    y: 37.7,
  },
  {
    id: "artist-studio",
    name: "Artist in Residence",
    description: "The transition zone between main hall and classroom wing — production facility where artists work on pieces that will be displayed throughout the building.",
    plannedUse: "Walk-through workshop as part of the visitor experience — \"stepping into Narnia.\" Artists create exhibition pieces visible to guests. Enterprise incubator space for local makers and craftspeople.",
    x: 79.4,
    y: 45.6,
  },
  {
    id: "courtyard",
    name: "Covered Courtyard",
    description: "The outdoor space between the building wings — sheltered by roof overhangs, connected to gardens. Tables, plants, dappled light.",
    plannedUse: "Outdoor dining overflow, covered tables for all-weather use. Servery window from kitchen. Connection point between restaurant, classroom, and gardens. Community gathering in the fresh air.",
    x: 29.9,
    y: 28.3,
  },
  {
    id: "office",
    name: "Office Spaces",
    description: "Administration and management offices — the operational hub that keeps The Harvest running day to day.",
    plannedUse: "Back-of-house offices for venue management, bookings, community coordination, and enterprise support. Shared hot-desking for resident artists and visiting collaborators.",
    x: 45.7,
    y: 76.1,
  },
];

export const defaultZones: HotspotZone[] = [];

export default function FloorPlanViewer({
  imageSrc = "/images/plans/building-layout-detail.jpeg",
  imageAlt = "The Harvest Building Layout — architect's interior plan",
  zones,
  keyPoints = defaultKeyPoints,
  className,
}: FloorPlanViewerProps) {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<KeyPoint | null>(null);

  const hoveredData = keyPoints.find((p) => p.id === hoveredPoint);

  // If zones are passed (legacy), don't render key points
  const showKeyPoints = !zones || zones.length === 0;

  return (
    <Card className={cn("overflow-hidden border-0 shadow-lg", className)}>
      {/* Desktop: interactive pin map */}
      <div className="hidden md:block">
        <div className="relative select-none">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />

          {showKeyPoints && keyPoints.map((point, index) => {
            const isActive = hoveredPoint === point.id || selectedPoint?.id === point.id;
            return (
              <button
                key={point.id}
                className={cn(
                  "absolute z-10 flex items-center gap-1.5 transition-all duration-200 cursor-pointer group",
                  "transform -translate-x-1/2 -translate-y-1/2",
                )}
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                }}
                onMouseEnter={() => setHoveredPoint(point.id)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => setSelectedPoint(selectedPoint?.id === point.id ? null : point)}
                aria-label={`View details for ${point.name}`}
              >
                <span
                  className={cn(
                    "flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold transition-all shadow-md",
                    isActive
                      ? "bg-amber-500 text-white scale-110 shadow-lg"
                      : "bg-white text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-800 group-hover:scale-105"
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap transition-all shadow-sm",
                    isActive
                      ? "bg-amber-500 text-white"
                      : "bg-white/95 text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-800"
                  )}
                >
                  {point.name}
                </span>
              </button>
            );
          })}

          {hoveredData && !selectedPoint && (
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                left: `${Math.min(hoveredData.x, 65)}%`,
                top: `${Math.max(hoveredData.y - 5, 0)}%`,
                transform: "translateX(-50%) translateY(-100%)",
              }}
            >
              <div className="bg-white rounded-lg shadow-xl border border-stone-200 p-3 min-w-[200px] max-w-[280px]">
                <h4 className="font-serif font-bold text-stone-800 text-sm">{hoveredData.name}</h4>
                <p className="text-xs text-stone-500 mt-1">{hoveredData.description}</p>
              </div>
            </div>
          )}
        </div>

        {selectedPoint && (
          <div className="p-5 border-t border-stone-200 bg-stone-50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif font-bold text-stone-800 text-lg">{selectedPoint.name}</h3>
                <p className="text-stone-600 text-sm mt-1">{selectedPoint.description}</p>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="p-1 rounded-full hover:bg-stone-200 text-stone-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3">
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">What's Planned</p>
              <p className="text-sm text-stone-700 mt-1">{selectedPoint.plannedUse}</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile: image + tappable numbered list */}
      <div className="md:hidden">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-auto"
        />
        <div className="divide-y divide-stone-200">
          {showKeyPoints && keyPoints.map((point, index) => {
            const isOpen = selectedPoint?.id === point.id;
            return (
              <button
                key={point.id}
                onClick={() => setSelectedPoint(isOpen ? null : point)}
                className={cn(
                  "w-full text-left transition-colors",
                  isOpen ? "bg-amber-50" : "bg-white active:bg-stone-50"
                )}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <span
                    className={cn(
                      "flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold shrink-0",
                      isOpen
                        ? "bg-amber-500 text-white"
                        : "bg-stone-100 text-stone-600"
                    )}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-stone-800 text-sm">{point.name}</h4>
                    {!isOpen && (
                      <p className="text-xs text-stone-500 truncate">{point.description}</p>
                    )}
                  </div>
                </div>
                {isOpen && (
                  <div className="px-4 pb-4 pl-14 space-y-2">
                    <p className="text-sm text-stone-600 leading-relaxed">{point.description}</p>
                    <div>
                      <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">What's Planned</p>
                      <p className="text-sm text-stone-700 mt-1 leading-relaxed">{point.plannedUse}</p>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
