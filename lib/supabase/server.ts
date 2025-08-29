// lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Works with Next 14 (sync cookies()) and Next 15 (async cookies()).
 * We always `await` — awaiting a non-promise is a no-op, so it's universal.
 */
export async function supabaseServer() {
  const cookieStore = await cookies(); // Next 15 returns a Promise; Next 14 is fine to await too.

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // In some edge runtimes the cookie store can be readonly.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Ignore if readonly.
          }
        },
      },
    }
  );
}
