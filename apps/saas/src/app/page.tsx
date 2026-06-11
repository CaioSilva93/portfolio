import Link from "next/link";
import dynamic from "next/dynamic";
import { Bug, ArrowRight, Zap } from "lucide-react";

const LandingFeatures = dynamic(
  () =>
    import("@/components/landing-features").then((m) => m.LandingFeatures),
);
const LandingArchitecture = dynamic(
  () =>
    import("@/components/landing-architecture").then(
      (m) => m.LandingArchitecture,
    ),
);
const LandingReview = dynamic(
  () =>
    import("@/components/landing-review").then((m) => m.LandingReview),
);
const LandingCTA = dynamic(
  () => import("@/components/landing-cta").then((m) => m.LandingCTA),
);

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

      <main>
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

        <LandingFeatures />
        <LandingArchitecture />
        <LandingReview />
        <LandingCTA />
      </main>

      <footer className="border-t border-[hsl(var(--border))] py-6 text-center">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[hsl(var(--muted-foreground))]">
          Built by Caio Silva &middot; Next.js &middot; Supabase &middot; Stripe
          &middot; Redis &middot; Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
