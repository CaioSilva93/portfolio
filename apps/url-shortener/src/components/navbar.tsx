"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Link2, Menu, X, LogIn, LayoutDashboard, LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-lg font-bold text-[hsl(var(--primary))]"
        >
          <Link2 className="h-5 w-5" />
          Short
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          {user && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}
          <Link
            href="/docs"
            className="text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
          >
            API Docs
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          ) : (
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </Button>
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 text-[hsl(var(--muted-foreground))] md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {user && (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm text-[hsl(var(--muted-foreground))]">
                Dashboard
              </Link>
            )}
            <Link href="/docs" onClick={() => setMobileOpen(false)} className="text-sm text-[hsl(var(--muted-foreground))]">
              API Docs
            </Link>
            {user ? (
              <button onClick={handleLogout} className="text-left text-sm text-[hsl(var(--muted-foreground))]">
                Sign out
              </button>
            ) : (
              <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="text-sm text-[hsl(var(--primary))]">
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
