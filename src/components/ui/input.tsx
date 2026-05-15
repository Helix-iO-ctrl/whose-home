import * as React from "react";
import { cn } from "@/lib/utils";

const fieldClasses =
  "block w-full rounded-lg border border-line-2 bg-spruce/60 px-3 py-2 text-sm text-parchment placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-gold-2 focus:border-transparent transition-shadow";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...p }, ref) => <input ref={ref} className={cn(fieldClasses, "h-10", className)} {...p} />,
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...p }, ref) => (
    <textarea ref={ref} className={cn(fieldClasses, "min-h-[96px] resize-y", className)} {...p} />
  ),
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...p }, ref) => (
    <select ref={ref} className={cn(fieldClasses, "h-10", className)} {...p} />
  ),
);
Select.displayName = "Select";

export function Label({ className, ...p }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5",
        className,
      )}
      {...p}
    />
  );
}

export function Field({
  label, hint, children, className,
}: { label?: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-3", className)}>
      {label && <Label>{label}</Label>}
      {children}
      {hint && <p className="mt-1.5 text-[11px] text-subtle">{hint}</p>}
    </div>
  );
}
