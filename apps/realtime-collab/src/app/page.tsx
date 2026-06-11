import Link from "next/link";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/server";
import {
  Kanban,
  ArrowRight,
  GripVertical,
  Radio,
} from "lucide-react";

const BelowFold = dynamic(() => import("@/components/landing/below-fold"), {
  ssr: true,
});

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

      <main>
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

      <BelowFold />

      </main>

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
