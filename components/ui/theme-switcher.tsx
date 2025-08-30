"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/design/theme";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { mode, setMode } = useTheme(); // ✅ matches your updated ThemeContext
  const next = mode === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setMode(next)}
      aria-label="Toggle theme"
      className={cn(
        "inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-border px-3 py-2 text-sm transition hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="text-muted-foreground">Switch to {next}</span>
    </button>
  );
}

export default ThemeSwitcher;
