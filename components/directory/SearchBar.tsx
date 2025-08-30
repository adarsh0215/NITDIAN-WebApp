"use client";
import * as React from "react";

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [local, setLocal] = React.useState(value);
  const lastSent = React.useRef(value);

  // keep local in sync with external value
  React.useEffect(() => setLocal(value), [value]);

  // debounce + change check
  React.useEffect(() => {
    const t = setTimeout(() => {
      if (local === lastSent.current) return; // no-op
      lastSent.current = local;
      onChange(local);
    }, 300);
    return () => clearTimeout(t);
  }, [local, onChange]);

  return (
    <div className="w-full sm:w-80">
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Search name, company, role…"
        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 ring-ring"
        aria-label="Search alumni"
      />
    </div>
  );
}
