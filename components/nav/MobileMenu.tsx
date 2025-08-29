"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { UserMeta } from "./UserPill";

type Props = { user?: UserMeta | null };

export default function MobileMenu({ user }: Props) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  async function signOut() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    setOpen(false);
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="md:hidden">
      <button
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-black/10"
      >
        {/* Hamburger / X */}
        {open ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <nav className="mx-auto max-w-5xl px-4 py-4">
            <ul className="space-y-2">
              <li><Link href="/#benefits" className="block rounded-md px-3 py-2 text-sm hover:bg-neutral-50" onClick={() => setOpen(false)}>Benefits</Link></li>
              <li><Link href="/#chapters" className="block rounded-md px-3 py-2 text-sm hover:bg-neutral-50" onClick={() => setOpen(false)}>Chapters</Link></li>
              <li><Link href="/#contact" className="block rounded-md px-3 py-2 text-sm hover:bg-neutral-50" onClick={() => setOpen(false)}>Contact</Link></li>

              {user ? (
                <>
                  <li><Link href="/dashboard" className="block rounded-md px-3 py-2 text-sm hover:bg-neutral-50" onClick={() => setOpen(false)}>Dashboard</Link></li>
                  <li><button onClick={signOut} className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-neutral-50">Sign out</button></li>
                </>
              ) : (
                <>
                  <li><Link href="/auth/login" className="block rounded-md px-3 py-2 text-sm hover:bg-neutral-50" onClick={() => setOpen(false)}>Log in</Link></li>
                  <li><Link href="/auth/signup" className="block rounded-md px-3 py-2 text-sm hover:bg-neutral-900 hover:text-white" onClick={() => setOpen(false)}>Sign up</Link></li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
