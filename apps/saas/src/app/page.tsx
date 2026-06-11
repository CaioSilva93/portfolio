import Link from "next/link";
import {
  Bug,
  ArrowRight,
  FolderKanban,
  Users,
  CreditCard,
  Shield,
  Activity,
  ShieldAlert,
  AlertTriangle,
  Eye,
  Zap,
  GitBranch,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen noise-bg">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-[250px] top-[100px] h-[600px] w-[600px] rounded-full bg-[hsl(346,77%,50%)] opacity-[0.04] blur-[180px]" />
        <div className="absolute -right-[200px] bottom-[100px] h-[500px] w-[500px] rounded-full bg-[hsl(330,80%,50%)] opacity-[0.03] blur-[150px]" />
      </div>

      <nav className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-[hsl(var(--primary))]" />
            <span className="font-semibold text-[hsl(var(--foreground))]">
              Tracker
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-all hover:brightness-110"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-1.5 text-xs text-[hsl(var(--muted-foreground))]">
            <Zap className="h-3 w-3 text-[hsl(var(--primary))]" />
            Multi-tenant SaaS &middot; Stripe Billing &middot; RBAC
          </div>

          <h1 className="text-[3rem] font-bold leading-[1.08] tracking-[-0.035em] sm:text-[4rem]">
            Issue tracking
            <br />
            <span className="text-gradient-rose">built for teams</span>
          </h1>

          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[hsl(var(--muted-foreground))]">
            A production-grade SaaS issue tracker with workspaces, projects,
            Stripe subscriptions, role-based access control, and real-time
            activity feeds.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-6 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:brightness-110 hover:shadow-[0_0_30px_hsl(var(--primary)/0.25)]"
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/login"
              className="rounded-lg border border-[hsl(var(--border))] px-6 py-3 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--card))]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: FolderKanban,
              title: "Projects & Issues",
              desc: "Organize work into projects with typed issues, priorities, labels, and auto-incrementing IDs.",
            },
            {
              icon: Users,
              title: "Team Workspaces",
              desc: "Multi-tenant workspaces with invite links, member management, and role-based permissions.",
            },
            {
              icon: CreditCard,
              title: "Stripe Billing",
              desc: "Free and Pro plans with Stripe Checkout, customer portal, and webhook-driven plan sync.",
            },
            {
              icon: Shield,
              title: "Row-Level Security",
              desc: "Every query is scoped by workspace. RLS policies enforce data isolation at the database level.",
            },
            {
              icon: Activity,
              title: "Activity Feeds",
              desc: "Automatic activity logging for issue creation, updates, comments, and member changes.",
            },
            {
              icon: GitBranch,
              title: "9 Review Cycles",
              desc: "Adversarial AI review process that caught 4 critical and 3 architectural flaws before shipping.",
            },
          ].map((f) => (
            <div key={f.title} className="noir-card rounded-xl p-5">
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

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          Architecture
        </h2>
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: "Next.js 16", sub: "App Router + Server Actions" },
            { label: "Supabase", sub: "Auth, DB, RLS, Realtime" },
            { label: "Stripe", sub: "Checkout, Webhooks, Portal" },
            { label: "Redis", sub: "Plan caching + Rate limits" },
          ].map((t) => (
            <div
              key={t.label}
              className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.5] p-4 text-center"
            >
              <p className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-semibold text-[hsl(var(--foreground))]">
                {t.label}
              </p>
              <p className="mt-0.5 text-[11px] text-[hsl(var(--muted-foreground))]">
                {t.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Built with AI, reviewed by a human
          </h2>
          <p className="mt-3 max-w-xl text-sm text-[hsl(var(--muted-foreground))]">
            This project was generated by AI agents across 9 adversarial review
            cycles. Every critical flaw below was caught and fixed through my
            experience directing AI workflows.
          </p>
        </div>

        <div className="space-y-2">
          {(
            [
              {
                type: "critical",
                title:
                  "SECURITY DEFINER functions without search_path isolation",
                desc: "All RLS helper functions lacked SET search_path = '', allowing schema injection attacks. I added search_path isolation, REVOKE EXECUTE FROM PUBLIC, and qualified all table references.",
              },
              {
                type: "critical",
                title: "Workspace creation allowed user impersonation",
                desc: "The saas_create_workspace RPC accepted a p_user_id from the client, letting any user create workspaces on behalf of another. I removed the parameter — the function now uses auth.uid() internally.",
              },
              {
                type: "critical",
                title: "Open redirect vulnerability in auth callback",
                desc: "The /auth/callback route blindly redirected to whatever ?next= parameter was supplied. I added strict validation: must start with /, not //, and not contain ://.",
              },
              {
                type: "critical",
                title: "Issue number race condition under concurrency",
                desc: "Issue numbers used MAX(issue_number) + 1, allowing duplicate numbers. I redesigned it with pg_advisory_xact_lock and a UNIQUE constraint as safety net.",
              },
              {
                type: "warning",
                title:
                  "FOR ALL policies silently blocked member SELECT access",
                desc: "FOR ALL policies with admin-only checks blocked regular members from viewing projects. I split into per-command policies with correct permission scoping.",
              },
              {
                type: "warning",
                title:
                  "Stripe webhook didn't invalidate Redis plan cache",
                desc: "After checkout, the old plan stayed in Redis for up to 2 minutes, causing 'limit reached' errors post-upgrade. I added explicit redis.del() calls in every webhook handler.",
              },
              {
                type: "warning",
                title:
                  "Cross-workspace data injection via mutable issue_id",
                desc: "Comment UPDATE policy didn't prevent changing issue_id after creation, allowing cross-workspace data injection. I added a BEFORE UPDATE trigger that prevents issue_id modification.",
              },
            ] as const
          ).map((item) => (
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

        <div className="mt-6 noir-card rounded-lg p-5">
          <div className="flex items-start gap-3">
            <Eye className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--primary))]" />
            <div>
              <h3 className="text-sm font-medium text-[hsl(var(--foreground))]">
                Why this matters
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-[hsl(var(--muted-foreground))]">
                Multi-tenant SaaS apps amplify the consequences of every flaw:
                a single RLS issue can expose every customer&apos;s data. Across 9
                adversarial review cycles, I identified and fixed 4 critical
                security vulnerabilities and 3 architectural warnings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="noir-card noir-glow rounded-2xl p-10 text-center sm:p-14">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to track issues?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[hsl(var(--muted-foreground))]">
            Create a workspace, invite your team, and start tracking issues in
            minutes. Free tier included.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-8 py-3.5 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:brightness-110 hover:shadow-[0_0_30px_hsl(var(--primary)/0.25)]"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[hsl(var(--border))] py-6 text-center">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[hsl(var(--muted-foreground))]">
          Built by Caio Silva &middot; Next.js &middot; Supabase &middot; Stripe
          &middot; Redis &middot; Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
