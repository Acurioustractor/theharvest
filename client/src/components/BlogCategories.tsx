import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flame, Users, Sprout, Heart, Home, Mountain, Fingerprint, Scale, LayoutGrid } from "lucide-react";

// Empathy Ledger themes
export type BlogTheme = "Resilience" | "Connection" | "Growth" | "Healing" | "Community" | "Land" | "Identity" | "Justice" | null;

interface BlogCategoriesProps {
  selected: BlogTheme;
  onChange: (theme: BlogTheme) => void;
  className?: string;
}

const themes: Array<{
  id: BlogTheme;
  label: string;
  icon: React.ElementType;
  description: string;
}> = [
  { id: null, label: "All Stories", icon: LayoutGrid, description: "Everything from The Harvest" },
  { id: "Community", label: "Community", icon: Users, description: "Local connections & gatherings" },
  { id: "Growth", label: "Growth", icon: Sprout, description: "Learning & transformation" },
  { id: "Connection", label: "Connection", icon: Heart, description: "Relationships & belonging" },
  { id: "Resilience", label: "Resilience", icon: Flame, description: "Strength & perseverance" },
  { id: "Healing", label: "Healing", icon: Home, description: "Recovery & restoration" },
  { id: "Land", label: "Land", icon: Mountain, description: "Place & environment" },
  { id: "Identity", label: "Identity", icon: Fingerprint, description: "Culture & heritage" },
  { id: "Justice", label: "Justice", icon: Scale, description: "Equity & fairness" },
];

export default function BlogCategories({ selected, onChange, className }: BlogCategoriesProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Mobile: Horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 md:hidden scrollbar-hide">
        {themes.map((theme) => (
          <Button
            key={theme.id || "all"}
            variant={selected === theme.id ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(theme.id)}
            className={cn(
              "flex-shrink-0 gap-2",
              selected === theme.id
                ? "bg-amber-500 hover:bg-amber-600 text-black border-amber-500"
                : "bg-white hover:bg-stone-50"
            )}
          >
            <theme.icon className="h-4 w-4" />
            {theme.label}
          </Button>
        ))}
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-3">
        {themes.map((theme) => (
          <button
            key={theme.id || "all"}
            onClick={() => onChange(theme.id)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg text-left transition-all",
              selected === theme.id
                ? "bg-amber-50 border-2 border-amber-500 shadow-sm"
                : "bg-white border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                selected === theme.id ? "bg-amber-500 text-white" : "bg-stone-100 text-stone-600"
              )}
            >
              <theme.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div
                className={cn(
                  "font-medium text-sm",
                  selected === theme.id ? "text-amber-700" : "text-stone-800"
                )}
              >
                {theme.label}
              </div>
              <div className="text-xs text-stone-500 truncate">{theme.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Compact version for sidebar
export function BlogCategoriesCompact({
  selected,
  onChange,
  className,
}: BlogCategoriesProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {themes.map((theme) => (
        <button
          key={theme.id || "all"}
          onClick={() => onChange(theme.id)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all text-sm",
            selected === theme.id
              ? "bg-amber-100 text-amber-800 font-medium"
              : "text-stone-600 hover:bg-stone-100"
          )}
        >
          <theme.icon className="h-4 w-4" />
          {theme.label}
        </button>
      ))}
    </div>
  );
}
