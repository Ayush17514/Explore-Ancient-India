import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, BookOpen, FileText, Users, Quote } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ContributePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Manuscript form
  const [mTitle, setMTitle] = useState("");
  const [mLang, setMLang] = useState("");
  const [mPeriod, setMPeriod] = useState("");
  const [mSource, setMSource] = useState("");
  const [mDesc, setMDesc] = useState("");

  // Research form
  const [rTitle, setRTitle] = useState("");
  const [rAuthors, setRAuthors] = useState("");
  const [rAffiliation, setRAffiliation] = useState("");
  const [rDomain, setRDomain] = useState("");
  const [rAbstract, setRAbstract] = useState("");

  // Tribal form
  const [tCommunity, setTCommunity] = useState("");
  const [tRegion, setTRegion] = useState("");
  const [tType, setTType] = useState("");
  const [tDocumenter, setTDocumenter] = useState("");
  const [tDesc, setTDesc] = useState("");

  // Citation form
  const [cTitle, setCTitle] = useState("");
  const [cAuthors, setCAuthors] = useState("");
  const [cSource, setCSource] = useState("");
  const [cYear, setCYear] = useState("");
  const [cDoi, setCDoi] = useState("");
  const [cUrl, setCUrl] = useState("");
  const [cType, setCType] = useState("article");
  const [cDomain, setCDomain] = useState("");

  const submitManuscript = async () => {
    if (!mTitle.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setLoading(true);
    const { error } = await supabase.from("manuscripts").insert({ title: mTitle.trim(), description: mDesc, estimated_period: mPeriod, repository_source: mSource, submitted_by: user!.id } as any);
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Manuscript submitted for review!" });
    setMTitle(""); setMDesc(""); setMPeriod(""); setMSource(""); setMLang("");
  };

  const submitResearch = async () => {
    if (!rTitle.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setLoading(true);
    const { error } = await supabase.from("research_submissions").insert({ paper_title: rTitle.trim(), authors: rAuthors, affiliation: rAffiliation, domain: rDomain, abstract: rAbstract, submitted_by: user!.id } as any);
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Research submitted for review!" });
    setRTitle(""); setRAuthors(""); setRAffiliation(""); setRDomain(""); setRAbstract("");
  };

  const submitTribal = async () => {
    if (!tCommunity.trim()) { toast({ title: "Community name is required", variant: "destructive" }); return; }
    setLoading(true);
    const { error } = await supabase.from("tribal_records").insert({ community_name: tCommunity.trim(), region: tRegion, knowledge_type: tType, documenter_name: tDocumenter, description: tDesc, submitted_by: user!.id } as any);
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Tribal record submitted for review!" });
    setTCommunity(""); setTRegion(""); setTType(""); setTDocumenter(""); setTDesc("");
  };

  const submitCitation = async () => {
    if (!cTitle.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setLoading(true);
    const { error } = await supabase.from("citations").insert({ title: cTitle.trim(), authors: cAuthors, source: cSource, year: cYear, doi: cDoi, url: cUrl, citation_type: cType, domain: cDomain, submitted_by: user!.id } as any);
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Citation submitted for review!" });
    setCTitle(""); setCAuthors(""); setCSource(""); setCYear(""); setCDoi(""); setCUrl(""); setCType("article"); setCDomain("");
  };

  return (
    <Layout>
      <section className="py-12 bg-card border-b border-border">
        <div className="container">
          <span className="text-xs font-body font-semibold uppercase tracking-[0.25em] text-gold mb-2 block">Contribute</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Contribute to the Archive</h1>
          <p className="font-body text-muted-foreground max-w-2xl">
            Help preserve India's civilizational knowledge. Upload manuscripts, submit research, document tribal traditions, or add citations.
          </p>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container max-w-3xl">
          <Tabs defaultValue="manuscript" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="manuscript" className="font-body text-xs gap-1"><Upload className="h-3 w-3" /> Manuscript</TabsTrigger>
              <TabsTrigger value="research" className="font-body text-xs gap-1"><BookOpen className="h-3 w-3" /> Research</TabsTrigger>
              <TabsTrigger value="tribal" className="font-body text-xs gap-1"><Users className="h-3 w-3" /> Tribal</TabsTrigger>
              <TabsTrigger value="citation" className="font-body text-xs gap-1"><Quote className="h-3 w-3" /> Citation</TabsTrigger>
            </TabsList>

            <TabsContent value="manuscript">
              <div className="p-6 rounded-lg border border-border bg-card space-y-5">
                <h2 className="font-heading text-xl font-semibold text-foreground">Upload Manuscript</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="font-body text-xs">Title *</Label><Input className="mt-1 font-body text-sm" value={mTitle} onChange={e => setMTitle(e.target.value)} placeholder="Manuscript title" /></div>
                  <div><Label className="font-body text-xs">Language</Label>
                    <Select value={mLang} onValueChange={setMLang}><SelectTrigger className="mt-1 font-body text-sm"><SelectValue placeholder="Select language" /></SelectTrigger>
                    <SelectContent>{["Sanskrit", "Pali", "Tamil", "Prakrit", "Other"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label className="font-body text-xs">Estimated Period</Label><Input className="mt-1 font-body text-sm" value={mPeriod} onChange={e => setMPeriod(e.target.value)} placeholder="e.g. c. 800 CE" /></div>
                  <div><Label className="font-body text-xs">Repository / Source</Label><Input className="mt-1 font-body text-sm" value={mSource} onChange={e => setMSource(e.target.value)} placeholder="Institution or private collection" /></div>
                </div>
                <div><Label className="font-body text-xs">Description</Label><Textarea className="mt-1 font-body text-sm" rows={4} value={mDesc} onChange={e => setMDesc(e.target.value)} placeholder="Brief description of the manuscript..." /></div>
                <Button className="font-body" onClick={submitManuscript} disabled={loading}><FileText className="h-4 w-4 mr-2" /> {loading ? "Submitting..." : "Submit Manuscript"}</Button>
              </div>
            </TabsContent>

            <TabsContent value="research">
              <div className="p-6 rounded-lg border border-border bg-card space-y-5">
                <h2 className="font-heading text-xl font-semibold text-foreground">Submit Research</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="font-body text-xs">Paper Title *</Label><Input className="mt-1 font-body text-sm" value={rTitle} onChange={e => setRTitle(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">Author(s)</Label><Input className="mt-1 font-body text-sm" value={rAuthors} onChange={e => setRAuthors(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">Affiliation</Label><Input className="mt-1 font-body text-sm" value={rAffiliation} onChange={e => setRAffiliation(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">Domain</Label>
                    <Select value={rDomain} onValueChange={setRDomain}><SelectTrigger className="mt-1 font-body text-sm"><SelectValue placeholder="Select domain" /></SelectTrigger>
                    <SelectContent>{["Textual Knowledge", "Science", "Architecture", "Philosophy", "Tribal Studies", "History"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
                  </div>
                </div>
                <div><Label className="font-body text-xs">Abstract</Label><Textarea className="mt-1 font-body text-sm" rows={4} value={rAbstract} onChange={e => setRAbstract(e.target.value)} /></div>
                <Button className="font-body" onClick={submitResearch} disabled={loading}><BookOpen className="h-4 w-4 mr-2" /> {loading ? "Submitting..." : "Submit Research"}</Button>
              </div>
            </TabsContent>

            <TabsContent value="tribal">
              <div className="p-6 rounded-lg border border-border bg-card space-y-5">
                <h2 className="font-heading text-xl font-semibold text-foreground">Document Tribal Knowledge</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="font-body text-xs">Community / Tribe Name *</Label><Input className="mt-1 font-body text-sm" value={tCommunity} onChange={e => setTCommunity(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">Region</Label><Input className="mt-1 font-body text-sm" value={tRegion} onChange={e => setTRegion(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">Knowledge Type</Label>
                    <Select value={tType} onValueChange={setTType}><SelectTrigger className="mt-1 font-body text-sm"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>{["Folk Song", "Medicinal Practice", "Craft Tradition", "Oral History", "Ritual", "Other"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label className="font-body text-xs">Documenter Name</Label><Input className="mt-1 font-body text-sm" value={tDocumenter} onChange={e => setTDocumenter(e.target.value)} /></div>
                </div>
                <div><Label className="font-body text-xs">Description</Label><Textarea className="mt-1 font-body text-sm" rows={4} value={tDesc} onChange={e => setTDesc(e.target.value)} placeholder="Detailed documentation..." /></div>
                <Button className="font-body" onClick={submitTribal} disabled={loading}><Users className="h-4 w-4 mr-2" /> {loading ? "Submitting..." : "Submit Documentation"}</Button>
              </div>
            </TabsContent>

            <TabsContent value="citation">
              <div className="p-6 rounded-lg border border-border bg-card space-y-5">
                <h2 className="font-heading text-xl font-semibold text-foreground">Add Citation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="font-body text-xs">Title *</Label><Input className="mt-1 font-body text-sm" value={cTitle} onChange={e => setCTitle(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">Author(s)</Label><Input className="mt-1 font-body text-sm" value={cAuthors} onChange={e => setCAuthors(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">Source / Journal</Label><Input className="mt-1 font-body text-sm" value={cSource} onChange={e => setCSource(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">Year</Label><Input className="mt-1 font-body text-sm" value={cYear} onChange={e => setCYear(e.target.value)} placeholder="e.g. 2024" /></div>
                  <div><Label className="font-body text-xs">DOI</Label><Input className="mt-1 font-body text-sm" value={cDoi} onChange={e => setCDoi(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">URL</Label><Input className="mt-1 font-body text-sm" value={cUrl} onChange={e => setCUrl(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">Type</Label>
                    <Select value={cType} onValueChange={setCType}><SelectTrigger className="mt-1 font-body text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>{["article", "book", "chapter", "thesis", "conference", "other"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label className="font-body text-xs">Domain</Label>
                    <Select value={cDomain} onValueChange={setCDomain}><SelectTrigger className="mt-1 font-body text-sm"><SelectValue placeholder="Select domain" /></SelectTrigger>
                    <SelectContent>{["Textual Knowledge", "Science", "Architecture", "Philosophy", "Tribal Studies", "History"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
                  </div>
                </div>
                <Button className="font-body" onClick={submitCitation} disabled={loading}><Quote className="h-4 w-4 mr-2" /> {loading ? "Submitting..." : "Submit Citation"}</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default ContributePage;
