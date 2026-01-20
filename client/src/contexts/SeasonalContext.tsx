import React, { createContext, useContext, useEffect, useState } from "react";

export type Season = "summer" | "autumn" | "winter" | "spring";

interface SeasonalColors {
  primary: string;
  secondary: string;
  accent: string;
  hero: {
    from: string;
    via: string;
    to: string;
  };
}

interface SeasonalContent {
  tagline: string;
  heroImage: string;
  welcomeMessage: string;
}

interface SeasonalData {
  season: Season;
  colors: SeasonalColors;
  content: SeasonalContent;
  displayName: string;
  emoji: string;
}

// Southern Hemisphere seasons (Australia)
const getSeasonFromDate = (date: Date): Season => {
  const month = date.getMonth() + 1; // 1-12

  // Summer: December, January, February
  if (month === 12 || month === 1 || month === 2) return "summer";
  // Autumn: March, April, May
  if (month >= 3 && month <= 5) return "autumn";
  // Winter: June, July, August
  if (month >= 6 && month <= 8) return "winter";
  // Spring: September, October, November
  return "spring";
};

const seasonalData: Record<Season, SeasonalData> = {
  summer: {
    season: "summer",
    displayName: "Summer",
    emoji: "☀️",
    colors: {
      primary: "oklch(0.55 0.15 45)", // Warm golden
      secondary: "oklch(0.65 0.12 85)", // Ochre
      accent: "oklch(0.75 0.10 60)", // Honey
      hero: {
        from: "from-amber-500/20",
        via: "via-orange-400/15",
        to: "to-yellow-500/20",
      },
    },
    content: {
      tagline: "Long days, warm gatherings",
      heroImage: "/images/harvest-hero-summer.jpg",
      welcomeMessage: "We're dreaming of long summer evenings – community tables under the stars, food shared with neighbours, gardens bursting with life.",
    },
  },
  autumn: {
    season: "autumn",
    displayName: "Autumn",
    emoji: "🍂",
    colors: {
      primary: "oklch(0.50 0.12 40)", // Deep terracotta
      secondary: "oklch(0.60 0.14 55)", // Burnt orange
      accent: "oklch(0.45 0.08 30)", // Rich clay
      hero: {
        from: "from-orange-600/20",
        via: "via-amber-500/15",
        to: "to-red-500/20",
      },
    },
    content: {
      tagline: "Harvest time, gratitude season",
      heroImage: "/images/harvest-hero-autumn.jpg",
      welcomeMessage: "We're building a place for harvest gatherings – where preserving skills pass between generations and gratitude becomes tradition.",
    },
  },
  winter: {
    season: "winter",
    displayName: "Winter",
    emoji: "🌧️",
    colors: {
      primary: "oklch(0.35 0.04 160)", // Deep forest
      secondary: "oklch(0.50 0.06 180)", // Sage
      accent: "oklch(0.55 0.08 200)", // Misty blue-green
      hero: {
        from: "from-stone-600/20",
        via: "via-emerald-800/15",
        to: "to-slate-600/20",
      },
    },
    content: {
      tagline: "Slow down, warm up",
      heroImage: "/images/harvest-hero-winter.jpg",
      welcomeMessage: "Picture winter here: warm kitchens, slow conversations, a fire going while we plan what comes next together.",
    },
  },
  spring: {
    season: "spring",
    displayName: "Spring",
    emoji: "🌸",
    colors: {
      primary: "oklch(0.50 0.12 140)", // Fresh green
      secondary: "oklch(0.70 0.10 100)", // Soft yellow-green
      accent: "oklch(0.65 0.15 350)", // Blossom pink
      hero: {
        from: "from-green-500/20",
        via: "via-emerald-400/15",
        to: "to-lime-500/20",
      },
    },
    content: {
      tagline: "New growth, fresh starts",
      heroImage: "/images/harvest-hero-spring.jpg",
      welcomeMessage: "Spring is for beginnings. We're preparing the ground for something beautiful – a place to grow, learn, and belong.",
    },
  },
};

interface SeasonalContextType {
  season: Season;
  data: SeasonalData;
  setSeason: (season: Season) => void;
  isOverridden: boolean;
  resetToNatural: () => void;
}

const SeasonalContext = createContext<SeasonalContextType | undefined>(undefined);

interface SeasonalProviderProps {
  children: React.ReactNode;
  defaultSeason?: Season;
}

export function SeasonalProvider({
  children,
  defaultSeason,
}: SeasonalProviderProps) {
  const naturalSeason = getSeasonFromDate(new Date());
  const [season, setSeason] = useState<Season>(defaultSeason || naturalSeason);
  const [isOverridden, setIsOverridden] = useState(!!defaultSeason);

  // Apply seasonal CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const colors = seasonalData[season].colors;

    root.style.setProperty("--seasonal-primary", colors.primary);
    root.style.setProperty("--seasonal-secondary", colors.secondary);
    root.style.setProperty("--seasonal-accent", colors.accent);
    root.setAttribute("data-season", season);
  }, [season]);

  const handleSetSeason = (newSeason: Season) => {
    setSeason(newSeason);
    setIsOverridden(true);
  };

  const resetToNatural = () => {
    setSeason(naturalSeason);
    setIsOverridden(false);
  };

  return (
    <SeasonalContext.Provider
      value={{
        season,
        data: seasonalData[season],
        setSeason: handleSetSeason,
        isOverridden,
        resetToNatural,
      }}
    >
      {children}
    </SeasonalContext.Provider>
  );
}

export function useSeason() {
  const context = useContext(SeasonalContext);
  if (!context) {
    throw new Error("useSeason must be used within SeasonalProvider");
  }
  return context;
}

export { seasonalData };
