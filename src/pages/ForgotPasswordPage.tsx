import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    <Layout>
      <section className="py-16 bg-background">
        <div className="container max-w-md">
          <div className="p-8 rounded-lg border border-border bg-card text-center">
            <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
            <h1 className="font-heading text-2xl font-bold text-foreground">Reset Password</h1>
            {sent ? (
              <p className="font-body text-sm text-muted-foreground mt-4">Check your email for a password reset link.</p>
            ) : (
              <form onSubmit={handleReset} className="space-y-4 mt-4 text-left">
                <div>
                  <Label className="font-body text-xs">Email</Label>
                  <Input className="mt-1 font-body text-sm" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full font-body" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}
            <Link to="/login" className="text-xs font-body text-primary hover:underline mt-4 block">Back to login</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPasswordPage;
