import * as React from "react";
import { cn } from "@/lib/utils";

export function Stat({
  label, value, hint, tone = "default", className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: "default" | "success" | "danger" | "gold";
  className?: string;
}) {
  const valueColor =
    tone === "success" ? "text-moss"
  : tone === "danger"  ? "text-danger"
  : tone === "gold"    ? "text-gold-2"
  :                       "text-parchment";

  return (
    <div className={cn("rounded-2xl border border-line bg-pine/70 p-4 shadow-soft", className)}>
      <div className="overline">{label}</div>
      <div className={cn("mt-2 font-display text-2xl font-bold tabular leading-none", valueColor)}>
        {value}
      </div>
      {hint && <div className="mt-1.5 text-xs text-muted">{hint}</div>}
    </div>
  );
}
