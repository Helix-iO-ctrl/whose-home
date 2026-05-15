import * as React from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow, title, subtitle, actions, className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6", className)}>
      <div>
        {eyebrow && <div className="overline mb-2">{eyebrow}</div>}
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-parchment leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-muted mt-2 max-w-xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function SectionHead({
  title, action, className,
}: { title: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between gap-3 mb-3", className)}>
      <h2 className="overline">{title}</h2>
      {action && <div>{action}</div>}
    </div>
  );
}
