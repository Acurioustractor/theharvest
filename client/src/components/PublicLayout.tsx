import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { cn } from "@/lib/utils";
import UnifiedFooter from "@/components/shared/UnifiedFooter";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, loading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const mainNavItems = [
    { label: "Overview", href: "/" },
    { label: "Vision", href: "/about" },
    { label: "Events & Programming", href: "/whats-on" },
    { label: "Contact", href: "/contact" },
  ];

  const exploreItems = [
    { label: "Accommodation", href: "/accommodation" },
    { label: "Local Enterprises", href: "/enterprises" },
    { label: "Venue Hire", href: "/venue-hire" },
  ];

  const isHomePage = location === "/";
  const showTransparentNav = isHomePage && !isScrolled;

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Navigation */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          showTransparentNav
            ? "bg-transparent py-4"
            : "bg-white/95 backdrop-blur-md border-b border-stone-200 py-3 shadow-sm"
        )}
      >
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                  showTransparentNav ? "bg-white/20 backdrop-blur" : "bg-amber-500"
                )}
              >
                <Leaf
                  className={cn(
                    "h-5 w-5",
                    showTransparentNav ? "text-white" : "text-black"
                  )}
                />
              </div>
              <div>
                <span
                  className={cn(
                    "font-serif font-bold text-xl tracking-tight block leading-tight transition-colors",
                    showTransparentNav ? "text-white drop-shadow-md" : "text-stone-800"
                  )}
                >
                  The Harvest
                </span>
                <span
                  className={cn(
                    "text-xs tracking-wider uppercase transition-colors",
                    showTransparentNav ? "text-white/70" : "text-stone-500"
                  )}
                >
                  Witta
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <span
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                    location === item.href
                      ? showTransparentNav
                        ? "bg-white/20 text-white"
                        : "bg-stone-100 text-stone-900"
                      : showTransparentNav
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ))}

            {/* Explore Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-1",
                    showTransparentNav
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                  )}
                >
                  Explore
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {exploreItems.map((item) => (
                  <DropdownMenuItem key={item.label} asChild>
                    <Link href={item.href}>
                      <span className="w-full">{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link href="/strategic-analysis">
                    <span className="w-full text-stone-500">Strategic Analysis</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              className={cn(
                "ml-4 font-medium",
                showTransparentNav
                  ? "bg-white text-stone-900 hover:bg-white/90"
                  : "bg-amber-500 text-black hover:bg-amber-600"
              )}
              asChild
            >
              <Link href="/whats-on">See What's On</Link>
            </Button>

            {loading ? null : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-3 flex items-center gap-2 rounded-full border border-stone-200 bg-white/90 px-2 py-1 text-sm shadow-sm hover:bg-white">
                    <Avatar className="h-7 w-7 border">
                      <AvatarFallback className="text-xs font-medium">
                        {(user?.name?.[0] || user?.email?.[0] || "?").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden xl:inline text-stone-700">
                      {user?.name || user?.email || "Account"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem asChild>
                    <Link href="/partner-portal">
                      <span className="w-full">Partner Portal</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      <span className="w-full">Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant={showTransparentNav ? "secondary" : "outline"}
                className="ml-3"
                onClick={() => {
                  window.location.href = getLoginUrl();
                }}
              >
                Sign in
              </Button>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X
                className={cn(
                  "h-6 w-6",
                  showTransparentNav ? "text-white" : "text-stone-800"
                )}
              />
            ) : (
              <Menu
                className={cn(
                  "h-6 w-6",
                  showTransparentNav ? "text-white" : "text-stone-800"
                )}
              />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 px-6 lg:hidden animate-in slide-in-from-top-5 fade-in">
          <nav className="flex flex-col gap-2 py-6">
            {mainNavItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <span
                  className={cn(
                    "block text-lg font-medium py-3 px-4 rounded-lg transition-colors",
                    location === item.href
                      ? "bg-amber-50 text-amber-700"
                      : "text-stone-700 hover:bg-stone-50"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ))}

            <div className="border-t border-stone-200 my-4 pt-4">
              <span className="text-xs uppercase tracking-wider text-stone-400 px-4">
                Explore
              </span>
              {exploreItems.map((item) => (
                <Link key={item.label} href={item.href}>
                  <span className="block text-lg font-medium py-3 px-4 text-stone-700 hover:bg-stone-50 rounded-lg">
                    {item.label}
                  </span>
                </Link>
              ))}
              <Link href="/strategic-analysis">
                <span className="block text-lg font-medium py-3 px-4 text-stone-500 hover:bg-stone-50 rounded-lg">
                  Strategic Analysis
                </span>
              </Link>
            </div>

            <Button
              className="mt-4 w-full bg-amber-500 text-black hover:bg-amber-600"
              size="lg"
              asChild
            >
              <Link href="/whats-on">See What's On</Link>
            </Button>
            {loading ? null : isAuthenticated ? (
              <div className="pt-3">
                <Link href="/account">
                  <span className="block text-lg font-medium py-3 px-4 rounded-lg transition-colors text-stone-800 hover:bg-stone-50">
                    Account
                  </span>
                </Link>
                <Link href="/partner-portal">
                  <span className="block text-lg font-medium py-3 px-4 rounded-lg transition-colors text-stone-800 hover:bg-stone-50">
                    Partner Portal
                  </span>
                </Link>
                <Button variant="outline" className="w-full mt-2" onClick={logout}>
                  Sign out
                </Button>
              </div>
            ) : (
              <Button
                className="w-full mt-2"
                onClick={() => {
                  window.location.href = getLoginUrl();
                }}
              >
                Sign in
              </Button>
            )}
          </nav>
        </div>
      )}

      <main>{children}</main>

      {/* Unified Footer */}
      <UnifiedFooter
        currentProject="The Harvest"
        showProjects={true}
        customLinks={[
          { label: "Visit", href: "/visit" },
          { label: "What's On", href: "/whats-on" },
          { label: "Venue Hire", href: "/venue-hire" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ]}
        contactEmail="hello@theharvestwitta.com.au"
      />
    </div>
  );
}
