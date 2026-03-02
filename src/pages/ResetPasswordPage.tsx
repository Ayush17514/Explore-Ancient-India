import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { KeyRound } from "lucide-react";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated!" });
      navigate("/login");
    }
  };

  if (!ready) {
    return (
      <Layout>
        <section className="py-16 bg-background">
          <div className="container max-w-md text-center">
            <p className="font-body text-muted-foreground">Invalid or expired reset link.</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 bg-background">
        <div className="container max-w-md">
          <div className="p-8 rounded-lg border border-border bg-card text-center">
            <KeyRound className="h-10 w-10 text-primary mx-auto mb-3" />
            <h1 className="font-heading text-2xl font-bold text-foreground">Set New Password</h1>
            <form onSubmit={handleUpdate} className="space-y-4 mt-4 text-left">
              <div>
                <Label className="font-body text-xs">New Password</Label>
                <Input className="mt-1 font-body text-sm" type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
              </div>
              <Button type="submit" className="w-full font-body" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResetPasswordPage;
