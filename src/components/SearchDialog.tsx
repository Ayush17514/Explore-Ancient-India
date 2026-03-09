import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, BookOpen, Landmark, Brain, Globe, Quote, X, Loader2 } from "lucide-react";
import { useGlobalSearch, type SearchResult } from "@/hooks/useGlobalSearch";

const TYPE_ICONS: Record<string, any> = {
  manuscript: FileText,
  site: Landmark,
  school: Brain,
  tribal: Globe,
  citation: Quote,
  research: BookOpen,
};

const TYPE_COLORS: Record<string, string> = {
  manuscript: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  site: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  school: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  tribal: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  citation: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  research: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

const SearchDialog = ({ open, onClose }: SearchDialogProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, loading, query, search, clearSearch } = useGlobalSearch();
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(-1);
    } else {
      clearSearch();
    }
  }, [open, clearSearch]);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
        else if (!open) onClose(); // toggle handled by parent
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Arrow key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
      navigateToResult(results[selectedIndex]);
    }
  };

  const navigateToResult = (result: SearchResult) => {
    const typeMap: Record<string, string> = {
      manuscript: "manuscripts",
      site: "architecture_sites",
      school: "philosophical_schools",
      tribal: "tribal_records",
      citation: "citations",
      research: "research_submissions",
    };
    navigate(`/records/${typeMap[result.type]}/${result.id}`);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-x-0 top-[15%] z-[101] mx-auto w-full max-w-2xl px-4 animate-in slide-in-from-top-4 fade-in duration-200">
        <div className="rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center border-b border-border px-4 gap-3">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => search(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search manuscripts, sites, research, citations..."
              className="flex-1 bg-transparent py-4 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            {loading && <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />}
            <button
              onClick={onClose}
              className="shrink-0 p-1 rounded hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {query.length > 0 && results.length === 0 && !loading && (
              <div className="py-12 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Try different keywords or check spelling</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {results.length} result{results.length !== 1 ? "s" : ""} found
                  </span>
                </div>
                {results.map((result, idx) => {
                  const Icon = TYPE_ICONS[result.type] || FileText;
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => navigateToResult(result)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        selectedIndex === idx
                          ? "bg-primary/5 border-l-2 border-primary"
                          : "hover:bg-secondary/50 border-l-2 border-transparent"
                      }`}
                    >
                      <div className={`p-1.5 rounded-md shrink-0 ${TYPE_COLORS[result.type] || ""}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{result.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">
                            {result.typeLabel}
                          </span>
                          {result.period && (
                            <span className="text-[10px] text-muted-foreground">· {result.period}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {query.length === 0 && (
              <div className="py-8 text-center">
                <Search className="h-8 w-8 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground">
                  Search across all knowledge domains
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-2">
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary text-[10px]">↑</kbd>{" "}
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary text-[10px]">↓</kbd> to navigate{" "}
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary text-[10px]">Enter</kbd> to select{" "}
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary text-[10px]">Esc</kbd> to close
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchDialog;
