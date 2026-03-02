import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!" });
      navigate("/");
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
              <h1 className="font-heading text-2xl font-bold text-foreground">Sign In</h1>
              <p className="font-body text-sm text-muted-foreground mt-1">Access the Digital Nalanda Archive</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label className="font-body text-xs">Email</Label>
                <Input className="mt-1 font-body text-sm" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div>
                <Label className="font-body text-xs">Password</Label>
                <div className="relative mt-1">
                  <Input className="font-body text-sm pr-10" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs font-body text-primary hover:underline">Forgot password?</Link>
              </div>
              <Button type="submit" className="w-full font-body" disabled={loading}>
                <LogIn className="h-4 w-4 mr-2" /> {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <p className="text-center text-xs font-body text-muted-foreground mt-4">
              Don't have an account? <Link to="/signup" className="text-primary hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;
