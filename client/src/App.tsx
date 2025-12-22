import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import PublicLayout from "./components/PublicLayout";
import HarvestHome from "./pages/HarvestHome";
import Visit from "./pages/Visit";
import WhatsOn from "./pages/WhatsOn";
import VenueHire from "./pages/VenueHire";
import About from "./pages/About";
import Accommodation from "./pages/Accommodation";
import AccommodationDirectory from "./pages/AccommodationDirectory";
import LocalEnterprises from "./pages/LocalEnterprises";
import StrategicAnalysis from "./pages/StrategicAnalysis";
import AdminDashboard from "./pages/AdminDashboard";
import MyBusiness from "./pages/MyBusiness";
import Login from "./pages/Login";
import Account from "./pages/Account";
import PartnerPortal from "./pages/PartnerPortal";
import Proposal from "./pages/Proposal";
import LeaseDraft from "./pages/LeaseDraft";
import Financials from "./pages/Financials";
import Contact from "./pages/Contact";

function Router() {
  return (
    <PublicLayout>
      <Switch>
        {/* Public pages */}
        <Route path="/" component={HarvestHome} />
        <Route path="/visit" component={Visit} />
        <Route path="/whats-on" component={WhatsOn} />
        <Route path="/venue-hire" component={VenueHire} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        
        {/* Explore pages */}
        <Route path="/accommodation" component={Accommodation} />
        <Route path="/accommodation/directory" component={AccommodationDirectory} />
        <Route path="/enterprises" component={LocalEnterprises} />
        
        {/* Strategic / Partner pages */}
        <Route path="/strategic-analysis" component={StrategicAnalysis} />
        <Route path="/partner-portal" component={PartnerPortal} />
        <Route path="/proposal" component={Proposal} />
        <Route path="/lease-draft" component={LeaseDraft} />
        <Route path="/financials" component={Financials} />

        {/* Auth */}
        <Route path="/login" component={Login} />
        <Route path="/account" component={Account} />
        
        {/* Admin / Business pages */}
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/my-business" component={MyBusiness} />
        
        {/* Fallback */}
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
