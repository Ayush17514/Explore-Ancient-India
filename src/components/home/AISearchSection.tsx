import { useState } from "react";
import { Search, FileText, Database, Download, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockResults = [
  {
    category: "Architecture & Engineering",
    title: "Stepwell Systems of Rajasthan: Design and Hydrology",
    source: "Archaeological Survey of India, Report 342-B",
    citations: 47,
  },
  {
    category: "Textual Knowledge",
    title: "Arthashastra Chapter 2.6: Water Management and Irrigation",
    source: "Kautilya's Arthashastra, R. Shamasastry Translation, 1915",
    citations: 128,
  },
  {
    category: "Scientific Contributions",
    title: "Ancient Indian Hydraulic Engineering: Ahar-Pyne System of Bihar",
    source: "Indian Journal of History of Science, Vol. 38(2)",
    citations: 31,
  },
];

const AISearchSection = () => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  return (
    <section className="py-20 bg-card border-y border-border">
      <div className="container">
        <div className="text-center mb-10">
          <span className="text-xs font-body font-semibold uppercase tracking-[0.25em] text-gold mb-3 block">
            AI-Powered Discovery
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Intelligent Knowledge Search
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Query India's knowledge archives using natural language. Our AI engine indexes texts, artifacts, and scholarly works.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative mb-8">
            <div className="flex items-center bg-background rounded-lg border-2 border-border focus-within:border-primary transition-colors">
              <Search className="h-5 w-5 text-muted-foreground ml-4" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask: Show me ancient Indian water management systems relevant to Rajasthan climate."
                className="flex-1 bg-transparent px-4 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <Button type="submit" size="sm" className="mr-2 font-body">
                Search
              </Button>
            </div>
          </form>

          {showResults && (
            <div className="space-y-4 animate-fade-up">
              <div className="flex items-center justify-between mb-2">
                <p className="font-body text-sm text-muted-foreground">
                  <span className="text-foreground font-semibold">3 results</span> across knowledge domains
                </p>
                <Button variant="outline" size="sm" className="font-body text-xs gap-1">
                  <Download className="h-3 w-3" /> Export Dataset
                </Button>
              </div>

              {mockResults.map((result, idx) => (
                <div key={idx} className="p-5 bg-background rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="inline-block text-xs font-body font-semibold text-gold uppercase tracking-wider mb-1">
                        {result.category}
                      </span>
                      <h4 className="font-heading text-base font-semibold text-foreground mb-1">
                        {result.title}
                      </h4>
                      <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {result.source}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                        <BookOpen className="h-3 w-3" /> {result.citations} citations
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs mt-1 h-7 font-body">
                        <Database className="h-3 w-3 mr-1" /> View Record
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AISearchSection;
