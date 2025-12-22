import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";

interface SwotItem {
  title: string;
  description: string;
}

interface SwotCardProps {
  type: "strengths" | "weaknesses" | "opportunities" | "threats";
  items: SwotItem[];
  icon: React.ReactNode;
}

export default function SwotCard({ type, items, icon }: SwotCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const config = {
    strengths: {
      color: "bg-primary/10 text-primary border-primary/20",
      headerColor: "text-primary",
      label: "Strengths",
      accent: "bg-primary"
    },
    weaknesses: {
      color: "bg-secondary/10 text-secondary border-secondary/20",
      headerColor: "text-secondary",
      label: "Weaknesses",
      accent: "bg-secondary"
    },
    opportunities: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      headerColor: "text-blue-700",
      label: "Opportunities",
      accent: "bg-blue-600"
    },
    threats: {
      color: "bg-red-50 text-red-700 border-red-200",
      headerColor: "text-red-700",
      label: "Threats",
      accent: "bg-red-600"
    }
  };

  const style = config[type];

  return (
    <motion.div
      layout
      className={cn(
        "relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-lg bg-card",
        style.color
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg text-white", style.accent)}>
            {icon}
          </div>
          <h3 className={cn("font-serif text-2xl font-bold", style.headerColor)}>
            {style.label}
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {/* Always show first 2 items */}
        <ul className="space-y-3">
          {items.slice(0, 2).map((item, idx) => (
            <li key={idx} className="flex gap-3 items-start">
              <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0", style.accent)} />
              <div>
                <strong className="block font-bold text-foreground/90">{item.title}</strong>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <AnimatePresence>
          {isExpanded && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              {items.slice(2).map((item, idx) => (
                <li key={idx + 2} className="flex gap-3 items-start">
                  <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0", style.accent)} />
                  <div>
                    <strong className="block font-bold text-foreground/90">{item.title}</strong>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {items.length > 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "flex items-center gap-2 text-sm font-bold uppercase tracking-wider mt-4 hover:opacity-80 transition-opacity",
              style.headerColor
            )}
          >
            {isExpanded ? (
              <>
                <Minus className="h-4 w-4" /> Show Less
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> View All {items.length} Factors
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}
