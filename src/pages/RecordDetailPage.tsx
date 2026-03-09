import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar, MapPin, BookOpen, FileText, Download, Copy, Share2, ArrowLeft,
  Loader2, ExternalLink, Quote,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type RecordType =
  | "manuscripts"
  | "architecture_sites"
  | "philosophical_schools"
  | "tribal_records"
  | "citations"
  | "research_submissions";

const TYPE_DISPLAY: Record<string, { label: string; domain: string }> = {
  manuscripts: { label: "Manuscript", domain: "Textual Knowledge" },
  architecture_sites: { label: "Architecture Site", domain: "Architecture & Engineering" },
  philosophical_schools: { label: "Philosophical School", domain: "Philosophical Schools" },
  tribal_records: { label: "Tribal Record", domain: "Tribal & Oral Traditions" },
  citations: { label: "Citation", domain: "Reference" },
  research_submissions: { label: "Research Paper", domain: "Research" },
};

const TITLE_FIELD: Record<string, string> = {
  manuscripts: "title",
  architecture_sites: "name",
  philosophical_schools: "name",
  tribal_records: "community_name",
  citations: "title",
  research_submissions: "paper_title",
};

function generateCitation(record: any, type: string, format: "apa" | "mla" | "bibtex"): string {
  const title = record[TITLE_FIELD[type]] || "Untitled";
  const year = record.estimated_period || record.era || record.period || record.year || new Date().getFullYear();

  if (format === "apa") {
    return `Digital Nalanda Archive. (${year}). ${title}. Explore Ancient India Knowledge Platform.`;
  }
  if (format === "mla") {
    return `"${title}." Digital Nalanda Archive, Explore Ancient India, ${year}.`;
  }
  return `@misc{doi:explore-${record.id?.slice(0, 8)},\n  title={${title}},\n  year={${year}},\n  publisher={Digital Nalanda Archive}\n}`;
}

const RecordDetailPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [citationFormat, setCitationFormat] = useState<"apa" | "mla" | "bibtex">("apa");

  const recordType = type as RecordType;
  const typeInfo = TYPE_DISPLAY[recordType] || { label: "Record", domain: "Unknown" };

  const { data: record, isLoading, error } = useQuery({
    queryKey: ["record", type, id],
    queryFn: async () => {
      if (!type || !id) throw new Error("Missing parameters");
      const { data, error } = await supabase.from(type as any).select("*").eq("id", id).single();
      if (error) throw error;
      return data as any;
    },
    enabled: !!type && !!id,
  });

  const title = record ? record[TITLE_FIELD[recordType]] || "Untitled" : "";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() =>
      toast({ title: "Copied to clipboard" })
    );
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title, url });
    } else {
      copyToClipboard(url);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !record) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <FileText className="h-12 w-12 text-muted-foreground/40" />
          <h2 className="font-heading text-xl font-semibold text-foreground">Record Not Found</h2>
          <p className="text-sm text-muted-foreground">This record may have been removed or doesn't exist.</p>
          <Button variant="outline" onClick={() => navigate("/knowledge")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Knowledge Archive
          </Button>
        </div>
      </Layout>
    );
  }

  // Build metadata pairs
  const metaFields: [string, string | null][] = [];
  if (record.domain) metaFields.push(["Domain", record.domain]);
  if (record.estimated_period || record.era || record.period) metaFields.push(["Period", record.estimated_period || record.era || record.period]);
  if (record.region || record.location) metaFields.push(["Region", record.region || record.location]);
  if (record.repository_source) metaFields.push(["Repository", record.repository_source]);
  if (record.authors || record.documenter_name || record.founder) metaFields.push(["Author(s)", record.authors || record.documenter_name || record.founder]);
  if (record.affiliation) metaFields.push(["Affiliation", record.affiliation]);
  if (record.tradition) metaFields.push(["Tradition", record.tradition]);
  if (record.architectural_style) metaFields.push(["Architectural Style", record.architectural_style]);
  if (record.knowledge_type) metaFields.push(["Knowledge Type", record.knowledge_type]);
  if (record.citation_type) metaFields.push(["Type", record.citation_type]);
  if (record.doi) metaFields.push(["DOI", record.doi]);
  if (record.url) metaFields.push(["URL", record.url]);
  if (record.source) metaFields.push(["Source", record.source]);
  if (record.year) metaFields.push(["Year", record.year]);
  if (record.core_texts) metaFields.push(["Core Texts", record.core_texts]);
  if (record.material) metaFields.push(["Material", record.material]);
  if (record.script_type) metaFields.push(["Script", record.script_type]);
  if (record.journal) metaFields.push(["Journal", record.journal]);
  if (record.status) metaFields.push(["Status", record.status]);
  if (record.created_at) metaFields.push(["Added", new Date(record.created_at).toLocaleDateString()]);

  const citation = generateCitation(record, recordType, citationFormat);

  return (
    <Layout>
      {/* Header */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-3 w-3" /> Back
          </button>

          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-semibold">
              {typeInfo.label}
            </Badge>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">{typeInfo.domain}</span>
          </div>

          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">{title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-body text-muted-foreground">
            {(record.estimated_period || record.era || record.period) && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {record.estimated_period || record.era || record.period}
              </span>
            )}
            {(record.region || record.location) && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {record.region || record.location}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              {(record.image_url || record.file_url || record.media_url) && (
                <div className="rounded-lg border border-border overflow-hidden bg-card">
                  <img
                    src={record.image_url || record.file_url || record.media_url}
                    alt={title}
                    className="w-full max-h-96 object-contain bg-foreground/5"
                  />
                </div>
              )}

              {/* Description */}
              {(record.description || record.abstract) && (
                <div className="p-6 rounded-lg border border-border bg-card">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Description</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {record.description || record.abstract}
                  </p>
                </div>
              )}

              {/* References */}
              {record.references_data && Array.isArray(record.references_data) && record.references_data.length > 0 && (
                <div className="p-6 rounded-lg border border-border bg-card">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">References</h3>
                  <div className="space-y-2">
                    {record.references_data.map((ref: any, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-secondary rounded text-sm font-body">
                        <Quote className="h-3 w-3 text-gold mt-1 shrink-0" />
                        <span className="text-muted-foreground text-xs">{typeof ref === "string" ? ref : ref.text || JSON.stringify(ref)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File attachments */}
              {record.file_urls && Array.isArray(record.file_urls) && record.file_urls.length > 0 && (
                <div className="p-6 rounded-lg border border-border bg-card">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Attached Files</h3>
                  <div className="space-y-2">
                    {record.file_urls.map((url: string, i: number) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-secondary rounded text-sm font-body hover:bg-secondary/60 transition-colors"
                      >
                        <Download className="h-3 w-3 text-gold shrink-0" />
                        <span className="text-foreground text-xs truncate">File {i + 1}</span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags / Keywords */}
              {((record.tags && record.tags.length > 0) || (record.keywords && record.keywords.length > 0)) && (
                <div className="p-6 rounded-lg border border-border bg-card">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {[...(record.tags || []), ...(record.keywords || [])].map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <div className="p-6 rounded-lg border border-border bg-card space-y-3">
                <h3 className="font-heading text-base font-semibold text-foreground">Actions</h3>
                {(record.file_url || record.media_url) && (
                  <Button variant="outline" size="sm" className="w-full font-body text-xs" asChild>
                    <a href={record.file_url || record.media_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-3 w-3 mr-2" /> Download File
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm" className="w-full font-body text-xs" onClick={handleShare}>
                  <Share2 className="h-3 w-3 mr-2" /> Share Record
                </Button>
              </div>

              {/* Metadata */}
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-heading text-base font-semibold text-foreground mb-3">Record Metadata</h3>
                <dl className="space-y-2 font-body text-xs">
                  {metaFields.map(([label, value]) =>
                    value ? (
                      <div key={label} className="flex justify-between gap-2">
                        <dt className="text-muted-foreground shrink-0">{label}</dt>
                        <dd className="text-foreground font-medium text-right truncate">{value}</dd>
                      </div>
                    ) : null
                  )}
                </dl>
              </div>

              {/* Citation */}
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-heading text-base font-semibold text-foreground mb-3">
                  <BookOpen className="h-4 w-4 inline mr-1.5 text-gold" /> Cite This Record
                </h3>

                <div className="flex gap-1 mb-3">
                  {(["apa", "mla", "bibtex"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setCitationFormat(fmt)}
                      className={`px-2 py-1 rounded text-[10px] uppercase font-semibold tracking-wider transition-colors ${
                        citationFormat === fmt
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>

                <div className="bg-secondary p-3 rounded text-xs font-body text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {citation}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 font-body text-xs"
                  onClick={() => copyToClipboard(citation)}
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy Citation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RecordDetailPage;
