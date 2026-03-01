import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import pillarTexts from "@/assets/pillar-texts.jpg";
import pillarScience from "@/assets/pillar-science.jpg";
import pillarArchitecture from "@/assets/pillar-architecture.jpg";
import pillarPhilosophy from "@/assets/pillar-philosophy.jpg";
import pillarTribal from "@/assets/pillar-tribal.jpg";
import pillarHistory from "@/assets/pillar-history.jpg";

const pillars = [
  {
    title: "Textual Knowledge",
    description: "Vedas, Upanishads, Arthashastra, Ayurveda texts, epigraphic inscriptions, and literary works spanning millennia of Indian intellectual tradition.",
    image: pillarTexts,
    delay: "delay-100",
  },
  {
    title: "Scientific Contributions",
    description: "The invention of zero, advances in metallurgy, astronomical observations, hydraulic engineering, and mathematical frameworks from ancient India.",
    image: pillarScience,
    delay: "delay-200",
  },
  {
    title: "Architecture & Engineering",
    description: "Temple architecture, stepwells, fortifications, urban planning principles, and structural engineering marvels of ancient Indian civilizations.",
    image: pillarArchitecture,
    delay: "delay-300",
  },
  {
    title: "Philosophical Schools",
    description: "Nyaya, Vedanta, Samkhya, Buddhist and Jain philosophical systems — logical frameworks and epistemological traditions.",
    image: pillarPhilosophy,
    delay: "delay-400",
  },
  {
    title: "Tribal & Oral Traditions",
    description: "Indigenous folk songs, tribal medicine systems, textile crafts, oral histories, and the living knowledge of India's diverse communities.",
    image: pillarTribal,
    delay: "delay-500",
  },
  {
    title: "Historical Archives",
    description: "Dynastic records, ancient trade routes, numismatic collections, archaeological artifacts, and diplomatic correspondences.",
    image: pillarHistory,
    delay: "delay-600",
  },
];

const KnowledgePillars = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-14">
          <span className="text-xs font-body font-semibold uppercase tracking-[0.25em] text-gold mb-3 block">
            Six Domains of Knowledge
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Knowledge Pillars
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            India's civilizational knowledge organized into structured, research-ready domains for exploration and study.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className={`group rounded-lg overflow-hidden border border-border bg-card hover:shadow-lg transition-all duration-300 animate-fade-up ${pillar.delay}`}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {pillar.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                  {pillar.description}
                </p>
                <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary font-body p-0 h-auto">
                  <Link to="/knowledge" className="flex items-center gap-1">
                    Explore <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KnowledgePillars;
