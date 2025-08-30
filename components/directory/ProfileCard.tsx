"use client";

import * as React from "react";
import Link from "next/link";
import type { DirectoryProfile } from "@/app/directory/page";

/* ---------- Utils ---------- */

// Collapse to letters only and lowercase: "C.S.E" -> "cse", "Comp Sci" -> "compsci"
function slugLetters(s: string) {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}

// Generate initials for avatar fallback
function initials(name?: string | null) {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("") || "A";
}

// Robust branch label mapper (handles short forms too)
function branchLabel(raw?: string | null) {
  if (!raw) return "";
  const s = slugLetters(raw);

  // Direct canonical codes
  const direct: Record<string, string> = {
    cse: "CSE",
    cs: "CSE",
    c: "CSE",
    it: "IT",
    ece: "ECE",
    ec: "ECE",
    e: "ECE",
    eee: "EEE",
    ee: "EEE",
    me: "ME",
    mech: "ME",
    ce: "CE",
    civil: "CE",
    chem: "CHE",
    che: "CHE",
    mt: "MT",
    metallurgical: "MT",
    pe: "PE",
    productionengineering: "PE",
    biotech: "BT",
    bt: "BT",
  };
  if (direct[s]) return direct[s];

  // Fuzzy fallbacks
  if (s.includes("computerscience") || s.includes("compsci")) return "CSE";
  if (s.includes("informationtechnology")) return "IT";
  if (s.includes("electronicscommunication")) return "ECE";
  if (s.includes("electricalelectronics")) return "EEE";
  if (s.includes("electrical")) return "EEE";
  if (s.includes("mechanical")) return "ME";
  if (s.includes("civil")) return "CE";
  if (s.includes("chemical")) return "CHE";
  if (s.includes("metall")) return "MT";
  if (s.includes("production")) return "PE";
  if (s.includes("biotech")) return "BT";

  // Last resort: initials up to 3 chars
  const short = raw
    .split(/[\s/&,-]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  return short || raw;
}

function Pill({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <span
      title={title}
      className={`
        inline-flex h-8 items-center rounded-full
        bg-primary/10 px-3 text-xs font-medium leading-none text-primary
        ring-1 ring-inset ring-primary/15
      `}
    >
      {children}
    </span>
  );
}

/* ---------- Card ---------- */

export function ProfileCard({ profile }: { profile: DirectoryProfile }) {
  const name = profile.full_name ?? "Unnamed";
  const roleCompany =
    profile.designation && profile.company
      ? `${profile.designation}, ${profile.company}`
      : profile.designation || profile.company || undefined;

  const location = [profile.city, profile.country].filter(Boolean).join(", ") || undefined;
  const branch = branchLabel(profile.branch);

  return (
    <Link
      href={`/profiles/${profile.id}`}
      className={`
        group block rounded-md border border-[#EAEAEA] dark:border-border bg-card p-5 shadow-[var(--shadow-1)]
        transition will-change-transform hover:-translate-y-[1px] hover:shadow-[var(--shadow-2)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
      `}
      aria-label={`View profile of ${name}`}
    >
      {/* Header: Avatar + name + batch */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={`
            relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden
            rounded-full ring-1 ring-inset ring-border bg-muted text-foreground
          `}
          aria-hidden="true"
        >
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="text-sm font-semibold">{initials(name)}</span>
          )}
          {/* tiny corner glow on hover */}
          <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            style={{ background: "radial-gradient(60% 60% at 50% 0%, color-mix(in oklch, var(--color-brand) 18%, transparent) 0%, transparent 70%)" }}
          />
        </div>

        {/* Title block */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate text-[17px] font-semibold tracking-tight text-foreground">
              {name}
            </h3>
            {profile.graduation_year ? (
              <div className="shrink-0 text-sm text-foreground/80">
                <span className="hidden sm:inline">Batch&nbsp;</span>
                {profile.graduation_year}
              </div>
            ) : null}
          </div>

          {/* Role / company */}
          <p className="mt-1 truncate text-[14.5px] leading-6 text-foreground/90">
            {roleCompany ?? "\u00A0"}
          </p>

          {/* Location */}
          <p className="mt-0.5 truncate text-[14.5px] leading-6 text-muted-foreground">
            {location ?? "\u00A0"}
          </p>
        </div>
      </div>

      {/* Pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {profile.degree ? <Pill title={profile.degree}>{profile.degree}</Pill> : null}
        {branch ? <Pill title={branch}>{branch}</Pill> : null}
      </div>
    </Link>
  );
}
