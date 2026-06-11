"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const projectUrls: Record<string, string> = {
  Tracker: process.env.NEXT_PUBLIC_TRACKER_URL || "/projects/tracker",
  Snip: process.env.NEXT_PUBLIC_SNIP_URL || "/projects/snip",
  Muse: process.env.NEXT_PUBLIC_MUSE_URL || "/projects/muse",
  Pulse: process.env.NEXT_PUBLIC_PULSE_URL || "/projects/pulse",
  Bazaar: process.env.NEXT_PUBLIC_BAZAAR_URL || "/projects/bazaar",
  Sync: process.env.NEXT_PUBLIC_SYNC_URL || "/projects/sync",
};

const criticalErrors = [
  {
    project: "Tracker",
    projectUrl: projectUrls.Tracker,
    title: "SECURITY DEFINER functions without search_path isolation",
    desc: "RLS helpers allowed schema injection attacks via shadow tables.",
  },
  {
    project: "Tracker",
    projectUrl: projectUrls.Tracker,
    title: "Workspace creation allowed user impersonation",
    desc: "Any user could create workspaces on behalf of another via p_user_id.",
  },
  {
    project: "Tracker",
    projectUrl: projectUrls.Tracker,
    title: "Open redirect vulnerability in auth callback",
    desc: "Auth callback redirected to any URL via ?next= parameter.",
  },
  {
    project: "Tracker",
    projectUrl: projectUrls.Tracker,
    title: "Issue number race condition under concurrency",
    desc: "MAX(issue_number) + 1 caused duplicate IDs under parallel requests.",
  },
  {
    project: "Snip",
    projectUrl: projectUrls.Snip,
    title: "RLS policies allowed full URL enumeration",
    desc: "SELECT USING (true) let any anonymous user query every URL.",
  },
  {
    project: "Snip",
    projectUrl: projectUrls.Snip,
    title: "Click injection via open INSERT policy",
    desc: "Anyone could inject fake analytics data through the Supabase API.",
  },
  {
    project: "Snip",
    projectUrl: projectUrls.Snip,
    title: "RPC function callable by anonymous users",
    desc: "SECURITY DEFINER function let anyone inflate click counts.",
  },
  {
    project: "Muse",
    projectUrl: projectUrls.Muse,
    title: "AI SDK version mismatch broke streaming pipeline",
    desc: "Code used v4 API while v5 was installed. Streaming silently failed.",
  },
  {
    project: "Muse",
    projectUrl: projectUrls.Muse,
    title: "onFinish callback never fired — generations never saved",
    desc: "Wrong callback signature meant no data was persisted to database.",
  },
  {
    project: "Muse",
    projectUrl: projectUrls.Muse,
    title: "Missing consumeStream — abort left streams hanging",
    desc: "Without consume option, server streams hung open on browser close.",
  },
  {
    project: "Pulse",
    projectUrl: projectUrls.Pulse,
    title: "RLS chicken-and-egg deadlock on team creation",
    desc: "Policies required admin check before membership existed.",
  },
  {
    project: "Pulse",
    projectUrl: projectUrls.Pulse,
    title: "Missing index caused N+1 queries on every RLS evaluation",
    desc: "get_my_team_ids() ran without index, re-querying every row scan.",
  },
  {
    project: "Pulse",
    projectUrl: projectUrls.Pulse,
    title: "Seed endpoint had no authorization guard",
    desc: "Admin-level /api/seed route was publicly accessible.",
  },
  {
    project: "Pulse",
    projectUrl: projectUrls.Pulse,
    title: "VOLATILE functions re-executed on every row",
    desc: "Missing STABLE marker caused 1,000 subqueries on 1,000-row tables.",
  },
  {
    project: "Bazaar",
    projectUrl: projectUrls.Bazaar,
    title: "RLS policies allowed admin privilege escalation",
    desc: "Any user could self-promote to admin by updating their role.",
  },
  {
    project: "Bazaar",
    projectUrl: projectUrls.Bazaar,
    title: "Non-transactional webhook could corrupt orders",
    desc: "Stripe webhook had sequential queries — partial failure lost inventory.",
  },
  {
    project: "Bazaar",
    projectUrl: projectUrls.Bazaar,
    title: "Seed route granted admin without authorization",
    desc: "Any user who hit /api/seed became admin with no guard.",
  },
  {
    project: "Bazaar",
    projectUrl: projectUrls.Bazaar,
    title: "Missing Stripe packages would break checkout",
    desc: "Dependencies @stripe/stripe-js and react-stripe-js were never installed.",
  },
  {
    project: "Sync",
    projectUrl: projectUrls.Sync,
    title: "RLS privilege escalation in board membership",
    desc: "INSERT policy let any user add themselves as owner to any board.",
  },
  {
    project: "Sync",
    projectUrl: projectUrls.Sync,
    title: "SECURITY DEFINER RPCs without authorization checks",
    desc: "Reorder functions ran as DB owner with no membership validation.",
  },
  {
    project: "Sync",
    projectUrl: projectUrls.Sync,
    title: "Auth callback open redirect vulnerability",
    desc: "Callback accepted any URL in the next parameter for redirect.",
  },
];

export function CriticalErrors() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const totalCritical = criticalErrors.length;
  const projectCount = new Set(criticalErrors.map((e) => e.project)).size;

  return (
    <section className="px-6 py-24" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-[family-name:var(--font-mono)] text-lg font-bold text-[hsl(var(--primary))]">
            {"// AI-Generated Code: Pitfalls of Automated Development"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[hsl(var(--muted-foreground))]">
            Every project in this portfolio was built with AI agents and reviewed
            through adversarial cycles. {totalCritical} critical vulnerabilities
            found and fixed across {projectCount} projects. Each project page has
            full details on every flaw.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 rounded-xl border border-[hsl(var(--border))] bg-[hsl(0_0%_3%)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-[hsl(var(--border))] px-5 py-3">
            <span className="rounded bg-red-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase text-red-400">
              {totalCritical} Critical
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-[hsl(var(--muted-foreground))]">
              {projectCount} projects
            </span>
          </div>

          {/* Error rows */}
          <div className="divide-y divide-[hsl(0_0%_10%)]">
            {criticalErrors.map((error, i) => (
              <a
                key={`${error.project}-${i}`}
                href={error.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-5 py-3 transition-colors hover:bg-[hsl(0_0%_5%)]"
              >
                <span className="shrink-0 rounded bg-red-500/10 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-semibold uppercase text-red-400">
                  CRITICAL
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-[hsl(var(--foreground))]">
                  {error.title}
                </span>
                <span className="hidden shrink-0 text-[11px] text-[hsl(var(--muted-foreground))] sm:block">
                  {error.desc}
                </span>
                <span className="flex shrink-0 items-center gap-1 font-[family-name:var(--font-mono)] text-[11px] text-[hsl(var(--primary))] transition-all group-hover:gap-1.5">
                  {error.project}
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
