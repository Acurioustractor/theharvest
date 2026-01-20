import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Leaf, Heart, MapPin, Calendar, Home as HomeIcon, Users, Bed, Building, Store, UserPlus, BookOpen, Mail } from "lucide-react";
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
import UnifiedFooter from "@/components/shared/UnifiedFooter";

interface PublicLayoutProps {
  children: React.ReactNode;
}

// Navigation structure with grouped categories
const navGroups = {
  about: {
    label: "About",
    items: [
      { label: "About The Harvest", href: "/about", icon: Heart, description: "Our story and values" },
      { label: "Our Journey", href: "/journey", icon: MapPin, description: "From nursery to community hub" },
      { label: "Stories", href: "/stories", icon: Users, description: "Voices from our community" },
      { label: "Venue Hire", href: "/venue-hire", icon: Building, description: "Host your event with us" },
    ],
  },
  visit: {
    label: "Visit",
    items: [
      { label: "Plan Your Visit", href: "/visit", icon: MapPin, description: "Hours, directions & what to expect" },
      { label: "What's On", href: "/whats-on", icon: Calendar, description: "Events, workshops & markets" },
      { label: "The Space", href: "/explore", icon: HomeIcon, description: "Explore our buildings & gardens" },
    ],
  },
  witta: {
    label: "About Witta",
    items: [
      { label: "Witta History", href: "/witta", icon: BookOpen, description: "The story of this place" },
      { label: "Accommodation", href: "/accommodation", icon: Bed, description: "Places to stay nearby" },
      { label: "Local Enterprises", href: "/enterprises", icon: Store, description: "Our community partners" },
    ],
  },
  join: {
    label: "Join",
    items: [
      { label: "Membership", href: "/membership", icon: UserPlus, description: "Become part of our community", badge: "Coming Soon" },
      { label: "Journal", href: "/blog", icon: BookOpen, description: "News, recipes & reflections" },
      { label: "Contact", href: "/contact", icon: Mail, description: "Get in touch" },
    ],
  },
};

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
                          {"badge" in item && item.badge && (
                            <span className="ml-auto px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-700 rounded">
                              {item.badge}
                            </span>
                          )}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

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

      {/* Footer */}
      <UnifiedFooter
        currentProject="The Harvest"
        showProjects={true}
        customLinks={[
          { label: "About", href: "/about" },
          { label: "Our Journey", href: "/journey" },
          { label: "Visit", href: "/visit" },
          { label: "What's On", href: "/whats-on" },
          { label: "Membership", href: "/membership" },
          { label: "Contact", href: "/contact" },
        ]}
        contactEmail="hello@theharvestwitta.com.au"
      />
    </div>
  );
}
