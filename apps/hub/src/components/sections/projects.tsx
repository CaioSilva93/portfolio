"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/icons";

const projects = [
  {
    title: "SaaS Analytics Dashboard",
    description: "Real-time data visualization platform with auth, RBAC, and multi-tenant architecture. Features live-updating charts and exportable reports.",
    tech: ["Next.js", "TypeScript", "Supabase", "Recharts"],
    link: "#",
    github: "#",
    color: "from-cyan-500/10 to-blue-500/10",
  },
  {
    title: "AI Content Generator",
    description: "Marketing copy generator powered by Google Gemini with streaming responses, prompt templates, and generation history.",
    tech: ["Next.js", "Vercel AI SDK", "Gemini API", "Supabase"],
    link: "#",
    github: "#",
    color: "from-purple-500/10 to-pink-500/10",
  },
  {
    title: "E-commerce Platform",
    description: "Full-featured online store with Stripe checkout, persistent cart, product catalog with SSR, and admin panel.",
    tech: ["Next.js", "Stripe", "Supabase", "Tailwind"],
    link: "#",
    github: "#",
    color: "from-green-500/10 to-emerald-500/10",
  },
  {
    title: "Realtime Collaborative Board",
    description: "Kanban board with real-time sync, drag-and-drop, presence indicators, and activity history — like a lightweight Trello.",
    tech: ["Next.js", "Supabase Realtime", "dnd-kit", "Yjs"],
    link: "#",
    github: "#",
    color: "from-orange-500/10 to-yellow-500/10",
  },
  {
    title: "URL Shortener with Analytics",
    description: "Link shortener with click analytics dashboard, QR code generation, Redis caching, and documented REST API.",
    tech: ["Next.js", "Supabase", "Upstash Redis", "Recharts"],
    link: "#",
    github: "#",
    color: "from-rose-500/10 to-red-500/10",
  },
];

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 px-6" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 text-2xl font-bold text-[hsl(var(--foreground))]"
        >
          <span className="font-[family-name:var(--font-mono)] text-[hsl(var(--primary))]">02.</span>
          Projects
        </motion.h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 transition-all hover:border-[hsl(var(--primary))]/50 hover:shadow-lg hover:shadow-[hsl(var(--primary))]/5"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 transition-opacity group-hover:opacity-100`} />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                    {project.title}
                  </h3>
                  <div className="flex gap-2">
                    <a href={project.github} className="text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]">
                      <GithubIcon className="h-4 w-4" />
                    </a>
                    <a href={project.link} className="text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]">
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-[hsl(var(--secondary))] px-3 py-1 font-[family-name:var(--font-mono)] text-xs text-[hsl(var(--muted-foreground))]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
