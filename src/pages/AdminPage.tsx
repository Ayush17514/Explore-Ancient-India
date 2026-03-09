import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, FileText, BookOpen, Landmark, Brain, Globe, Quote, BarChart3, Check, X, Clock, Database, Activity } from "lucide-react";

type ContentItem = { id: string; title?: string; name?: string; paper_title?: string; community_name?: string; status: string; created_at: string; submitted_by: string | null };
type UserRow = { id: string; full_name: string; institution: string; role_label: string; created_at: string };
type ResourceRow = { id: string; title: string; resource_type: string; mime_type: string | null; file_size_bytes: number | null; file_url: string | null; created_at: string };
type ActivityRow = { id: string; user_id: string | null; action: string; entity_type: string | null; created_at: string };

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const AdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [manuscripts, setManuscripts] = useState<ContentItem[]>([]);
  const [research, setResearch] = useState<ContentItem[]>([]);
  const [citations, setCitations] = useState<ContentItem[]>([]);
  const [tribal, setTribal] = useState<ContentItem[]>([]);
  const [sites, setSites] = useState<ContentItem[]>([]);
  const [schools, setSchools] = useState<ContentItem[]>([]);
  const [resources, setResources] = useState<ResourceRow[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityRow[]>([]);
  const [stats, setStats] = useState({ users: 0, pending: 0, approved: 0, total: 0, files: 0 });
  const [roleChanges, setRoleChanges] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkTable, setBulkTable] = useState("");

  const fetchAll = async () => {
    const [uRes, mRes, rRes, cRes, tRes, sRes, pRes] = await Promise.all([
      supabase.from("profiles").select("id, full_name, institution, role_label, created_at").order("created_at", { ascending: false }),
      supabase.from("manuscripts").select("id, title, status, created_at, submitted_by").order("created_at", { ascending: false }),
      supabase.from("research_submissions").select("id, paper_title, status, created_at, submitted_by").order("created_at", { ascending: false }),
      supabase.from("citations").select("id, title, status, created_at, submitted_by").order("created_at", { ascending: false }),
      supabase.from("tribal_records").select("id, community_name, status, created_at, submitted_by").order("created_at", { ascending: false }),
      supabase.from("architecture_sites").select("id, name, status, created_at, submitted_by").order("created_at", { ascending: false }),
      supabase.from("philosophical_schools").select("id, name, status, created_at, submitted_by").order("created_at", { ascending: false }),
    ]);

    // Fetch resources & activity log
    const [resRes, actRes] = await Promise.all([
      supabase.from("resource_tracker" as any).select("id, title, resource_type, mime_type, file_size_bytes, file_url, created_at").order("created_at", { ascending: false }).limit(50),
      supabase.from("activity_log" as any).select("id, user_id, action, entity_type, created_at").order("created_at", { ascending: false }).limit(50),
    ]);

    if (uRes.data) setUsers(uRes.data as any);
    if (mRes.data) setManuscripts(mRes.data as any);
    if (rRes.data) setResearch(rRes.data as any);
    if (cRes.data) setCitations(cRes.data as any);
    if (tRes.data) setTribal(tRes.data as any);
    if (sRes.data) setSites(sRes.data as any);
    if (pRes.data) setSchools(pRes.data as any);
    if (resRes.data) setResources(resRes.data as any);
    if (actRes.data) setActivityLog(actRes.data as any);

    const allContent = [...(mRes.data || []), ...(rRes.data || []), ...(cRes.data || []), ...(tRes.data || []), ...(sRes.data || []), ...(pRes.data || [])];
    setStats({
      users: uRes.data?.length || 0,
      pending: allContent.filter((c: any) => c.status === "pending").length,
      approved: allContent.filter((c: any) => c.status === "approved").length,
      total: allContent.length,
      files: resRes.data?.length || 0,
    });
  };

  useEffect(() => { fetchAll(); }, []);

  const updateStatus = async (table: string, id: string, status: string) => {
    const { error } = await supabase.from(table as any).update({ status, reviewed_by: user?.id, reviewed_at: new Date().toISOString() } as any).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Item ${status}` });
      await supabase.from("activity_log" as any).insert({ user_id: user?.id, action: `${status}_content`, entity_type: table, entity_id: id } as any);
      fetchAll();
    }
  };

  const bulkUpdateStatus = async (table: string, ids: string[], status: string) => {
    if (ids.length === 0) return;
    for (const id of ids) {
      await supabase.from(table as any).update({ status, reviewed_by: user?.id, reviewed_at: new Date().toISOString() } as any).eq("id", id);
    }
    toast({ title: `${ids.length} items ${status}` });
    setSelectedIds(new Set());
    fetchAll();
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const assignRole = async (userId: string, role: string) => {
    const { error } = await supabase.from("user_roles" as any).upsert({ user_id: userId, role } as any, { onConflict: "user_id,role" });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Role assigned: ${role}` });
      await supabase.from("activity_log" as any).insert({ user_id: user?.id, action: "assign_role", entity_type: "user_roles", metadata: { target_user: userId, role } } as any);
    }
  };

  const getLabel = (item: ContentItem) => item.title || item.name || item.paper_title || item.community_name || "Untitled";

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const ContentTable = ({ items, table }: { items: ContentItem[]; table: string }) => (
    <div className="space-y-3">
      {selectedIds.size > 0 && bulkTable === table && (
        <div className="flex items-center gap-2 p-2 bg-secondary rounded">
          <span className="text-xs font-body text-muted-foreground">{selectedIds.size} selected</span>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => bulkUpdateStatus(table, [...selectedIds], "approved")}>
            <Check className="h-3 w-3 mr-1" /> Approve All
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs text-destructive" onClick={() => bulkUpdateStatus(table, [...selectedIds], "rejected")}>
            <X className="h-3 w-3 mr-1" /> Reject All
          </Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs">
              <th className="text-left py-2 px-3 w-8">
                <input type="checkbox" onChange={(e) => {
                  if (e.target.checked) {
                    setBulkTable(table);
                    setSelectedIds(new Set(items.map(i => i.id)));
                  } else {
                    setSelectedIds(new Set());
                  }
                }} />
              </th>
              <th className="text-left py-2 px-3">Title</th>
              <th className="text-left py-2 px-3">Status</th>
              <th className="text-left py-2 px-3">Date</th>
              <th className="text-right py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={5} className="text-center py-6 text-muted-foreground">No items yet</td></tr>
            )}
            {items.map(item => (
              <tr key={item.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-3">
                  <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => { setBulkTable(table); toggleSelect(item.id); }} />
                </td>
                <td className="py-3 px-3 font-medium text-foreground">{getLabel(item)}</td>
                <td className="py-3 px-3">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColors[item.status] || ""}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-muted-foreground text-xs">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-3 text-right space-x-1">
                  {item.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(table, item.id, "approved")}>
                        <Check className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs text-destructive" onClick={() => updateStatus(table, item.id, "rejected")}>
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {item.status === "approved" && (
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(table, item.id, "pending")}>
                      <Clock className="h-3 w-3 mr-1" /> Unpublish
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Layout>
      <section className="py-8 bg-card border-b border-border">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="font-body text-sm text-muted-foreground">Manage content, users, files & analytics</p>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            {[
              { label: "Total Users", value: stats.users, icon: Users, color: "text-blue-600" },
              { label: "Pending Review", value: stats.pending, icon: Clock, color: "text-yellow-600" },
              { label: "Approved", value: stats.approved, icon: Check, color: "text-green-600" },
              { label: "Total Submissions", value: stats.total, icon: BarChart3, color: "text-primary" },
              { label: "Tracked Files", value: stats.files, icon: Database, color: "text-violet-600" },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-lg border border-border bg-background">
                <s.icon className={`h-5 w-5 ${s.color} mb-1`} />
                <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
                <p className="font-body text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6 bg-background">
        <div className="container">
          <Tabs defaultValue="manuscripts" className="w-full">
            <TabsList className="flex flex-wrap gap-1 mb-6 h-auto">
              <TabsTrigger value="manuscripts" className="font-body text-xs gap-1"><FileText className="h-3 w-3" /> Manuscripts</TabsTrigger>
              <TabsTrigger value="research" className="font-body text-xs gap-1"><BookOpen className="h-3 w-3" /> Research</TabsTrigger>
              <TabsTrigger value="citations" className="font-body text-xs gap-1"><Quote className="h-3 w-3" /> Citations</TabsTrigger>
              <TabsTrigger value="sites" className="font-body text-xs gap-1"><Landmark className="h-3 w-3" /> Sites</TabsTrigger>
              <TabsTrigger value="schools" className="font-body text-xs gap-1"><Brain className="h-3 w-3" /> Philosophy</TabsTrigger>
              <TabsTrigger value="tribal" className="font-body text-xs gap-1"><Globe className="h-3 w-3" /> Tribal</TabsTrigger>
              <TabsTrigger value="resources" className="font-body text-xs gap-1"><Database className="h-3 w-3" /> Resources</TabsTrigger>
              <TabsTrigger value="activity" className="font-body text-xs gap-1"><Activity className="h-3 w-3" /> Activity</TabsTrigger>
              <TabsTrigger value="users" className="font-body text-xs gap-1"><Users className="h-3 w-3" /> Users</TabsTrigger>
            </TabsList>

            <TabsContent value="manuscripts"><ContentTable items={manuscripts} table="manuscripts" /></TabsContent>
            <TabsContent value="research"><ContentTable items={research} table="research_submissions" /></TabsContent>
            <TabsContent value="citations"><ContentTable items={citations} table="citations" /></TabsContent>
            <TabsContent value="sites"><ContentTable items={sites} table="architecture_sites" /></TabsContent>
            <TabsContent value="schools"><ContentTable items={schools} table="philosophical_schools" /></TabsContent>
            <TabsContent value="tribal"><ContentTable items={tribal} table="tribal_records" /></TabsContent>

            {/* Resource Tracker */}
            <TabsContent value="resources">
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs">
                      <th className="text-left py-2 px-3">Title</th>
                      <th className="text-left py-2 px-3">Type</th>
                      <th className="text-left py-2 px-3">MIME</th>
                      <th className="text-left py-2 px-3">Size</th>
                      <th className="text-left py-2 px-3">Date</th>
                      <th className="text-right py-2 px-3">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-6 text-muted-foreground">No tracked resources yet</td></tr>
                    )}
                    {resources.map(r => (
                      <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-3 font-medium text-foreground">{r.title}</td>
                        <td className="py-3 px-3"><Badge variant="secondary" className="text-xs">{r.resource_type}</Badge></td>
                        <td className="py-3 px-3 text-muted-foreground text-xs">{r.mime_type || "—"}</td>
                        <td className="py-3 px-3 text-muted-foreground text-xs">{formatFileSize(r.file_size_bytes)}</td>
                        <td className="py-3 px-3 text-muted-foreground text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-3 text-right">
                          {r.file_url && (
                            <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">View</a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Activity Log */}
            <TabsContent value="activity">
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs">
                      <th className="text-left py-2 px-3">Action</th>
                      <th className="text-left py-2 px-3">Entity</th>
                      <th className="text-left py-2 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLog.length === 0 && (
                      <tr><td colSpan={3} className="text-center py-6 text-muted-foreground">No activity logged yet</td></tr>
                    )}
                    {activityLog.map(a => (
                      <tr key={a.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-3 font-medium text-foreground">{a.action}</td>
                        <td className="py-3 px-3 text-muted-foreground text-xs">{a.entity_type || "—"}</td>
                        <td className="py-3 px-3 text-muted-foreground text-xs">{new Date(a.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Users */}
            <TabsContent value="users">
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs">
                      <th className="text-left py-2 px-3">Name</th>
                      <th className="text-left py-2 px-3">Institution</th>
                      <th className="text-left py-2 px-3">Type</th>
                      <th className="text-left py-2 px-3">Joined</th>
                      <th className="text-right py-2 px-3">Assign Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-3 font-medium text-foreground">{u.full_name || "—"}</td>
                        <td className="py-3 px-3 text-muted-foreground">{u.institution || "—"}</td>
                        <td className="py-3 px-3"><Badge variant="secondary" className="text-xs">{u.role_label || "Contributor"}</Badge></td>
                        <td className="py-3 px-3 text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Select value={roleChanges[u.id] || ""} onValueChange={v => setRoleChanges(p => ({ ...p, [u.id]: v }))}>
                              <SelectTrigger className="w-32 h-7 text-xs font-body"><SelectValue placeholder="Select role" /></SelectTrigger>
                              <SelectContent>
                                {["user", "scholar", "institution", "moderator", "admin"].map(r => (
                                  <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button size="sm" variant="outline" className="h-7 text-xs" disabled={!roleChanges[u.id]} onClick={() => roleChanges[u.id] && assignRole(u.id, roleChanges[u.id])}>
                              Assign
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default AdminPage;
