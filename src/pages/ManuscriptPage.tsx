import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, BookOpen, Calendar, MapPin, FileText, MessageSquare } from "lucide-react";
import manuscriptImg from "@/assets/manuscript-sample.jpg";

const ManuscriptPage = () => {
  return (
    <Layout>
      <section className="py-6 bg-card border-b border-border">
        <div className="container">
          <div className="flex items-center gap-2 text-xs font-body text-muted-foreground mb-3">
            <span>Knowledge Archive</span> <span>/</span> <span>Textual Knowledge</span> <span>/</span>
            <span className="text-foreground">Isha Upanishad Manuscript</span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Isha Upanishad — Palm Leaf Manuscript</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-body text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> c. 800 CE</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Bihar, Eastern India</span>
            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> 128 citations</span>
            <span className="inline-block px-2 py-0.5 bg-gold/10 text-gold text-[10px] font-semibold uppercase tracking-wider rounded">Verified Source</span>
          </div>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image viewer */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
                  <span className="font-body text-xs text-muted-foreground">Folio 1 of 18</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ChevronRight className="h-4 w-4" /></Button>
                    <Separator orientation="vertical" className="h-4 mx-1" />
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ZoomIn className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ZoomOut className="h-4 w-4" /></Button>
                    <Separator orientation="vertical" className="h-4 mx-1" />
                    <Button variant="ghost" size="sm" className="h-7 text-xs font-body"><Download className="h-3 w-3 mr-1" /> PDF</Button>
                  </div>
                </div>
                <div className="bg-foreground/5 p-8 flex items-center justify-center min-h-[400px]">
                  <img src={manuscriptImg} alt="Isha Upanishad palm leaf manuscript" className="max-w-full max-h-96 object-contain rounded shadow-xl" />
                </div>
              </div>

              {/* Annotations */}
              <div className="mt-6 p-6 rounded-lg border border-border bg-card">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Annotations & Commentary</h3>
                <div className="space-y-3">
                  {[
                    { verse: "Verse 1 (Ishavasyam)", note: "Opening invocation establishing divine pervasion of the cosmos. Paleographic analysis indicates a transitional Siddhamatrika-Devanagari script." },
                    { verse: "Verse 6 (Yas tu sarvani)", note: "Describes the non-dual realization: one who sees all beings in the Self. The manuscript shows a marginal gloss in a later hand." },
                    { verse: "Verse 15 (Hiranmayena)", note: "The 'golden disc' metaphor for maya. Notable variant reading compared to the Kashmir recension." },
                  ].map((a, i) => (
                    <div key={i} className="p-4 bg-secondary rounded">
                      <p className="font-body text-sm font-semibold text-foreground mb-1">{a.verse}</p>
                      <p className="font-body text-xs text-muted-foreground leading-relaxed">{a.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Translation */}
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Translation</h3>
                <p className="text-xs font-body text-muted-foreground mb-3">English | R. Hume, Oxford, 1921</p>
                <blockquote className="font-body text-sm text-foreground/90 italic border-l-2 border-gold pl-4 leading-relaxed">
                  "All this — whatever exists in this moving world — is enveloped by the Lord. Renounce and enjoy. Do not covet the wealth of any man."
                </blockquote>
              </div>

              {/* Metadata */}
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-heading text-base font-semibold text-foreground mb-3">Record Metadata</h3>
                <dl className="space-y-2 font-body text-xs">
                  {[
                    ["Classification", "Textual Knowledge / Upanishads"],
                    ["Language", "Sanskrit (Devanagari)"],
                    ["Material", "Palm Leaf"],
                    ["Dimensions", "32 × 5.5 cm"],
                    ["Folios", "18"],
                    ["Repository", "National Archives of India"],
                    ["Accession No.", "NAI-MS-1842-UPN"],
                    ["Digitized", "2024"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="text-foreground font-medium text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Citations */}
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-heading text-base font-semibold text-foreground mb-3">Cite This Record</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-wider text-gold font-semibold mb-1">APA</p>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed bg-secondary p-2 rounded">
                      Digital Nalanda Archive. (2024). <em>Isha Upanishad: Palm Leaf Manuscript</em> (NAI-MS-1842-UPN). National Archives of India.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full font-body text-xs">
                    <FileText className="h-3 w-3 mr-1" /> Export Citation
                  </Button>
                </div>
              </div>

              {/* Scholar Comments */}
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-heading text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gold" /> Scholar Comments
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-secondary rounded">
                    <p className="font-body text-xs font-semibold text-foreground">Dr. A. Sharma, JNU</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">"Paleographic markers place this in the early Pala period."</p>
                  </div>
                  <div className="p-3 bg-secondary rounded">
                    <p className="font-body text-xs font-semibold text-foreground">Prof. M. Raghavan, UoM</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">"The variant readings in Verse 15 are significant for textual criticism."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ManuscriptPage;
