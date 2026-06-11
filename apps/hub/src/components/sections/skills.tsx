"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "Python", "PHP", "REST APIs"],
  },
  {
    title: "Database",
    skills: ["PostgreSQL", "MySQL", "Supabase", "Firebase", "Redis"],
  },
  {
    title: "DevOps & Tools",
    skills: ["Docker", "Git", "Vercel", "GitHub Actions", "CI/CD"],
  },
  {
    title: "AI Tools",
    skills: ["Cursor IDE", "Claude", "ChatGPT", "GitHub Copilot", "Vercel AI SDK"],
  },
];

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="px-6 py-24" ref={ref}>
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 text-2xl font-bold text-[hsl(var(--foreground))]"
        >
          <span className="font-[family-name:var(--font-mono)] text-[hsl(var(--primary))]">
            03.
          </span>
          Skills
        </motion.h2>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="terminal-card rounded-xl p-5"
            >
              <h3 className="font-[family-name:var(--font-mono)] text-xs font-medium text-[hsl(var(--primary))]">
                {category.title}
              </h3>
              <ul className="mt-3 space-y-1.5">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="text-sm text-[hsl(var(--muted-foreground))]"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
