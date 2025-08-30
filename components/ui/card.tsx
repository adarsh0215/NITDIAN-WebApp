import * as React from "react";
import { cn } from "@/lib/utils";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div className={cn("card p-6", className)} {...rest} />;
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div className={cn("mb-2", className)} {...rest} />;
}

export function CardTitle(props: React.ComponentPropsWithoutRef<"h3">) {
  const { className, ...rest } = props;
  return (
    <h3 className={cn("text-lg font-semibold tracking-tight", className)} {...rest} />
  );
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div className={cn("text-muted-foreground", className)} {...rest} />;
}
