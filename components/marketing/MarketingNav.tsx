"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function MarketingNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-gold-100/60 bg-ivory-100/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm text-ink-light transition hover:text-gold-700",
                pathname === l.href && "text-gold-700"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/signin" className="text-sm text-ink-light transition hover:text-gold-700">
            Sign in
          </Link>
          <Link href="/signup">
            <Button size="sm">Try for free</Button>
          </Link>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6 text-ink" /> : <Menu className="h-6 w-6 text-ink" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-gold-100 bg-ivory-50 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-ink-light" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/signin" className="text-sm text-ink-light" onClick={() => setOpen(false)}>
              Sign in
            </Link>
            <Link href="/signup" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full">Try for free</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
