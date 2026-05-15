import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
  {
    variants: {
      tone: {
        success: "bg-moss/20 text-moss",
        gold:    "bg-gold/15 text-gold-2",
        danger:  "bg-danger/15 text-danger",
        neutral: "bg-line text-muted",
        info:    "bg-forest/30 text-parchment",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

type ChipProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof chipVariants>;

export function Chip({ className, tone, ...p }: ChipProps) {
  return <span className={cn(chipVariants({ tone }), className)} {...p} />;
}

export function Dot({ className }: { className?: string }) {
  return <span className={cn("inline-block h-1.5 w-1.5 rounded-full", className)} />;
}
