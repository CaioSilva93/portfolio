"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Sparkles, Globe } from "lucide-react";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-6" ref={ref}>
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="flex items-center gap-3 text-2xl font-bold text-[hsl(var(--foreground))]">
            <span className="font-[family-name:var(--font-mono)] text-[hsl(var(--primary))]">01.</span>
            About Me
          </h2>

          <div className="mt-8 grid gap-8 md:grid-cols-[3fr_2fr]">
            <div className="space-y-4 text-[hsl(var(--muted-foreground))]">
              <p>
                I&apos;m a Fullstack Developer who combines technical expertise with a
                deep understanding of digital marketing and business metrics. This
                rare combination allows me to build applications that don&apos;t just
                work — they deliver measurable results.
              </p>
              <p>
                My journey includes building SaaS platforms, e-commerce solutions,
                admin dashboards, and marketing automation tools for startups,
                agencies, and mid-size companies. I&apos;ve also spent time as a
                Traffic Manager, giving me firsthand experience with conversion
                funnels and user acquisition.
              </p>
              <p>
                Today, I leverage AI tools like Cursor and Claude to supercharge my
                workflow, delivering production-quality code 2-3x faster while
                maintaining high standards.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-[hsl(var(--primary))]" />
                  <span className="text-sm text-[hsl(var(--foreground))]">Santo André, SP, Brazil</span>
                </div>
              </div>
              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-[hsl(var(--primary))]" />
                  <span className="text-sm text-[hsl(var(--foreground))]">English (Fluent) & Portuguese (Native)</span>
                </div>
              </div>
              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-[hsl(var(--primary))]" />
                  <span className="text-sm text-[hsl(var(--foreground))]">AI-Augmented Development</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
