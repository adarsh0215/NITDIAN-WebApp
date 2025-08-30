// app/directory/page.tsx
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import DirectoryClient from "@/components/directory/DirectoryClient";

export const metadata = { title: "Alumni Directory • NITDIAN Alumni" };
export const dynamic = "force-dynamic";

export type DirectoryProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  designation: string | null;
  company: string | null;
  city: string | null;
  country: string | null;
  graduation_year: number | null;
  degree: string | null;
  branch: string | null;
};

export default async function DirectoryPage() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/directory");

  // gate: user must be onboarded and not rejected
  const { data: me } = await supabase
    .from("profiles")
    .select("onboarded, approval")
    .eq("id", user.id)
    .maybeSingle();

  if (!me?.onboarded) redirect("/onboarding");
  if (me.approval && me.approval === "rejected") redirect("/dashboard");

  // fetch approved + public profiles server-side (no client flicker)
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, avatar_url, designation, company, city, country, graduation_year, degree, branch"
    )
    .eq("is_public", true)
    .eq("approval", "approved")
    .order("graduation_year", { ascending: false })
    .order("full_name", { ascending: true });

  if (error) {
    // fail soft with an empty list
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Alumni Directory</h1>
        <p className="mt-2 text-muted-foreground">Couldn’t load the directory right now.</p>
      </main>
    );
  }

  return <DirectoryClient initial={data ?? []} />;
}
