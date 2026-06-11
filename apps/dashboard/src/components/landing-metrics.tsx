import { TrendingUp, Users, BarChart3, Activity } from "lucide-react";

const metrics = [
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
];

export function LandingMetrics() {
  return (
    <section className="lazy-section mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
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
  );
}
