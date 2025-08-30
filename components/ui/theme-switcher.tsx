// components/ui/theme-switcher.tsx
"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/design/theme";
import { cn } from "@/lib/utils";

export function ThemeSwitcher({
  className,
  variant = "segmented",
}: {
  className?: string;
  variant?: "segmented" | "icon";
}) {
  const { resolvedTheme, setMode } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => setMode(isDark ? "light" : "dark")}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full border",
          "bg-background hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-ring/60",
          className
        )}
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme switcher"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border bg-background p-1",
        className
      )}
    >
      <Seg
        active={!isDark}
        onClick={() => setMode("light")}
        label="Light"
      >
        <Sun className="h-4 w-4" />
      </Seg>
      <Seg
        active={isDark}
        onClick={() => setMode("dark")}
        label="Dark"
      >
        <Moon className="h-4 w-4" />
      </Seg>
    </div>
  );
}

function Seg({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm transition",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted"
      )}
      title={label}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
