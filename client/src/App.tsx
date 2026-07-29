import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import { Redirect, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SeasonalProvider } from "./contexts/SeasonalContext";

const BauhausHome = lazy(() => import("./pages/BauhausHome"));
const Account = lazy(() => import("./pages/Account"));
const BauhausZone = lazy(() => import("./pages/BauhausZone"));
const CommunityPulse = lazy(() => import("./pages/CommunityPulse"));
const Contact = lazy(() => import("./pages/Contact"));
const EventFeedback = lazy(() => import("./pages/EventFeedback"));
const LocalEnterprises = lazy(() => import("./pages/LocalEnterprises"));
const Works = lazy(() => import("./pages/Works"));
const WorkDetail = lazy(() => import("./pages/WorkDetail"));
const HarvestJourneyPost = lazy(() => import("./pages/HarvestJourneyPost"));
const Membership = lazy(() => import("./pages/Membership"));
const Shop = lazy(() => import("./pages/Shop"));
const GetInvolved = lazy(() => import("./pages/GetInvolved"));
const StartHere = lazy(() => import("./pages/StartHere"));
const HarvestControlRoom = lazy(() => import("./pages/HarvestControlRoom"));
const Privacy = lazy(() => import("./pages/Privacy"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const MediaLibraryAdmin = lazy(() => import("./pages/admin/MediaLibraryAdmin"));
const RsvpAdmin = lazy(() => import("./pages/admin/RsvpAdmin"));
const PulseAdmin = lazy(() => import("./pages/admin/PulseAdmin"));
const EventFeedbackAdmin = lazy(() => import("./pages/admin/EventFeedbackAdmin"));
const Login = lazy(() => import("./pages/Login"));
const VenueHire = lazy(() => import("./pages/VenueHire"));
const Media = lazy(() => import("./pages/Media"));
const WhatsOn = lazy(() => import("./pages/WhatsOn"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Router() {
  const [rawLocation] = useLocation();
  const location = rawLocation.length > 1 ? rawLocation.replace(/\/+$/, "") : rawLocation;

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    let frame = 0;
    let attempts = 0;
    const targetId = (() => {
      try {
        return decodeURIComponent(hash);
      } catch {
        return hash;
      }
    })();
    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ block: "start" });
        return;
      }
      if (attempts < 120) {
        attempts += 1;
        frame = window.requestAnimationFrame(scrollToTarget);
      }
    };
    frame = window.requestAnimationFrame(scrollToTarget);
    return () => window.cancelAnimationFrame(frame);
  }, [rawLocation]);

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
  if (location === "/compendium") return <Redirect to="/what-is-the-harvest" />;
  if (location === "/brand-guide" || location === "/brand-development") {
    return <Redirect to="/what-is-the-harvest" />;
  }
  if (location === "/bauhaus" || location === "/bauhaus/") return <Redirect to="/" />;
  if (location.startsWith("/bauhaus/")) {
    const zoneId = location.slice("/bauhaus/".length).split("/")[0];
    return zoneId ? <BauhausZone zoneId={zoneId} /> : <BauhausHome />;
  }
  if (location === "/whats-on") return <WhatsOn />;
  if (location === "/witta-pizza") return <WhatsOn />;
  if (location === "/pizza") return <Redirect to="/witta-pizza" />;
  if (location === "/venue-hire") return <VenueHire />;
  if (location === "/media" || location === "/press") return <Media />;
  if (location === "/enterprises") return <LocalEnterprises />;
  if (location === "/site-plan") return <Redirect to="/what-is-the-harvest" />;
  if (location === "/social") return <Redirect to="/whats-on" />;
  if (location === "/pulse") return <CommunityPulse />;
  if (location === "/logo-story") return <Redirect to="/what-is-the-harvest" />;
  if (location === "/photo-wall" || location.startsWith("/photo-wall/")) return <Redirect to="/whats-on" />;
  if (location === "/witta") return <Redirect to="/what-is-the-harvest" />;
  if (location === "/login") return <Login />;
  if (location === "/account") return <Account />;
  if (location === "/admin") return <AdminDashboard />;
  if (location === "/admin/control-room") return <HarvestControlRoom />;
  if (location === "/admin/media-library") return <MediaLibraryAdmin />;
  if (location === "/admin/rsvps") return <RsvpAdmin />;
  if (location === "/admin/pulse") return <PulseAdmin />;
  if (location === "/admin/feedback") return <EventFeedbackAdmin />;
  if (location === "/components") return <Redirect to="/what-is-the-harvest" />;
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
  if (location === "/stories") return <Works />;
  if (location.startsWith("/stories/")) {
    const slug = location.slice("/stories/".length).split("/")[0];
    return <WorkDetail slug={slug} />;
  }
  if (location === "/get-involved") return <GetInvolved />;
  if (location === "/start" || location === "/start-here") return <StartHere />;
  if (location === "/story") return <Redirect to="/whats-on" />;
  if (location === "/people" || location.startsWith("/people/")) return <Redirect to="/whats-on" />;
  if (location === "/garden-launch" || location === "/june-20") return <Redirect to="/whats-on" />;
  if (location === "/privacy") return <Privacy />;
  if (location === "/launch-redesign") return <Redirect to="/what-is-the-harvest" />;
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
            <Suspense
              fallback={(
                <div
                  className="min-h-screen bg-[#F5F0E8]"
                  role="status"
                  aria-label="Loading page"
                />
              )}
            >
              <Router />
            </Suspense>
          </TooltipProvider>
        </SeasonalProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
