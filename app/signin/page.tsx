"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AuthShell, SocialButtons } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/fields";
import { Mail, Lock, Sparkles } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }
    router.push("/app");
    router.refresh();
  }

  function fillDemo() {
    setEmail("demo@zariya.app");
    setPassword("demo1234");
  }

  return (
    <AuthShell>
      <h1 className="font-serif text-4xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Log in to continue planning your wedding with calm, clarity, and everything in one place.
      </p>

      <button
        onClick={fillDemo}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gold-200 bg-gold-50 px-4 py-2 text-sm font-medium text-gold-700 transition hover:bg-gold-100"
      >
        <Sparkles className="h-4 w-4" /> Free to try for couples — use the demo workspace
      </button>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label="Email">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500" />
            <TextInput
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-9"
            />
          </div>
        </Field>
        <Field label="Password">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500" />
            <TextInput
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-9"
            />
          </div>
        </Field>
        {error && <p className="rounded-lg bg-rose-bg px-3 py-2 text-sm text-rose-text">{error}</p>}
        <Button type="submit" className="w-full" loading={loading}>
          Continue with email
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-ink-muted">
        <span className="h-px flex-1 bg-gold-100" /> or <span className="h-px flex-1 bg-gold-100" />
      </div>
      <SocialButtons />

      <p className="mt-6 text-center text-sm text-ink-muted">
        New to Zariya?{" "}
        <Link href="/signup" className="font-medium text-gold-700 hover:underline">
          Sign up free
        </Link>
      </p>
    </AuthShell>
  );
}
