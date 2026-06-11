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
} from "lucide-react";

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    createClient().auth.getUser().then(({ data }) => {
      if (data.user) setIsLoggedIn(true);
    });
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[hsl(var(--primary))]" />
            <span className="font-semibold text-[hsl(var(--foreground))]">
              Analytics Dashboard
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="rounded-md p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
              >
                {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}
            <Link
              href={isLoggedIn ? "/dashboard" : "/auth/login"}
              className="rounded-lg bg-[hsl(var(--primary))] px-4 py-1.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-colors hover:bg-[hsl(var(--primary))]/90"
            >
              {isLoggedIn ? "Go to Dashboard" : "Sign in"}
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-24">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--primary))]/10">
            <BarChart3 className="h-8 w-8 text-[hsl(var(--primary))]" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-5xl">
            SaaS Analytics Dashboard
          </h1>
          <p className="mt-4 text-lg text-[hsl(var(--muted-foreground))]">
            Real-time metrics, RBAC, multi-tenant data isolation,
            <br />
            and production-grade caching.
          </p>
        </div>

        <div className="mt-12 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--primary))]/5 p-8 text-center">
          <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
            Explore the live dashboard
          </h2>
          <p className="mt-2 text-[hsl(var(--muted-foreground))]">
            {isLoggedIn
              ? "You're signed in. Head to the dashboard to see real-time charts, customer tables, CSV/PDF export, and role-based access control in action."
              : "Create a free account to see real-time charts, customer tables, CSV/PDF export, and role-based access control in action."}
          </p>
          <Link
            href={isLoggedIn ? "/dashboard" : "/auth/signup"}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-6 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-colors hover:bg-[hsl(var(--primary))]/90"
          >
            {isLoggedIn ? "Go to Dashboard" : "Create free account"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center">
            <LineChart className="mx-auto h-8 w-8 text-[hsl(var(--primary))]" />
            <p className="mt-3 font-[family-name:var(--font-mono)] text-xl font-bold text-[hsl(var(--foreground))]">
              Realtime
            </p>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Supabase Realtime subscriptions with team_id filtering
            </p>
          </div>
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center">
            <Lock className="mx-auto h-8 w-8 text-[hsl(var(--primary))]" />
            <p className="mt-3 font-[family-name:var(--font-mono)] text-xl font-bold text-[hsl(var(--foreground))]">
              Multi-tenant
            </p>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              RLS-enforced data isolation with RBAC (admin/viewer)
            </p>
          </div>
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center">
            <LayoutDashboard className="mx-auto h-8 w-8 text-[hsl(var(--primary))]" />
            <p className="mt-3 font-[family-name:var(--font-mono)] text-xl font-bold text-[hsl(var(--foreground))]">
              Charts
            </p>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Revenue, growth &amp; plan distribution via Recharts
            </p>
          </div>
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center">
            <Users className="mx-auto h-8 w-8 text-[hsl(var(--primary))]" />
            <p className="mt-3 font-[family-name:var(--font-mono)] text-xl font-bold text-[hsl(var(--foreground))]">
              Data Table
            </p>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Filter, search, paginate + CSV/PDF export
            </p>
          </div>
        </div>

        <div className="mt-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] sm:text-3xl">
              Built with AI, reviewed by a human
            </h2>
            <p className="mt-3 text-[hsl(var(--muted-foreground))]">
              This project went through 3 rounds of adversarial critic review before a single
              line of code was written. Each round uncovered critical flaws that AI code generation
              alone would have shipped to production.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-red-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-red-500">
                      CRITICAL
                    </span>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      RLS chicken-and-egg deadlock on team creation
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                    The AI generated RLS policies requiring <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">is_team_admin(team_id)</code> for
                    all INSERT operations, but new users have no team membership yet &mdash; the
                    check always returns false, permanently blocking team creation. I redesigned the
                    flow to use <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">createAdminClient()</code> (service_role)
                    for the bootstrap step, with a separate INSERT policy checking <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">auth.uid() = created_by</code>.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-red-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-red-500">
                      CRITICAL
                    </span>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Missing index caused N+1 queries on every RLS evaluation
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                    The <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">get_my_team_ids()</code> function
                    queries <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">dash_team_members</code> on every
                    row scan, but the AI omitted the <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">user_id</code> index.
                    Without it, every SELECT triggers a sequential scan &mdash; O(n) per row evaluated.
                    I added <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">CREATE INDEX idx_dash_team_members_user_id</code> and
                    marked both helper functions as <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">STABLE</code> so
                    Postgres caches results within a single query instead of re-executing per row.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-red-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-red-500">
                      CRITICAL
                    </span>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Seed endpoint had no authorization guard
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                    The <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">/api/seed</code> endpoint
                    uses the admin client to bulk-insert demo data, but the AI left authorization as &ldquo;admin-only&rdquo;
                    without implementing it. Any authenticated user could wipe and re-seed another team&apos;s data.
                    I added a 3-step guard: authenticate via <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">getUser()</code>,
                    verify admin role, then proceed &mdash; plus rate limiting at 1 req/30s via Upstash.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-red-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-red-500">
                      CRITICAL
                    </span>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Seed &ldquo;transaction&rdquo; was impossible with the client SDK
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                    The AI planned a client-side transaction wrapping DELETE + INSERT for seed data,
                    but <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">@supabase/supabase-js</code> has
                    no transaction API. If the INSERT failed halfway, the DELETE would have already
                    committed &mdash; leaving the team with zero data. I replaced this with a
                    plpgsql <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">SECURITY DEFINER</code> stored
                    procedure called via <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">.rpc()</code> that
                    wraps everything in a real Postgres transaction.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-red-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-red-500">
                      CRITICAL
                    </span>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      VOLATILE RLS functions re-executed on every row
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                    The <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">get_my_team_ids()</code> and <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">is_team_admin()</code> functions
                    were missing the <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">STABLE</code> volatility
                    marker, so Postgres treated them as <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">VOLATILE</code> by
                    default. On a table with 1,000 rows, each SELECT triggered 1,000 subqueries
                    to <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">dash_team_members</code>. Adding <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">STABLE</code> lets
                    Postgres cache results within a single statement.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-yellow-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-yellow-500">
                      WARNING
                    </span>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Realtime event storm during seed operations
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                    Bulk-inserting 30+ rows fires 30+ Realtime events, causing the client to
                    re-render dozens of times in rapid succession. I added a <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">paused</code> mode
                    to the Realtime hook that unsubscribes during seed operations and does one full
                    data refresh after completion.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-yellow-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-yellow-500">
                      WARNING
                    </span>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Proxy matcher excluded seed endpoint from auth
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                    The AI excluded <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">/api/seed</code> from
                    the auth proxy matcher (like <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">/api/health</code>),
                    which meant the session would never refresh before hitting the seed endpoint.
                    I removed it from the exclusion list &mdash; only public routes should bypass the proxy.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-yellow-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-yellow-500">
                      WARNING
                    </span>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Unfiltered Realtime subscriptions received all WAL traffic
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                    The AI subscribed to <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">postgres_changes</code> on
                    entire tables without filtering, meaning every team&apos;s mutations were
                    broadcast to every connected client. I added explicit <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">team_id=eq.&#123;teamId&#125;</code> filters
                    to all Realtime subscriptions.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-yellow-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-yellow-500">
                      WARNING
                    </span>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      ensure-team race condition on concurrent signups
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                    If a user&apos;s first request spawns two parallel server components, both could try
                    to create a team simultaneously. Even with a UNIQUE constraint, one would fail
                    with a duplicate key error. I replaced the INSERT with <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">INSERT ... ON CONFLICT (created_by) DO NOTHING</code> followed
                    by a SELECT, making the operation idempotent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <div className="flex items-start gap-3">
              <Eye className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--primary))]" />
              <div>
                <h3 className="font-semibold text-[hsl(var(--foreground))]">
                  Why this matters
                </h3>
                <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                  This project went through 3 rounds of adversarial review before execution. The first
                  round found 3 critical issues and 12 warnings. The second found 2 more critical issues
                  and 8 warnings. Only after the third round returned 0 critical issues did implementation
                  begin. In total, 5 critical vulnerabilities and 8 architectural warnings were caught
                  and fixed at the design phase &mdash; before writing any code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
