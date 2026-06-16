"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

type Variant = "gold" | "ghost" | "soft" | "danger" | "link";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  gold: "bg-gradient-to-b from-gold-500 to-gold-600 text-white shadow-soft hover:from-gold-600 hover:to-gold-700",
  ghost: "border border-gold-200/70 bg-white text-ink hover:bg-ivory-100",
  soft: "bg-gold-50 text-gold-700 hover:bg-gold-100",
  danger: "border border-rose-ring/50 bg-rose-bg text-rose-text hover:bg-rose-bg/70",
  link: "text-gold-600 hover:text-gold-700 underline-offset-4 hover:underline px-0 py-0",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "gold", size = "md", loading, icon, className, children, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        variant !== "link" && SIZES[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
});
