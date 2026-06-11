import dynamic from "next/dynamic";
import { Activity } from "lucide-react";
import { LandingHeader, HeroCTA } from "@/components/landing-header";

const LandingMetrics = dynamic(
  () =>
    import("@/components/landing-metrics").then((m) => m.LandingMetrics),
);
const LandingFeatures = dynamic(
  () =>
    import("@/components/landing-features").then((m) => m.LandingFeatures),
);
const LandingReview = dynamic(
  () =>
    import("@/components/landing-review").then((m) => m.LandingReview),
);

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10 opacity-40" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--background))]" />

      <LandingHeader />

      <main>
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

            <HeroCTA />
          </div>
        </section>

        <LandingMetrics />
        <LandingFeatures />
        <LandingReview />
      </main>

      <footer className="border-t border-[hsl(var(--border))] py-6 text-center">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[hsl(var(--muted-foreground))]">
          Built by Caio Silva &middot; Next.js &middot; Supabase &middot; Redis
          &middot; Recharts &middot; Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
