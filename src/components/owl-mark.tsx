import * as React from "react";
import { cn } from "@/lib/utils";

type OwlMarkProps = {
  size?: number;
  className?: string;
  withWordmark?: boolean;
  withTagline?: boolean;
  /** Whether the surrounding context is light (parchment) or dark (default). */
  variant?: "dark" | "light";
};

/**
 * Whose Home — owl-character mark, recolored from Option C to green & gold.
 * Body in Forest, ear tufts in Antique Gold, eyes Champagne with Spruce pupils,
 * gold beak. Kept simple/flat to feel premium rather than cartoonish.
 */
export function OwlMark({
  size = 36,
  className,
  withWordmark = false,
  withTagline = false,
  variant = "dark",
}: OwlMarkProps) {
  const onLight = variant === "light";
  const wordmarkColor = onLight ? "#0E1A12" : "#F7F1E1";
  const taglineColor  = onLight ? "rgba(20,83,45,0.7)" : "rgba(232,195,106,0.85)";
  const accentColor   = onLight ? "#14532D" : "#E8C36A";

  const Owl = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Body */}
      <ellipse cx="32" cy="36" rx="20" ry="22" fill="#14532D" />
      {/* Inner breast */}
      <ellipse cx="32" cy="42" rx="12" ry="14" fill="#1E7A45" opacity="0.9" />
      {/* Wing hints */}
      <path d="M12 36 Q7 28 12 20 Q17 32 12 36Z" fill="#0E3219" />
      <path d="M52 36 Q57 28 52 20 Q47 32 52 36Z" fill="#0E3219" />
      {/* Ear tufts */}
      <path d="M19 18 L23 8 L27 18 Z" fill="#C9A227" />
      <path d="M37 18 L41 8 L45 18 Z" fill="#C9A227" />
      {/* Eyes — large, expressive */}
      <circle cx="24" cy="30" r="7.5" fill="#E8C36A" />
      <circle cx="40" cy="30" r="7.5" fill="#E8C36A" />
      <circle cx="24" cy="30" r="3.6" fill="#0B1F14" />
      <circle cx="40" cy="30" r="3.6" fill="#0B1F14" />
      <circle cx="25.4" cy="28.6" r="1.2" fill="#F7F1E1" />
      <circle cx="41.4" cy="28.6" r="1.2" fill="#F7F1E1" />
      {/* Beak */}
      <path d="M28 36 L32 41 L36 36 Q32 34.5 28 36 Z" fill="#C9A227" />
    </svg>
  );

  if (!withWordmark) {
    return <span className={cn("inline-flex items-center", className)}>{Owl}</span>;
  }

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {Owl}
      <span className="flex flex-col leading-none">
        <span
          className="font-display text-[1.05em] font-bold tracking-tight"
          style={{ color: wordmarkColor }}
        >
          Whose <span style={{ color: accentColor, fontStyle: "italic", fontWeight: 400 }}>Home</span>
        </span>
        {withTagline && (
          <span
            className="font-display text-[0.65em] italic tracking-wide mt-1"
            style={{ color: taglineColor }}
          >
            hoo &middot; hoo
          </span>
        )}
      </span>
    </span>
  );
}
