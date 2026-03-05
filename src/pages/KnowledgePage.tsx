import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, BookOpen, Calendar, MapPin, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  useSupportedLanguages,
  useTranslations,
  useLanguageState,
} from "@/hooks/useTranslation";

/* ---------------------- */
/* Domain Categories */
/* ---------------------- */

const categories = [
  "All Domains",
  "Textual Knowledge",
  "Scientific Contributions",
  "Architecture & Engineering",
  "Philosophical Schools",
  "Tribal & Oral Traditions",
  "Historical Archives",
];

/* ---------------------- */
/* Types */
/* ---------------------- */

type KnowledgeRecord = {
  id: string;
  title: string;
  description?: string | null;
  domain: string;
  estimated_period?: string | null;
  created_at?: string;
  status?: string;
  _entity:
    | "manuscripts"
    | "architecture_sites"
    | "philosophical_schools"
    | "tribal_records";
  _region?: string | null;
};

/* ---------------------- */
/* Page Component */
/* ---------------------- */

const KnowledgePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All Domains");

  const { language, setLanguage, getField } = useLanguageState();
  const { data: languages } = useSupportedLanguages();

  /* ---------------------- */
  /* Fetch manuscripts */
  /* ---------------------- */

  const { data: manuscripts, isLoading: loadingManuscripts } = useQuery({
    queryKey: ["knowledge-manuscripts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("manuscripts")
        .select(
          "id,title,description,domain,estimated_period,status,created_at"
        )
        .eq("status", "approved");

      return (
        data?.map(
          (r) =>
            ({
              ...r,
              _entity: "manuscripts",
              _region: "Pan-Indian",
            } as KnowledgeRecord)
        ) || []
      );
    },
  });

  /* ---------------------- */
  /* Fetch architecture sites */
  /* ---------------------- */

  const { data: sites } = useQuery({
    queryKey: ["knowledge-sites"],
    queryFn: async () => {
      const { data } = await supabase
        .from("architecture_sites")
        .select("id,name,region,era,description,status,created_at")
        .eq("status", "approved");

      return (
        data?.map(
          (r) =>
            ({
              id: r.id,
              title: r.name,
              description: r.description,
              domain: "Architecture & Engineering",
              estimated_period: r.era,
              status: r.status,
              created_at: r.created_at,
              _entity: "architecture_sites",
              _region: r.region || "Pan-Indian",
            } as KnowledgeRecord)
        ) || []
      );
    },
  });

  /* ---------------------- */
  /* Fetch philosophical schools */
  /* ---------------------- */

  const { data: schools } = useQuery({
    queryKey: ["knowledge-schools"],
    queryFn: async () => {
      const { data } = await supabase
        .from("philosophical_schools")
        .select("id,name,period,description,status,created_at")
        .eq("status", "approved");

      return (
        data?.map(
          (r) =>
            ({
              id: r.id,
              title: r.name,
              description: r.description,
              domain: "Philosophical Schools",
              estimated_period: r.period,
              status: r.status,
              created_at: r.created_at,
              _entity: "philosophical_schools",
              _region: "Pan-Indian",
            } as KnowledgeRecord)
        ) || []
      );
    },
  });

  /* ---------------------- */
  /* Fetch tribal knowledge */
  /* ---------------------- */

  const { data: tribal } = useQuery({
    queryKey: ["knowledge-tribal"],
    queryFn: async () => {
      const { data } = await supabase
        .from("tribal_records")
        .select(
          "id,community_name,region,knowledge_type,description,status,created_at"
        )
        .eq("status", "approved");

      return (
        data?.map(
          (r) =>
            ({
              id: r.id,
              title: r.community_name,
              description: r.description,
              domain: "Tribal & Oral Traditions",
              estimated_period: "Oral Tradition",
              status: r.status,
              created_at: r.created_at,
              _entity: "tribal_records",
              _region: r.region || "Pan-Indian",
            } as KnowledgeRecord)
        ) || []
      );
    },
  });

  /* ---------------------- */
  /* Merge all records */
  /* ---------------------- */

  const allRecords: KnowledgeRecord[] = useMemo(() => {
    return [
      ...(manuscripts || []),
      ...(sites || []),
      ...(schools || []),
      ...(tribal || []),
    ];
  }, [manuscripts, sites, schools, tribal]);

  /* ---------------------- */
  /* Filter */
  /* ---------------------- */

  const filteredRecords = useMemo(() => {
    return allRecords.filter((r) => {
      const matchesSearch = r.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesDomain =
        selectedDomain === "All Domains" || r.domain === selectedDomain;

      return matchesSearch && matchesDomain;
    });
  }, [allRecords, searchQuery, selectedDomain]);

  /* ---------------------- */
  /* Translation IDs */
  /* ---------------------- */

  const manuscriptIds = filteredRecords
    .filter((r) => r._entity === "manuscripts")
    .map((r) => r.id);

  const siteIds = filteredRecords
    .filter((r) => r._entity === "architecture_sites")
    .map((r) => r.id);

  const schoolIds = filteredRecords
    .filter((r) => r._entity === "philosophical_schools")
    .map((r) => r.id);

  const tribalIds = filteredRecords
    .filter((r) => r._entity === "tribal_records")
    .map((r) => r.id);

  const { data: mTrans } = useTranslations(
    "manuscripts",
    manuscriptIds,
    language
  );
  const { data: sTrans } = useTranslations(
    "architecture_sites",
    siteIds,
    language
  );
  const { data: pTrans } = useTranslations(
    "philosophical_schools",
    schoolIds,
    language
  );
  const { data: tTrans } = useTranslations(
    "tribal_records",
    tribalIds,
    language
  );

  const transMap = {
    manuscripts: mTrans,
    architecture_sites: sTrans,
    philosophical_schools: pTrans,
    tribal_records: tTrans,
  };

  /* ---------------------- */
  /* UI */
  /* ---------------------- */

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Browse & Discover
            </span>

            {languages && (
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-36 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.native_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Knowledge Archive
          </h1>

          <p className="text-muted-foreground max-w-2xl">
            Search across India's civilizational knowledge — filtered by era,
            region, and domain.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search knowledge records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Result Count */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredRecords.length}
            </span>{" "}
            records
          </div>

          {/* Records */}
          <div className="space-y-3">
            {filteredRecords.map((record) => {
              const trans = transMap[record._entity];

              const title =
                getField(trans, record.id, "title", record.title) ||
                getField(trans, record.id, "name", record.title) ||
                getField(
                  trans,
                  record.id,
                  "community_name",
                  record.title
                );

              const desc = getField(
                trans,
                record.id,
                "description",
                record.description || ""
              );

              return (
                <div
                  key={record.id}
                  className="p-5 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-3">
                    <div className="flex-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">
                        {record.domain}
                      </span>

                      <h3 className="text-base font-semibold mt-1">{title}</h3>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {record.estimated_period || "—"}
                        </span>

                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {record._region}
                        </span>
                      </div>

                      {desc && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {desc}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-3 w-3 mr-1" />
                        Cite
                      </Button>

                      <Button size="sm">View Record</Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredRecords.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>
                  No approved records found. Content will appear here once
                  approved by moderators.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default KnowledgePage;