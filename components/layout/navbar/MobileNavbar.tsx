"use client";

import * as React from "react";
import ReactDOM from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import type { Brand, NavLink } from "./types";

function BodyPortal({ children }: { children: React.ReactNode }) {
  const [mount, setMount] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    const node = document.createElement("div");
    node.style.position = "relative";
    node.style.zIndex = "100";
    document.body.appendChild(node);
    setMount(node);

    // cleanup
    return () => {
      document.body.removeChild(node);
    };
  }, []);

  if (!mount) return null;
  return ReactDOM.createPortal(children, mount);
}


type Props = {
  brand: Brand;
  links: NavLink[];
  linkCls: (href: string) => string;
  authed: boolean;
  onSignOut: () => Promise<void>;
};

export default function MobileNavbar({
  brand,
  links,
  linkCls,
  authed,
  onSignOut,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Scroll lock while open
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev || "";
    return () => { document.body.style.overflow = prev || ""; };
  }, [open]);

  // Esc to close
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setTimeout(() => triggerRef.current?.focus(), 0);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden flex h-16 items-center justify-between max-w-7xl mx-auto px-3">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2" aria-label={`${brand.title} home`}>
        <Image src={brand.logo} alt="Logo" width={40} height={40} className="h-10 w-10 object-contain" />
        <span className="font-semibold">{brand.title}</span>
      </Link>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <ThemeSwitcher variant="icon" />
        <Button
          ref={triggerRef}
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {open && (
        <BodyPortal>
          {/* Solid dark overlay (theme-agnostic) */}
          <div
            className="fixed inset-0 z-[95] mix-blend-normal isolate"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={() => {
              setOpen(false);
              setTimeout(() => triggerRef.current?.focus(), 0);
            }}
            aria-hidden="true"
          />

          {/* Drawer on bg-surface (solid in both themes) */}
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-[100] flex flex-col overflow-y-auto shadow-lg bg-surface"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 min-w-0">
                <Image src={brand.logo} alt="Logo" width={28} height={28} className="h-7 w-7 object-contain" />
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="truncate text-base font-semibold tracking-tight">{brand.title}</span>
                  {brand.subtitle && (
                    <span className="truncate text-xs text-muted-foreground">{brand.subtitle}</span>
                  )}
                </div>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => triggerRef.current?.focus(), 0);
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile navigation">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={linkCls(l.href)}>
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="px-4 py-3 border-t flex flex-col gap-2">
              {!authed ? (
                <>
                  <Link href="/auth/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              ) : (
                <Button variant="destructive" className="w-full" onClick={onSignOut}>
                  Sign out
                </Button>
              )}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </BodyPortal>
      )}
    </div>
  );
}
