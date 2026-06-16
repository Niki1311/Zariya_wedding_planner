"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { ChevronDown, LogOut, Settings, Sparkles, User } from "lucide-react";
import { useStore, useWedding } from "@/lib/store";

export function ProfileMenu() {
  const wedding = useWedding();
  const router = useRouter();
  const mutate = useStore((s) => s.mutate);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const name = wedding.user.name || wedding.coupleNames.split("&")[0]?.trim() || "You";

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function restartGuide() {
    setOpen(false);
    await mutate("PATCH", "/api/wedding", { guideCompleted: false });
    router.push("/app");
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-gold-100 bg-white py-1.5 pl-1.5 pr-2.5 transition hover:bg-ivory-100"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-xs font-semibold text-white">
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden text-sm font-medium text-ink sm:block">{name}</span>
        <ChevronDown className="h-4 w-4 text-ink-muted" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-gold-100 bg-white shadow-lift">
          <div className="border-b border-gold-100 px-4 py-3">
            <p className="text-sm font-semibold text-ink">{name}</p>
            <p className="truncate text-xs text-ink-muted">{wedding.user.email}</p>
          </div>
          <div className="p-1.5">
            <MenuItem icon={<Settings className="h-4 w-4" />} label="Settings" onClick={() => { setOpen(false); router.push("/app/settings"); }} />
            <MenuItem icon={<Sparkles className="h-4 w-4" />} label="Restart dashboard guide" onClick={restartGuide} />
            <MenuItem icon={<LogOut className="h-4 w-4" />} label="Sign out" onClick={() => signOut({ callbackUrl: "/" })} />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-ink-light transition hover:bg-ivory-100 hover:text-ink">
      <span className="text-gold-500">{icon}</span>
      {label}
    </button>
  );
}
