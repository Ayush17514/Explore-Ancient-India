import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, Calendar, MapPin, FileText } from "lucide-react";

const categories = [
  "All Domains", "Textual Knowledge", "Scientific Contributions",
  "Architecture & Engineering", "Philosophical Schools",
  "Tribal & Oral Traditions", "Historical Archives",
];

const eras = ["All Periods", "Pre-500 BCE", "500 BCE – 0 CE", "0 – 500 CE", "500 – 1000 CE", "1000 – 1500 CE", "1500 – 1800 CE"];
const regions = ["All Regions", "North India", "South India", "East India", "West India", "Central India", "Pan-Indian"];

const sampleRecords = [
  { title: "Rigveda — Mandala 10, Nasadiya Sukta", domain: "Textual Knowledge", era: "c. 1500 BCE", region: "Pan-Indian", citations: 342 },
  { title: "Sushruta Samhita — Surgical Instruments Classification", domain: "Scientific Contributions", era: "c. 600 BCE", region: "North India", citations: 218 },
  { title: "Brihadeeshwara Temple — Structural Analysis", domain: "Architecture & Engineering", era: "1010 CE", region: "South India", citations: 95 },
  { title: "Nagarjuna's Madhyamaka — Dialectical Foundations", domain: "Philosophical Schools", era: "c. 200 CE", region: "South India", citations: 176 },
  { title: "Bhil Tribal Medicine — Herbal Compendium", domain: "Tribal & Oral Traditions", era: "Oral Tradition", region: "West India", citations: 28 },
  { title: "Chola Maritime Trade Routes — Numismatic Evidence", domain: "Historical Archives", era: "c. 1000 CE", region: "South India", citations: 89 },
  { title: "Arthashastra — Taxation and Governance", domain: "Textual Knowledge", era: "c. 300 BCE", region: "North India", citations: 412 },
  { title: "Jantar Mantar — Astronomical Observation Methods", domain: "Scientific Contributions", era: "1724 CE", region: "North India", citations: 156 },
];

const KnowledgePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All Domains");

  const filteredRecords = sampleRecords.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === "All Domains" || r.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <Layout>
      <section className="py-12 bg-card border-b border-border">
        <div className="container">
          <span className="text-xs font-body font-semibold uppercase tracking-[0.25em] text-gold mb-2 block">Browse & Discover</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Knowledge Archive</h1>
          <p className="font-body text-muted-foreground max-w-2xl">Search across India's civilizational knowledge — filtered by era, region, and domain.</p>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="container">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search knowledge records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-body"
              />
            </div>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-full md:w-56 font-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48 font-body">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                {eras.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48 font-body">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          <div className="mb-4 font-body text-sm text-muted-foreground">
            Showing <span className="text-foreground font-semibold">{filteredRecords.length}</span> records
          </div>
          <div className="space-y-3">
            {filteredRecords.map((record, idx) => (
              <div key={idx} className="p-5 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-[10px] font-body font-semibold uppercase tracking-wider text-gold">{record.domain}</span>
                    <h3 className="font-heading text-base font-semibold text-foreground mt-1">{record.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-body text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {record.era}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {record.region}</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {record.citations} citations</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="font-body text-xs">
                      <FileText className="h-3 w-3 mr-1" /> Cite
                    </Button>
                    <Button size="sm" className="font-body text-xs">View Record</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default KnowledgePage;
