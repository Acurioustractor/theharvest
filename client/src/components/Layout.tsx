import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Layout({ children }: { children: React.ReactNode }) {
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

  const navItems = [
    { label: "Overview", href: "/" },
    { label: "Vision", href: "/about" },
    { label: "Events & Programming", href: "/whats-on" },
    { label: "Contact", href: "/contact" },
    { label: "Accommodation", href: "/accommodation" },
    { label: "Local Enterprises", href: "/enterprises" },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    setLocation(href);
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-secondary selection:text-secondary-foreground">
      {/* Navigation */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled || location !== "/"
            ? "bg-background/95 backdrop-blur-md border-border py-3 shadow-sm"
            : "bg-transparent py-6"
        )}
      >
        <div className="container flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-xl">
                W
              </div>
              <span className={cn(
                "font-serif font-bold text-xl tracking-tight transition-colors",
                (isScrolled || location !== "/") ? "text-foreground" : "text-white drop-shadow-md"
              )}>
                Witta Analysis
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-secondary",
                  (isScrolled || location !== "/") ? "text-foreground/80" : "text-white/90 hover:text-white"
                )}
              >
                {item.label}
              </button>
            ))}
            <Button 
              variant={(isScrolled || location !== "/") ? "default" : "secondary"}
              size="sm"
              className="font-serif"
            >
              Download Report
            </Button>
            {loading ? null : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                    <Avatar className="h-7 w-7 border">
                      <AvatarFallback className="text-xs font-medium">
                        {(user?.name?.[0] || user?.email?.[0] || "?").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground/80">
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
                variant="outline"
                size="sm"
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
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={(isScrolled || location !== "/") ? "text-foreground" : "text-white"} />
            ) : (
              <Menu className={(isScrolled || location !== "/") ? "text-foreground" : "text-white"} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden animate-in slide-in-from-top-10 fade-in">
          <nav className="flex flex-col gap-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-2xl font-serif font-bold text-foreground flex items-center justify-between border-b border-border pb-4"
              >
                {item.label}
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
            <Button className="w-full mt-4" size="lg">
              Download Full Report
            </Button>
            {loading ? null : isAuthenticated ? (
              <div className="pt-2">
                <Link href="/account">
                  <span className="block text-lg font-medium py-3 px-4 rounded-lg transition-colors text-foreground hover:bg-accent/50">
                    Account
                  </span>
                </Link>
                <Link href="/partner-portal">
                  <span className="block text-lg font-medium py-3 px-4 rounded-lg transition-colors text-foreground hover:bg-accent/50">
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

      <footer className="bg-primary text-primary-foreground py-12 mt-20">
        <div className="container grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">Witta Social Enterprise Analysis</h3>
            <p className="text-primary-foreground/80 max-w-xs">
              A strategic examination of the social enterprise ecosystem in the Sunshine Coast Hinterland.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-sm opacity-70">Sections</h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <button 
                    onClick={() => handleNavClick(item.href)}
                    className="text-primary-foreground/80 hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-sm opacity-70">Contact</h4>
            <p className="text-primary-foreground/80">
              Prepared for strategic planning and community development purposes.
            </p>
            <div className="mt-6 text-sm opacity-50">
              © 2025 Witta Analysis Project
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
