// app/layout/navbar/NavbarShell.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import type { NavProfile } from "./Navbar";
import UserPill from "./UserPill"; // assumes you have this file
import ThemeSwitcher from "@/components/ui/theme-switcher"; // your existing switcher

function cn(...a: Array<string | undefined | false>) {
  return a.filter(Boolean).join(" ");
}

type Props = {
  authed: boolean;
  profile: NavProfile | null;
  links: Array<{ label: string; href: string }>;
};

/* ---------------- Nav link (desktop) ---------------- */
const NavLink = React.memo(function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex h-10 items-center rounded-full px-3 text-sm font-medium transition-colors",
        "text-muted-foreground hover:text-foreground hover:bg-muted",
        active &&
          "text-foreground after:absolute after:-bottom-2 after:left-4 after:right-4 after:h-[2px] after:bg-foreground/80 after:rounded-full"
      )}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
});

/* ---------------- Focus helpers ---------------- */
function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
}

/* ========================================================= */

export default function NavbarShell({ authed, profile, links }: Props) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const panelRef = React.useRef<HTMLElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);
  const menuBtnRef = React.useRef<HTMLButtonElement>(null);

  /* Close menu on route change */
  React.useEffect(() => setOpen(false), [pathname]);

  /* Close on Esc, trap focus, and lock scroll while open */
  React.useEffect(() => {
    if (!open) return;

    // lock background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // focus management
    closeBtnRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const f = getFocusable(panelRef.current);
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  /* Auto-close if viewport grows to md+ (avoid stale overlay) */
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-3 md:px-4">
        {/* Left: Brand */}
        <Link href="/" aria-label="NITDIAN home" className="flex items-center gap-2">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg text-primary">
            <Image
              src="/images/logo.png"
              alt="NIT Durgapur Alumni logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </span>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-tight">NIT Durgapur</span>
            <span className="text-sm font-medium text-muted-foreground tracking-tight">
              International Alumni Network
            </span>
          </div>
        </Link>

        {/* Center: Nav (desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-1" aria-label="Primary">
          {links.map((l) => (
            <NavLink key={l.href} href={l.href} label={l.label} />
          ))}
        </nav>

        {/* Right: Theme + Auth (desktop) & Menu (mobile) */}
        <div className="flex items-center justify-end gap-1 md:gap-2">
          {/* Theme */}
          <ThemeSwitcher />

          {/* Auth (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {!authed ? (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="rounded-lg">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="rounded-lg">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <UserPill
                name={profile?.full_name ?? "Member"}
                email={profile?.email ?? undefined}
                avatarUrl={profile?.avatar_url ?? undefined}
              />
            )}
          </div>

          {/* Mobile menu button */}
          <button
            ref={menuBtnRef}
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside
            ref={panelRef}
            id="mobile-nav"
            className="fixed right-0 top-0 z-[51] h-full w-[88vw] max-w-[360px] bg-background border-l shadow-xl p-4 flex flex-col outline-none"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2"
                aria-label="NITDIAN home"
                onClick={() => setOpen(false)}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-primary">
                  <Image
                    src="/images/logo.png"
                    alt="NIT Durgapur Alumni logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </span>
                <span className="font-semibold tracking-tight">NIT Durgapur</span>
              </Link>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => menuBtnRef.current?.focus(), 0);
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* CTA / User at top */}
            <div className="mt-4 grid gap-2">
              {!authed ? (
                <>
                  <Link href="/auth/signup" onClick={() => setOpen(false)}>
                    <Button className="w-full rounded-lg">Sign Up</Button>
                  </Link>
                  <Link href="/auth/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full rounded-lg">
                      Login
                    </Button>
                  </Link>
                </>
              ) : (
                <UserPill
                  name={profile?.full_name ?? "Member"}
                  email={profile?.email ?? undefined}
                  avatarUrl={profile?.avatar_url ?? undefined}
                />
              )}
            </div>

            {/* Nav list */}
            <div className="mt-4 flex-1 overflow-auto">
              <nav className="grid gap-1" aria-label="Mobile navigation">
                {links.map((l) => {
                  const active =
                    pathname === l.href ||
                    (l.href !== "/" && pathname?.startsWith(l.href));
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm hover:bg-muted",
                        active && "bg-muted text-foreground font-medium"
                      )}
                    >
                      {l.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Theme at bottom */}
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeSwitcher />
              </div>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
