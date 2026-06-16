"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useWedding } from "@/lib/store";
import { notifications } from "@/lib/selectors";
import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  rose: "bg-rose-bg text-rose-text",
  amber: "bg-amberc-bg text-amberc-text",
  sage: "bg-sage-bg text-sage-text",
  slate: "bg-slatec-bg text-slatec-text",
};

export function Notifications() {
  const wedding = useWedding();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const items = notifications(wedding);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        data-tour="notifications"
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-gold-100 bg-white text-ink-light transition hover:bg-ivory-100"
      >
        <Bell className="h-5 w-5" />
        {items.length > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-1 text-[0.65rem] font-semibold text-white">
            {items.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-gold-100 bg-white shadow-lift">
          <div className="border-b border-gold-100 px-4 py-3">
            <p className="font-serif text-lg font-semibold">Notifications</p>
            <p className="text-xs text-ink-muted">{items.length} need attention</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink-muted">You&apos;re all caught up ✨</p>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    setOpen(false);
                    router.push(n.href);
                  }}
                  className="flex w-full items-start gap-3 border-b border-gold-50 px-4 py-3 text-left transition last:border-0 hover:bg-ivory-50"
                >
                  <span className={cn("mt-0.5 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase", TONE[n.tone])}>{n.type}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink">{n.title}</span>
                    <span className="block truncate text-xs text-ink-muted">{n.detail}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
