"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AuthShell, SocialButtons } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/fields";
import { Mail, Lock, User, Sparkles } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not create account.");
      setLoading(false);
      return;
    }
    const login = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (login?.error) {
      setError("Account created — please sign in.");
      router.push("/signin");
      return;
    }
    router.push("/onboarding");
    router.refresh();
  }

  return (
    <AuthShell>
      <h1 className="font-serif text-4xl font-semibold">Start planning in seconds</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Create your Zariya account with email. It&apos;s free to try, and your wedding workspace will be
        ready in moments.
      </p>

      <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-gold-200 bg-gold-50 px-4 py-2 text-sm font-medium text-gold-700">
        <Sparkles className="h-4 w-4" /> Free early access
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label="Your name">
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500" />
            <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aisha" className="pl-9" />
          </div>
        </Field>
        <Field label="Email">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500" />
            <TextInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9" />
          </div>
        </Field>
        <Field label="Password" hint="At least 6 characters.">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500" />
            <TextInput type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-9" />
          </div>
        </Field>
        {error && <p className="rounded-lg bg-rose-bg px-3 py-2 text-sm text-rose-text">{error}</p>}
        <Button type="submit" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-ink-muted">
        <span className="h-px flex-1 bg-gold-100" /> or <span className="h-px flex-1 bg-gold-100" />
      </div>
      <SocialButtons />

      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/signin" className="font-medium text-gold-700 hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
