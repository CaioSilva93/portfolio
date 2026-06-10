"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (error.message.toLowerCase().includes("rate limit")) {
        setError(
          "Email rate limit exceeded. Supabase allows a maximum of 3 confirmation emails per hour. Please wait and try again later."
        );
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[hsl(var(--foreground))]">Check your email</CardTitle>
            <CardDescription className="text-[hsl(var(--muted-foreground))]">
              We sent a confirmation link to {email}. Note: Supabase free tier
              allows a maximum of 3 confirmation emails per hour.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[hsl(var(--foreground))]">Create an account</CardTitle>
          <CardDescription className="text-[hsl(var(--muted-foreground))]">
            Sign up to generate AI-powered content
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <p className="rounded-md bg-[hsl(var(--muted))]/50 p-3 text-xs text-[hsl(var(--muted-foreground))]">
              Note: Supabase free tier allows a maximum of 3 confirmation
              emails per hour. If you hit this limit, please wait before
              trying again.
            </p>
            {error && (
              <p className="rounded-md bg-[hsl(var(--destructive))]/10 p-3 text-sm text-[hsl(var(--destructive))]">
                {error}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[hsl(var(--primary))] hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
