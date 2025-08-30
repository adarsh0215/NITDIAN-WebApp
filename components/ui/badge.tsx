import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] border px-2 py-0.5 text-xs font-medium",
        variant === "default"
          ? "bg-muted text-foreground border-border"
          : "bg-transparent text-foreground border-border",
        className
      )}
      {...props}
    />
  );
}
