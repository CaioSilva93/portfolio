"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail } from "lucide-react";
import { GithubIcon } from "@/components/icons";

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-24 px-6" ref={ref}>
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-[family-name:var(--font-mono)] text-sm text-[hsl(var(--primary))]">
            05. What&apos;s Next?
          </p>
          <h2 className="mt-4 text-3xl font-bold text-[hsl(var(--foreground))] sm:text-4xl">
            Get In Touch
          </h2>
          <p className="mt-4 text-[hsl(var(--muted-foreground))]">
            I&apos;m currently looking for new opportunities. Whether you have a
            question or just want to say hi, my inbox is always open.
          </p>

          <a
            href="mailto:caio_9_3@hotmail.com"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-8 py-3 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
          >
            <Mail className="h-4 w-4" />
            Say Hello
          </a>

          <div className="mt-12 flex items-center justify-center gap-6">
            <a
              href="https://github.com/CaioSilva93"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--primary))]"
              aria-label="GitHub"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href="mailto:caio_9_3@hotmail.com"
              className="text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--primary))]"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
