"use client";

import { motion } from "framer-motion";
import { ProgressRing, Chip } from "@/components/ui/primitives";
import { CalendarHeart, Wallet, Users } from "lucide-react";

/** A polished mock of the Zariya dashboard, used in the marketing hero. */
export function AppPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="relative w-full max-w-md"
    >
      <div className="card-base overflow-hidden p-0 shadow-lift">
        <div className="flex items-center justify-between bg-gradient-to-r from-ivory-200 to-ivory-100 px-5 py-3.5">
          <div>
            <p className="font-serif text-lg font-semibold leading-none">Aisha &amp; Rohan</p>
            <p className="text-xs text-ink-muted">Udaipur, Rajasthan</p>
          </div>
          <Chip tone="gold">108 days to go</Chip>
        </div>
        <div className="grid grid-cols-3 gap-3 p-5">
          <MiniStat icon={<CalendarHeart className="h-4 w-4" />} label="Events" value="5" tone="gold" />
          <MiniStat icon={<Users className="h-4 w-4" />} label="RSVPs" value="176" tone="sage" />
          <MiniStat icon={<Wallet className="h-4 w-4" />} label="Budget" value="₹1.4Cr" tone="amber" />
        </div>
        <div className="flex items-center gap-4 px-5 pb-5">
          <ProgressRing value={68} size={72} tone="gold" />
          <div className="flex-1">
            <p className="text-sm font-medium text-ink">Planning progress</p>
            <p className="text-xs text-ink-muted">On track · 68% complete</p>
            <div className="mt-2 space-y-1.5">
              {["Confirm decor vendor", "Payment due — Royal Events", "Final menu tasting"].map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.12 }}
                  className="flex items-center gap-2 text-xs text-ink-light"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                  {t}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* floating accent card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-gold-100 bg-white p-3 shadow-card sm:block"
      >
        <p className="text-[0.65rem] uppercase tracking-wide text-ink-muted">Guest summary</p>
        <p className="font-serif text-xl font-semibold">176 / 250</p>
        <p className="text-[0.65rem] text-sage-text">accepted</p>
      </motion.div>
    </motion.div>
  );
}

function MiniStat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "gold" | "sage" | "amber" }) {
  const toneCls =
    tone === "sage" ? "bg-sage-bg text-sage-text" : tone === "amber" ? "bg-amberc-bg text-amberc-text" : "bg-gold-50 text-gold-700";
  return (
    <div className="rounded-xl border border-gold-100 bg-ivory-50 p-3">
      <div className={`mb-1.5 inline-grid h-7 w-7 place-items-center rounded-lg ${toneCls}`}>{icon}</div>
      <p className="font-serif text-lg font-semibold leading-none">{value}</p>
      <p className="text-[0.65rem] text-ink-muted">{label}</p>
    </div>
  );
}
