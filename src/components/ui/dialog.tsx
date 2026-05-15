"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Modal dialog. Portals to document.body so it escapes any ancestor
 * stacking context (e.g. parent Cards use `backdrop-blur-sm`, which per
 * spec creates a containing block for descendant `position: fixed`
 * elements — without portaling, the dialog would render trapped inside
 * its parent column).
 */
export function Dialog({
  open, onClose, title, children, size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    // Lock body scroll while open so the page behind doesn't move.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const widthClass =
    size === "lg" ? "sm:max-w-lg" :
    size === "sm" ? "sm:max-w-sm" :
                    "sm:max-w-md";

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full sm:m-4 rounded-t-2xl sm:rounded-2xl",
          "bg-pine border border-line-2 shadow-soft p-5 animate-slide-up",
          widthClass,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="font-display text-lg font-bold text-parchment leading-tight">{title}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted hover:text-parchment hover:bg-pine-2 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
