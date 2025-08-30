// app/layout/navbar/Navbar.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import NavbarShell from "./NavbarShell";

export type NavProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

async function getAuthState() {
  const cookieStore = await cookies(); // server-side
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  );

  const { data: ures } = await supabase.auth.getUser();
  const user = ures?.user;
  if (!user) return { authed: false, profile: null as NavProfile | null };

  const { data: p } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  return {
    authed: true,
    profile: {
      id: user.id,
      email: user.email ?? null,
      full_name: p?.full_name ?? null,
      avatar_url: p?.avatar_url ?? null,
    } as NavProfile,
  };
}

export default async function Navbar() {
  const state = await getAuthState();

  return (
    <NavbarShell
      authed={state.authed}
      profile={state.profile}
      links={[
        { href: "/", label: "Home" },
        { href: "/directory", label: "Directory" },
        { href: "/about", label: "About" },
        { href: "/events", label: "Events" },
        { href: "/jobs", label: "Jobs" },
      ]}
    />
  );
}
