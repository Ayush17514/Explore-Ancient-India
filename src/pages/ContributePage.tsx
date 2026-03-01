import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, BookOpen, FileText, Users } from "lucide-react";

const ContributePage = () => {
  return (
    <Layout>
      <section className="py-12 bg-card border-b border-border">
        <div className="container">
          <span className="text-xs font-body font-semibold uppercase tracking-[0.25em] text-gold mb-2 block">Contribute</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Contribute to the Archive</h1>
          <p className="font-body text-muted-foreground max-w-2xl">
            Help preserve India's civilizational knowledge. Upload manuscripts, submit research, or document tribal traditions.
          </p>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container max-w-3xl">
          <Tabs defaultValue="manuscript" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="manuscript" className="font-body text-xs gap-1"><Upload className="h-3 w-3" /> Manuscript</TabsTrigger>
              <TabsTrigger value="research" className="font-body text-xs gap-1"><BookOpen className="h-3 w-3" /> Research</TabsTrigger>
              <TabsTrigger value="tribal" className="font-body text-xs gap-1"><Users className="h-3 w-3" /> Tribal Knowledge</TabsTrigger>
            </TabsList>

            <TabsContent value="manuscript">
              <div className="p-6 rounded-lg border border-border bg-card space-y-5">
                <h2 className="font-heading text-xl font-semibold text-foreground">Upload Manuscript</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="font-body text-xs">Title</Label><Input className="mt-1 font-body text-sm" placeholder="Manuscript title" /></div>
                  <div><Label className="font-body text-xs">Language</Label>
                    <Select><SelectTrigger className="mt-1 font-body text-sm"><SelectValue placeholder="Select language" /></SelectTrigger>
                    <SelectContent>{["Sanskrit", "Pali", "Tamil", "Prakrit", "Other"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label className="font-body text-xs">Estimated Period</Label><Input className="mt-1 font-body text-sm" placeholder="e.g. c. 800 CE" /></div>
                  <div><Label className="font-body text-xs">Repository / Source</Label><Input className="mt-1 font-body text-sm" placeholder="Institution or private collection" /></div>
                </div>
                <div><Label className="font-body text-xs">Description</Label><Textarea className="mt-1 font-body text-sm" rows={4} placeholder="Brief description of the manuscript..." /></div>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-body text-sm text-muted-foreground">Drag and drop files or click to upload</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">TIFF, PNG, PDF — Max 100MB</p>
                </div>
                <Button className="font-body"><FileText className="h-4 w-4 mr-2" /> Submit Manuscript</Button>
              </div>
            </TabsContent>

            <TabsContent value="research">
              <div className="p-6 rounded-lg border border-border bg-card space-y-5">
                <h2 className="font-heading text-xl font-semibold text-foreground">Submit Research</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="font-body text-xs">Paper Title</Label><Input className="mt-1 font-body text-sm" /></div>
                  <div><Label className="font-body text-xs">Author(s)</Label><Input className="mt-1 font-body text-sm" /></div>
                  <div><Label className="font-body text-xs">Affiliation</Label><Input className="mt-1 font-body text-sm" /></div>
                  <div><Label className="font-body text-xs">Domain</Label>
                    <Select><SelectTrigger className="mt-1 font-body text-sm"><SelectValue placeholder="Select domain" /></SelectTrigger>
                    <SelectContent>{["Textual Knowledge", "Science", "Architecture", "Philosophy", "Tribal Studies", "History"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
                  </div>
                </div>
                <div><Label className="font-body text-xs">Abstract</Label><Textarea className="mt-1 font-body text-sm" rows={4} /></div>
                <Button className="font-body"><BookOpen className="h-4 w-4 mr-2" /> Submit Research</Button>
              </div>
            </TabsContent>

            <TabsContent value="tribal">
              <div className="p-6 rounded-lg border border-border bg-card space-y-5">
                <h2 className="font-heading text-xl font-semibold text-foreground">Document Tribal Knowledge</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="font-body text-xs">Community / Tribe Name</Label><Input className="mt-1 font-body text-sm" /></div>
                  <div><Label className="font-body text-xs">Region</Label><Input className="mt-1 font-body text-sm" /></div>
                  <div><Label className="font-body text-xs">Knowledge Type</Label>
                    <Select><SelectTrigger className="mt-1 font-body text-sm"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>{["Folk Song", "Medicinal Practice", "Craft Tradition", "Oral History", "Ritual", "Other"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label className="font-body text-xs">Documenter Name</Label><Input className="mt-1 font-body text-sm" /></div>
                </div>
                <div><Label className="font-body text-xs">Description</Label><Textarea className="mt-1 font-body text-sm" rows={4} placeholder="Detailed documentation..." /></div>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-body text-sm text-muted-foreground">Upload audio, video, or image files</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">MP3, MP4, JPG, PNG — Max 200MB</p>
                </div>
                <Button className="font-body"><Users className="h-4 w-4 mr-2" /> Submit Documentation</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default ContributePage;
