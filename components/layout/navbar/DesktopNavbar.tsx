"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import UserPill from "./UserPill";
import type { Brand, NavLink, NavProfile } from "./types";

type Props = {
  brand: Brand;
  links: NavLink[];
  authed: boolean;
  profile: NavProfile | null;
  isActive: (href: string) => boolean;
  linkCls: (href: string) => string;
  onSignOut: () => Promise<void>;
};

export default function DesktopNavbar({
  brand,
  links,
  authed,
  profile,
  isActive,
  linkCls,
  onSignOut,
}: Props) {
  return (
    <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] h-16 items-center max-w-7xl mx-auto px-6">
      {/* Brand */}
      <Link
        href="/"
        aria-label={`${brand.title} home`}
        className="flex items-center gap-2 md:justify-self-start"
      >
        <Image src={brand.logo} alt="Logo" width={40} height={40} className="h-10 w-10 object-contain" />
        <div className="hidden sm:flex flex-col leading-tight min-w-0">
          <span className="truncate text-base font-semibold tracking-tight">{brand.title}</span>
          {brand.subtitle && (
            <span className="truncate text-xs sm:text-sm text-muted-foreground">{brand.subtitle}</span>
          )}
        </div>
      </Link>

      {/* Links (centered) */}
      <nav className="flex items-center justify-center gap-1" aria-label="Primary">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={linkCls(l.href)}
            aria-current={isActive(l.href) ? "page" : undefined}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-2 md:justify-self-end">
        <ThemeSwitcher />
        {!authed ? (
          <>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="rounded-lg">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="rounded-lg">Sign Up</Button>
            </Link>
          </>
        ) : (
          <UserPill
            name={profile?.full_name ?? undefined}
            email={profile?.email ?? undefined}
            avatarUrl={profile?.avatar_url ?? undefined}
            onSignOut={onSignOut}
          />
        )}
      </div>
    </div>
  );
}
