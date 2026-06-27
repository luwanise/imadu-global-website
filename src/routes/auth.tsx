import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — Imadu Global Concepts" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back");
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      toast.error((err as Error).message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <section className="container-page py-20 max-w-md">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 font-display text-4xl text-charcoal">Sign in</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Restricted area. Only authorised staff can access the dashboard. New
          accounts are provisioned by the site owner — public sign-up is disabled.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <div>
            <label className="text-sm text-charcoal mb-2 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-input rounded-sm bg-background px-4 py-2.5 text-sm focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine"
            />
          </div>
          <div>
            <label className="text-sm text-charcoal mb-2 block">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-input rounded-sm bg-background px-4 py-2.5 text-sm focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-sm bg-wine px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-wine-deep disabled:opacity-60 transition-colors"
          >
            {loading ? "Working…" : "Sign in"}
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}
