import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Upload } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/40" />
      
      {/* Gold accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-block border-l-2 border-gold pl-4">
            <span className="text-xs font-body font-semibold uppercase tracking-[0.25em] text-gold">
              Civilizational Knowledge Archive
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] text-background mb-6">
            Preserving India's Civilizational Intelligence for the Future
          </h1>
          <p className="font-body text-lg md:text-xl text-background/80 mb-10 max-w-2xl leading-relaxed">
            Digitizing ancient knowledge systems — from Vedic texts to tribal traditions — for researchers, institutions, and citizens.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-gold text-accent-foreground hover:bg-gold-light font-body font-semibold text-base px-8">
              <Link to="/knowledge">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Knowledge
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-background/30 text-background hover:bg-background/10 font-body text-base px-8">
              <Link to="/research">
                <GraduationCap className="mr-2 h-5 w-5" />
                Research Access
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-background/30 text-background hover:bg-background/10 font-body text-base px-8">
              <Link to="/contribute">
                <Upload className="mr-2 h-5 w-5" />
                Contribute Archive
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
