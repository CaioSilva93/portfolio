import {
  FolderKanban,
  Users,
  CreditCard,
  Shield,
  Activity,
  GitBranch,
} from "lucide-react";

const features = [
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
];

export function LandingFeatures() {
  return (
    <section className="lazy-section mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="noir-card rounded-xl p-5">
            <f.icon className="mb-3 h-5 w-5 text-[hsl(var(--primary))]" />
            <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
              {f.title}
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[hsl(var(--muted-foreground))]">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
