import { MessageSquare, Download, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import manuscriptImg from "@/assets/manuscript-sample.jpg";

const ManuscriptPreview = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-14">
          <span className="text-xs font-body font-semibold uppercase tracking-[0.25em] text-gold mb-3 block">
            Digital Manuscript Reader
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Ancient Texts
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            High-resolution manuscript scans with scholarly translations, annotations, and contextual references.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden max-w-5xl mx-auto">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
            <div className="font-body text-sm font-medium text-foreground">
              Isha Upanishad — Palm Leaf Manuscript, c. 800 CE
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-7 text-xs font-body">
                <ZoomIn className="h-3 w-3 mr-1" /> Zoom
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs font-body">
                <Download className="h-3 w-3 mr-1" /> PDF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Manuscript image */}
            <div className="aspect-square lg:aspect-auto bg-foreground/5 p-4 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-border">
              <img
                src={manuscriptImg}
                alt="Ancient palm leaf manuscript with Sanskrit text"
                className="max-w-full max-h-80 object-contain rounded shadow-lg"
              />
            </div>

            {/* Translation panel */}
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-heading text-lg font-semibold text-foreground mb-1">Translation</h4>
                <p className="text-xs font-body text-muted-foreground">English | R. Hume, 1921</p>
              </div>
              <blockquote className="font-body text-sm text-foreground/90 leading-relaxed italic border-l-2 border-gold pl-4 mb-6">
                "All this — whatever exists in this moving world — is enveloped by the Lord. Renounce and enjoy. Do not covet the wealth of any man."
              </blockquote>
              
              <Separator className="my-4" />

              <div className="mb-4">
                <h4 className="font-heading text-sm font-semibold text-foreground mb-2">Annotations</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-secondary rounded text-xs font-body">
                    <span className="font-semibold text-foreground">Verse 1:</span>{" "}
                    <span className="text-muted-foreground">The opening verse establishes the foundational concept of divine immanence (Ishavasyam) — a non-dual ontological claim.</span>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-heading text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gold" /> Scholar Comments
                </h4>
                <div className="p-3 bg-secondary rounded text-xs font-body">
                  <p className="font-semibold text-foreground mb-1">Dr. A. Sharma, JNU</p>
                  <p className="text-muted-foreground">"This manuscript shows paleographic markers consistent with early Devanagari script evolution in the Bihar-Bengal region."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManuscriptPreview;
