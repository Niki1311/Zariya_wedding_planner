import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import { AppPreview } from "@/components/marketing/AppPreview";
import { CornerMotif, GoldDivider } from "@/components/ui/Motifs";
import {
  CalendarHeart,
  Wallet,
  Users,
  Store,
  ListChecks,
  Receipt,
  Sparkles,
  ArrowRight,
  Star,
  MessageCircle,
  FileSpreadsheet,
  StickyNote,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <CornerMotif className="absolute -left-12 top-10 h-72 w-72 opacity-30" />
        <CornerMotif className="absolute -right-16 top-40 h-80 w-80 opacity-20" flip />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <FadeIn>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-200 bg-white px-3 py-1 text-xs font-medium text-gold-700">
                <Sparkles className="h-3.5 w-3.5" /> Calm planning for destination weddings
              </span>
            </FadeIn>
            <FadeIn delay={0.05}>
              <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] text-ink md:text-6xl">
                Plan your Indian destination wedding{" "}
                <span className="bg-gradient-to-r from-gold-500 to-gold-700 bg-clip-text text-transparent">
                  without the chaos
                </span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-5 max-w-lg text-lg text-ink-light">
                Replace scattered WhatsApp messages, spreadsheets, and notes with one calm workspace for
                events, guests, vendors, budget, payments and schedules.
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/signup">
                  <Button size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                    Start with early access
                  </Button>
                </Link>
                <Link href="/features">
                  <Button size="lg" variant="ghost">
                    See what&apos;s included
                  </Button>
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="mt-6 flex items-center gap-3 text-sm text-ink-muted">
                <div className="flex -space-x-2">
                  {["#E9D29C", "#DDBA6C", "#C49A4A", "#E7D8BF"].map((c) => (
                    <span key={c} className="h-7 w-7 rounded-full border-2 border-ivory-100" style={{ background: c }} />
                  ))}
                </div>
                <span className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                  ))}
                </span>
                <span>Loved by early couples · 4.9/5</span>
              </div>
            </FadeIn>
          </div>
          <div className="flex justify-center md:justify-end">
            <AppPreview />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl px-5 py-16">
        <div className="text-center">
          <GoldDivider className="mb-4" />
          <h2 className="font-serif text-4xl font-semibold">Your plan starts with 4 details</h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-light">
            Tell Zariya a little about your wedding and your entire workspace builds itself.
          </p>
        </div>
        <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
          {HOW.map((h) => (
            <StaggerItem key={h.title}>
              <div className="card-base h-full p-6">
                <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-gold-50 text-gold-600">
                  {h.icon}
                </div>
                <h3 className="text-xl font-semibold">{h.title}</h3>
                <p className="mt-2 text-sm text-ink-light">{h.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Built for the details */}
      <section className="bg-ivory-200/50 py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center">
            <GoldDivider className="mb-4" />
            <h2 className="font-serif text-4xl font-semibold">Built for the details spreadsheets miss</h2>
            <p className="mx-auto mt-2 max-w-xl text-ink-light">
              Enter information once — Zariya keeps every page in sync automatically.
            </p>
          </div>
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <StaggerItem key={f.title}>
                <div className="card-base h-full p-6 transition hover:shadow-lift">
                  <div className="mb-3 inline-grid h-11 w-11 place-items-center rounded-xl bg-gold-50 text-gold-600">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-light">{f.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Everything in one place */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="text-center">
          <GoldDivider className="mb-4" />
          <h2 className="font-serif text-4xl font-semibold">Everything in one place</h2>
        </div>
        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-ink-muted">
            <Channel icon={<MessageCircle className="h-5 w-5" />} label="WhatsApp" />
            <Channel icon={<FileSpreadsheet className="h-5 w-5" />} label="Spreadsheets" />
            <Channel icon={<StickyNote className="h-5 w-5" />} label="Notes" />
          </div>
          <ArrowRight className="h-6 w-6 rotate-90 text-gold-400" />
          <div className="rounded-2xl border border-gold-200 bg-gradient-to-b from-gold-50 to-white px-8 py-6 text-center shadow-card">
            <p className="zariya-wordmark text-3xl">Zariya</p>
            <p className="text-xs uppercase tracking-[0.25em] text-gold-600">Your wedding OS</p>
          </div>
        </div>
      </section>

      {/* Story / testimonial */}
      <section id="story" className="bg-ivory-200/50 py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <GoldDivider className="mb-5" />
          <blockquote className="font-serif text-2xl font-medium leading-relaxed text-ink md:text-3xl">
            &ldquo;Zariya made me realise wedding planning can be calm and organised. From budgets to
            guests to vendors, everything was in one place. We could actually enjoy the journey.&rdquo;
          </blockquote>
          <p className="mt-5 text-sm text-ink-muted">Aishwarya &amp; Karan — Udaipur, May 2025</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-5xl px-5 py-20 text-center">
        <h2 className="font-serif text-4xl font-semibold md:text-5xl">A calmer way to plan your wedding.</h2>
        <p className="mx-auto mt-3 max-w-lg text-ink-light">
          Start calm. Grow with Zariya. Join free and build your wedding workspace in minutes.
        </p>
        <Link href="/signup" className="mt-7 inline-block">
          <Button size="lg" icon={<Sparkles className="h-4 w-4" />}>
            Create my wedding workspace
          </Button>
        </Link>
      </section>
    </>
  );
}

const HOW = [
  { icon: <CalendarHeart className="h-6 w-6" />, title: "Set your wedding details", body: "Add your names, dates, destination and budget. They flow across your entire workspace." },
  { icon: <ListChecks className="h-6 w-6" />, title: "Get your planning workspace", body: "Selected events get ready-made checklists, run-of-show, and a planning timeline." },
  { icon: <Sparkles className="h-6 w-6" />, title: "Track everything in one place", body: "Guests, vendors, budget and payments stay connected and always up to date." },
];

const FEATURES = [
  { icon: <CalendarHeart className="h-5 w-5" />, title: "Events & schedules", body: "Every celebration with checklist, run-of-show, vendors and guest counts." },
  { icon: <ListChecks className="h-5 w-5" />, title: "Planning timeline", body: "Phase-by-phase checklists from 12 months out to wedding week." },
  { icon: <Users className="h-5 w-5" />, title: "Guests & RSVP", body: "Add a guest once — totals and event counts update everywhere." },
  { icon: <Store className="h-5 w-5" />, title: "Vendor directory", body: "Contracts, payments and event links for every vendor in one record." },
  { icon: <Wallet className="h-5 w-5" />, title: "Budget health", body: "Estimated vs actual, committed vs spent, and over-budget alerts." },
  { icon: <Receipt className="h-5 w-5" />, title: "Payment tracking", body: "Due, pending and paid — automatically reflected in your budget." },
];

function Channel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-gold-100 bg-white px-4 py-2.5 shadow-soft">
      <span className="text-gold-500">{icon}</span>
      <span className="text-sm font-medium text-ink">{label}</span>
    </div>
  );
}
