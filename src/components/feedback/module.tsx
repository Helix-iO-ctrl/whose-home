"use client";

import * as React from "react";
import { MessageSquareQuote } from "lucide-react";
import { useFeedback } from "./feedback-provider";
import { cn } from "@/lib/utils";

/**
 * Wrap any distinct module/widget so its in-place feedback button captures
 * the right component identifier when Greg clicks it.
 *
 * Usage:
 *   <Module id="landlord.dashboard.maintenance-queue" label="Maintenance queue">
 *     ...module content...
 *   </Module>
 */
export function Module({
  id,
  label,
  children,
  className,
  as = "section",
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
  /** HTML tag name to render as (e.g. "section", "div", "article"). */
  as?: string;
}) {
  // Cast to ElementType so React accepts the dynamic tag name.
  const As = as as React.ElementType;
  const fb = useFeedback();
  return (
    <As
      data-module-id={id}
      className={cn("group/module relative", className)}
    >
      <button
        type="button"
        onClick={() => fb.openFor(id, label)}
        aria-label={`Send feedback about ${label}`}
        title={`Feedback on ${label}`}
        className={cn(
          "absolute right-3 top-3 z-10 inline-flex items-center justify-center",
          "h-7 w-7 rounded-full border border-line bg-pine/70 text-muted",
          "opacity-0 group-hover/module:opacity-100 focus-visible:opacity-100",
          "hover:bg-pine-2 hover:text-gold-2 hover:border-line-2",
          "transition-all backdrop-blur-sm",
        )}
      >
        <MessageSquareQuote size={13} strokeWidth={2.25} />
      </button>
      {children}
    </As>
  );
}
