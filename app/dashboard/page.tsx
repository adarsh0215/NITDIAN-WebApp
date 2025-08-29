// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata = {
  title: "Dashboard • NITDIAN Alumni",
};

// Always render fresh user/profile data
export const dynamic = "force-dynamic";

/* ---------- Types ---------- */
type Tone = "neutral" | "success" | "warning" | "danger";
type Approval = "pending" | "approved" | "rejected" | null | undefined;

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone_e164: string | null;
  city: string | null;
  country: string | null;
  graduation_year: number | null;
  degree: string | null;
  branch: string | null;
  employment_type: string | null;
  company: string | null;
  designation: string | null;
  interests: string[] | null;
  is_public: boolean | null;
  approval?: Approval; // might be undefined on older schema
  onboarded: boolean | null;
};

/* ---------- UI bits ---------- */
function StatusPill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: Tone;
}) {
  const tones: Record<Tone, string> = {
    neutral: "bg-neutral-100 text-neutral-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${tones[tone]}`}
    >
      {label}
    </span>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="text-sm text-neutral-500">{label}</div>
      <div className="text-sm font-medium text-neutral-900">{value}</div>
    </div>
  );
}

function Initials({
  name,
  email,
  size = 56,
}: {
  name?: string | null;
  email?: string | null;
  size?: number;
}) {
  const base = (name || email || "U").trim();
  const text =
    base
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  // deterministic color by string
  const palette = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
  ];
  let hash = 0;
  for (let i = 0; i < base.length; i++)
    hash = base.charCodeAt(i) + ((hash << 5) - hash);
  const bg = palette[Math.abs(hash) % palette.length];

  return (
    <div
      className="flex items-center justify-center rounded-full text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        fontSize: size * 0.35,
        fontWeight: 700,
      }}
      aria-hidden="true"
    >
      {text}
    </div>
  );
}

/* ---------- Helpers ---------- */
function approvalDisplay(
  approval: Approval,
  isPublic: boolean | null
): {
  label: string;
  tone: Tone;
} {
  if (approval === "approved") return { label: "Approved", tone: "success" };
  if (approval === "rejected") return { label: "Rejected", tone: "danger" };
  if (approval === "pending") return { label: "Pending", tone: "warning" };

  // Fallback for older schema: no enum present → infer from visibility
  return isPublic
    ? { label: "Approved", tone: "success" }
    : { label: "Pending", tone: "warning" };
}

/* ---------- Page ---------- */
export default async function DashboardPage() {
  const supabase = await supabaseServer();

  // Require auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/dashboard");

  // Load profile
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      [
        "id",
        "email",
        "full_name",
        "avatar_url",
        "phone_e164",
        "city",
        "country",
        "graduation_year",
        "degree",
        "branch",
        "employment_type",
        "company",
        "designation",
        "interests",
        "is_public",
        "approval",
        "onboarded",
      ].join(",")
    )
    .eq("id", user.id)
    .maybeSingle<Profile>();

  // If user hasn't finished onboarding, send them there
  if (!profile || !profile.onboarded) redirect("/onboarding");

  const { label: approvalLabel, tone: approvalTone } = approvalDisplay(
    profile.approval ?? null,
    profile.is_public
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name ?? "User avatar"}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <Initials
              name={profile.full_name}
              email={profile.email}
              size={56}
            />
          )}

          <div>
            <h1 className="text-xl font-semibold">
              Welcome back
              {profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}{" "}
              👋
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <StatusPill label={approvalLabel} tone={approvalTone} />
              {profile.is_public ? (
                <StatusPill label="Public profile" tone="neutral" />
              ) : (
                <StatusPill label="Hidden from directory" tone="neutral" />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/settings/profile"
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
          >
            Edit profile
          </Link>
          <Link
            href="/directory"
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
          >
            View directory
          </Link>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile summary */}
        <section className="rounded-xl border bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Profile Summary
          </h2>

          <div className="divide-y">
            <Field label="Name" value={profile.full_name} />
            <Field label="Email" value={profile.email} />
            <Field label="Phone" value={profile.phone_e164} />
            <Field
              label="Location"
              value={
                [profile.city, profile.country].filter(Boolean).join(", ") ||
                null
              }
            />
            <Field
              label="Academics"
              value={
                [profile.degree, profile.branch, profile.graduation_year]
                  .filter(Boolean)
                  .join(" • ") || null
              }
            />
            <Field
              label="Work"
              value={
                [profile.employment_type, profile.company, profile.designation]
                  .filter(Boolean)
                  .join(" • ") || null
              }
            />
            {profile.interests && profile.interests.length > 0 && (
              <div className="flex items-start justify-between gap-3 py-2">
                <div className="text-sm text-neutral-500">Interests</div>
                <div className="flex max-w-[70%] flex-wrap gap-2">
                  {profile.interests.map((i: string) => (
                    <span
                      key={i}
                      className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Quick actions */}
        <aside className="rounded-xl border bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link
              href="/settings/profile"
              className="block rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
            >
              Update profile details
            </Link>
            <Link
              href="/directory"
              className="block rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
            >
              Browse alumni directory
            </Link>
            <Link
              href="/onboarding"
              className="block rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
            >
              Re-run onboarding
            </Link>
          </div>

          <div className="mt-6 rounded-md bg-neutral-50 p-3 text-xs text-neutral-600">
            Tip: Profiles marked <b>Public</b> appear in the directory once
            they’re <b>Approved</b> by admins.
          </div>
        </aside>
      </div>
    </main>
  );
}
