import { cn } from "@/lib/utils";
import { Calendar, Hammer, ShoppingBag, Building2, Leaf, Utensils } from "lucide-react";

export type Interest = 
  | "events"
  | "workshops"
  | "markets"
  | "venue-hire"
  | "garden-centre"
  | "food-kitchen";

interface InterestOption {
  id: Interest;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const interestOptions: InterestOption[] = [
  { id: "events", label: "Events", icon: Calendar },
  { id: "workshops", label: "Workshops", icon: Hammer },
  { id: "markets", label: "Markets", icon: ShoppingBag },
  { id: "venue-hire", label: "Venue Hire", icon: Building2 },
  { id: "garden-centre", label: "Garden", icon: Leaf },
  { id: "food-kitchen", label: "Food & Kitchen", icon: Utensils },
];

interface InterestSelectorProps {
  selected: Interest[];
  onChange: (interests: Interest[]) => void;
  variant?: "light" | "dark";
  className?: string;
}

export function InterestSelector({
  selected,
  onChange,
  variant = "light",
  className,
}: InterestSelectorProps) {
  const toggleInterest = (interest: Interest) => {
    if (selected.includes(interest)) {
      onChange(selected.filter((i) => i !== interest));
    } else {
      onChange([...selected, interest]);
    }
  };

  const isDark = variant === "dark";

  return (
    <div className={cn("space-y-2", className)}>
      <p className={cn(
        "text-sm font-medium",
        isDark ? "text-stone-300" : "text-stone-600"
      )}>
        I'm interested in: <span className={cn("font-normal", isDark ? "text-stone-400" : "text-stone-500")}>(optional)</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {interestOptions.map((option) => {
          const isSelected = selected.includes(option.id);
          const Icon = option.icon;
          
          return (
            <button
              key={option.id}
              type="button"
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
              <Icon className="h-3.5 w-3.5" />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { interestOptions };
