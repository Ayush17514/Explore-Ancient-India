import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Eye, EyeOff } from "lucide-react";

const roles = [
  { value: "user", label: "General Contributor" },
  { value: "scholar", label: "Scholar / Researcher" },
  { value: "institution", label: "Institution" },
];

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [roleLabel, setRoleLabel] = useState("user");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || password.length < 6 || !fullName.trim()) {
      toast({ title: "Please fill all required fields", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName.trim(), institution, role_label: roles.find(r => r.value === roleLabel)?.label },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Verification email sent", description: "Please check your inbox to verify your email before signing in." });
      navigate("/login");
    }
  };

  return (
    <Layout>
      <section className="py-16 bg-background">
        <div className="container max-w-md">
          <div className="p-8 rounded-lg border border-border bg-card">
            <div className="text-center mb-6">
              <div className="h-12 w-12 rounded bg-primary flex items-center justify-center mx-auto mb-3">
                <span className="font-heading text-xl font-bold text-primary-foreground">N</span>
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Create Account</h1>
              <p className="font-body text-sm text-muted-foreground mt-1">Join the Digital Nalanda community</p>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label className="font-body text-xs">Full Name *</Label>
                <Input className="mt-1 font-body text-sm" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" required />
              </div>
              <div>
                <Label className="font-body text-xs">Email *</Label>
                <Input className="mt-1 font-body text-sm" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div>
                <Label className="font-body text-xs">Password *</Label>
                <div className="relative mt-1">
                  <Input className="font-body text-sm pr-10" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label className="font-body text-xs">Role</Label>
                <Select value={roleLabel} onValueChange={setRoleLabel}>
                  <SelectTrigger className="mt-1 font-body text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {roles.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-body text-xs">Institution (optional)</Label>
                <Input className="mt-1 font-body text-sm" value={institution} onChange={e => setInstitution(e.target.value)} placeholder="University or organization" />
              </div>
              <Button type="submit" className="w-full font-body" disabled={loading}>
                <UserPlus className="h-4 w-4 mr-2" /> {loading ? "Creating..." : "Create Account"}
              </Button>
            </form>
            <p className="text-center text-xs font-body text-muted-foreground mt-4">
              Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SignupPage;
