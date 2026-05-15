import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-2 focus-visible:ring-offset-2 focus-visible:ring-offset-spruce",
  {
    variants: {
      variant: {
        primary:   "bg-gold text-ink hover:bg-gold-2",
        forest:    "bg-forest text-parchment hover:bg-moss",
        outline:   "border border-line-2 bg-transparent text-parchment hover:bg-pine-2",
        ghost:     "bg-transparent text-parchment hover:bg-pine-2",
        subtle:    "bg-pine-2 text-parchment hover:bg-pine border border-line",
        danger:    "bg-danger text-parchment hover:bg-danger/90",
      },
      size: {
        sm:  "h-8  px-3   text-xs",
        md:  "h-10 px-4   text-sm",
        lg:  "h-12 px-5   text-base",
        icon:"h-9  w-9    text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
