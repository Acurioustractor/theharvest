import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
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
import SocialPlanner from "./pages/SocialPlanner";
import LogoStory from "./pages/LogoStory";
import GrowingH from "./pages/GrowingH";
import LogoLab from "./pages/LogoLab";
import GatheringPostcard from "./pages/GatheringPostcard";
import Social from "./pages/Social";
import PhotoWall from "./pages/PhotoWall";
import PhotoWallCheckin from "./pages/PhotoWallCheckin";
import NotFound from "./pages/NotFound";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // All pages are standalone (no PublicLayout)
  if (location === "/") return <BauhausHome />;
  if (location === "/gather") return <Gather />;
  if (location === "/contact") return <Contact />;
  if (location === "/compendium") return <Compendium />;
  if (location === "/community") return <CommunityIntelligence />;
  if (location === "/pulse") return <CommunityPulse />;
  if (location === "/brand-guide") return <BrandGuide />;
  if (location === "/zone-workshop") return <ZoneWorkshop />;
  if (location === "/social-planner") return <SocialPlanner />;
  if (location === "/logo-story") return <LogoStory />;
  if (location === "/growing-h") return <GrowingH />;
  if (location === "/logo-lab") return <LogoLab />;
  if (location === "/gathering-postcard") return <GatheringPostcard />;
  if (location === "/social") return <Social />;
  if (location === "/photo-wall") return <PhotoWall />;
  if (location.startsWith("/photo-wall/checkin")) return <PhotoWallCheckin />;
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
