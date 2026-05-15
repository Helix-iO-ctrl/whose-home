"use client";

import * as React from "react";

export type FeedbackContext = {
  pageRoute: string;
  moduleId: string | null;
  moduleLabel: string | null;
  /** Open the panel pre-targeted at a specific module. */
  openFor: (moduleId: string, moduleLabel: string) => void;
  /** Open the panel without a specific module focus (page-level). */
  openPage: () => void;
  /** Close the panel. */
  close: () => void;
  isOpen: boolean;
  /** True while the most recent submit is in flight. */
  submitting: boolean;
  /** True after a successful submit, used for the toast / micro-confirmation. */
  submittedAt: number | null;
  submit: (body: string) => Promise<void>;
  user: string;
};

const Ctx = React.createContext<FeedbackContext | null>(null);

export function useFeedback() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useFeedback must be used inside <FeedbackProvider>");
  return ctx;
}

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [moduleId, setModuleId] = React.useState<string | null>(null);
  const [moduleLabel, setModuleLabel] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submittedAt, setSubmittedAt] = React.useState<number | null>(null);

  // Track current route on the client. We avoid pulling in usePathname here so
  // the provider works at the root layout level even if the route tree changes.
  const [pageRoute, setPageRoute] = React.useState<string>("/");
  React.useEffect(() => {
    const update = () => setPageRoute(window.location.pathname + window.location.search);
    update();
    const onPop = () => update();
    window.addEventListener("popstate", onPop);
    // Patch pushState/replaceState so client-side navigation updates the route too.
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function (...args) { const r = origPush.apply(this, args as never); update(); return r; };
    history.replaceState = function (...args) { const r = origReplace.apply(this, args as never); update(); return r; };
    return () => {
      window.removeEventListener("popstate", onPop);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, []);

  const openFor = React.useCallback((id: string, label: string) => {
    setModuleId(id); setModuleLabel(label); setIsOpen(true);
  }, []);
  const openPage = React.useCallback(() => {
    setModuleId(null); setModuleLabel(null); setIsOpen(true);
  }, []);
  const close = React.useCallback(() => setIsOpen(false), []);

  const user = process.env.NEXT_PUBLIC_DEFAULT_USER ?? "greg";

  const submit = React.useCallback(
    async (body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return;
      setSubmitting(true);
      try {
        // Fire-and-forget so the user can keep clicking around. The route
        // does the actual Supabase write server-side.
        await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user,
            page_route: pageRoute,
            module_id: moduleId,
            module_label: moduleLabel,
            body: trimmed,
            user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
            metadata: { viewport: typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : null },
          }),
        });
        setSubmittedAt(Date.now());
        setIsOpen(false);
        // Auto-clear the toast indicator after 3s
        setTimeout(() => setSubmittedAt((t) => (t && Date.now() - t >= 2900 ? null : t)), 3000);
      } catch (err) {
        // Don't break Greg's flow — log and let him retry.
        console.error("[feedback] submit failed", err);
      } finally {
        setSubmitting(false);
      }
    },
    [moduleId, moduleLabel, pageRoute, user],
  );

  const value: FeedbackContext = {
    pageRoute, moduleId, moduleLabel,
    openFor, openPage, close,
    isOpen, submitting, submittedAt, submit, user,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
