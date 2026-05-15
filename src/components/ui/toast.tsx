"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastTone = "success" | "info" | "warning" | "danger";

type ToastItem = {
  id: number;
  body: string;
  tone: ToastTone;
  title?: string;
};

type ToastContext = {
  show: (body: string, opts?: { tone?: ToastTone; title?: string }) => void;
};

const Ctx = React.createContext<ToastContext | null>(null);

export function useToast(): ToastContext {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  const show = React.useCallback<ToastContext["show"]>((body, opts) => {
    const id = nextId++;
    setToasts((t) => [...t, { id, body, tone: opts?.tone ?? "success", title: opts?.title }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const remove = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {mounted && createPortal(
        <div
          aria-live="polite"
          aria-atomic="true"
          className="fixed top-4 right-4 z-[70] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)] pointer-events-none"
        >
          {toasts.map((t) => (
            <ToastView key={t.id} t={t} onDismiss={() => remove(t.id)} />
          ))}
        </div>,
        document.body,
      )}
    </Ctx.Provider>
  );
}

function ToastView({ t, onDismiss }: { t: ToastItem; onDismiss: () => void }) {
  const Icon =
    t.tone === "success" ? CheckCircle2 :
    t.tone === "warning" ? AlertTriangle :
    t.tone === "danger"  ? AlertTriangle :
                           Info;

  const accent =
    t.tone === "success" ? "text-moss" :
    t.tone === "warning" ? "text-gold-2" :
    t.tone === "danger"  ? "text-danger" :
                           "text-gold-2";

  return (
    <div className="pointer-events-auto rounded-xl border border-line-2 bg-pine/95 backdrop-blur shadow-soft p-3.5 animate-fade-in">
      <div className="flex items-start gap-2.5">
        <Icon size={16} strokeWidth={2.25} className={cn("mt-0.5 shrink-0", accent)} />
        <div className="flex-1 min-w-0">
          {t.title && <div className="text-sm font-semibold text-parchment">{t.title}</div>}
          <div className="text-sm text-parchment leading-relaxed">{t.body}</div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="rounded-md p-0.5 text-muted hover:text-parchment hover:bg-pine-2 transition-colors -mr-1 -mt-1 shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
