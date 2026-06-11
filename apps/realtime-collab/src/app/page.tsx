import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Kanban,
  ArrowRight,
  Users,
  Zap,
  GripVertical,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Eye,
  Radio,
  MousePointerClick,
  Layers,
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { redirect } = await import("next/navigation");
    redirect("/boards");
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Subtle background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-[200px] top-[80px] h-[500px] w-[500px] rounded-full bg-[hsl(160,84%,40%)] opacity-[0.04] blur-[150px]" />
        <div className="absolute -right-[150px] bottom-[200px] h-[400px] w-[400px] rounded-full bg-[hsl(160,84%,45%)] opacity-[0.03] blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="border-b border-[hsl(var(--border))/0.5] bg-[hsl(var(--background))/0.8] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Kanban className="h-5 w-5 text-[hsl(var(--primary))]" />
            <span className="font-semibold text-[hsl(var(--foreground))]">
              Collab Board
            </span>
          </Link>
          <Link
            href="/auth/login"
            className="rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-all hover:brightness-110"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.5] px-4 py-1.5 text-sm text-[hsl(var(--muted-foreground))]">
              <Radio className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
              Supabase Realtime + Presence
            </div>

            <h1 className="text-[3rem] font-bold leading-[1.1] tracking-[-0.03em] sm:text-[4rem]">
              Collaborate
              <br />
              in <span className="text-[hsl(var(--primary))]">real time</span>
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
              Drag-and-drop Kanban boards with live cursors, presence
              indicators, and instant sync across all connected users.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-6 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:brightness-110 hover:shadow-[0_0_25px_hsl(var(--primary)/0.3)]"
              >
                Get Started
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

          {/* Preview Card */}
          <div className="hidden lg:block">
            <div className="animate-float-gentle float-card rounded-2xl p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-[hsl(var(--foreground))]">Sprint Board</span>
                <div className="flex -space-x-1.5">
                  <div className="h-6 w-6 rounded-full border-2 border-[hsl(var(--card))] bg-emerald-500" />
                  <div className="h-6 w-6 rounded-full border-2 border-[hsl(var(--card))] bg-blue-500" />
                  <div className="h-6 w-6 rounded-full border-2 border-[hsl(var(--card))] bg-amber-500" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["To Do", "In Progress", "Done"].map((col) => (
                  <div key={col} className="rounded-lg bg-[hsl(var(--background))/0.5] p-2">
                    <span className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{col}</span>
                    {[1, 2].map((i) => (
                      <div key={i} className="mb-1.5 flex items-center gap-1.5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2">
                        <GripVertical className="h-3 w-3 shrink-0 text-[hsl(var(--muted-foreground))/0.4]" />
                        <div className="h-2 flex-1 rounded bg-[hsl(var(--muted))]" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                <div className="h-1.5 w-1.5 animate-presence rounded-full bg-emerald-400" />
                3 online now
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Zap, title: "Instant Sync", desc: "Changes propagate to all users in milliseconds via Supabase Realtime." },
            { icon: MousePointerClick, title: "Drag & Drop", desc: "Reorder cards and columns with smooth DnD Kit animations." },
            { icon: Users, title: "Live Presence", desc: "See who's online and watching your board in real time." },
            { icon: Shield, title: "Role-Based", desc: "Owner, editor, and viewer roles with RLS enforcement." },
          ].map((f) => (
            <div key={f.title} className="float-card rounded-xl p-5">
              <f.icon className="mb-3 h-5 w-5 text-[hsl(var(--primary))]" />
              <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{f.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[hsl(var(--muted-foreground))]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          How it works
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { step: "01", icon: Layers, title: "Create a Board", desc: "Start a new Kanban board with customizable columns." },
            { step: "02", icon: Users, title: "Invite Your Team", desc: "Share a link and assign roles to collaborators." },
            { step: "03", icon: Radio, title: "Collaborate Live", desc: "Drag cards, add tasks, and see changes in real time." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <s.icon className="h-5 w-5 text-[hsl(var(--primary))]" />
              </div>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[hsl(var(--primary))]">{s.step}</span>
              <h3 className="mt-1 font-semibold text-[hsl(var(--foreground))]">{s.title}</h3>
              <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built with AI */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built with AI, reviewed by a human
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[hsl(var(--muted-foreground))]">
            This project was generated by AI agents, but every critical flaw below
            was caught and fixed through my experience directing AI workflows.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              type: "critical" as const,
              title: "RLS privilege escalation in board membership",
              desc: "The collab_board_members INSERT policy allowed any user to add themselves as owner to any board. I replaced it with a SECURITY DEFINER RPC that atomically creates board + membership + columns.",
            },
            {
              type: "critical" as const,
              title: "SECURITY DEFINER RPCs without authorization checks",
              desc: "collab_reorder_cards and collab_reorder_columns ran as DB owner with no membership validation. I added collab_is_editor() checks inside each function.",
            },
            {
              type: "critical" as const,
              title: "Auth callback open redirect vulnerability",
              desc: "The /auth/callback route accepted any URL in the next parameter, allowing redirects to malicious sites. I added origin validation to reject external URLs.",
            },
            {
              type: "warning" as const,
              title: "Sequential DB updates on every drag-and-drop",
              desc: "Card reordering fired individual UPDATE queries in a loop. Moving one card across 10 siblings meant 10 round trips. I replaced this with batch RPCs that update all positions in a single transaction.",
            },
            {
              type: "warning" as const,
              title: "Optimistic rollback used stale state snapshot",
              desc: "The snapshot for rollback was taken after handleDragOver mutated state, so failures would rollback to an already-modified state. I moved the snapshot to handleDragStart.",
            },
            {
              type: "warning" as const,
              title: "JSON.stringify on JSONB parameter broke all card moves",
              desc: "The RPC calls passed JSON.stringify(updates) to a JSONB parameter, causing double-serialization. PostgreSQL received a string literal instead of a JSON array, failing on every card move.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`rounded-2xl border p-5 ${
                item.type === "critical"
                  ? "border-red-500/20 bg-red-500/[0.04]"
                  : "border-amber-500/20 bg-amber-500/[0.04]"
              }`}
            >
              <div className="flex items-start gap-3">
                {item.type === "critical" ? (
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold ${
                        item.type === "critical"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {item.type === "critical" ? "CRITICAL" : "WARNING"}
                    </span>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 float-card rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Eye className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--primary))]" />
            <div>
              <h3 className="font-semibold text-[hsl(var(--foreground))]">Why this matters</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                AI code generation is powerful, but it consistently produces plausible-looking code
                with subtle security holes. Across 2 review cycles, I identified and fixed 4 critical
                security vulnerabilities, 12 architectural warnings, and multiple convention issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))/0.5] py-8 text-center">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[hsl(var(--muted-foreground))]">
          Built by Caio Silva &middot; Next.js &middot; Supabase Realtime &middot;
          DnD Kit &middot; Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
