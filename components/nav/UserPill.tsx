"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export type UserMeta = {
  email?: string | null;
  name?: string | null;
  avatar_url?: string | null;
};

function initials(name?: string | null, email?: string | null) {
  const base = (name || email || "").trim();
  if (!base) return "U";
  const parts = base.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "U";
}

export function UserPill({ user }: { user: UserMeta }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  async function signOut() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    setOpen(false);
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border px-3 py-1.5 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-black/10"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar_url} alt="" className="h-6 w-6 rounded-full object-cover" />
        ) : (
          <div className="h-6 w-6 rounded-full bg-neutral-200 text-xs flex items-center justify-center">
            {initials(user.name, user.email)}
          </div>
        )}
        <span className="max-w-[120px] truncate text-sm">{user.name || user.email}</span>
        <svg className="h-4 w-4 opacity-60" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M5.25 7.5 10 12.25 14.75 7.5h-9.5z" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 overflow-hidden rounded-md border bg-white shadow-md"
          onMouseLeave={() => setOpen(false)}
        >
          <Link href="/dashboard" className="block px-3 py-2 text-sm hover:bg-neutral-50" role="menuitem" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <button onClick={signOut} className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-50" role="menuitem">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
