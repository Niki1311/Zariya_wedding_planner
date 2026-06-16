"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LotusMark, Logo } from "@/components/ui/Logo";
import { CornerMotif } from "@/components/ui/Motifs";
import { CalendarClock, Wallet, Users, Store, Bell, StickyNote, Plane, CalendarHeart } from "lucide-react";

const ORBIT = [
  { icon: <CalendarClock className="h-4 w-4" />, label: "Timeline", angle: -60 },
  { icon: <Wallet className="h-4 w-4" />, label: "Budget", angle: -20 },
  { icon: <Users className="h-4 w-4" />, label: "Guests", angle: 20 },
  { icon: <CalendarHeart className="h-4 w-4" />, label: "Events", angle: 60 },
  { icon: <Plane className="h-4 w-4" />, label: "Travel", angle: 110 },
  { icon: <Store className="h-4 w-4" />, label: "Vendors", angle: 160 },
  { icon: <StickyNote className="h-4 w-4" />, label: "Notes", angle: 200 },
  { icon: <Bell className="h-4 w-4" />, label: "Reminders", angle: 250 },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Form side */}
      <div className="relative flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-20">
        <CornerMotif className="absolute left-0 top-0 h-40 w-40 opacity-20" />
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-8 inline-block">
            <Logo size="sm" showTagline />
          </Link>
          {children}
        </div>
      </div>

      {/* Decorative side */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-ivory-200 via-gold-50 to-ivory-300 md:block">
        <div className="absolute inset-0 grain opacity-60" />
        <CornerMotif className="absolute right-0 top-0 h-72 w-72 opacity-40" flip />
        <CornerMotif className="absolute bottom-0 left-0 h-72 w-72 opacity-30" />
        <div className="relative grid h-full place-items-center p-10">
          <div className="relative h-[22rem] w-[22rem]">
            {/* orbit rings */}
            <div className="absolute inset-0 rounded-full border border-gold-200/60" />
            <div className="absolute inset-8 rounded-full border border-gold-200/50" />
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              {ORBIT.map((o) => {
                const rad = (o.angle * Math.PI) / 180;
                const R = 152;
                const x = Math.cos(rad) * R;
                const y = Math.sin(rad) * R;
                return (
                  <motion.div
                    key={o.label}
                    className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border border-gold-100 bg-white text-gold-600 shadow-soft"
                    style={{ x, y }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  >
                    {o.icon}
                  </motion.div>
                );
              })}
            </motion.div>
            {/* center mark */}
            <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border border-gold-200 bg-white/80 shadow-card backdrop-blur">
              <LotusMark className="h-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SocialButtons() {
  const providers = [
    { name: "Google", color: "#EA4335", letter: "G" },
    { name: "Apple", color: "#000000", letter: "" },
    { name: "Microsoft", color: "#00A4EF", letter: "" },
  ];
  return (
    <div className="space-y-2.5">
      {providers.map((p) => (
        <button
          key={p.name}
          type="button"
          disabled
          title="Social sign-in coming soon"
          className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-gold-200/70 bg-white px-4 py-2.5 text-sm font-medium text-ink opacity-70 transition"
        >
          <span className="grid h-5 w-5 place-items-center rounded-full text-xs font-bold text-white" style={{ background: p.color }}>
            {p.letter}
          </span>
          Continue with {p.name}
        </button>
      ))}
    </div>
  );
}
