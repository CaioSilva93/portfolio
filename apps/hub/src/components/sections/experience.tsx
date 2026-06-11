"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    company: "Vizo",
    role: "Fullstack Developer",
    period: "Jul 2025 – Present",
    description:
      "Building fullstack web applications with React, Next.js, and Node.js. Implementing third-party API integrations and collaborating in agile team.",
  },
  {
    company: "Self-employed",
    role: "Digital Marketing / Traffic Manager",
    period: "Apr 2024 – Jun 2025",
    description:
      "Managed digital advertising campaigns (Google Ads, Meta Ads). Built conversion-optimized landing pages and analyzed funnel data to improve client ROI.",
  },
  {
    company: "Freelancer",
    role: "Fullstack Developer",
    period: "Jan 2022 – Apr 2024",
    description:
      "Developed e-commerce platforms, admin dashboards, and automation scripts. Managed full project lifecycle from requirements to deployment.",
  },
  {
    company: "Ctrl+D",
    role: "Fullstack Developer (Junior → Mid)",
    period: "Jan 2020 – Dec 2021",
    description:
      "Promoted from Junior to Mid-level within 1 year. Built web applications, dashboards, and SaaS products for agency clients using React and Node.js.",
  },
];

export function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="px-6 py-24" ref={ref}>
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 text-2xl font-bold text-[hsl(var(--foreground))]"
        >
          <span className="font-[family-name:var(--font-mono)] text-[hsl(var(--primary))]">
            04.
          </span>
          Experience
        </motion.h2>

        <div className="mt-12 space-y-0">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.company + exp.role}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative border-l-2 border-[hsl(var(--border))] py-6 pl-8 first:pt-0 last:pb-0"
            >
              <div className="absolute -left-[9px] top-7 h-4 w-4 rounded-full border-2 border-[hsl(var(--primary))] bg-[hsl(var(--background))]" />

              <p className="font-[family-name:var(--font-mono)] text-xs text-[hsl(var(--primary))]">
                {exp.period}
              </p>
              <h3 className="mt-1 text-base font-semibold text-[hsl(var(--foreground))]">
                {exp.role}
              </h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                @ {exp.company}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
