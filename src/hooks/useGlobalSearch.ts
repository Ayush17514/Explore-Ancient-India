import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SearchResult = {
  id: string;
  title: string;
  description: string | null;
  domain: string;
  type: "manuscript" | "site" | "school" | "tribal" | "citation" | "research";
  typeLabel: string;
  period: string | null;
  createdAt: string | null;
};

const TYPE_LABELS: Record<string, string> = {
  manuscript: "Manuscript",
  site: "Architecture Site",
  school: "Philosophical School",
  tribal: "Tribal Record",
  citation: "Citation",
  research: "Research Paper",
};

export function useGlobalSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const pattern = `%${q.trim()}%`;

    try {
      const [manuscripts, sites, schools, tribal, citations, research] = await Promise.all([
        supabase
          .from("manuscripts")
          .select("id, title, description, domain, estimated_period, created_at")
          .eq("status", "approved")
          .or(`title.ilike.${pattern},description.ilike.${pattern}`)
          .limit(8),
        supabase
          .from("architecture_sites")
          .select("id, name, description, region, era, created_at")
          .eq("status", "approved")
          .or(`name.ilike.${pattern},description.ilike.${pattern}`)
          .limit(8),
        supabase
          .from("philosophical_schools")
          .select("id, name, description, period, created_at")
          .eq("status", "approved")
          .or(`name.ilike.${pattern},description.ilike.${pattern}`)
          .limit(8),
        supabase
          .from("tribal_records")
          .select("id, community_name, description, knowledge_type, region, created_at")
          .eq("status", "approved")
          .or(`community_name.ilike.${pattern},description.ilike.${pattern}`)
          .limit(8),
        supabase
          .from("citations")
          .select("id, title, authors, source, domain, created_at")
          .eq("status", "approved")
          .or(`title.ilike.${pattern},authors.ilike.${pattern}`)
          .limit(8),
        supabase
          .from("research_submissions")
          .select("id, paper_title, abstract, domain, created_at")
          .eq("status", "approved")
          .or(`paper_title.ilike.${pattern},abstract.ilike.${pattern}`)
          .limit(8),
      ]);

      const merged: SearchResult[] = [
        ...(manuscripts.data || []).map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          domain: r.domain || "Textual Knowledge",
          type: "manuscript" as const,
          typeLabel: TYPE_LABELS.manuscript,
          period: r.estimated_period,
          createdAt: r.created_at,
        })),
        ...(sites.data || []).map((r) => ({
          id: r.id,
          title: r.name,
          description: r.description,
          domain: "Architecture & Engineering",
          type: "site" as const,
          typeLabel: TYPE_LABELS.site,
          period: r.era,
          createdAt: r.created_at,
        })),
        ...(schools.data || []).map((r) => ({
          id: r.id,
          title: r.name,
          description: r.description,
          domain: "Philosophical Schools",
          type: "school" as const,
          typeLabel: TYPE_LABELS.school,
          period: r.period,
          createdAt: r.created_at,
        })),
        ...(tribal.data || []).map((r) => ({
          id: r.id,
          title: r.community_name,
          description: r.description,
          domain: "Tribal & Oral Traditions",
          type: "tribal" as const,
          typeLabel: TYPE_LABELS.tribal,
          period: r.knowledge_type,
          createdAt: r.created_at,
        })),
        ...(citations.data || []).map((r) => ({
          id: r.id,
          title: r.title,
          description: r.authors,
          domain: r.domain || "Citation",
          type: "citation" as const,
          typeLabel: TYPE_LABELS.citation,
          period: null,
          createdAt: r.created_at,
        })),
        ...(research.data || []).map((r) => ({
          id: r.id,
          title: r.paper_title,
          description: r.abstract,
          domain: r.domain || "Research",
          type: "research" as const,
          typeLabel: TYPE_LABELS.research,
          period: null,
          createdAt: r.created_at,
        })),
      ];

      // Sort: exact title matches first, then partial
      const lowerQ = q.toLowerCase();
      merged.sort((a, b) => {
        const aExact = a.title?.toLowerCase().startsWith(lowerQ) ? 0 : 1;
        const bExact = b.title?.toLowerCase().startsWith(lowerQ) ? 0 : 1;
        return aExact - bExact;
      });

      setResults(merged);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    (q: string) => {
      setQuery(q);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!q || q.trim().length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      debounceRef.current = setTimeout(() => search(q), 300);
    },
    [search]
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setLoading(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  return { results, loading, query, search: debouncedSearch, clearSearch };
}
