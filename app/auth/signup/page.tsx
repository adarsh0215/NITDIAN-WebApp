"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabaseBrowser } from "@/lib/supabase/client";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

export const dynamic = "force-dynamic";

function safePath(raw: string | null): string {
  if (!raw) return "/onboarding";
  if (!raw.startsWith("/")) return "/onboarding";
  return raw;
}

function SignupInner() {
  const sp = useSearchParams();
  const next = safePath(sp.get("next"));
  const router = useRouter();

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
    router.replace(next);
  }

  return (
    <main className="mx-auto max-w-sm space-y-6">
      <h1 className="text-2xl font-semibold">Sign up</h1>

      <GoogleAuthButton next={next} />

      <div className="text-center text-xs text-neutral-500">or</div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm">Email</label>
          <input className="w-full rounded-md border px-3 py-2" type="email" value={email}
                 onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Password</label>
          <input className="w-full rounded-md border px-3 py-2" type="password" value={password}
                 onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button disabled={loading} className="w-full rounded-md border px-4 py-2">
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-neutral-600">
        Already have an account? <Link href="/auth/login" className="underline">Log in</Link>
      </p>
    </main>
  );
}

export default function SignupPage() {
  return <Suspense fallback={<div className="p-6">Loading…</div>}><SignupInner /></Suspense>;
}
