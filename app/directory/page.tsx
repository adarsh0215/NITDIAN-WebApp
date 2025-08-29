// app/directory/page.tsx
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata = {
  title: "Directory • NITDIAN Alumni",
};

export const dynamic = "force-dynamic";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  graduation_year: number | null;
  degree: string | null;
  branch: string | null;
  employment_type: string | null;
  company: string | null;
  designation: string | null;
  city: string | null;
  country: string | null;
};

function Initials({ name, email, size = 64 }: { name?: string | null; email?: string | null; size?: number }) {
  const base = name || email || "U";
  const text =
    base
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const palette = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"];
  let hash = 0;
  for (let i = 0; i < base.length; i++) hash = base.charCodeAt(i) + ((hash << 5) - hash);
  const bg = palette[Math.abs(hash) % palette.length];

  return (
    <div
      className="flex items-center justify-center rounded-full text-white"
      style={{ width: size, height: size, backgroundColor: bg, fontSize: size * 0.35, fontWeight: 600 }}
    >
      {text}
    </div>
  );
}

function DirectoryCard({ profile }: { profile: Profile }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow transition">
      <div className="flex items-center gap-4">
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={profile.full_name ?? "User"}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <Initials name={profile.full_name} email={profile.email} />
        )}
        <div>
          <h3 className="text-base font-semibold">{profile.full_name ?? "Unnamed"}</h3>
          <p className="text-sm text-neutral-600">
            {[profile.degree, profile.branch, profile.graduation_year].filter(Boolean).join(" • ")}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-1 text-sm text-neutral-700">
        {profile.employment_type && (
          <p>
            {profile.employment_type}
            {profile.company ? ` • ${profile.company}` : ""}
            {profile.designation ? ` (${profile.designation})` : ""}
          </p>
        )}
        {(profile.city || profile.country) && (
          <p className="text-neutral-500">
            {[profile.city, profile.country].filter(Boolean).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}

export default async function DirectoryPage() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/directory");

  // Get current profile (to check approval)
  const { data: me } = await supabase
    .from("profiles")
    .select("onboarded, approval, is_public")
    .eq("id", user.id)
    .maybeSingle();

  if (!me?.onboarded) redirect("/onboarding");
  if (me.approval && me.approval !== "approved") redirect("/dashboard");

  // Fetch approved, public profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, avatar_url, graduation_year, degree, branch, employment_type, company, designation, city, country"
    )
    .eq("is_public", true)
    .eq("approval", "approved")
    .order("graduation_year", { ascending: false });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Alumni Directory</h1>
      {profiles && profiles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <DirectoryCard key={p.id} profile={p} />
          ))}
        </div>
      ) : (
        <p className="text-neutral-600">No profiles available yet.</p>
      )}
    </main>
  );
}
