import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-pine/70 backdrop-blur-sm p-5 shadow-soft",
        className,
      )}
      {...p}
    />
  );
}

export function CardHeader({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex items-start justify-between gap-3", className)} {...p} />;
}

export function CardTitle({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("font-display text-lg font-bold text-parchment leading-tight", className)}
      {...p}
    />
  );
}

export function CardLabel({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("overline", className)} {...p} />;
}

export function CardSubtitle({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <p className={cn("text-sm text-muted mt-1", className)} {...p} />;
}
