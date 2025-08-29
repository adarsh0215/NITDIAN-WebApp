import Link from "next/link";
import UserPill, { type UserMeta } from "@/components/nav/UserPill";
import { supabaseServer } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const userMeta: UserMeta | null = user
    ? {
        email: user.email,
        name:
          (user.user_metadata?.name as string | undefined) ??
          (user.user_metadata?.full_name as string | undefined) ??
          null,
        avatarUrl:
          (user.user_metadata?.avatar_url as string | undefined) ?? null,
      }
    : null;

  return (
    <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-md bg-black" />
          <span className="text-sm font-semibold tracking-tight">
            NITDIAN Alumni
          </span>
        </Link>

        {/* Primary nav (hidden on small) */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/#benefits" className="text-sm hover:underline">
            Benefits
          </Link>
          <Link href="/#chapters" className="text-sm hover:underline">
            Chapters
          </Link>
          <Link href="/#contact" className="text-sm hover:underline">
            Contact
          </Link>

          {userMeta ? (
            <UserPill user={userMeta} />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile actions */}
        <div className="md:hidden">
          {userMeta ? (
            <UserPill user={userMeta} />
          ) : (
            <Link
              href="/auth/login"
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
            >
              Menu
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
