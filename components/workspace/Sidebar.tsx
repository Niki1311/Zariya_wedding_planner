"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { CornerMotif } from "@/components/ui/Motifs";
import {
  LayoutDashboard,
  CalendarClock,
  Wallet,
  Receipt,
  CalendarHeart,
  Users,
  Store,
  Settings,
} from "lucide-react";

const NAV = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/app/timeline", label: "Timeline", icon: CalendarClock },
  { href: "/app/budget", label: "Budget", icon: Wallet },
  { href: "/app/payments", label: "Payments", icon: Receipt },
  { href: "/app/events", label: "Events", icon: CalendarHeart },
  { href: "/app/guests", label: "Guests", icon: Users },
  { href: "/app/vendors", label: "Vendors", icon: Store },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-gold-100 bg-ivory-50/90 lg:flex">
      <div className="relative overflow-hidden px-5 py-5">
        <CornerMotif className="absolute -bottom-16 -left-8 h-48 w-48 opacity-20" />
        <Link href="/app">
          <Logo size="sm" showTagline />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              data-tour={`nav-${item.label.toLowerCase()}`}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-gradient-to-r from-gold-50 to-ivory-100 text-gold-700"
                  : "text-ink-light hover:bg-ivory-100 hover:text-ink"
              )}
            >
              {active && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-gold-400 to-gold-600" />}
              <Icon className={cn("h-[1.15rem] w-[1.15rem]", active ? "text-gold-600" : "text-ink-muted group-hover:text-gold-600")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="relative overflow-hidden border-t border-gold-100 px-5 py-4">
        <CornerMotif className="absolute -top-10 right-0 h-32 w-32 opacity-20" flip />
        <p className="text-xs text-ink-muted">Enter once,</p>
        <p className="font-serif text-base font-semibold text-gold-700">update everywhere.</p>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-gold-100 bg-ivory-50/95 px-2 py-1.5 backdrop-blur lg:hidden">
      {NAV.slice(0, 6).map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} className={cn("flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-[0.6rem]", active ? "text-gold-700" : "text-ink-muted")}>
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
