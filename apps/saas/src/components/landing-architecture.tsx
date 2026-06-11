const techStack = [
  { label: "Next.js 16", sub: "App Router + Server Actions" },
  { label: "Supabase", sub: "Auth, DB, RLS, Realtime" },
  { label: "Stripe", sub: "Checkout, Webhooks, Portal" },
  { label: "Redis", sub: "Plan caching + Rate limits" },
];

export function LandingArchitecture() {
  return (
    <section className="lazy-section mx-auto max-w-5xl px-6 py-12">
      <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
        Architecture
      </h2>
      <div className="grid gap-3 sm:grid-cols-4">
        {techStack.map((t) => (
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
  );
}
