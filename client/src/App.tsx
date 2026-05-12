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
import Witta from "./pages/Witta";
import Works from "./pages/Works";
import WorkDetail from "./pages/WorkDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import HarvestJourneyPost from "./pages/HarvestJourneyPost";
import Membership from "./pages/Membership";
import Journey from "./pages/Journey";
import People from "./pages/People";
import Person from "./pages/Person";
import StoryDetail from "./pages/StoryDetail";
import GardenLaunch from "./pages/GardenLaunch";
import LaunchRedesign from "./pages/LaunchRedesign";
import HarvestReviewTest from "./pages/HarvestReviewTest";
import AdminDashboard from "./pages/AdminDashboard";
import MediaLibraryAdmin from "./pages/admin/MediaLibraryAdmin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // One-click dev admin login: visit any page with ?devAdmin=1 to enable.
  // Only works on localhost. Runs once on mount; redirects to clean URL.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hostname !== "localhost") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("devAdmin") === "1") {
      localStorage.setItem("dev-admin-login", "true");
      params.delete("devAdmin");
      const next = window.location.pathname + (params.toString() ? `?${params}` : "");
      window.location.replace(next);
    } else if (params.get("devAdmin") === "0") {
      localStorage.removeItem("dev-admin-login");
      params.delete("devAdmin");
      const next = window.location.pathname + (params.toString() ? `?${params}` : "");
      window.location.replace(next);
    }
  }, []);

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
  if (location === "/witta") return <Witta />;
  if (location === "/login") return <Login />;
  if (location === "/admin") return <AdminDashboard />;
  if (location === "/admin/media-library") return <MediaLibraryAdmin />;
  if (location === "/works") return <Works />;
  if (location.startsWith("/works/")) {
    const slug = location.slice("/works/".length).split("/")[0];
    return <WorkDetail slug={slug} />;
  }
  if (location === "/blog") return <Blog />;
  if (
    location === "/what-is-the-harvest" ||
    location === "/blog/what-is-the-harvest" ||
    location === "/blog/the-harvest-journey"
  ) return <HarvestJourneyPost />;
  if (location.startsWith("/blog/")) {
    const slug = location.slice("/blog/".length).split("/")[0];
    return <BlogPost slug={slug} />;
  }
  if (location === "/membership") return <Membership />;
  if (location === "/journey" || location === "/story") return <Journey />;
  if (location === "/people") return <People />;
  if (location.startsWith("/people/")) {
    const slug = location.slice("/people/".length).split("/")[0];
    return <Person slug={slug} />;
  }
  if (location.startsWith("/stories/")) {
    const storyId = location.slice("/stories/".length).split("/")[0];
    return <StoryDetail storyId={storyId} />;
  }
  if (location === "/garden-launch" || location === "/june-20") return <GardenLaunch />;
  if (location === "/launch-redesign") return <LaunchRedesign />;
  if (location === "/new-look-test" || location === "/review-test") return <HarvestReviewTest />;
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
