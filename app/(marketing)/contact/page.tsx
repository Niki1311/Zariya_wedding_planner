"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, TextInput, TextArea } from "@/components/ui/fields";
import { GoldDivider, CornerMotif } from "@/components/ui/Motifs";
import { Mail, Clock, Heart, Check } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="relative overflow-hidden">
      <CornerMotif className="absolute -right-16 top-10 h-80 w-80 opacity-20" flip />
      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="text-center">
          <GoldDivider className="mb-4" />
          <h1 className="font-serif text-5xl font-semibold">Contact us</h1>
          <p className="mt-2 text-ink-light">Tell us about your wedding and we&apos;ll follow up shortly.</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="card-base p-7">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 grid h-14 w-14 place-items-center rounded-full bg-sage-bg text-sage-text">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold">Message sent</h3>
                <p className="mt-1 text-sm text-ink-muted">We usually reply within 24–48 hours.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="grid gap-4"
              >
                <Field label="Name"><TextInput required placeholder="Your name" /></Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email"><TextInput type="email" required placeholder="you@example.com" /></Field>
                  <Field label="Phone"><TextInput placeholder="+91 ..." /></Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Wedding location"><TextInput placeholder="e.g. Udaipur, Rajasthan" /></Field>
                  <Field label="Wedding date"><TextInput type="date" /></Field>
                </div>
                <Field label="Message"><TextArea placeholder="Tell us about your wedding plans..." /></Field>
                <Button type="submit" className="w-fit">Send message</Button>
              </form>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <InfoCard icon={<Mail className="h-5 w-5" />} title="Prefer email?" body="hello@zariya.in" />
            <InfoCard icon={<Clock className="h-5 w-5" />} title="Response time" body="We usually reply within 24–48 hours." />
            <div className="card-base flex-1 p-6">
              <Heart className="mb-2 h-6 w-6 text-gold-500" />
              <p className="font-serif text-lg font-semibold">Every love story is unique.</p>
              <p className="mt-1 text-sm text-ink-muted">We&apos;re here to help you plan it beautifully.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card-base flex items-start gap-3 p-5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-50 text-gold-600">{icon}</span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm text-ink-muted">{body}</p>
      </div>
    </div>
  );
}
