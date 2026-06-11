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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "glass-strong border-b border-[hsl(var(--border))/0.3]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-lg font-bold"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
            <Link2 className="h-4 w-4" />
          </div>
          <span className="text-[hsl(var(--foreground))]">Short</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {user && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}
          <Link
            href="/docs"
            className="rounded-lg px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
          >
            API Docs
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
          <div className="ml-2 h-5 w-px bg-[hsl(var(--border))]" />
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-2">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          ) : (
            <Link href="/auth/login" className="ml-2">
              <Button size="sm" className="rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90">
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </Button>
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="glass-strong border-t border-[hsl(var(--border))/0.3] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {user && (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]">
                Dashboard
              </Link>
            )}
            <Link href="/docs" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]">
              API Docs
            </Link>
            {user ? (
              <button onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-sm text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]">
                Sign out
              </button>
            ) : (
              <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-[hsl(var(--primary))]">
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
