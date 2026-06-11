"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BarChart3,
  ShieldAlert,
  AlertTriangle,
  Eye,
  ArrowRight,
  Moon,
  Sun,
  LayoutDashboard,
  Users,
  LineChart,
  Lock,
  Activity,
  TrendingUp,
} from "lucide-react";

export default function Home() {
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
    <div className="min-h-screen">
      {/* Grid background */}
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10 opacity-40" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--background))]" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[hsl(var(--primary))]" />
            <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
              Analytics
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Moon className="h-3.5 w-3.5" />
                )}
              </button>
            )}
            <Link
              href={isLoggedIn ? "/dashboard" : "/auth/login"}
              className="rounded-md bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--primary-foreground))] transition-all hover:brightness-110"
            >
              {isLoggedIn ? "Dashboard" : "Sign in"}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-12 pt-20 sm:pt-28">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1 text-xs text-[hsl(var(--muted-foreground))]">
            <Activity className="h-3 w-3 text-[hsl(var(--primary))]" />
            Real-time analytics &middot; RBAC &middot; Multi-tenant
          </div>

          <h1 className="text-[2.75rem] font-bold leading-[1.1] tracking-[-0.035em] text-[hsl(var(--foreground))] sm:text-[3.5rem]">
            SaaS Analytics
            <br />
            <span className="text-[hsl(var(--primary))]">Dashboard</span>
          </h1>

          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[hsl(var(--muted-foreground))]">
            Production-grade metrics dashboard with real-time subscriptions,
            role-based access control, multi-tenant data isolation, and
            server-side caching.
          </p>

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
        </div>
      </section>

      {/* Metrics Preview */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Revenue",
              value: "$48.2K",
              change: "+12.5%",
              icon: TrendingUp,
            },
            {
              label: "Customers",
              value: "2,847",
              change: "+8.3%",
              icon: Users,
            },
            { label: "MRR", value: "$12.4K", change: "+4.1%", icon: BarChart3 },
            {
              label: "Churn",
              value: "1.2%",
              change: "-0.3%",
              icon: Activity,
            },
          ].map((m) => (
            <div key={m.label} className="linear-card rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  {m.label}
                </span>
                <m.icon className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
              </div>
              <p className="mt-2 font-[family-name:var(--font-jetbrains-mono)] text-2xl font-bold text-[hsl(var(--foreground))]">
                {m.value}
              </p>
              <span
                className={`mt-1 inline-block text-xs font-medium ${
                  m.change.startsWith("+")
                    ? "text-emerald-400"
                    : "text-[hsl(var(--primary))]"
                }`}
              >
                {m.change}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          Features
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: LineChart,
              title: "Real-time Charts",
              desc: "Supabase Realtime subscriptions with team_id filtering. Revenue, growth & plan distribution via Recharts.",
            },
            {
              icon: Lock,
              title: "Multi-tenant RBAC",
              desc: "RLS-enforced data isolation with admin/viewer roles. Every query is automatically scoped to the user's team.",
            },
            {
              icon: LayoutDashboard,
              title: "Interactive Tables",
              desc: "Filter, search, and paginate customer data. Export to CSV or PDF with one click.",
            },
            {
              icon: Users,
              title: "Team Management",
              desc: "Create teams, invite members, assign roles. All secured with row-level security policies.",
            },
          ].map((f) => (
            <div key={f.title} className="linear-card rounded-lg p-5">
              <f.icon className="mb-3 h-5 w-5 text-[hsl(var(--primary))]" />
              <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">
                {f.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[hsl(var(--muted-foreground))]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Built with AI */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-3xl">
            Built with AI, reviewed by a human
          </h2>
          <p className="mt-3 max-w-xl text-sm text-[hsl(var(--muted-foreground))]">
            This project went through 3 rounds of adversarial critic review
            before a single line of code was written. Each round uncovered
            critical flaws that AI code generation alone would have shipped to
            production.
          </p>
        </div>

        <div className="space-y-2">
          {[
            {
              type: "critical" as const,
              title: "RLS chicken-and-egg deadlock on team creation",
              desc: "The AI generated RLS policies requiring is_team_admin(team_id) for all INSERT operations, but new users have no team membership yet. I redesigned the flow to use createAdminClient() for the bootstrap step.",
            },
            {
              type: "critical" as const,
              title: "Missing index caused N+1 queries on every RLS evaluation",
              desc: "The get_my_team_ids() function queries dash_team_members on every row scan, but the AI omitted the user_id index. I added the index and marked helper functions as STABLE.",
            },
            {
              type: "critical" as const,
              title: "Seed endpoint had no authorization guard",
              desc: "The /api/seed endpoint uses the admin client to bulk-insert demo data, but the AI left authorization unimplemented. I added a 3-step guard plus rate limiting via Upstash.",
            },
            {
              type: "critical" as const,
              title: 'Seed "transaction" was impossible with the client SDK',
              desc: "The AI planned a client-side transaction wrapping DELETE + INSERT, but @supabase/supabase-js has no transaction API. I replaced this with a plpgsql SECURITY DEFINER stored procedure.",
            },
            {
              type: "critical" as const,
              title: "VOLATILE RLS functions re-executed on every row",
              desc: "Helper functions were missing the STABLE volatility marker. On a 1,000-row table, each SELECT triggered 1,000 subqueries. Adding STABLE lets Postgres cache results within a single statement.",
            },
            {
              type: "warning" as const,
              title: "Realtime event storm during seed operations",
              desc: "Bulk-inserting 30+ rows fires 30+ Realtime events. I added a paused mode that unsubscribes during seed operations and does one full data refresh after completion.",
            },
            {
              type: "warning" as const,
              title: "Proxy matcher excluded seed endpoint from auth",
              desc: "The AI excluded /api/seed from the auth proxy matcher, which meant the session would never refresh. I removed it from the exclusion list.",
            },
            {
              type: "warning" as const,
              title: "Unfiltered Realtime subscriptions received all WAL traffic",
              desc: "The AI subscribed to postgres_changes on entire tables without filtering. I added explicit team_id=eq.{teamId} filters to all Realtime subscriptions.",
            },
            {
              type: "warning" as const,
              title: "ensure-team race condition on concurrent signups",
              desc: "If a user's first request spawns two parallel server components, both could try to create a team simultaneously. I replaced INSERT with INSERT ... ON CONFLICT DO NOTHING.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`rounded-lg border p-4 ${
                item.type === "critical"
                  ? "border-red-500/15 bg-red-500/[0.03]"
                  : "border-amber-500/15 bg-amber-500/[0.03]"
              }`}
            >
              <div className="flex items-start gap-3">
                {item.type === "critical" ? (
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[10px] font-semibold uppercase ${
                        item.type === "critical"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {item.type}
                    </span>
                    <h3 className="text-sm font-medium text-[hsl(var(--foreground))]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 linear-card rounded-lg p-5">
          <div className="flex items-start gap-3">
            <Eye className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--primary))]" />
            <div>
              <h3 className="text-sm font-medium text-[hsl(var(--foreground))]">
                Why this matters
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-[hsl(var(--muted-foreground))]">
                AI code generation is powerful, but it consistently produces
                plausible-looking designs with subtle security holes. In this
                project alone, I identified and fixed 5 critical vulnerabilities
                and 8 architectural warnings across 3 rounds of review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] py-6 text-center">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[hsl(var(--muted-foreground))]">
          Built by Caio Silva &middot; Next.js &middot; Supabase &middot; Redis
          &middot; Recharts &middot; Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
