import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { Redirect, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SeasonalProvider } from "./contexts/SeasonalContext";
import BauhausHome from "./pages/BauhausHome";
import Account from "./pages/Account";
import BauhausZone from "./pages/BauhausZone";
import CommunityPulse from "./pages/CommunityPulse";
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
import Social from "./pages/Social";
import SocialPlanner from "./pages/SocialPlanner";
import LogoStory from "./pages/LogoStory";
import Works from "./pages/Works";
import WorkDetail from "./pages/WorkDetail";
import HarvestJourneyPost from "./pages/HarvestJourneyPost";
import Membership from "./pages/Membership";
import Shop from "./pages/Shop";
import GetInvolved from "./pages/GetInvolved";
import SitePlan from "./pages/SitePlan";
import LaunchRedesign from "./pages/LaunchRedesign";
import HarvestControlRoom from "./pages/HarvestControlRoom";
import Privacy from "./pages/Privacy";
import AdminDashboard from "./pages/AdminDashboard";
import MediaLibraryAdmin from "./pages/admin/MediaLibraryAdmin";
import RsvpAdmin from "./pages/admin/RsvpAdmin";
import PulseAdmin from "./pages/admin/PulseAdmin";
import EventFeedbackAdmin from "./pages/admin/EventFeedbackAdmin";
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
  if (location === "/gather") return <Redirect to="/whats-on" />;
  if (location === "/about") return <Redirect to="/what-is-the-harvest" />;
  if (location === "/contact") return <Contact />;
  if (location === "/compendium") return <Compendium />;
  if (location === "/brand-guide") return <BrandGuide />;
  if (location === "/brand-development") return <BrandDevelopmentWorkbench />;
  if (location === "/bauhaus" || location === "/bauhaus/") return <Redirect to="/" />;
  if (location.startsWith("/bauhaus/")) {
    const zoneId = location.slice("/bauhaus/".length).split("/")[0];
    return zoneId ? <BauhausZone zoneId={zoneId} /> : <BauhausHome />;
  }
  if (location === "/whats-on") return <WhatsOn />;
  if (location === "/witta-pizza") return <WhatsOn />;
  if (location === "/pizza") return <Redirect to="/witta-pizza" />;
  if (location === "/venue-hire") return <VenueHire />;
  if (location === "/enterprises") return <LocalEnterprises />;
  if (location === "/site-plan") return <SitePlan />;
  if (location === "/social") return <Social />;
  if (location === "/social-planner") return <SocialPlanner />;
  if (location === "/pulse") return <CommunityPulse />;
  if (location === "/logo-story") return <LogoStory />;
  if (location === "/photo-wall" || location.startsWith("/photo-wall/")) return <Redirect to="/whats-on" />;
  if (location === "/witta") return <Redirect to="/what-is-the-harvest" />;
  if (location === "/login") return <Login />;
  if (location === "/account") return <Account />;
  if (location === "/partner-portal") return <PartnerPortal />;
  if (location === "/admin") return <AdminDashboard />;
  if (location === "/admin/control-room") return <HarvestControlRoom />;
  if (location === "/admin/media-library") return <MediaLibraryAdmin />;
  if (location === "/admin/rsvps") return <RsvpAdmin />;
  if (location === "/admin/pulse") return <PulseAdmin />;
  if (location === "/admin/feedback") return <EventFeedbackAdmin />;
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
  if (
    location === "/what-is-the-harvest" ||
    location === "/blog/what-is-the-harvest" ||
    location === "/blog/the-harvest-journey"
  ) return <HarvestJourneyPost />;
  if (location === "/blog" || location.startsWith("/blog/")) return <Redirect to="/whats-on" />;
  if (location === "/membership") return <Membership />;
  if (location === "/shop") return <Shop />;
  if (location === "/stories" || location.startsWith("/stories/")) return <Redirect to="/whats-on" />;
  if (location === "/get-involved") return <GetInvolved />;
  if (location === "/story") return <Redirect to="/whats-on" />;
  if (location === "/people" || location.startsWith("/people/")) return <Redirect to="/whats-on" />;
  if (location === "/garden-launch" || location === "/june-20") return <Redirect to="/whats-on" />;
  if (location === "/privacy") return <Privacy />;
  if (location === "/launch-redesign") return <LaunchRedesign />;
  if (location === "/new-look-test" || location === "/review-test") return <Redirect to="/" />;
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
            <RouteIdentity />
            <Router />
          </TooltipProvider>
        </SeasonalProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function RouteIdentity() {
  const [location] = useLocation();
  const route = location === "/" ? "home" : location.slice(1).replaceAll("/", ":");
  return (
    <span
      data-harvest-route={`harvest-route:${route}`}
      hidden
      aria-hidden="true"
    />
  );
}

export default App;
