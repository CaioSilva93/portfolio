"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Shield, Bug, CreditCard, Users, Activity, Layers } from "lucide-react";
import { GithubIcon } from "@/components/icons";

const projectUrls: Record<string, string> = {
  tracker: process.env.NEXT_PUBLIC_TRACKER_URL || "/projects/tracker",
  snip: process.env.NEXT_PUBLIC_SNIP_URL || "/projects/snip",
  muse: process.env.NEXT_PUBLIC_MUSE_URL || "/projects/muse",
  pulse: process.env.NEXT_PUBLIC_PULSE_URL || "/projects/pulse",
  bazaar: process.env.NEXT_PUBLIC_BAZAAR_URL || "/projects/bazaar",
  sync: process.env.NEXT_PUBLIC_SYNC_URL || "/projects/sync",
};

const featuredProject = {
  name: "Tracker",
  title: "Complex SaaS Issue Tracker",
  description:
    "Multi-tenant SaaS with workspaces, projects, Stripe subscriptions, RBAC, and real-time activity feeds. 4 critical security vulnerabilities and 3 architectural warnings caught across 9 adversarial AI review cycles.",
  tech: ["Next.js 16", "Supabase", "Stripe", "Upstash Redis", "Tailwind CSS"],
  link: projectUrls.tracker,
  github: "#",
  stats: { critical: 4, warnings: 3, cycles: 9 },
};

const projects = [
  {
    name: "Snip",
    title: "URL Shortener with Analytics",
    description:
      "Link shortener with click analytics dashboard, QR code generation, Redis caching, and documented REST API.",
    tech: ["Next.js", "Supabase", "Redis", "Recharts"],
    link: projectUrls.snip,
    github: "#",
  },
  {
    name: "Muse",
    title: "AI Content Generator",
    description:
      "Marketing copy generator powered by Google Gemini with streaming responses, prompt templates, and generation history.",
    tech: ["Next.js", "Vercel AI SDK", "Gemini API", "Supabase"],
    link: projectUrls.muse,
    github: "#",
  },
  {
    name: "Pulse",
    title: "Analytics Dashboard",
    description:
      "Real-time data visualization platform with auth, RBAC, team management, and exportable reports.",
    tech: ["Next.js", "Supabase", "Recharts", "Redis"],
    link: projectUrls.pulse,
    github: "#",
  },
  {
    name: "Bazaar",
    title: "E-commerce Platform",
    description:
      "Full-featured online store with Stripe checkout, persistent cart, product catalog with SSR, and admin panel.",
    tech: ["Next.js", "Stripe", "Supabase", "Tailwind"],
    link: projectUrls.bazaar,
    github: "#",
  },
  {
    name: "Sync",
    title: "Realtime Collaborative Board",
    description:
      "Kanban board with real-time sync, drag-and-drop, presence indicators, and activity history.",
    tech: ["Next.js", "Supabase Realtime", "dnd-kit"],
    link: projectUrls.sync,
    github: "#",
  },
];

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="px-6 py-24" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 text-2xl font-bold text-[hsl(var(--foreground))]"
        >
          <span className="font-[family-name:var(--font-mono)] text-[hsl(var(--primary))]">
            02.
          </span>
          Projects
        </motion.h2>

        {/* Featured Project */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10"
        >
          <a
            href={featuredProject.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block featured-card rounded-xl p-6 sm:p-8 transition-all hover:bg-[hsl(0_0%_6%)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--primary))]">
                ★ Featured Project
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-[family-name:var(--font-mono)] text-xs text-[hsl(var(--muted-foreground))]">
                    {featuredProject.name}
                  </span>
                  <h3 className="text-xl font-bold text-[hsl(var(--foreground))] sm:text-2xl">
                    {featuredProject.title}
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {featuredProject.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {featuredProject.tech.map((t) => (
                    <span key={t} className="terminal-badge rounded px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px]">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-6">
                  <span className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs text-[hsl(var(--primary))] transition-all group-hover:gap-3">
                    View Project
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[11px] text-red-400">
                    {featuredProject.stats.critical} critical
                  </span>
                  <span className="text-[11px] text-amber-400">
                    {featuredProject.stats.warnings} warnings
                  </span>
                  <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
                    {featuredProject.stats.cycles} review cycles
                  </span>
                </div>
              </div>

              {/* Mini dashboard preview */}
              <div className="hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(0_0%_3%)] p-4 lg:block">
                <div className="flex items-center gap-2 border-b border-[hsl(var(--border))] pb-3">
                  <Bug className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                  <span className="font-[family-name:var(--font-mono)] text-[11px] text-[hsl(var(--foreground))]">
                    Tracker Dashboard
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { label: "Open", value: "12" },
                    { label: "Done", value: "47" },
                    { label: "Members", value: "5" },
                  ].map((s) => (
                    <div key={s.label} className="rounded border border-[hsl(var(--border))] bg-[hsl(0_0%_5%)] p-2.5 text-center">
                      <p className="font-[family-name:var(--font-mono)] text-lg font-bold text-[hsl(var(--foreground))]">{s.value}</p>
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-1.5">
                  {["issue_created", "member_invited", "issue_resolved"].map((a) => (
                    <div key={a} className="flex items-center gap-2">
                      <Activity className="h-2.5 w-2.5 text-[hsl(var(--muted-foreground))]" />
                      <span className="font-[family-name:var(--font-mono)] text-[10px] text-[hsl(var(--muted-foreground))]">
                        {a.replace(/_/g, " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </a>
        </motion.div>

        {/* Other Projects Grid */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.a
              key={project.name}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              className="group terminal-card rounded-xl p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[hsl(var(--primary))]">
                    {project.name}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold text-[hsl(var(--foreground))]">
                    {project.title}
                  </h3>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] transition-all group-hover:text-[hsl(var(--primary))] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>

              <p className="mt-2 text-[13px] leading-relaxed text-[hsl(var(--muted-foreground))]">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-[hsl(var(--secondary))] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[hsl(var(--muted-foreground))]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
