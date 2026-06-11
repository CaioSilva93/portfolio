"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))]">
        <div className="w-full max-w-md space-y-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--card-foreground))]">
            Check your email
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            We&apos;ve sent you a confirmation link. Please check your email to
            verify your account.
          </p>
          <Link
            href="/auth/login"
            className="inline-block text-sm font-medium text-[hsl(var(--primary))] hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))]">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--card-foreground))]">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            Sign up to start shopping
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-[hsl(var(--destructive))] px-4 py-3 text-sm text-[hsl(var(--destructive-foreground))]">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[hsl(var(--card-foreground))]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[hsl(var(--card-foreground))]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-[hsl(var(--primary))] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
