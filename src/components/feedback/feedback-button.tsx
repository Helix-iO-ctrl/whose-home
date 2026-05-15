"use client";

import * as React from "react";
import { MessageSquareQuote, X, CheckCircle2, Loader2 } from "lucide-react";
import { useFeedback } from "./feedback-provider";
import { cn } from "@/lib/utils";

/**
 * Persistent global feedback affordance.
 *  - Floating "Send feedback" pill, bottom-right, present on every page.
 *  - Hidden on the /feedback admin route (so we don't ask Greg for feedback
 *    on a page he's actively reading other people's feedback on).
 *  - When opened with no module context, the panel asks for general feedback.
 *  - Per-module Feedback buttons elsewhere call useFeedback().openFor(moduleId, label).
 */
export function FeedbackButton() {
  const fb = useFeedback();
  const [draft, setDraft] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (fb.isOpen) {
      // small delay so the slide-up finishes
      requestAnimationFrame(() => textareaRef.current?.focus());
    } else {
      setDraft("");
    }
  }, [fb.isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!draft.trim()) return;
    await fb.submit(draft);
    setDraft("");
  };

  const onAdminPage = fb.pageRoute.startsWith("/feedback");

  return (
    <>
      {/* Floating pill */}
      {!onAdminPage && !fb.isOpen && (
        <button
          type="button"
          onClick={fb.openPage}
          aria-label="Send feedback"
          className={cn(
            "fixed bottom-5 right-5 z-40 inline-flex items-center gap-2",
            "rounded-full px-4 py-3 shadow-soft border border-line-2",
            "bg-gold text-ink font-semibold text-sm",
            "hover:bg-gold-2 transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-2",
          )}
        >
          <MessageSquareQuote size={16} strokeWidth={2.25} />
          <span className="hidden sm:inline">Send feedback</span>
        </button>
      )}

      {/* Toast confirmation */}
      {fb.submittedAt && !fb.isOpen && (
        <div
          role="status"
          className="fixed bottom-20 right-5 z-40 inline-flex items-center gap-2 rounded-xl border border-moss/40 bg-pine px-3.5 py-2.5 text-parchment shadow-soft animate-fade-in"
        >
          <CheckCircle2 size={16} className="text-moss" />
          <span className="text-sm">Thanks — we got it.</span>
        </div>
      )}

      {/* Slide-up panel */}
      {fb.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-end sm:justify-end animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) fb.close();
          }}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" aria-hidden="true" />
          <form
            onSubmit={handleSubmit}
            className={cn(
              "relative w-full sm:w-[420px] sm:m-5 rounded-t-2xl sm:rounded-2xl",
              "bg-pine border border-line-2 shadow-soft",
              "p-5 animate-slide-up",
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="overline mb-1.5">Feedback for Hayden</div>
                <h3 className="font-display text-xl font-bold text-parchment leading-tight">
                  What's on your mind?
                </h3>
                <p className="text-xs text-muted mt-1.5">
                  {fb.moduleLabel ? (
                    <>
                      You're commenting on{" "}
                      <span className="text-gold-2">{fb.moduleLabel}</span> &middot;{" "}
                      <span className="font-mono">{fb.pageRoute}</span>
                    </>
                  ) : (
                    <>
                      Page-level note &middot;{" "}
                      <span className="font-mono">{fb.pageRoute}</span>
                    </>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={fb.close}
                aria-label="Close"
                className="rounded-md p-1 text-muted hover:text-parchment hover:bg-pine-2 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={5}
              placeholder="Anything — bug, copy nit, missing feature, 'this color is off'…"
              className="w-full rounded-lg bg-spruce border border-line-2 px-3.5 py-2.5 text-sm text-parchment placeholder:text-subtle resize-none"
            />

            <div className="flex items-center justify-between gap-2 mt-3">
              <span className="text-[11px] text-subtle">
                Captures route, module, time, and user automatically.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fb.close}
                  className="px-3 py-2 rounded-md text-sm text-muted hover:text-parchment hover:bg-pine-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={fb.submitting || !draft.trim()}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold",
                    "bg-gold text-ink hover:bg-gold-2 transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                >
                  {fb.submitting ? <Loader2 size={14} className="animate-spin" /> : null}
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
