"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import type { Brand, NavLink, NavProfile } from "./types";

function cx(...a: Array<string | false | undefined>) {
  return a.filter(Boolean).join(" ");
}

type Props = {
  brand: Brand;
  links: NavLink[];
  authed: boolean;
  profile: NavProfile | null;
};

export default function NavbarShell({ brand, links, authed, profile }: Props) {
  const pathname = usePathname();

  // Sign out
  const supabase = React.useMemo(() => supabaseBrowser(), []);
  const onSignOut: () => Promise<void> = React.useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) { toast.error(error.message); return; }
    window.location.assign("/");
  }, [supabase]);

  const isActive = React.useCallback(
    (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href)),
    [pathname]
  );

  const linkCls = React.useCallback(
    (href: string) =>
      cx(
        "rounded-md px-3 py-2 text-sm transition-colors",
        isActive(href)
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      ),
    [isActive]
  );

  return (
    <header className="sticky top-0 z-[70] w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-12 py-2">
      <DesktopNavbar
        brand={brand}
        links={links}
        authed={authed}
        profile={profile}
        isActive={isActive}
        linkCls={linkCls}
        onSignOut={onSignOut}
      />
      <MobileNavbar
        brand={brand}
        links={links}
        authed={authed}
        linkCls={linkCls}
        onSignOut={onSignOut}
      />
    </header>
  );
}
