"use client";

import { cn } from "@/lib/utils";

export function FilterTabs({
  options,
  value,
  onChange,
  className,
  size = "md",
}: {
  options: { value: string; label: string; count?: number }[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-full border transition",
              size === "sm" ? "px-3 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
              active
                ? "border-gold-400 bg-gradient-to-b from-gold-50 to-gold-100 font-medium text-gold-700 shadow-soft"
                : "border-transparent bg-ivory-200/60 text-ink-muted hover:bg-ivory-200"
            )}
          >
            {o.label}
            {o.count !== undefined && (
              <span className={cn("ml-1.5 text-xs", active ? "text-gold-600" : "text-ink-muted/70")}>
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex rounded-xl border border-gold-200/70 bg-white p-1", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition",
              active ? "bg-gradient-to-b from-gold-500 to-gold-600 text-white shadow-soft" : "text-ink-muted hover:text-ink"
            )}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
