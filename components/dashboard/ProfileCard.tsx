"use client";
import Link from "next/link";
import { useMe, completeness } from "@/lib/hooks/useMe";
import { AvatarSkeleton } from "./Skeletons";

function Pill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const map = {
    neutral: "border border-border bg-background text-foreground/80",
    success:
      "border border-border bg-[oklch(0.95_0.03_150)] text-[oklch(0.45_0.12_150)]",
    warning:
      "border border-border bg-[oklch(0.97_0.04_85)] text-[oklch(0.55_0.14_85)]",
    danger:
      "border border-border bg-[oklch(0.97_0.04_25)] text-[oklch(0.55_0.16_25)]",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs ${map[tone]}`}
    >
      {label}
    </span>
  );
}

export default function ProfileCard() {
  const { me, loading } = useMe();

  if (loading) {
    return (
      <div className="card px-5 py-6 sm:px-6">
        <div className="mb-4 flex items-center gap-4">
          <AvatarSkeleton />
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-muted animate-pulse" />
            <div className="h-3 w-24 rounded bg-muted animate-pulse" />
          </div>
        </div>
        <div className="h-2 w-full rounded bg-muted animate-pulse" />
      </div>
    );
  }
  if (!me) return null;

  const { pct, missing } = completeness(me);
  const approval = me.approval ?? (me.is_public ? "approved" : "pending");
  type Approval = "approved" | "pending" | "rejected" | null;

  const toneMap: Record<
    Exclude<Approval, null>,
    "success" | "warning" | "danger"
  > = {
    approved: "success",
    pending: "warning",
    rejected: "danger",
  };

  // fallback if null or unknown
  const tone = approval ? toneMap[approval] : "neutral";

  return (
    <div className="card px-5 py-6 sm:px-6">
      {/* Header row */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          {me.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={me.avatar_url}
              alt={me.full_name ?? "Avatar"}
              className="h-14 w-14 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-muted grid place-items-center text-sm font-semibold">
              {String(me.full_name || me.email)
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Welcome back
              {me.full_name ? `, ${me.full_name.split(" ")[0]}` : ""} 👋
            </h2>
            <div className="mt-1 flex flex-wrap gap-2">
              <Pill
                label={
                  approval === "approved"
                    ? "Approved"
                    : approval === "pending"
                    ? "Pending"
                    : approval === "rejected"
                    ? "Rejected"
                    : "Unknown"
                }
                tone={tone}
              />

              <Pill
                label={
                  me.is_public ? "Public profile" : "Hidden from directory"
                }
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/settings/profile"
            className="inline-flex items-center rounded-xl border border-border px-3 py-1.5 text-sm hover:bg-muted"
          >
            Edit profile
          </Link>
          <Link
            href="/directory"
            className="inline-flex items-center rounded-xl border border-border px-3 py-1.5 text-sm hover:bg-muted"
          >
            View directory
          </Link>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold">Profile</h3>
        <span className="text-xs text-muted-foreground">{pct}% complete</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
      {missing.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Missing: {missing.join(", ")}.{" "}
          <Link
            href="/settings/profile"
            className="underline underline-offset-2"
          >
            Complete now
          </Link>
        </p>
      )}

      {/* Summary rows */}
      <div className="mt-4 divide-y divide-border">
        <Row label="Name" value={me.full_name} />
        <Row label="Email" value={me.email} />
        <Row
          label="Location"
          value={[me.city, me.country].filter(Boolean).join(", ") || null}
        />
        <Row
          label="Academics"
          value={
            [me.degree, me.branch, me.graduation_year]
              .filter(Boolean)
              .join(" • ") || null
          }
        />
        <Row
          label="Work"
          value={
            [me.employment_type, me.company, me.designation]
              .filter(Boolean)
              .join(" • ") || null
          }
        />
        {me.interests?.length ? (
          <div className="flex items-start justify-between gap-3 py-2">
            <div className="text-sm text-muted-foreground">Interests</div>
            <div className="flex max-w-[70%] flex-wrap gap-2">
              {me.interests.map((i) => (
                <span
                  key={i}
                  className="rounded-lg border border-border bg-background px-2 py-0.5 text-xs"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
