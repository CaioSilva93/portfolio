import { LineChart, Lock, LayoutDashboard, Users } from "lucide-react";

const features = [
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
];

export function LandingFeatures() {
  return (
    <section className="lazy-section mx-auto max-w-5xl px-6 py-12">
      <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
        Features
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {features.map((f) => (
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
  );
}
