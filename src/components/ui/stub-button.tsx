"use client";

import * as React from "react";
import { Button, type ButtonProps } from "./button";
import { useToast, type ToastTone } from "./toast";

type Props = Omit<ButtonProps, "onClick"> & {
  /** Body of the toast that appears when this button is clicked. */
  toast: string;
  /** Optional bold title above the body. */
  toastTitle?: string;
  /** Defaults to "success" (green check). */
  tone?: ToastTone;
};

/**
 * A button that, when clicked, shows a toast and does nothing else.
 * Use for prototype affordances where the destination doesn't exist yet
 * but the button shouldn't be a dead end.
 */
export function StubButton({ toast: toastMsg, toastTitle, tone, ...props }: Props) {
  const t = useToast();
  return (
    <Button
      {...props}
      onClick={() => t.show(toastMsg, { tone, title: toastTitle })}
    />
  );
}
