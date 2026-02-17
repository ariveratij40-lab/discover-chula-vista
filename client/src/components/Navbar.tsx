import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/restaurants", labelEn: "Restaurants", labelEs: "Restaurantes" },
    { href: "/events", labelEn: "Events", labelEs: "Eventos" },
    { href: "/experiences", labelEn: "Experiences", labelEs: "Experiencias" },
    { href: "/map", labelEn: "Map", labelEs: "Mapa" },
    { href: "/amenities", labelEn: "Amenities", labelEs: "Amenidades" },
    { href: "/business/dashboard", labelEn: "For Business", labelEs: "Para Negocios" },
  ];

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity">
            <MapPin className="w-6 h-6" />
            <span className="hidden sm:inline">Discover Chula Vista</span>
            <span className="sm:hidden">DCV</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-foreground hover:text-primary transition-colors font-medium">
                {t(link.labelEn, link.labelEs)}
              </Link>
            ))}
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(link.labelEn, link.labelEs)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
