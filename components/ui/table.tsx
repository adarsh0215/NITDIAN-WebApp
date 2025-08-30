import * as React from "react";
import { cn } from "@/lib/utils";

export type TableProps = React.TableHTMLAttributes<HTMLTableElement>;
export type SectionProps = React.HTMLAttributes<HTMLTableSectionElement>;
export type RowProps = React.HTMLAttributes<HTMLTableRowElement>;
export type ThProps = React.ThHTMLAttributes<HTMLTableCellElement>;
export type TdProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius)] border border-border bg-surface">
      <table className={cn("w-full text-sm text-left", className)} {...props} />
    </div>
  );
}

export function THead({ className, ...props }: SectionProps) {
  return <thead className={cn("bg-muted/60 text-muted-foreground", className)} {...props} />;
}

export function TBody({ className, ...props }: SectionProps) {
  return <tbody className={cn("divide-y divide-border", className)} {...props} />;
}

export function TR({ className, ...props }: RowProps) {
  return <tr className={cn("hover:bg-muted/40 transition-colors", className)} {...props} />;
}

export function TH({ className, ...props }: ThProps) {
  return <th className={cn("px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground", className)} {...props} />;
}

export function TD({ className, ...props }: TdProps) {
  return <td className={cn("px-4 py-3 text-foreground", className)} {...props} />;
}
