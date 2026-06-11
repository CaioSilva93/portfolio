import { ShieldAlert, AlertTriangle, Eye } from "lucide-react";

const reviewItems = [
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
];

export function LandingReview() {
  return (
    <section className="lazy-section mx-auto max-w-5xl px-6 py-16">
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
        {reviewItems.map((item) => (
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
  );
}
