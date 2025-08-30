import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[999px] border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground",
        className,
      )}
      {...props}
    />
  );
}
