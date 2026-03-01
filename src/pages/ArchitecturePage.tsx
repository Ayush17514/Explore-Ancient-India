import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, BookOpen, Download, ArrowRight } from "lucide-react";
import pillarArch from "@/assets/pillar-architecture.jpg";

const ArchitecturePage = () => {
  return (
    <Layout>
      <section className="py-6 bg-card border-b border-border">
        <div className="container">
          <div className="flex items-center gap-2 text-xs font-body text-muted-foreground mb-3">
            <span>Knowledge Archive</span> <span>/</span> <span>Architecture & Engineering</span> <span>/</span>
            <span className="text-foreground">Brihadeeshwara Temple</span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Brihadeeshwara Temple — Structural Analysis</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-body text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> 1010 CE</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Thanjavur, Tamil Nadu</span>
            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> 95 citations</span>
          </div>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container max-w-4xl">
          <img src={pillarArch} alt="Temple stone carving detail" className="w-full rounded-lg border border-border mb-8 object-cover max-h-96" />

          <div className="prose-like space-y-8">
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Overview</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                The Brihadeeshwara Temple at Thanjavur, built by Rajaraja Chola I in 1010 CE, represents the pinnacle of Chola-era Dravidian architecture. The 66-meter vimana (tower) remains one of the tallest temple structures in India, demonstrating advanced understanding of structural load distribution, granite engineering, and seismic resilience.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Engineering Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Structural System", value: "Corbelled stone construction with interlocking granite blocks — no binding mortar used." },
                  { label: "Foundation", value: "Raft foundation technique distributing 130,000 tons across compacted alluvial soil." },
                  { label: "Capstone", value: "80-ton monolithic granite cupola raised to 66m height via an inclined ramp system spanning 6 km." },
                  { label: "Acoustics", value: "Mandapa columns function as tuned resonators, producing distinct musical notes when struck." },
                ].map((item) => (
                  <div key={item.label} className="p-4 bg-card rounded-lg border border-border">
                    <h4 className="font-heading text-sm font-semibold text-foreground mb-1">{item.label}</h4>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Climate Adaptation Insights</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                The temple's orientation, ventilation corridors, and thermal mass properties demonstrate passive cooling strategies relevant to modern tropical architecture. The use of granite's high thermal inertia creates temperature differentials that drive natural air circulation through the mandapa spaces.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Modern Relevance</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                Studies by IIT Madras (2019) demonstrate that the structural principles used in the Brihadeeshwara Temple — particularly its distributed load systems and seismic damping through interlocking blocks — offer insights applicable to modern earthquake-resistant design. The temple has survived multiple seismic events over 1000+ years.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="font-body text-xs">
                  <Download className="h-3 w-3 mr-1" /> Download Full Analysis (PDF)
                </Button>
                <Button variant="ghost" size="sm" className="font-body text-xs text-primary">
                  View Related Records <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ArchitecturePage;
