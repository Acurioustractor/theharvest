import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SeasonalProvider } from "./contexts/SeasonalContext";
import BauhausHome from "./pages/BauhausHome";
import Gather from "./pages/Gather";
import About from "./pages/About";
import Account from "./pages/Account";
import BauhausZone from "./pages/BauhausZone";
import Contact from "./pages/Contact";
import Compendium from "./pages/Compendium";
import ComponentShowcase from "./pages/ComponentShowcase";
import EventFeedback from "./pages/EventFeedback";
import BrandGuide from "./pages/BrandGuide";
import BrandDevelopmentWorkbench from "./pages/BrandDevelopmentWorkbench";
import Financials from "./pages/Financials";
import LocalEnterprises from "./pages/LocalEnterprises";
import PartnerPortal from "./pages/PartnerPortal";
import Proposal from "./pages/Proposal";
import LeaseDraft from "./pages/LeaseDraft";
import SocialPlanner from "./pages/SocialPlanner";
import LogoStory from "./pages/LogoStory";
import PhotoWall from "./pages/PhotoWall";
import PhotoWallCheckin from "./pages/PhotoWallCheckin";
import Witta from "./pages/Witta";
import Works from "./pages/Works";
import WorkDetail from "./pages/WorkDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import HarvestJourneyPost from "./pages/HarvestJourneyPost";
import Membership from "./pages/Membership";
import Shop from "./pages/Shop";
import Stories from "./pages/Stories";
import GetInvolved from "./pages/GetInvolved";
import Journey from "./pages/Journey";
import People from "./pages/People";
import SitePlan from "./pages/SitePlan";
import Person from "./pages/Person";
import StoryDetail from "./pages/StoryDetail";
import GardenLaunch from "./pages/GardenLaunch";
import LaunchRedesign from "./pages/LaunchRedesign";
import HarvestReviewTest from "./pages/HarvestReviewTest";
import HarvestControlRoom from "./pages/HarvestControlRoom";
import Privacy from "./pages/Privacy";
import AdminDashboard from "./pages/AdminDashboard";
import MediaLibraryAdmin from "./pages/admin/MediaLibraryAdmin";
import Login from "./pages/Login";
import StrategicAnalysis from "./pages/StrategicAnalysis";
import VenueHire from "./pages/VenueHire";
import WhatsOn from "./pages/WhatsOn";
import NotFound from "./pages/NotFound";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // One-click dev admin login: visit any page with ?devAdmin=1 to enable.
  // Only works on localhost. `?devAdmin=0` forces the local opt-out.
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
      localStorage.setItem("dev-admin-login", "false");
      params.delete("devAdmin");
      const next = window.location.pathname + (params.toString() ? `?${params}` : "");
      window.location.replace(next);
    }
  }, []);

  // All pages are standalone (no PublicLayout)
  if (location === "/") return <BauhausHome />;
  if (location === "/gather") return <Gather />;
  if (location === "/about") return <About />;
  if (location === "/contact") return <Contact />;
  if (location === "/compendium") return <Compendium />;
  if (location === "/brand-guide") return <BrandGuide />;
  if (location === "/brand-development") return <BrandDevelopmentWorkbench />;
  if (location === "/bauhaus" || location === "/bauhaus/") return <BauhausHome />;
  if (location.startsWith("/bauhaus/")) {
    const zoneId = location.slice("/bauhaus/".length).split("/")[0];
    return zoneId ? <BauhausZone zoneId={zoneId} /> : <BauhausHome />;
  }
  if (location === "/whats-on") return <WhatsOn />;
  if (location === "/venue-hire") return <VenueHire />;
  if (location === "/enterprises") return <LocalEnterprises />;
  if (location === "/site-plan") return <SitePlan />;
  if (location === "/social-planner") return <SocialPlanner />;
  if (location === "/logo-story") return <LogoStory />;
  if (location === "/photo-wall") return <PhotoWall />;
  if (location.startsWith("/photo-wall/checkin")) return <PhotoWallCheckin />;
  if (location === "/witta") return <Witta />;
  if (location === "/login") return <Login />;
  if (location === "/account") return <Account />;
  if (location === "/partner-portal") return <PartnerPortal />;
  if (location === "/admin") return <AdminDashboard />;
  if (location === "/admin/control-room") return <HarvestControlRoom />;
  if (location === "/admin/media-library") return <MediaLibraryAdmin />;
  if (location === "/components") return <ComponentShowcase />;
  if (location === "/strategic-analysis") return <StrategicAnalysis />;
  if (location === "/proposal") return <Proposal />;
  if (location === "/lease-draft") return <LeaseDraft />;
  if (location === "/financials") return <Financials />;
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
  if (location === "/shop") return <Shop />;
  if (location === "/stories") return <Stories />;
  if (location === "/get-involved") return <GetInvolved />;
  if (location === "/story") return <Journey />;
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
  if (location === "/privacy") return <Privacy />;
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
