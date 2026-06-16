"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Logo, LotusMark } from "@/components/ui/Logo";
import { CornerMotif, GoldDivider } from "@/components/ui/Motifs";
import { Button } from "@/components/ui/Button";
import { Field, TextInput, Select } from "@/components/ui/fields";
import { Check, Heart, ArrowLeft, ArrowRight, Plus, Sparkles } from "lucide-react";
import { EVENT_OPTIONS, PLANNING_PHASES } from "@/lib/types";
import { cn, formatINR } from "@/lib/utils";

const HELP_AREAS = ["Timeline", "Budget", "Guests", "Vendors", "Travel & stay", "Family coordination", "Everything"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [building, setBuilding] = useState(false);

  // form state
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [weddingName, setWeddingName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [budget, setBudget] = useState("");
  const [events, setEvents] = useState<string[]>(["Haldi", "Mehendi", "Sangeet", "Wedding", "Reception"]);
  const [customEvent, setCustomEvent] = useState("");
  const [phase, setPhase] = useState("4 months before");
  const [help, setHelp] = useState<string>("Everything");

  const TOTAL = 4;

  function toggleEvent(name: string) {
    setEvents((cur) => (cur.includes(name) ? cur.filter((e) => e !== name) : [...cur, name]));
  }
  function addCustom() {
    const v = customEvent.trim();
    if (v && !events.includes(v)) setEvents([...events, v]);
    setCustomEvent("");
  }

  async function finish() {
    setBuilding(true);
    const coupleNames = p1 && p2 ? `${p1} & ${p2}` : p1 || "Our";
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        coupleNames,
        weddingName: weddingName || `${coupleNames}'s Wedding`,
        location,
        startDate: startDate || null,
        endDate: endDate || null,
        totalBudget: budget ? parseFloat(budget) : 0,
        planningPhase: phase,
        events,
      }),
    });
    // let the build animation play
    setTimeout(() => {
      router.push("/app");
      router.refresh();
    }, 3200);
  }

  const canNext =
    step === 1 ? !!p1 : step === 2 ? !!startDate && !!location : step === 3 ? events.length > 0 : true;

  if (building) return <CreatingWorkspace />;

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Form side */}
      <div className="relative flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-20">
        <CornerMotif className="absolute left-0 top-0 h-40 w-40 opacity-20" />
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center justify-between">
            <Logo size="sm" />
            <span className="text-sm text-ink-muted">{step} / {TOTAL}</span>
          </div>
          {/* progress */}
          <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-ivory-300">
            <div className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-500" style={{ width: `${(step / TOTAL) * 100}%` }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <Stepwrap title="Couple details" subtitle="Let's begin with the names behind the celebration.">
                  <Field label="Partner 1 name" required>
                    <TextInput value={p1} onChange={(e) => setP1(e.target.value)} placeholder="e.g. Aisha" />
                  </Field>
                  <Field label="Partner 2 name">
                    <TextInput value={p2} onChange={(e) => setP2(e.target.value)} placeholder="e.g. Rohan" />
                  </Field>
                  <Field label="Wedding name (optional)">
                    <TextInput value={weddingName} onChange={(e) => setWeddingName(e.target.value)} placeholder="Aisha & Rohan's Wedding" />
                  </Field>
                </Stepwrap>
              )}

              {step === 2 && (
                <Stepwrap title="Wedding basics" subtitle="Tell us the essentials so we can shape your planning workspace.">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Start date" required>
                      <TextInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </Field>
                    <Field label="End date">
                      <TextInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Destination" required>
                    <TextInput value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Udaipur, Rajasthan" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Guest count">
                      <TextInput type="number" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} placeholder="250" />
                    </Field>
                    <Field label="Total budget (₹)" hint={budget ? formatINR(parseFloat(budget)) : undefined}>
                      <TextInput type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="14000000" />
                    </Field>
                  </div>
                </Stepwrap>
              )}

              {step === 3 && (
                <Stepwrap title="Choose your events" subtitle="Select the celebrations you're planning. You can add more later.">
                  <div className="grid grid-cols-3 gap-2.5">
                    {[...EVENT_OPTIONS, ...events.filter((e) => !EVENT_OPTIONS.includes(e as any))].map((name) => {
                      const active = events.includes(name);
                      return (
                        <button
                          key={name}
                          onClick={() => toggleEvent(name)}
                          className={cn(
                            "relative rounded-xl border px-2 py-3 text-sm font-medium transition",
                            active
                              ? "border-gold-400 bg-gradient-to-b from-gold-50 to-gold-100 text-gold-700 shadow-soft"
                              : "border-gold-200/70 bg-white text-ink-light hover:bg-ivory-100"
                          )}
                        >
                          {active && <Check className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-gold-600" />}
                          {name}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <TextInput
                      value={customEvent}
                      onChange={(e) => setCustomEvent(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
                      placeholder="Custom event (e.g. Pool party)"
                    />
                    <Button variant="ghost" onClick={addCustom} icon={<Plus className="h-4 w-4" />}>Add</Button>
                  </div>
                </Stepwrap>
              )}

              {step === 4 && (
                <Stepwrap title="Planning style" subtitle="What do you need the most help with? We'll personalize your dashboard.">
                  <div className="grid grid-cols-2 gap-2.5">
                    {HELP_AREAS.map((h) => (
                      <button
                        key={h}
                        onClick={() => setHelp(h)}
                        className={cn(
                          "rounded-xl border px-3 py-3 text-sm font-medium transition",
                          help === h
                            ? "border-gold-400 bg-gradient-to-b from-gold-50 to-gold-100 text-gold-700 shadow-soft"
                            : "border-gold-200/70 bg-white text-ink-light hover:bg-ivory-100"
                        )}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                  <Field label="How far away is your wedding?" className="mt-4">
                    <Select value={phase} onChange={(e) => setPhase(e.target.value)} options={PLANNING_PHASES as unknown as string[]} />
                  </Field>
                </Stepwrap>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center gap-3">
            {step > 1 && (
              <Button variant="ghost" onClick={() => setStep(step - 1)} icon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
            )}
            {step < TOTAL ? (
              <Button onClick={() => canNext && setStep(step + 1)} disabled={!canNext} icon={<ArrowRight className="h-4 w-4" />} className="ml-auto">
                Next step
              </Button>
            ) : (
              <Button onClick={finish} icon={<Sparkles className="h-4 w-4" />} className="ml-auto">
                Create workspace
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Decorative side */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-ivory-200 via-gold-50 to-ivory-300 md:block">
        <div className="absolute inset-0 grain opacity-60" />
        <CornerMotif className="absolute right-0 top-0 h-72 w-72 opacity-40" flip />
        <CornerMotif className="absolute bottom-0 left-0 h-72 w-72 opacity-30" />
        <div className="relative grid h-full place-items-center p-12 text-center">
          <div>
            <LotusMark className="mx-auto h-20" />
            <GoldDivider className="my-6" />
            <p className="font-serif text-3xl font-semibold leading-snug text-ink">
              Your wedding,
              <br />
              beautifully planned
            </p>
            <p className="mt-3 max-w-xs text-sm text-ink-muted">
              Some love stories deserve a destination. Yours is one of them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stepwrap({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-serif text-4xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}

function CreatingWorkspace() {
  const steps = ["Timeline", "Budget tracker", "Events workspace", "Guest list", "Planning dashboard"];
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-ivory-100 via-gold-50 to-ivory-200 px-6">
      <div className="w-full max-w-md text-center">
        <LotusMark className="mx-auto h-16" />
        <h1 className="mt-6 font-serif text-4xl font-semibold">Creating your Zariya workspace…</h1>
        <p className="mt-2 text-sm text-ink-muted">
          We&apos;re setting up your personalized planning dashboard so everything feels organized from day one.
        </p>
        <div className="mt-8 space-y-3 text-left">
          {steps.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.5 }}
              className="flex items-center justify-between rounded-xl border border-gold-100 bg-white px-4 py-3 shadow-soft"
            >
              <span className="text-sm font-medium text-ink">{s}</span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.55 + i * 0.5, type: "spring" }}
                className="grid h-6 w-6 place-items-center rounded-full bg-sage-bg text-sage-text"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </motion.span>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-muted">
          <Heart className="h-4 w-4 text-gold-500" /> This will only take a moment.
        </p>
      </div>
    </div>
  );
}
