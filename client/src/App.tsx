import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SeasonalProvider } from "./contexts/SeasonalContext";
import BauhausHome from "./pages/BauhausHome";
import Gather from "./pages/Gather";
import Contact from "./pages/Contact";
import Compendium from "./pages/Compendium";
import CommunityIntelligence from "./pages/CommunityIntelligence";
import CommunityPulse from "./pages/CommunityPulse";
import EventFeedback from "./pages/EventFeedback";
import BrandGuide from "./pages/BrandGuide";
import ZoneWorkshop from "./pages/ZoneWorkshop";
import NotFound from "./pages/NotFound";

function Router() {
  const [location] = useLocation();

  // All pages are standalone (no PublicLayout)
  if (location === "/") return <BauhausHome />;
  if (location === "/gather") return <Gather />;
  if (location === "/contact") return <Contact />;
  if (location === "/compendium") return <Compendium />;
  if (location === "/community") return <CommunityIntelligence />;
  if (location === "/pulse") return <CommunityPulse />;
  if (location === "/brand-guide") return <BrandGuide />;
  if (location === "/zone-workshop") return <ZoneWorkshop />;
  if (location.startsWith("/feedback")) {
    const eventId = location.split("/feedback/")[1];
    return <EventFeedback eventId={eventId} />;
  }

  return <NotFound />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <SeasonalProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </SeasonalProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
