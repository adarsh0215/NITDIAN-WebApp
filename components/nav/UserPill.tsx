"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

export type UserMeta = {
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
};

/** Generate a deterministic number from a string */
function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

/** Pick a color from a fixed palette */
function pickColor(str: string) {
  const colors = [
    "#3B82F6", // blue-500
    "#10B981", // green-500
    "#F59E0B", // amber-500
    "#EF4444", // red-500
    "#8B5CF6", // violet-500
    "#EC4899", // pink-500
    "#14B8A6", // teal-500
  ];
  const idx = Math.abs(hashCode(str)) % colors.length;
  return colors[idx];
}

function Initials({ name, email }: { name?: string | null; email?: string | null }) {
  const base = name || email || "U";
  const text =
    base
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const bg = pickColor(base);

  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: bg }}
    >
      {text}
    </div>
  );
}

export default function UserPill({ user }: { user: UserMeta }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-neutral-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {/* Avatar with fallback */}
        {user.avatarUrl && !imageError ? (
          <Image
            src={user.avatarUrl}
            alt={user.name ?? "User"}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <Initials name={user.name} email={user.email} />
        )}

        <span className="hidden text-sm md:block">
          {user.name ?? user.email ?? "Account"}
        </span>
        <svg
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.127l3.71-3.896a.75.75 0 111.08 1.04l-4.25 4.47a.75.75 0 01-1.08 0l-4.25-4.47a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-md border bg-white shadow-md"
        >
          <div className="px-3 py-2 text-xs text-neutral-600">{user.email}</div>
          <Link
            href="/dashboard"
            className="block px-3 py-2 text-sm hover:bg-neutral-50"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/settings/profile"
            className="block px-3 py-2 text-sm hover:bg-neutral-50"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
