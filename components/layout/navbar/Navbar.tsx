"use client";

import * as React from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import NavbarShell from "./NavbarShell";
import type { Brand, NavLink, NavProfile } from "./types";

export default function Navbar() {
  const supabase = React.useMemo(() => supabaseBrowser(), []);

  const [authed, setAuthed] = React.useState(false);
  const [profile, setProfile] = React.useState<NavProfile | null>(null);

  // Brand config
  const brand: Brand = {
    title: "NIT Durgapur",
    subtitle: "International Alumni Network",
    logo: "/images/image.png", // update with your logo path
  };

  // Primary nav links
  const links: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/directory", label: "Directory" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
    { href: "/jobs", label: "Jobs" },
  ];

  // Load user + profile
  React.useEffect(() => {
    async function load() {
      const { data: ures } = await supabase.auth.getUser();
      const user = ures?.user;
      if (!user) {
        setAuthed(false);
        setProfile(null);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      setAuthed(true);
      setProfile({
        full_name: profile?.full_name ?? null,
        email: profile?.email ?? user.email ?? null,
        avatar_url: profile?.avatar_url ?? null,
      });
    }

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => sub?.subscription.unsubscribe();
  }, [supabase]);

  return (
    <NavbarShell brand={brand} links={links} authed={authed} profile={profile} />
  );
}
