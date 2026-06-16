"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function Field({
  label,
  children,
  hint,
  required,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <label className="label-base">
          {label} {required && <span className="text-gold-600">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("input-base", props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("input-base min-h-[80px] resize-y", props.className)} />;
}

export function Select({
  options,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[] | { value: string; label: string }[] }) {
  return (
    <select {...props} className={cn("input-base appearance-none bg-[length:1.1rem] pr-9", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23B8860B' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.7rem center",
      }}
    >
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o} value={o}>{o}</option>
        ) : (
          <option key={o.value} value={o.value}>{o.label}</option>
        )
      )}
    </select>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-2.5 text-sm", className)}>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition",
          checked ? "border-gold-500 bg-gradient-to-b from-gold-400 to-gold-600 text-white" : "border-gold-300 bg-white"
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </button>
      {label && <span className="text-ink">{label}</span>}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      {label && <span className="text-sm text-ink">{label}</span>}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition",
          checked ? "bg-gradient-to-r from-gold-400 to-gold-600" : "bg-ivory-300"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[1.4rem]" : "left-0.5"
          )}
        />
      </button>
    </label>
  );
}
