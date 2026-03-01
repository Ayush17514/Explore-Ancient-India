import { Building2 } from "lucide-react";

const partners = [
  "Ministry of Culture",
  "National Archives of India",
  "Archaeological Survey of India",
  "Central Sanskrit University",
  "IIT Delhi",
  "IIT Madras",
];

const CollaborationStrip = () => {
  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container text-center">
        <span className="text-xs font-body font-semibold uppercase tracking-[0.25em] text-gold mb-3 block">
          Institutional Partners
        </span>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
          Built in Collaboration
        </h2>
        <p className="font-body text-sm text-muted-foreground mb-10 max-w-xl mx-auto">
          Built in collaboration with academic and heritage institutions across India.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {partners.map((partner) => (
            <div
              key={partner}
              className="flex items-center gap-2 px-5 py-3 bg-background rounded-lg border border-border"
            >
              <Building2 className="h-5 w-5 text-muted-foreground shrink-0" />
              <span className="font-body text-sm font-medium text-foreground whitespace-nowrap">{partner}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollaborationStrip;
