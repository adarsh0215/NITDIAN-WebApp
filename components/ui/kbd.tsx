import * as React from "react";
import { cn } from "@/lib/utils";

export function Kbd({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-muted px-1.5 py-0.5",
        "font-mono text-[11px] font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
