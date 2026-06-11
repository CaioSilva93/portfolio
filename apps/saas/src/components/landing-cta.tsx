import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingCTA() {
  return (
    <section className="lazy-section mx-auto max-w-5xl px-6 py-8">
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
  );
}
