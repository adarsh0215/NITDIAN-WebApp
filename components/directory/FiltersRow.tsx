"use client";

import * as React from "react";
import { SearchBar } from "./SearchBar";
import { DEGREES, BRANCHES } from "@/lib/validation/onboarding";

type Props = {
  search: string;
  onSearch: (v: string) => void;

  year: string;                     // "" or "2025"
  onYear: (y: string) => void;

  degree: string;                   // "" or "B.Tech"
  onDegree: (d: string) => void;

  branch: string;                   // "" or "CSE"
  onBranch: (b: string) => void;

  years: number[];                  // e.g. [2026, 2025, 2024, ...]
};

export default function FiltersRow({
  search, onSearch, year, onYear, degree, onDegree, branch, onBranch, years,
}: Props) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
      {/* Search (grows) */}
      <div className="flex-1">
        <SearchBar value={search} onChange={onSearch} />
      </div>

      {/* Year */}
      <label className="md:w-[160px]">
        <span className="sr-only">Graduation year</span>
        <select
          value={year}
          onChange={(e) => onYear(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 ring-ring"
        >
          <option value="">Year: Any</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </label>

      {/* Branch */}
      <label className="md:w-[160px]">
        <span className="sr-only">Branch</span>
        <select
          value={branch}
          onChange={(e) => onBranch(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 ring-ring"
        >
          <option value="">Branch: Any</option>
          {BRANCHES.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </label>

      {/* Degree */}
      <label className="md:w-[160px]">
        <span className="sr-only">Degree</span>
        <select
          value={degree}
          onChange={(e) => onDegree(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 ring-ring"
        >
          <option value="">Degree: Any</option>
          {DEGREES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
