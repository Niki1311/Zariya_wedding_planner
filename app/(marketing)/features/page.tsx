import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import { GoldDivider, CornerMotif } from "@/components/ui/Motifs";
import {
  LayoutDashboard, CalendarClock, CalendarHeart, Users, Store, Wallet, Receipt,
  ListChecks, Bell, Search, Settings, Sparkles, ArrowRight,
} from "lucide-react";

const SECTIONS = [
  { icon: <LayoutDashboard className="h-5 w-5" />, title: "Dashboard", body: "Countdown, planning progress, guest summary, attention items, itinerary and budget — what needs you next, at a glance." },
  { icon: <CalendarClock className="h-5 w-5" />, title: "Planning timeline", body: "Phase-by-phase checklists from 12 months out to wedding week, with statuses, due dates, filters and a full calendar." },
  { icon: <CalendarHeart className="h-5 w-5" />, title: "Events", body: "Each celebration with a default checklist, run-of-show, vendors involved and live guest counts." },
  { icon: <ListChecks className="h-5 w-5" />, title: "Master wedding timeline", body: "The real wedding-day schedule — calendar, list and print views with overlapping blocks." },
  { icon: <Users className="h-5 w-5" />, title: "Guests & RSVP", body: "Add a guest once; RSVP totals, segments and per-event counts update across the app." },
  { icon: <Store className="h-5 w-5" />, title: "Vendors", body: "Contracts, payments, categories and event links in a single connected record." },
  { icon: <Wallet className="h-5 w-5" />, title: "Budget", body: "Estimated vs actual by category, overall health chart, and one-click 'update to actual'." },
  { icon: <Receipt className="h-5 w-5" />, title: "Payments", body: "Upcoming, pending and paid — feeding budget health and vendor status automatically." },
  { icon: <Search className="h-5 w-5" />, title: "Global search", body: "Find any guest, vendor, event, task or payment — grouped clearly by type." },
  { icon: <Bell className="h-5 w-5" />, title: "Smart notifications", body: "Payment reminders, overdue tasks, RSVP follow-ups and over-budget alerts." },
  { icon: <Settings className="h-5 w-5" />, title: "Settings", body: "Manage events, budget categories, dates and preferences — reflected everywhere." },
  { icon: <Sparkles className="h-5 w-5" />, title: "Guided setup", body: "A friendly first-time tour and a build-your-workspace onboarding flow." },
];

export default function FeaturesPage() {
  return (
    <div className="relative overflow-hidden">
      <CornerMotif className="absolute -right-16 top-10 h-80 w-80 opacity-20" flip />
      <section className="mx-auto max-w-7xl px-5 py-16 text-center">
        <FadeIn>
          <GoldDivider className="mb-4" />
          <h1 className="font-serif text-5xl font-semibold">Everything you need, beautifully connected</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-light">
            One workspace where guest, vendor, event, payment and budget information flows automatically
            into the places it&apos;s needed.
          </p>
        </FadeIn>
        <Stagger className="mt-12 grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <StaggerItem key={s.title}>
              <div className="card-base h-full p-6 transition hover:shadow-lift">
                <div className="mb-3 inline-grid h-11 w-11 place-items-center rounded-xl bg-gold-50 text-gold-600">
                  {s.icon}
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-light">{s.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-14">
          <Link href="/signup">
            <Button size="lg" icon={<ArrowRight className="h-4 w-4" />}>Try Zariya free</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
