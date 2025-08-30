"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import AuthShell from "@/components/auth/AuthShell";
import AuthCard from "@/components/auth/AuthCard";
// import AuthTroubleRow from "@/components/auth/AuthTroubleRow";
// import TermsNote from "@/components/auth/TermsNote";

export const dynamic = "force-dynamic";

// function getOrigin() {
//   if (typeof window !== "undefined") return window.location.origin;
//   return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
// }

export default function SignupPage() {
  const router = useRouter();
  const NEXT = "/onboarding";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. Check email if confirmation is required.");
    router.replace(NEXT);
  }

  // async function onMagicLinkRequest(targetEmail: string) {
  //   try {
  //     setLoading(true);
  //     const supabase = supabaseBrowser();
  //     const { error } = await supabase.auth.signInWithOtp({
  //       email: targetEmail,
  //       options: { emailRedirectTo: `${getOrigin()}/auth/callback?next=${encodeURIComponent(NEXT)}` },
  //     });
  //     if (error) throw error;
  //     toast.success("Magic link sent. Check your email.");
  //   } catch (err: unknown) {
  //     toast.error(err instanceof Error ? err.message : "Failed to send magic link");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // async function onResetPasswordRequest(targetEmail: string) {
  //   try {
  //     setLoading(true);
  //     const supabase = supabaseBrowser();
  //     const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
  //       redirectTo: `${getOrigin()}/auth/reset`,
  //     });
  //     if (error) throw error;
  //     toast.success("Password reset email sent.");
  //   } catch (err: unknown) {
  //     toast.error(err instanceof Error ? err.message : "Failed to send reset email");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <AuthShell>
      <AuthCard
        title="Create your account"
        subtitle="Join the NIT Durgapur alumni network"
        socialSlot={<GoogleAuthButton next={NEXT} />}
        dividerText="or sign up with email"
        footer={
          <>
            {/* <AuthTroubleRow
              currentEmail={email}
              onMagicLink={onMagicLinkRequest}
              onResetPassword={onResetPasswordRequest}
              loading={loading}
            /> */}
            <p className="mt-3 text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
            {/* <TermsNote /> */}
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 ring-ring"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 ring-ring"
              autoComplete="new-password"
            />
          </div>
          <button
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium bg-primary text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
