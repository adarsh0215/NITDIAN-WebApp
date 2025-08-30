"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";
import AuthCard from "@/components/auth/AuthCard";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  const router = useRouter();
  const NEXT = "/dashboard"; // after success you can route to /login if you prefer

  const [ready, setReady] = React.useState(false);
  const [hasSession, setHasSession] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    // Verify we have a recovery session from Supabase
    const supabase = supabaseBrowser();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setReady(true);
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast.success("Password updated.");
      // Users are typically signed-in after recovery; route them forward
      router.replace(NEXT);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <AuthShell>
        <div className="rounded-2xl border bg-card p-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking session…
          </div>
        </div>
      </AuthShell>
    );
  }

  if (!hasSession) {
    // If a user opens /auth/reset directly (no recovery token), guide them
    return (
      <AuthShell>
        <AuthCard
          title="Reset link required"
          subtitle="Open the password reset link from your email to continue."
          dividerText={undefined}
          socialSlot={null}
          footer={
            <p className="text-sm text-muted-foreground text-center">
              Go back to{" "}
              <a href="/auth/login" className="font-medium text-primary hover:underline">
                Log in
              </a>{" "}
              or request a new reset link from there.
            </p>
          }
        >
          <div className="text-sm text-muted-foreground">
            This page needs a valid recovery session from Supabase. Click the password
            reset link in your email again, and you’ll land here with the session active.
          </div>
        </AuthCard>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <AuthCard
        title="Set a new password"
        subtitle="Choose a strong password you’ll remember"
        dividerText={undefined}
        socialSlot={null}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              New password
            </label>
            <div className="relative">
              <input
                id="password"
                type={show ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 pr-10 text-sm outline-none focus-visible:ring-2 ring-ring"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:opacity-80"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              At least 8 characters. Use a mix of letters, numbers, and symbols.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm" className="text-sm font-medium">
              Confirm password
            </label>
            <input
              id="confirm"
              type={show ? "text" : "password"}
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 ring-ring"
              autoComplete="new-password"
            />
          </div>

          <button
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium bg-primary text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
