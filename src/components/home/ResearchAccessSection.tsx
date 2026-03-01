import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code, Download, FileText, Key } from "lucide-react";

const features = [
  {
    icon: Code,
    title: "API Access",
    description: "RESTful and GraphQL endpoints for programmatic access to the entire knowledge corpus.",
  },
  {
    icon: Download,
    title: "Dataset Downloads",
    description: "Structured CSV, JSON, and XML exports for manuscripts, artifacts, and metadata.",
  },
  {
    icon: FileText,
    title: "Citation Export",
    description: "APA, MLA, Chicago, and BibTeX formatted citations for all records.",
  },
  {
    icon: Key,
    title: "AI Training Corpus",
    description: "Curated datasets formatted for NLP and machine learning research on Indian knowledge systems.",
  },
];

const ResearchAccessSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-body font-semibold uppercase tracking-[0.25em] text-gold mb-3 block">
              For Researchers & Institutions
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Research Access Portal
            </h2>
            <p className="font-body text-muted-foreground mb-8 leading-relaxed">
              Access India's civilizational knowledge programmatically. Designed for scholars, universities, and AI research labs.
            </p>
            <div className="flex gap-3">
              <Button asChild size="lg" className="font-body">
                <Link to="/research">Access Portal</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-body">
                <Link to="/research">View API Docs</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 bg-card rounded-lg border border-border">
                <feature.icon className="h-8 w-8 text-gold mb-3" />
                <h3 className="font-heading text-base font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchAccessSection;
