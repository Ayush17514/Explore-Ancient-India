import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, BookOpen, FileText, Users, Quote, Landmark, Brain, X, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useFileUpload, validateFile } from "@/hooks/useFileUpload";

const ContributePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { uploadFile, uploading, progress } = useFileUpload();

  // File state (shared)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manuscript form
  const [mTitle, setMTitle] = useState("");
  const [mLang, setMLang] = useState("");
  const [mPeriod, setMPeriod] = useState("");
  const [mSource, setMSource] = useState("");
  const [mDesc, setMDesc] = useState("");
  const [mMaterial, setMMaterial] = useState("");
  const [mScript, setMScript] = useState("");
  const [mTags, setMTags] = useState("");
  const [mReferences, setMReferences] = useState("");

  // Research form
  const [rTitle, setRTitle] = useState("");
  const [rAuthors, setRAuthors] = useState("");
  const [rAffiliation, setRAffiliation] = useState("");
  const [rDomain, setRDomain] = useState("");
  const [rAbstract, setRAbstract] = useState("");
  const [rJournal, setRJournal] = useState("");
  const [rYear, setRYear] = useState("");
  const [rKeywords, setRKeywords] = useState("");

  // Tribal form
  const [tCommunity, setTCommunity] = useState("");
  const [tRegion, setTRegion] = useState("");
  const [tType, setTType] = useState("");
  const [tDocumenter, setTDocumenter] = useState("");
  const [tDesc, setTDesc] = useState("");
  const [tRecordingType, setTRecordingType] = useState("");

  // Citation form
  const [cTitle, setCTitle] = useState("");
  const [cAuthors, setCAuthors] = useState("");
  const [cSource, setCSource] = useState("");
  const [cYear, setCYear] = useState("");
  const [cDoi, setCDoi] = useState("");
  const [cUrl, setCUrl] = useState("");
  const [cType, setCType] = useState("article");
  const [cDomain, setCDomain] = useState("");
  const [cAbstract, setCAbstract] = useState("");
  const [cVolume, setCVolume] = useState("");
  const [cIssue, setCIssue] = useState("");
  const [cPages, setCPages] = useState("");

  // Architecture form
  const [aName, setAName] = useState("");
  const [aLocation, setALocation] = useState("");
  const [aRegion, setARegion] = useState("");
  const [aEra, setAEra] = useState("");
  const [aStyle, setAStyle] = useState("");
  const [aDesc, setADesc] = useState("");

  // Philosophy form
  const [pName, setPName] = useState("");
  const [pTradition, setPTradition] = useState("");
  const [pFounder, setPFounder] = useState("");
  const [pPeriod, setPPeriod] = useState("");
  const [pCoreTexts, setPCoreTexts] = useState("");
  const [pDesc, setPDesc] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateFile(file);
    if (!validation.valid) {
      toast({ title: "Invalid file", description: validation.error, variant: "destructive" });
      return;
    }
    setSelectedFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const parseReferences = (text: string): string[] => {
    return text.split("\n").map(r => r.trim()).filter(Boolean);
  };

  const parseTags = (text: string): string[] => {
    return text.split(",").map(t => t.trim()).filter(Boolean);
  };

  const uploadSelectedFile = async (resourceType: string, sourceTable: string) => {
    if (!selectedFile || !user) return null;
    const result = await uploadFile(selectedFile, "uploads", resourceType, {
      title: selectedFile.name,
      resourceType,
      sourceTable,
      userId: user.id,
    });
    return result?.url || null;
  };

  const submitManuscript = async () => {
    if (!mTitle.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setLoading(true);
    const fileUrl = await uploadSelectedFile("manuscript", "manuscripts");
    const { error } = await supabase.from("manuscripts").insert({
      title: mTitle.trim(), description: mDesc, estimated_period: mPeriod,
      repository_source: mSource, submitted_by: user!.id,
      material: mMaterial || null, script_type: mScript || null,
      tags: parseTags(mTags), references_data: parseReferences(mReferences),
      file_url: fileUrl, file_urls: fileUrl ? [fileUrl] : [],
    } as any);
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Manuscript submitted for review!" });
    setMTitle(""); setMDesc(""); setMPeriod(""); setMSource(""); setMLang(""); setMMaterial(""); setMScript(""); setMTags(""); setMReferences(""); clearFile();
  };

  const submitResearch = async () => {
    if (!rTitle.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setLoading(true);
    const fileUrl = await uploadSelectedFile("research", "research_submissions");
    const { error } = await supabase.from("research_submissions").insert({
      paper_title: rTitle.trim(), authors: rAuthors, affiliation: rAffiliation,
      domain: rDomain, abstract: rAbstract, submitted_by: user!.id,
      journal: rJournal || null, publication_year: rYear || null,
      keywords: parseTags(rKeywords),
      file_url: fileUrl, file_urls: fileUrl ? [fileUrl] : [],
    } as any);
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Research submitted for review!" });
    setRTitle(""); setRAuthors(""); setRAffiliation(""); setRDomain(""); setRAbstract(""); setRJournal(""); setRYear(""); setRKeywords(""); clearFile();
  };

  const submitTribal = async () => {
    if (!tCommunity.trim()) { toast({ title: "Community name is required", variant: "destructive" }); return; }
    setLoading(true);
    const fileUrl = await uploadSelectedFile("tribal", "tribal_records");
    const { error } = await supabase.from("tribal_records").insert({
      community_name: tCommunity.trim(), region: tRegion, knowledge_type: tType,
      documenter_name: tDocumenter, description: tDesc, submitted_by: user!.id,
      recording_type: tRecordingType || null,
      media_url: fileUrl, file_urls: fileUrl ? [fileUrl] : [],
    } as any);
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Tribal record submitted for review!" });
    setTCommunity(""); setTRegion(""); setTType(""); setTDocumenter(""); setTDesc(""); setTRecordingType(""); clearFile();
  };

  const submitCitation = async () => {
    if (!cTitle.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setLoading(true);
    const { error } = await supabase.from("citations").insert({
      title: cTitle.trim(), authors: cAuthors, source: cSource, year: cYear,
      doi: cDoi, url: cUrl, citation_type: cType, domain: cDomain,
      submitted_by: user!.id, abstract: cAbstract || null,
      volume: cVolume || null, issue: cIssue || null, page_numbers: cPages || null,
    } as any);
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Citation submitted for review!" });
    setCTitle(""); setCAuthors(""); setCSource(""); setCYear(""); setCDoi(""); setCUrl(""); setCType("article"); setCDomain(""); setCAbstract(""); setCVolume(""); setCIssue(""); setCPages(""); clearFile();
  };

  const submitArchitecture = async () => {
    if (!aName.trim()) { toast({ title: "Site name is required", variant: "destructive" }); return; }
    setLoading(true);
    const fileUrl = await uploadSelectedFile("site", "architecture_sites");
    const { error } = await supabase.from("architecture_sites").insert({
      name: aName.trim(), location: aLocation, region: aRegion, era: aEra,
      architectural_style: aStyle, description: aDesc, submitted_by: user!.id,
      image_url: fileUrl, file_urls: fileUrl ? [fileUrl] : [],
    } as any);
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Architecture site submitted for review!" });
    setAName(""); setALocation(""); setARegion(""); setAEra(""); setAStyle(""); setADesc(""); clearFile();
  };

  const submitPhilosophy = async () => {
    if (!pName.trim()) { toast({ title: "School name is required", variant: "destructive" }); return; }
    setLoading(true);
    const { error } = await supabase.from("philosophical_schools").insert({
      name: pName.trim(), tradition: pTradition, founder: pFounder,
      period: pPeriod, core_texts: pCoreTexts, description: pDesc,
      submitted_by: user!.id,
    } as any);
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Philosophical school submitted for review!" });
    setPName(""); setPTradition(""); setPFounder(""); setPPeriod(""); setPCoreTexts(""); setPDesc(""); clearFile();
  };

  const FileUploader = () => (
    <div className="space-y-2">
      <Label className="font-body text-xs">Attach File (PDF, JPEG, PNG, TIFF, DOCX)</Label>
      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/30 transition-colors">
        {selectedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-gold" />
              <span className="font-body text-xs text-foreground">{selectedFile.name}</span>
              <span className="text-[10px] text-muted-foreground">({(selectedFile.size / 1024 / 1024).toFixed(1)}MB)</span>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={clearFile}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div>
            <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground mb-2">Drag & drop or click to browse</p>
            <Button variant="outline" size="sm" className="font-body text-xs" onClick={() => fileInputRef.current?.click()}>
              Choose File
            </Button>
          </div>
        )}
        <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.tiff,.docx" onChange={handleFileSelect} />
      </div>
      {uploading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Uploading... {progress}%</span>
        </div>
      )}
    </div>
  );

  const isSubmitting = loading || uploading;

  return (
    <Layout>
      <section className="py-12 bg-card border-b border-border">
        <div className="container">
          <span className="text-xs font-body font-semibold uppercase tracking-[0.25em] text-gold mb-2 block">Contribute</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Contribute to the Archive</h1>
          <p className="font-body text-muted-foreground max-w-2xl">
            Help preserve India's civilizational knowledge. Upload manuscripts, submit research, document tribal traditions, add citations, register architecture sites, or describe philosophical schools.
          </p>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container max-w-3xl">
          <Tabs defaultValue="manuscript" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8 h-auto gap-1">
              <TabsTrigger value="manuscript" className="font-body text-xs gap-1"><Upload className="h-3 w-3" /> Manuscript</TabsTrigger>
              <TabsTrigger value="research" className="font-body text-xs gap-1"><BookOpen className="h-3 w-3" /> Research</TabsTrigger>
              <TabsTrigger value="tribal" className="font-body text-xs gap-1"><Users className="h-3 w-3" /> Tribal</TabsTrigger>
              <TabsTrigger value="citation" className="font-body text-xs gap-1"><Quote className="h-3 w-3" /> Citation</TabsTrigger>
              <TabsTrigger value="architecture" className="font-body text-xs gap-1"><Landmark className="h-3 w-3" /> Sites</TabsTrigger>
              <TabsTrigger value="philosophy" className="font-body text-xs gap-1"><Brain className="h-3 w-3" /> Philosophy</TabsTrigger>
            </TabsList>

            {/* MANUSCRIPT */}
            <TabsContent value="manuscript">
              <div className="p-6 rounded-lg border border-border bg-card space-y-5">
                <h2 className="font-heading text-xl font-semibold text-foreground">Upload Manuscript</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="font-body text-xs">Title *</Label><Input className="mt-1 font-body text-sm" value={mTitle} onChange={e => setMTitle(e.target.value)} placeholder="Manuscript title" /></div>
                  <div><Label className="font-body text-xs">Language</Label>
                    <Select value={mLang} onValueChange={setMLang}><SelectTrigger className="mt-1 font-body text-sm"><SelectValue placeholder="Select language" /></SelectTrigger>
                    <SelectContent>{["Sanskrit", "Pali", "Tamil", "Prakrit", "Bengali", "Marathi", "Other"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label className="font-body text-xs">Estimated Period</Label><Input className="mt-1 font-body text-sm" value={mPeriod} onChange={e => setMPeriod(e.target.value)} placeholder="e.g. c. 800 CE" /></div>
                  <div><Label className="font-body text-xs">Repository / Source</Label><Input className="mt-1 font-body text-sm" value={mSource} onChange={e => setMSource(e.target.value)} placeholder="Institution or private collection" /></div>
                  <div><Label className="font-body text-xs">Material</Label>
                    <Select value={mMaterial} onValueChange={setMMaterial}><SelectTrigger className="mt-1 font-body text-sm"><SelectValue placeholder="Select material" /></SelectTrigger>
                    <SelectContent>{["Palm Leaf", "Birch Bark", "Paper", "Copper Plate", "Stone", "Other"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label className="font-body text-xs">Script Type</Label><Input className="mt-1 font-body text-sm" value={mScript} onChange={e => setMScript(e.target.value)} placeholder="e.g. Devanagari, Brahmi" /></div>
                </div>
                <div><Label className="font-body text-xs">Tags (comma-separated)</Label><Input className="mt-1 font-body text-sm" value={mTags} onChange={e => setMTags(e.target.value)} placeholder="Upanishad, Vedic, Philosophy" /></div>
                <div><Label className="font-body text-xs">Description</Label><Textarea className="mt-1 font-body text-sm" rows={3} value={mDesc} onChange={e => setMDesc(e.target.value)} placeholder="Brief description of the manuscript..." /></div>
                <div><Label className="font-body text-xs">References (one per line)</Label><Textarea className="mt-1 font-body text-sm" rows={3} value={mReferences} onChange={e => setMReferences(e.target.value)} placeholder="Add each reference on a new line..." /></div>
                <FileUploader />
                <Button className="font-body" onClick={submitManuscript} disabled={isSubmitting}><FileText className="h-4 w-4 mr-2" /> {isSubmitting ? "Submitting..." : "Submit Manuscript"}</Button>
              </div>
            </TabsContent>

            {/* RESEARCH */}
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
                  <div><Label className="font-body text-xs">Journal</Label><Input className="mt-1 font-body text-sm" value={rJournal} onChange={e => setRJournal(e.target.value)} placeholder="Journal name" /></div>
                  <div><Label className="font-body text-xs">Publication Year</Label><Input className="mt-1 font-body text-sm" value={rYear} onChange={e => setRYear(e.target.value)} placeholder="e.g. 2024" /></div>
                </div>
                <div><Label className="font-body text-xs">Keywords (comma-separated)</Label><Input className="mt-1 font-body text-sm" value={rKeywords} onChange={e => setRKeywords(e.target.value)} placeholder="Indo-Aryan, Linguistics" /></div>
                <div><Label className="font-body text-xs">Abstract</Label><Textarea className="mt-1 font-body text-sm" rows={4} value={rAbstract} onChange={e => setRAbstract(e.target.value)} /></div>
                <FileUploader />
                <Button className="font-body" onClick={submitResearch} disabled={isSubmitting}><BookOpen className="h-4 w-4 mr-2" /> {isSubmitting ? "Submitting..." : "Submit Research"}</Button>
              </div>
            </TabsContent>

            {/* TRIBAL */}
            <TabsContent value="tribal">
              <div className="p-6 rounded-lg border border-border bg-card space-y-5">
                <h2 className="font-heading text-xl font-semibold text-foreground">Document Tribal Knowledge</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="font-body text-xs">Community / Tribe Name *</Label><Input className="mt-1 font-body text-sm" value={tCommunity} onChange={e => setTCommunity(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">Region</Label><Input className="mt-1 font-body text-sm" value={tRegion} onChange={e => setTRegion(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">Knowledge Type</Label>
                    <Select value={tType} onValueChange={setTType}><SelectTrigger className="mt-1 font-body text-sm"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>{["Folk Song", "Medicinal Practice", "Craft Tradition", "Oral History", "Ritual", "Dance", "Agriculture", "Other"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label className="font-body text-xs">Documenter Name</Label><Input className="mt-1 font-body text-sm" value={tDocumenter} onChange={e => setTDocumenter(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">Recording Type</Label>
                    <Select value={tRecordingType} onValueChange={setTRecordingType}><SelectTrigger className="mt-1 font-body text-sm"><SelectValue placeholder="Select recording type" /></SelectTrigger>
                    <SelectContent>{["Audio", "Video", "Text", "Photograph", "Mixed"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
                  </div>
                </div>
                <div><Label className="font-body text-xs">Description</Label><Textarea className="mt-1 font-body text-sm" rows={4} value={tDesc} onChange={e => setTDesc(e.target.value)} placeholder="Detailed documentation..." /></div>
                <FileUploader />
                <Button className="font-body" onClick={submitTribal} disabled={isSubmitting}><Users className="h-4 w-4 mr-2" /> {isSubmitting ? "Submitting..." : "Submit Documentation"}</Button>
              </div>
            </TabsContent>

            {/* CITATION */}
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
                    <SelectContent>{["article", "book", "chapter", "thesis", "conference", "report", "other"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label className="font-body text-xs">Domain</Label>
                    <Select value={cDomain} onValueChange={setCDomain}><SelectTrigger className="mt-1 font-body text-sm"><SelectValue placeholder="Select domain" /></SelectTrigger>
                    <SelectContent>{["Textual Knowledge", "Science", "Architecture", "Philosophy", "Tribal Studies", "History"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label className="font-body text-xs">Volume</Label><Input className="mt-1 font-body text-sm" value={cVolume} onChange={e => setCVolume(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">Issue</Label><Input className="mt-1 font-body text-sm" value={cIssue} onChange={e => setCIssue(e.target.value)} /></div>
                  <div><Label className="font-body text-xs">Page Numbers</Label><Input className="mt-1 font-body text-sm" value={cPages} onChange={e => setCPages(e.target.value)} placeholder="e.g. 1-24" /></div>
                </div>
                <div><Label className="font-body text-xs">Abstract</Label><Textarea className="mt-1 font-body text-sm" rows={3} value={cAbstract} onChange={e => setCAbstract(e.target.value)} /></div>
                <Button className="font-body" onClick={submitCitation} disabled={isSubmitting}><Quote className="h-4 w-4 mr-2" /> {isSubmitting ? "Submitting..." : "Submit Citation"}</Button>
              </div>
            </TabsContent>

            {/* ARCHITECTURE SITES */}
            <TabsContent value="architecture">
              <div className="p-6 rounded-lg border border-border bg-card space-y-5">
                <h2 className="font-heading text-xl font-semibold text-foreground">Register Architecture Site</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="font-body text-xs">Site Name *</Label><Input className="mt-1 font-body text-sm" value={aName} onChange={e => setAName(e.target.value)} placeholder="e.g. Brihadeeshwara Temple" /></div>
                  <div><Label className="font-body text-xs">Location</Label><Input className="mt-1 font-body text-sm" value={aLocation} onChange={e => setALocation(e.target.value)} placeholder="City, State" /></div>
                  <div><Label className="font-body text-xs">Region</Label><Input className="mt-1 font-body text-sm" value={aRegion} onChange={e => setARegion(e.target.value)} placeholder="e.g. South India" /></div>
                  <div><Label className="font-body text-xs">Era</Label><Input className="mt-1 font-body text-sm" value={aEra} onChange={e => setAEra(e.target.value)} placeholder="e.g. 1010 CE" /></div>
                  <div className="md:col-span-2"><Label className="font-body text-xs">Architectural Style</Label>
                    <Select value={aStyle} onValueChange={setAStyle}><SelectTrigger className="mt-1 font-body text-sm"><SelectValue placeholder="Select style" /></SelectTrigger>
                    <SelectContent>{["Dravidian", "Nagara", "Vesara", "Indo-Islamic", "Buddhist", "Jain", "Colonial", "Other"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                  </div>
                </div>
                <div><Label className="font-body text-xs">Description</Label><Textarea className="mt-1 font-body text-sm" rows={4} value={aDesc} onChange={e => setADesc(e.target.value)} placeholder="Describe the site, its significance, and engineering features..." /></div>
                <FileUploader />
                <Button className="font-body" onClick={submitArchitecture} disabled={isSubmitting}><Landmark className="h-4 w-4 mr-2" /> {isSubmitting ? "Submitting..." : "Submit Site"}</Button>
              </div>
            </TabsContent>

            {/* PHILOSOPHICAL SCHOOLS */}
            <TabsContent value="philosophy">
              <div className="p-6 rounded-lg border border-border bg-card space-y-5">
                <h2 className="font-heading text-xl font-semibold text-foreground">Describe Philosophical School</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="font-body text-xs">School Name *</Label><Input className="mt-1 font-body text-sm" value={pName} onChange={e => setPName(e.target.value)} placeholder="e.g. Advaita Vedanta" /></div>
                  <div><Label className="font-body text-xs">Tradition</Label>
                    <Select value={pTradition} onValueChange={setPTradition}><SelectTrigger className="mt-1 font-body text-sm"><SelectValue placeholder="Select tradition" /></SelectTrigger>
                    <SelectContent>{["Vedantic", "Buddhist", "Jain", "Shaiva", "Vaishnava", "Nyaya-Vaisheshika", "Samkhya-Yoga", "Other"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label className="font-body text-xs">Founder</Label><Input className="mt-1 font-body text-sm" value={pFounder} onChange={e => setPFounder(e.target.value)} placeholder="e.g. Adi Shankaracharya" /></div>
                  <div><Label className="font-body text-xs">Period</Label><Input className="mt-1 font-body text-sm" value={pPeriod} onChange={e => setPPeriod(e.target.value)} placeholder="e.g. 8th century CE" /></div>
                </div>
                <div><Label className="font-body text-xs">Core Texts</Label><Input className="mt-1 font-body text-sm" value={pCoreTexts} onChange={e => setPCoreTexts(e.target.value)} placeholder="e.g. Brahma Sutras, Upanishads" /></div>
                <div><Label className="font-body text-xs">Description</Label><Textarea className="mt-1 font-body text-sm" rows={4} value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Describe the key tenets and contributions..." /></div>
                <Button className="font-body" onClick={submitPhilosophy} disabled={isSubmitting}><Brain className="h-4 w-4 mr-2" /> {isSubmitting ? "Submitting..." : "Submit School"}</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default ContributePage;
