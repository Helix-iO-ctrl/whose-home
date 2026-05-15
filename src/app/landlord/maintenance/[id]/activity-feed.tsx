"use client";

import * as React from "react";
import {
  Send, Sparkles, CheckCircle2, XCircle, Bell, ChevronDown, Wrench, Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ActivityTone = "info" | "success" | "warning" | "critical";

export type ActivityEvent = {
  kind: "submitted" | "ai-capture" | "triage-complete" | "escalated" | "dispatched";
  tone: ActivityTone;
  title: string;
  detail?: string;
  at: string;
  expandable?: boolean;
  tag?: string;
};

const ICONS: Record<ActivityEvent["kind"], React.ComponentType<{ size?: number; className?: string }>> = {
  "submitted":        Send,
  "ai-capture":       Sparkles,
  "triage-complete":  Wrench,
  "escalated":        Bell,
  "dispatched":       Truck,
};

export function ActivityFeed({
  events, troubleshooting,
}: {
  events: ActivityEvent[];
  troubleshooting: { step: string; passed: boolean }[] | null;
}) {
  const [expanded, setExpanded] = React.useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <ol className="mt-3 relative">
      {/* Vertical guide line */}
      <span className="absolute left-[15px] top-2 bottom-2 w-px bg-line" aria-hidden="true" />

      {events.map((e, i) => {
        const Icon = ICONS[e.kind];
        const isExpanded = expanded.has(i);
        const isCritical = e.tone === "critical";

        const dotClasses =
          e.tone === "critical" ? "bg-gold text-ink ring-4 ring-gold/20" :
          e.tone === "success"  ? "bg-moss text-parchment" :
          e.tone === "warning"  ? "bg-gold/20 text-gold-2 border border-gold/40" :
                                  "bg-spruce text-muted border border-line";

        return (
          <li key={i} className="relative pl-10 pb-4 last:pb-0">
            <span
              className={cn(
                "absolute left-0 top-0.5 h-8 w-8 rounded-full flex items-center justify-center z-10",
                dotClasses,
              )}
            >
              <Icon size={14} />
            </span>

            <div
              className={cn(
                "rounded-lg p-3 transition-colors",
                isCritical
                  ? "bg-gold/10 border border-gold/40"
                  : "border border-transparent hover:bg-pine-2/40",
              )}
            >
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "text-sm font-semibold",
                    isCritical ? "text-parchment" : "text-parchment",
                  )}>
                    {e.title}
                  </span>
                  {e.tag && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold text-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      <Bell size={10} /> {e.tag}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-subtle shrink-0">{e.at}</span>
              </div>

              {e.detail && (
                <div className="text-xs text-muted mt-1">{e.detail}</div>
              )}

              {e.expandable && troubleshooting && (
                <>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-gold-2 hover:text-gold transition-colors"
                  >
                    {isExpanded ? "Hide steps" : "Show all steps"}
                    <ChevronDown
                      size={12}
                      className={cn("transition-transform", isExpanded && "rotate-180")}
                    />
                  </button>

                  {isExpanded && (
                    <ul className="mt-2 rounded-lg bg-spruce/60 border border-line p-3 space-y-1.5">
                      {troubleshooting.map((s, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs">
                          {s.passed
                            ? <CheckCircle2 size={13} className="text-moss mt-0.5 shrink-0" />
                            : <XCircle size={13} className="text-danger mt-0.5 shrink-0" />}
                          <span className="text-parchment leading-relaxed">{s.step}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
