import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { UserPill, type UserMeta } from "@/components/nav/UserPill";
import MobileMenu from "@/components/nav/MobileMenu";

export default async function Navbar() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const userMeta: UserMeta | null = user
    ? {
        email: user.email,
        name:
          (user.user_metadata?.full_name as string | undefined) ||
          (user.user_metadata?.name as string | undefined) ||
          null,
        avatar_url:
          (user.user_metadata?.avatar_url as string | undefined) ||
          (user.user_metadata?.picture as string | undefined) ||
          null,
      }
    : null;

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-black" aria-hidden="true" />
          <span className="font-semibold">NITDIAN Alumni</span>
        </Link>

        {/* Desktop: Nav links */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/#benefits" className="text-sm text-neutral-700 hover:underline">
            Benefits
          </Link>
          <Link href="/#chapters" className="text-sm text-neutral-700 hover:underline">
            Chapters
          </Link>
          <Link href="/#contact" className="text-sm text-neutral-700 hover:underline">
            Contact
          </Link>
        </nav>

        {/* Desktop: CTAs or user pill */}
        <div className="hidden items-center gap-3 md:flex">
          {userMeta ? (
            <UserPill user={userMeta} />
          ) : (
            <>
              <Link href="/auth/login" className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50">
                Log in
              </Link>
              <Link href="/auth/signup" className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-900 hover:text-white">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile: Hamburger */}
        <MobileMenu user={userMeta} />
      </div>
    </header>
  );
}
