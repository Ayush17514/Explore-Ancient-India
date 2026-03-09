import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Database, Download, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";

const AISearchSection = () => {
  const [inputValue, setInputValue] = useState("");
  const { results, loading, search } = useGlobalSearch();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(inputValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    search(e.target.value);
  };

  const TYPE_MAP: Record<string, string> = {
    manuscript: "manuscripts",
    site: "architecture_sites",
    school: "philosophical_schools",
    tribal: "tribal_records",
    citation: "citations",
    research: "research_submissions",
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
            Query India's knowledge archives using natural language. Our search engine indexes texts, artifacts, and scholarly works across all domains.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative mb-8">
            <div className="flex items-center bg-background rounded-lg border-2 border-border focus-within:border-primary transition-colors">
              <Search className="h-5 w-5 text-muted-foreground ml-4" />
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Search: ancient Indian water management, Vedic mathematics, temple architecture..."
                className="flex-1 bg-transparent px-4 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {loading && <Loader2 className="h-4 w-4 text-muted-foreground animate-spin mr-2" />}
              <Button type="submit" size="sm" className="mr-2 font-body">
                Search
              </Button>
            </div>
          </form>

          {results.length > 0 && (
            <div className="space-y-4 animate-fade-up">
              <div className="flex items-center justify-between mb-2">
                <p className="font-body text-sm text-muted-foreground">
                  <span className="text-foreground font-semibold">{results.length} result{results.length !== 1 ? "s" : ""}</span> across knowledge domains
                </p>
              </div>

              {results.slice(0, 5).map((result) => (
                <div key={`${result.type}-${result.id}`} className="p-5 bg-background rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="inline-block text-xs font-body font-semibold text-gold uppercase tracking-wider mb-1">
                        {result.typeLabel}
                      </span>
                      <h4 className="font-heading text-base font-semibold text-foreground mb-1">
                        {result.title}
                      </h4>
                      {result.description && (
                        <p className="font-body text-xs text-muted-foreground flex items-center gap-1 line-clamp-1">
                          <FileText className="h-3 w-3 shrink-0" /> {result.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {result.period && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground font-body mb-1">
                          <BookOpen className="h-3 w-3" /> {result.period}
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 font-body"
                        onClick={() => navigate(`/records/${TYPE_MAP[result.type]}/${result.id}`)}
                      >
                        <Database className="h-3 w-3 mr-1" /> View Record
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {results.length > 5 && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-body text-xs"
                    onClick={() => navigate("/knowledge")}
                  >
                    View all {results.length} results in Knowledge Archive
                  </Button>
                </div>
              )}
            </div>
          )}

          {inputValue.length >= 2 && results.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground animate-fade-up">
              <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No results found for "{inputValue}"</p>
              <p className="text-xs mt-1">Try different keywords</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AISearchSection;
