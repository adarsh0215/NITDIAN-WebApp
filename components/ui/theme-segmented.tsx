"use client";

import * as React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/lib/design/theme"; // your provider
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** "md" (default) shows labels, "icon" shows only icons (good for mobile header) */
  size?: "md" | "icon";
};

export default function ThemeSegmented({ className, size = "md" }: Props) {
  const { mode, setMode, resolvedTheme } = useTheme();

  const Item = ({
    label,
    active,
    onClick,
    children,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted",
        size === "icon" && "h-9 w-9 justify-center px-0 py-0"
      )}
      title={label}
    >
      {children}
      {size === "md" && <span>{label}</span>}
    </button>
  );

  return (
    <div
      role="group"
      aria-label="Theme switcher"
      className={cn(
        "inline-flex items-center rounded-full border bg-background p-1",
        size === "icon" ? "p-0 border-none" : "",
        className
      )}
    >
      <Item label="Light" active={resolvedTheme === "light"} onClick={() => setMode("light")}>
        <Sun className="h-4 w-4" />
      </Item>
      <Item label="Dark" active={resolvedTheme === "dark"} onClick={() => setMode("dark")}>
        <Moon className="h-4 w-4" />
      </Item>
      <Item label="System" active={mode === "system"} onClick={() => setMode("system")}>
        <Monitor className="h-4 w-4" />
      </Item>
    </div>
  );
}
