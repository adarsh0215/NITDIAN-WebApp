"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabaseBrowser } from "@/lib/supabase/client";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

// prevent prerender headaches
export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();
  const NEXT = "/dashboard";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Logged in");
    router.replace(NEXT);
  }

  return (
    <main className="mx-auto max-w-sm space-y-6">
      <h1 className="text-2xl font-semibold">Log in</h1>

      <GoogleAuthButton next={NEXT} />

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
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-sm text-neutral-600">
        No account? <Link href="/auth/signup" className="underline">Sign up</Link>
      </p>
    </main>
  );
}
