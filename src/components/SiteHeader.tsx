import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Globe, Search, LogOut, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "sa", label: "संस्कृतम्" },
  { code: "ta", label: "தமிழ்" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
];

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/knowledge", label: "Knowledge" },
  { to: "/manuscripts", label: "Manuscripts" },
  { to: "/architecture", label: "Architecture" },
  { to: "/research", label: "Research" },
  { to: "/contribute", label: "Contribute" },
  { to: "/about", label: "About" },
];

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Top bar */}
      <div className="border-b border-border bg-primary">
        <div className="container flex h-8 items-center justify-between text-xs text-primary-foreground">
          <span className="font-body">A Civilizational Knowledge Initiative</span>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-primary-foreground hover:text-gold transition-colors">
                  <Globe className="h-3 w-3" />
                  <span>{languages.find(l => l.code === currentLang)?.label}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map(lang => (
                  <DropdownMenuItem key={lang.code} onClick={() => setCurrentLang(lang.code)}>
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-primary">
            <span className="font-heading text-lg font-bold text-primary-foreground">N</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-heading text-lg font-semibold leading-tight text-foreground">Digital Nalanda</h1>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">Knowledge Vault of India</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 text-sm font-body font-medium rounded transition-colors ${
                location.pathname === link.to
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2 text-muted-foreground">
            <Search className="h-4 w-4" />
            <span>Search Archive</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm" className="hidden md:flex gap-2">
                  <User className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">{profile?.full_name || "Account"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <Shield className="h-3 w-3 mr-2" /> Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate("/contribute")}>
                  Contribute
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-3 w-3 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" className="hidden md:flex" onClick={() => navigate("/login")}>
              Research Login
            </Button>
          )}

          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 text-sm font-body font-medium rounded transition-colors ${
                  location.pathname === link.to
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-body font-medium rounded text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center gap-2">
                <Shield className="h-4 w-4" /> Admin
              </Link>
            )}
            <div className="mt-3 flex gap-2 px-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Search className="h-4 w-4 mr-2" /> Search
              </Button>
              {user ? (
                <Button variant="default" size="sm" className="flex-1" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              ) : (
                <Button variant="default" size="sm" className="flex-1" onClick={() => { setMobileOpen(false); navigate("/login"); }}>
                  Login
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
