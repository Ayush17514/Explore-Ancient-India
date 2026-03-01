import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Code, Download, FileText, Key, Lock, BarChart3, History, Bookmark } from "lucide-react";

const ResearchPage = () => {
  return (
    <Layout>
      <section className="py-12 bg-card border-b border-border">
        <div className="container">
          <span className="text-xs font-body font-semibold uppercase tracking-[0.25em] text-gold mb-2 block">Research Portal</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Research Access & API</h1>
          <p className="font-body text-muted-foreground max-w-2xl">
            Programmatic access to India's civilizational knowledge corpus. For scholars, institutions, and AI research.
          </p>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* API Access */}
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <Code className="h-6 w-6 text-gold" />
                  <h2 className="font-heading text-xl font-semibold text-foreground">API Access</h2>
                </div>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  RESTful endpoints for querying manuscripts, artifacts, and metadata. Rate-limited to 1000 requests/day for institutional accounts.
                </p>
                <div className="bg-secondary rounded p-4 font-mono text-xs text-foreground overflow-x-auto">
                  <pre>{`GET /api/v1/manuscripts?domain=textual&era=500bce-0ce
Authorization: Bearer <your_api_key>

{
  "results": 142,
  "data": [
    {
      "id": "MS-1842-UPN",
      "title": "Isha Upanishad",
      "language": "Sanskrit",
      "era": "c. 800 CE",
      "citations": 128
    }
  ]
}`}</pre>
                </div>
              </div>

              {/* Dataset Downloads */}
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <Download className="h-6 w-6 text-gold" />
                  <h2 className="font-heading text-xl font-semibold text-foreground">Available Datasets</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Complete Manuscript Metadata", format: "CSV / JSON", size: "42 MB", records: "12,847" },
                    { name: "Architectural Sites Database", format: "JSON / XML", size: "18 MB", records: "3,214" },
                    { name: "Philosophical Texts Corpus", format: "TXT / JSON", size: "156 MB", records: "8,421" },
                    { name: "Tribal Knowledge Records", format: "JSON", size: "8 MB", records: "1,892" },
                  ].map((ds) => (
                    <div key={ds.name} className="flex items-center justify-between p-4 bg-secondary rounded">
                      <div>
                        <p className="font-body text-sm font-semibold text-foreground">{ds.name}</p>
                        <p className="font-body text-xs text-muted-foreground">{ds.format} · {ds.size} · {ds.records} records</p>
                      </div>
                      <Button variant="outline" size="sm" className="font-body text-xs shrink-0">
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citation */}
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-gold" />
                  <h2 className="font-heading text-xl font-semibold text-foreground">Citation Export</h2>
                </div>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  Export citations in APA, MLA, Chicago, and BibTeX formats for all records in the archive.
                </p>
                <div className="flex gap-2">
                  {["APA", "MLA", "Chicago", "BibTeX"].map(fmt => (
                    <Button key={fmt} variant="outline" size="sm" className="font-body text-xs">{fmt}</Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Login sidebar */}
            <div className="space-y-6">
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="h-5 w-5 text-gold" />
                  <h3 className="font-heading text-lg font-semibold text-foreground">Institutional Login</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="font-body text-xs">Email</Label>
                    <Input type="email" placeholder="researcher@university.ac.in" className="font-body text-sm mt-1" />
                  </div>
                  <div>
                    <Label className="font-body text-xs">Password</Label>
                    <Input type="password" className="font-body text-sm mt-1" />
                  </div>
                  <Button className="w-full font-body">Sign In</Button>
                  <p className="text-[10px] font-body text-muted-foreground text-center">
                    Request institutional access via your university registrar.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-heading text-base font-semibold text-foreground mb-3">Researcher Dashboard</h3>
                <p className="font-body text-xs text-muted-foreground mb-4">Sign in to access your personalized dashboard.</p>
                <Separator className="mb-4" />
                <div className="space-y-3">
                  {[
                    { icon: Bookmark, label: "Saved Datasets" },
                    { icon: History, label: "Download History" },
                    { icon: Key, label: "API Key Management" },
                    { icon: BarChart3, label: "Usage Statistics" },
                    { icon: FileText, label: "Citation Exports" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 p-3 bg-secondary rounded text-xs font-body text-muted-foreground">
                      <Icon className="h-4 w-4 text-gold shrink-0" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResearchPage;
