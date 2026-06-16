import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/motion";
import { GoldDivider, CornerMotif } from "@/components/ui/Motifs";
import { Check, Sparkles, Bell } from "lucide-react";

const AVAILABLE = ["Wedding dashboard", "Planning timeline & calendar", "Events workspace", "Budget tracker", "Guest list & RSVP", "Vendor directory", "Payment tracking", "Master wedding-day timeline"];
const COMING = ["Family co-planning", "Guest travel & stay", "Document storage", "Vendor reminders", "Mobile app"];

export default function EarlyAccessPage() {
  return (
    <div className="relative overflow-hidden">
      <CornerMotif className="absolute -left-12 top-10 h-72 w-72 opacity-25" />
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-200 bg-white px-3 py-1 text-xs font-medium text-gold-700">
              <Sparkles className="h-3.5 w-3.5" /> Available now
            </span>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight">
              Start with what you need today.{" "}
              <span className="bg-gradient-to-r from-gold-500 to-gold-700 bg-clip-text text-transparent">
                Grow into everything else.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-ink-light">
              Zariya gives you a calm planning workspace now — with more powerful planning features landing
              soon. Built for Indian destination weddings that deserve more than spreadsheets and WhatsApp.
            </p>
            <Link href="/signup" className="mt-7 inline-block">
              <Button size="lg" icon={<Sparkles className="h-4 w-4" />}>Start free with early access</Button>
            </Link>
          </FadeIn>
          <div className="grid gap-5">
            <div className="card-base p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Check className="h-5 w-5 text-sage-text" /> Free / Early access
              </h3>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {AVAILABLE.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-light">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-text" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-base p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Bell className="h-5 w-5 text-gold-500" /> Coming soon
              </h3>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {COMING.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-300" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 text-center">
          <GoldDivider className="mb-4" />
          <h2 className="font-serif text-3xl font-semibold">Start calm. Grow with Zariya.</h2>
          <Link href="/signup" className="mt-6 inline-block">
            <Button size="lg">Create my wedding workspace</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
