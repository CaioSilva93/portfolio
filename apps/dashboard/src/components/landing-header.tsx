"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BarChart3, Moon, Sun, ArrowRight } from "lucide-react";

export function LandingHeader() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (data.user) setIsLoggedIn(true);
      });
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[hsl(var(--primary))]" />
          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
            Analytics
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              mounted &&
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
            className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
            style={{ width: 30, height: 30 }}
          >
            {mounted &&
              (resolvedTheme === "dark" ? (
                <Sun className="h-3.5 w-3.5" />
              ) : (
                <Moon className="h-3.5 w-3.5" />
              ))}
          </button>
          <Link
            href={isLoggedIn ? "/dashboard" : "/auth/login"}
            className="rounded-md bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--primary-foreground))] transition-all hover:brightness-110"
          >
            {isLoggedIn ? "Dashboard" : "Sign in"}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function HeroCTA() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (data.user) setIsLoggedIn(true);
      });
  }, []);

  return (
    <div className="mt-8 flex items-center gap-3">
      <Link
        href={isLoggedIn ? "/dashboard" : "/auth/signup"}
        className="inline-flex items-center gap-2 rounded-md bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-all hover:brightness-110"
      >
        {isLoggedIn ? "Go to Dashboard" : "Create free account"}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
      {!isLoggedIn && (
        <Link
          href="/auth/login"
          className="rounded-md border border-[hsl(var(--border))] bg-transparent px-5 py-2.5 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--card))]"
        >
          Sign in
        </Link>
      )}
    </div>
  );
}
