"use client";

import * as React from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

function getOrigin() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

type GoogleAuthButtonProps = {
  next: string; // where to redirect after login/signup
};

export function GoogleAuthButton({ next }: GoogleAuthButtonProps) {
  const [loading, setLoading] = React.useState(false);

  async function handleClick() {
    setLoading(true);
    const supabase = supabaseBrowser();
    const origin = getOrigin();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: { prompt: "select_account" },
      },
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 rounded-md border px-4 py-2 hover:bg-neutral-50 disabled:opacity-50"
    >
      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3">
        <path d="M533.5 278.4c0-17.4-1.5-34.1-4.4-50.4H272.1v95.4h147c-6.4 34.9-25.6 64.4-54.5 84.3v69h87.9c51.4-47.3 80-116.9 80-198.3z" fill="#4285f4"/>
        <path d="M272.1 544.3c72.9 0 134.1-24.1 178.8-65.4l-87.9-69c-24.4 16.4-55.7 26-90.9 26-69.9 0-129-47.2-150.2-110.7h-91.4v69.8c44.8 88.4 136.8 149.3 241.6 149.3z" fill="#34a853"/>
        <path d="M121.9 325.2c-10.6-31.9-10.6-66.4 0-98.3v-69.8H30.5c-43.7 86.8-43.7 188.1 0 274.9l91.4-69.8z" fill="#fbbc04"/>
        <path d="M272.1 107.7c38.6-.6 75.5 13.6 103.8 39.8l77.3-77.3C403.6 24.4 341.8-1 272.1 0 167.3 0 75.3 60.9 30.5 157.1l91.4 69.8c21.1-63.5 80.3-110.7 150.2-110.7z" fill="#ea4335"/>
      </svg>
      {loading ? "Redirecting…" : "Continue with Google"}
    </button>
  );
}
