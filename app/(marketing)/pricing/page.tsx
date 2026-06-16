import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/motion";
import { GoldDivider } from "@/components/ui/Motifs";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Early Access",
    price: "Free",
    tag: "Available now",
    highlight: true,
    features: ["Full planning workspace", "Events, guests, vendors", "Budget & payment tracking", "Planning & wedding-day timelines", "Guided setup & tour"],
  },
  {
    name: "Couple",
    price: "Coming soon",
    tag: "Planned",
    highlight: false,
    features: ["Everything in Early Access", "Family & co-planner access", "Document storage", "Travel & stay management", "Priority support"],
  },
];

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16 text-center">
      <FadeIn>
        <GoldDivider className="mb-4" />
        <h1 className="font-serif text-5xl font-semibold">Simple, couple-friendly pricing</h1>
        <p className="mx-auto mt-3 max-w-lg text-ink-light">
          Start free while we&apos;re in early access. It&apos;s genuinely free to plan your whole wedding.
        </p>
      </FadeIn>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`card-base p-8 text-left ${p.highlight ? "ring-2 ring-gold-300" : ""}`}
          >
            <span className="inline-block rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-gold-700">
              {p.tag}
            </span>
            <h3 className="mt-4 font-serif text-2xl font-semibold">{p.name}</h3>
            <p className="mt-1 font-serif text-4xl font-semibold text-gold-700">{p.price}</p>
            <ul className="mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-light">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-text" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="mt-8 block">
              <Button className="w-full" variant={p.highlight ? "gold" : "ghost"}>
                {p.highlight ? "Get started free" : "Join the waitlist"}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
