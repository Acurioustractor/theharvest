import { useState, useEffect, FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Heart, MapPin, Calendar, Home as HomeIcon, Users, Building, Store, UserPlus, BookOpen, Mail, Eye, Map, ScrollText, Compass, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
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
import { subscribeNewsletter } from "@/lib/api";

interface PublicLayoutProps {
  children: React.ReactNode;
}

// Navigation structure — minimal, two dropdowns + standalone Compendium
const navGroups = {
  visit: {
    label: "Visit",
    items: [
      { label: "Plan Your Visit", href: "/visit", icon: MapPin, description: "Hours, directions & what to expect" },
      { label: "What's On", href: "/whats-on", icon: Calendar, description: "Events, workshops & markets" },
    ],
  },
  discover: {
    label: "Discover",
    items: [
      { label: "About", href: "/about", icon: Heart, description: "Who we are, in 30 seconds" },
      { label: "Our Story", href: "/story", icon: BookOpen, description: "The space, the plan, the progress" },
      { label: "Witta", href: "/witta", icon: Compass, description: "The story of this place" },
      { label: "Local Enterprises", href: "/enterprises", icon: Store, description: "Our community partners" },
      { label: "Journal", href: "/blog", icon: BookOpen, description: "News, recipes & reflections" },
    ],
  },
};

// Footer link groups
const footerGroups = {
  harvest: {
    label: "The Harvest",
    links: [
      { label: "About", href: "/about" },
      { label: "The Compendium", href: "/compendium" },
      { label: "Our Story", href: "/story" },
      { label: "Site Plan", href: "/site-plan" },
    ],
  },
  visit: {
    label: "Visit",
    links: [
      { label: "Plan Your Visit", href: "/visit" },
      { label: "What's On", href: "/whats-on" },
      { label: "Venue Hire", href: "/venue-hire" },
    ],
  },
  community: {
    label: "Community",
    links: [
      { label: "Witta", href: "/witta" },
      { label: "Local Enterprises", href: "/enterprises" },
      { label: "Membership", href: "/membership" },
      { label: "Stories", href: "/stories" },
      { label: "Journal", href: "/blog" },
    ],
  },
  connect: {
    label: "Connect",
    links: [
      { label: "Get Involved", href: "/get-involved" },
      { label: "Contact", href: "/contact" },
    ],
  },
};

function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const result = await subscribeNewsletter({ email: email.trim(), phone: phone.trim() || undefined, source: "footer" });
      if (result.success) {
        setStatus("success");
        setEmail("");
      } else {
        setErrorMsg(result.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Could not connect. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-stone-800 py-10">
        <div className="container text-center">
          <p className="text-amber-400 font-serif text-lg">You're in. Welcome to The Harvest.</p>
          <p className="text-stone-400 text-sm mt-2">We'll be in touch with stories, events, and ways to get involved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-800 py-10">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h3 className="text-amber-400 font-serif text-xl">Stay close to what's growing</h3>
          <p className="text-stone-400 text-sm leading-relaxed">
            Stories from the land, upcoming gatherings, and ways to be part of something worth building.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-2">
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 rounded-lg bg-stone-700 border border-stone-600 text-stone-200 placeholder:text-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-5 py-2.5 rounded-lg bg-amber-500 text-black font-medium text-sm hover:bg-amber-400 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Join
              </button>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional — for text updates)"
              className="w-full px-4 py-2.5 rounded-lg bg-stone-700 border border-stone-600 text-stone-200 placeholder:text-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </form>
          {status === "error" && (
            <p className="text-red-400 text-xs">{errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [location] = useLocation();
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
    setExpandedGroup(null);
  }, [location]);

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
            <div className="flex items-center cursor-pointer group">
              <img
                src="/images/logo-v1-dark-clean.png"
                alt="The Harvest"
                className={cn(
                  "h-12 w-auto object-contain transition-all",
                  showTransparentNav ? "brightness-0 invert" : ""
                )}
              />
            </div>
          </Link>

          {/* Desktop Nav - Mega Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Home Link */}
            <Link href="/">
              <span
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                  location === "/"
                    ? showTransparentNav
                      ? "bg-white/20 text-white"
                      : "bg-stone-100 text-stone-900"
                    : showTransparentNav
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                )}
              >
                Home
              </span>
            </Link>

            {/* Mega Menu Groups */}
            <NavigationMenu>
              <NavigationMenuList>
                {Object.entries(navGroups).map(([key, group]) => (
                  <NavigationMenuItem key={key}>
                    <NavigationMenuTrigger
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-full transition-colors bg-transparent",
                        showTransparentNav
                          ? "text-white/90 hover:text-white hover:bg-white/10 data-[state=open]:bg-white/20"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-50 data-[state=open]:bg-stone-100"
                      )}
                    >
                      {group.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-1 p-4">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <li key={item.href}>
                              <NavigationMenuLink asChild>
                                <Link href={item.href}>
                                  <span
                                    className={cn(
                                      "flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-stone-50 cursor-pointer group",
                                      location === item.href && "bg-amber-50"
                                    )}
                                  >
                                    <div className={cn(
                                      "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                      location === item.href
                                        ? "bg-amber-500 text-white"
                                        : "bg-stone-100 text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-700"
                                    )}>
                                      <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                      <div className={cn(
                                        "text-sm font-medium flex items-center gap-2",
                                        location === item.href ? "text-amber-700" : "text-stone-900"
                                      )}>
                                        {item.label}
                                        {"badge" in item && item.badge && (
                                          <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-700 rounded">
                                            {item.badge}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-xs text-stone-500 mt-0.5">
                                        {item.description}
                                      </div>
                                    </div>
                                  </span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          );
                        })}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Standalone Compendium Link */}
            <Link href="/compendium">
              <span
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                  location === "/compendium"
                    ? showTransparentNav
                      ? "bg-white/20 text-white"
                      : "bg-stone-100 text-stone-900"
                    : showTransparentNav
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                )}
              >
                The Compendium
              </span>
            </Link>

            {/* CTA Button */}
            <Button
              className={cn(
                "ml-4 font-medium",
                showTransparentNav
                  ? "bg-white text-stone-900 hover:bg-white/90"
                  : "bg-amber-500 text-black hover:bg-amber-600"
              )}
              asChild
            >
              <Link href="/whats-on">What's On</Link>
            </Button>

            {/* User Menu */}
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
                asChild
              >
                <Link href="/contact">Contact Us</Link>
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
        <div className="fixed inset-0 z-40 bg-white pt-20 px-4 lg:hidden animate-in slide-in-from-top-5 fade-in overflow-y-auto">
          <nav className="flex flex-col gap-2 py-4 pb-32">
            {/* Home */}
            <Link href="/">
              <span
                className={cn(
                  "flex items-center gap-3 text-base font-medium py-3 px-4 rounded-lg transition-colors",
                  location === "/"
                    ? "bg-amber-50 text-amber-700"
                    : "text-stone-700 hover:bg-stone-50"
                )}
              >
                <HomeIcon className="h-5 w-5" />
                Home
              </span>
            </Link>

            {/* Grouped Sections */}
            {Object.entries(navGroups).map(([key, group]) => (
              <div key={key} className="border-t border-stone-100 pt-2 mt-2">
                <button
                  onClick={() => setExpandedGroup(expandedGroup === key ? null : key)}
                  className="flex items-center justify-between w-full text-xs uppercase tracking-wider text-stone-400 px-4 py-2"
                >
                  {group.label}
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    expandedGroup === key && "rotate-180"
                  )} />
                </button>
                <div className={cn(
                  "overflow-hidden transition-all",
                  expandedGroup === key ? "max-h-96" : "max-h-0"
                )}>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} href={item.href}>
                        <span
                          className={cn(
                            "flex items-center gap-3 text-base font-medium py-3 px-4 rounded-lg transition-colors",
                            location === item.href
                              ? "bg-amber-50 text-amber-700"
                              : "text-stone-700 hover:bg-stone-50"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Standalone Compendium */}
            <div className="border-t border-stone-100 pt-2 mt-2">
              <Link href="/compendium">
                <span
                  className={cn(
                    "flex items-center gap-3 text-base font-medium py-3 px-4 rounded-lg transition-colors",
                    location === "/compendium"
                      ? "bg-amber-50 text-amber-700"
                      : "text-stone-700 hover:bg-stone-50"
                  )}
                >
                  <ScrollText className="h-5 w-5" />
                  The Compendium
                </span>
              </Link>
            </div>

            {/* CTA */}
            <div className="border-t border-stone-100 pt-4 mt-4">
              <Button
                className="w-full bg-amber-500 text-black hover:bg-amber-600"
                size="lg"
                asChild
              >
                <Link href="/whats-on">What's On</Link>
              </Button>
            </div>

            {/* Auth */}
            {loading ? null : isAuthenticated ? (
              <div className="pt-3 space-y-1">
                <Link href="/account">
                  <span className="block text-base font-medium py-3 px-4 rounded-lg transition-colors text-stone-800 hover:bg-stone-50">
                    Account
                  </span>
                </Link>
                <Link href="/partner-portal">
                  <span className="block text-base font-medium py-3 px-4 rounded-lg transition-colors text-stone-800 hover:bg-stone-50">
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
                variant="outline"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            )}
          </nav>
        </div>
      )}

      <main>{children}</main>

      {/* Newsletter Banner */}
      <FooterNewsletter />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-stone-50 py-12">
        <div className="container">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand column */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex flex-col gap-1">
                <img
                  src="/images/logo-v1-dark-clean.png"
                  alt="The Harvest"
                  className="h-14 w-auto"
                />
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">
                A place to eat, gather, make, and grow on Jinibara Country.
              </p>
              <p className="text-sm text-stone-500">
                <a href="mailto:hello@theharvestwitta.com.au" className="hover:text-stone-800 transition-colors">
                  hello@theharvestwitta.com.au
                </a>
              </p>
            </div>

            {/* Link groups */}
            {Object.entries(footerGroups).map(([key, group]) => (
              <div key={key}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">
                  {group.label}
                </h4>
                <nav className="space-y-2">
                  {group.links.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span className="block text-sm text-stone-600 transition hover:text-stone-900">
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-stone-400">
              We acknowledge the Jinibara people as the traditional custodians of this land.
            </p>
            <p className="text-xs text-stone-400">
              A Curious Tractor project
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
