"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, useWedding } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { LotusMark } from "@/components/ui/Logo";

const STEPS = [
  { sel: "[data-tour=wedding-header]", title: "Wedding details", text: "Start by confirming your wedding name, location, and date range. These details appear across your workspace." },
  { sel: "[data-tour=nav-events]", title: "Events", text: "Your selected wedding events appear here. Open each event card to add its date, time, location, checklist, vendors, and schedule." },
  { sel: "[data-tour=nav-guests]", title: "Guests", text: "Add your guests once. RSVP totals and event guest counts will update automatically." },
  { sel: "[data-tour=nav-vendors]", title: "Vendors", text: "Add each vendor once. Their category, payment status, and event links are reused across Budget, Payments, Events, and Dashboard." },
  { sel: "[data-tour=nav-budget]", title: "Budget", text: "Set your estimated budget by category. Zariya compares it with actual vendor and payment amounts." },
  { sel: "[data-tour=nav-payments]", title: "Payments", text: "Track due and paid payments here. Payment updates automatically affect your budget and vendor status." },
  { sel: "[data-tour=attention-area]", title: "What needs your attention", text: "This area shows what needs your attention next — overdue tasks, payment reminders, and budget warnings." },
];

export function GuidedTour() {
  const wedding = useWedding();
  const mutate = useStore((s) => s.mutate);
  const [active, setActive] = useState(false);
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!wedding.guideCompleted) {
      const t = setTimeout(() => setActive(true), 700);
      return () => clearTimeout(t);
    }
  }, [wedding.guideCompleted]);

  const locate = useCallback(() => {
    const el = document.querySelector(STEPS[i].sel);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setRect(el.getBoundingClientRect());
    } else {
      setRect(null);
    }
  }, [i]);

  useEffect(() => {
    if (!active) return;
    locate();
    const t = setTimeout(locate, 350);
    window.addEventListener("resize", locate);
    window.addEventListener("scroll", locate, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", locate);
      window.removeEventListener("scroll", locate, true);
    };
  }, [active, i, locate]);

  async function finish() {
    setActive(false);
    await mutate("PATCH", "/api/wedding", { guideCompleted: true });
  }

  if (!mounted || !active) return null;

  const step = STEPS[i];
  // tooltip position
  const pad = 12;
  let top = window.innerHeight / 2 - 120;
  let left = window.innerWidth / 2 - 170;
  if (rect) {
    const below = rect.bottom + 220 < window.innerHeight;
    top = below ? rect.bottom + pad : Math.max(pad, rect.top - 200);
    left = Math.min(Math.max(pad, rect.left), window.innerWidth - 360);
  }

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]" />
      {rect && (
        <motion.div
          layout
          className="pointer-events-none absolute rounded-2xl ring-4 ring-gold-400"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            boxShadow: "0 0 0 9999px rgba(43,42,58,0.42)",
          }}
          transition={{ duration: 0.3 }}
        />
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="absolute w-[340px] rounded-2xl border border-gold-100 bg-white p-5 shadow-lift"
          style={{ top, left }}
        >
          <div className="mb-2 flex items-center gap-2">
            <LotusMark className="h-6" />
            <span className="text-xs font-medium uppercase tracking-wide text-gold-600">
              Step {i + 1} of {STEPS.length}
            </span>
          </div>
          <h3 className="font-serif text-xl font-semibold">{step.title}</h3>
          <p className="mt-1.5 text-sm text-ink-light">{step.text}</p>
          <div className="mt-4 flex items-center justify-between">
            <button onClick={finish} className="text-xs text-ink-muted hover:text-ink">
              Skip tour
            </button>
            <div className="flex gap-2">
              {i > 0 && (
                <Button size="sm" variant="ghost" onClick={() => setI(i - 1)}>
                  Back
                </Button>
              )}
              {i < STEPS.length - 1 ? (
                <Button size="sm" onClick={() => setI(i + 1)}>
                  Next
                </Button>
              ) : (
                <Button size="sm" onClick={finish}>
                  Finish
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );
}
