"use client";

import * as React from "react";
import type { DirectoryProfile } from "@/app/directory/page";
import { ProfileCard } from "./ProfileCard";
import FiltersRow from "./FiltersRow";

function normalize(s: string) {
  return s.normalize("NFKD").toLowerCase();
}

export default function DirectoryClient({ initial }: { initial: DirectoryProfile[] }) {
  // search
  const [searchInput, setSearchInput] = React.useState("");
  const [q, setQ] = React.useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setQ(searchInput.trim()), 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  // dropdown filters
  const [year, setYear] = React.useState("");      // "" or "2025"
  const [degree, setDegree] = React.useState("");  // "" or exact label
  const [branch, setBranch] = React.useState("");  // "" or exact label

  // years to show in the dropdown (from data; fallback to a sensible range)
  const yearsFromData = React.useMemo(() => {
    const u = new Set<number>();
    initial.forEach((p) => { if (p.graduation_year) u.add(p.graduation_year); });
    const arr = Array.from(u).sort((a, b) => b - a);
    if (arr.length > 0) return arr;
    const CURRENT_YEAR = new Date().getFullYear();
    return Array.from({ length: (CURRENT_YEAR + 1) - 1965 + 1 }, (_, i) => (CURRENT_YEAR + 1) - i);
  }, [initial]);

  // filter logic
  const rows = React.useMemo(() => {
    const needle = normalize(q);
    return initial.filter((p) => {
      // search
      if (needle) {
        const hay = [
          p.full_name,
          p.designation,
          p.company,
          p.city,
          p.country,
          p.degree,
          p.branch,
          p.graduation_year ? String(p.graduation_year) : "",
        ]
          .filter(Boolean)
          .map((x) => normalize(String(x)))
          .join(" | ");
        if (!hay.includes(needle)) return false;
      }
      // year
      if (year && String(p.graduation_year ?? "") !== year) return false;
      // degree
      if (degree && p.degree !== degree) return false;
      // branch
      if (branch && p.branch !== branch) return false;

      return true;
    });
  }, [initial, q, year, degree, branch]);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Alumni Directory</h1>
        <p className="mt-2 text-muted-foreground">
          Discover fellow alumni and expand your network.
        </p>
      </header>

      {/* Search + 3 filters */}
      <div className="mb-6">
        <FiltersRow
          search={searchInput}
          onSearch={setSearchInput}
          year={year}
          onYear={setYear}
          degree={degree}
          onDegree={setDegree}
          branch={branch}
          onBranch={setBranch}
          years={yearsFromData}
        />
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border p-6 text-sm text-muted-foreground">
          No alumni match your filters. Try clearing filters or searching differently.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((p) => (
            <ProfileCard key={p.id} profile={p} />
          ))}
        </div>
      )}
    </main>
  );
}
