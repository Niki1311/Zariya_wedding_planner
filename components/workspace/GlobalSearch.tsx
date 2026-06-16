"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useWedding } from "@/lib/store";
import { globalSearch } from "@/lib/selectors";
import { cn } from "@/lib/utils";

export function GlobalSearch() {
  const wedding = useWedding();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = q.trim() ? globalSearch(wedding, q) : [];
  const grouped = results.reduce<Record<string, typeof results>>((acc, r) => {
    (acc[r.group] ??= []).push(r);
    return acc;
  }, {});

  function go(href: string) {
    setOpen(false);
    setQ("");
    router.push(href);
  }

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search anything — guests, vendors, events, tasks…"
          className="w-full rounded-xl border border-gold-200/70 bg-ivory-50 py-2 pl-9 pr-8 text-sm outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-200/50"
        />
        {q && (
          <button onClick={() => setQ("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-gold-100 bg-white p-2 shadow-lift">
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-ink-muted">No results for &ldquo;{q}&rdquo;</p>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="mb-1">
                <p className="px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-gold-600">{group}</p>
                {items.map((r, i) => (
                  <button
                    key={group + i}
                    onClick={() => go(r.href)}
                    className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-ivory-100")}
                  >
                    <span className="truncate text-ink">{r.label}</span>
                    <span className="ml-3 shrink-0 text-xs text-ink-muted">{r.sublabel}</span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
