import { cn } from "@/lib/utils";
import {
  Calendar,
  Hammer,
  ShoppingBag,
  Building2,
  Leaf,
  Utensils,
  Users,
  Heart,
  Sparkles,
  TreeDeciduous,
} from "lucide-react";

export type Interest =
  | "events"
  | "workshops"
  | "markets"
  | "venue-hire"
  | "garden-centre"
  | "food-kitchen"
  | "community"
  | "volunteering"
  | "membership"
  | "sustainability";

interface InterestOption {
  id: Interest;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  ghlTag?: string; // Tag to send to GHL
}

const interestOptions: InterestOption[] = [
  { id: "events", label: "Events", icon: Calendar, ghlTag: "interest-events" },
  { id: "workshops", label: "Workshops", icon: Hammer, ghlTag: "interest-workshops" },
  { id: "markets", label: "Markets", icon: ShoppingBag, ghlTag: "interest-markets" },
  { id: "venue-hire", label: "Venue Hire", icon: Building2, ghlTag: "interest-venue" },
  { id: "garden-centre", label: "Garden", icon: Leaf, ghlTag: "interest-garden" },
  { id: "food-kitchen", label: "Food & Kitchen", icon: Utensils, ghlTag: "interest-food" },
  { id: "community", label: "Community", icon: Users, ghlTag: "interest-community" },
  { id: "volunteering", label: "Volunteering", icon: Heart, ghlTag: "interest-volunteer" },
  { id: "membership", label: "Membership", icon: Sparkles, ghlTag: "interest-membership" },
  { id: "sustainability", label: "Sustainability", icon: TreeDeciduous, ghlTag: "interest-sustainability" },
];

// Get GHL tags from selected interests
export function getGHLTagsFromInterests(interests: Interest[]): string[] {
  return interests
    .map((id) => interestOptions.find((opt) => opt.id === id)?.ghlTag)
    .filter((tag): tag is string => !!tag);
}

interface InterestSelectorProps {
  selected: Interest[];
  onChange: (interests: Interest[]) => void;
  variant?: "light" | "dark";
  className?: string;
  id?: string;
  name?: string;
}

export function InterestSelector({
  selected,
  onChange,
  variant = "light",
  className,
  id = "interest-selector",
  name = "interests",
}: InterestSelectorProps) {
  const toggleInterest = (interest: Interest) => {
    if (selected.includes(interest)) {
      onChange(selected.filter((i) => i !== interest));
    } else {
      onChange([...selected, interest]);
    }
  };

  const isDark = variant === "dark";
  const labelId = `${id}-label`;

  return (
    <div className={cn("space-y-2", className)}>
      <p id={labelId} className={cn(
        "text-sm font-medium",
        isDark ? "text-stone-300" : "text-stone-600"
      )}>
        I'm interested in: <span className={cn("font-normal", isDark ? "text-stone-400" : "text-stone-500")}>(optional)</span>
      </p>
      <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-2">
        {interestOptions.map((option) => {
          const isSelected = selected.includes(option.id);
          const Icon = option.icon;
          
          return (
            <button
              key={option.id}
              id={`${id}-${option.id}`}
              name={name}
              value={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggleInterest(option.id)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                "border focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1",
                isDark
                  ? isSelected
                    ? "bg-amber-500 text-black border-amber-500"
                    : "bg-white/10 text-stone-300 border-white/20 hover:bg-white/20 hover:border-white/30"
                  : isSelected
                    ? "bg-amber-500 text-black border-amber-500"
                    : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200 hover:border-stone-300"
              )}
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { interestOptions };
