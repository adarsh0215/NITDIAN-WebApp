import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

function safeNext(raw: string | null) {
  if (!raw) return "/dashboard";           // default after login
  if (!raw.startsWith("/")) return "/dashboard";
  return raw;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  if (!code) {
    // No OAuth code -> go home (or login)
    return NextResponse.redirect(new URL("/", req.url));
  }

  const supabase = await supabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const back = new URL("/auth/login", req.url);
    back.searchParams.set("message", "Google sign-in failed");
    return NextResponse.redirect(back);
  }

  // Session cookie is now set → redirect to intended page
  return NextResponse.redirect(new URL(next, req.url));
}
