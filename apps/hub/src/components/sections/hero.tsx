"use client";

import { motion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import { GithubIcon } from "@/components/icons";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6">
      <div className="mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-[family-name:var(--font-mono)] text-sm text-[hsl(var(--primary))]"
        >
          Hi, my name is
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-6xl lg:text-7xl"
        >
          Caio Silva.
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-2 text-3xl font-bold tracking-tight text-[hsl(var(--muted-foreground))] sm:text-5xl lg:text-6xl"
        >
          I build things for the web.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-base text-[hsl(var(--muted-foreground))] sm:text-lg"
        >
          Fullstack Developer with 5+ years of experience building scalable web
          applications. Background in digital marketing brings a unique
          product-minded perspective. AI-augmented workflow for maximum
          productivity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="rounded-lg bg-[hsl(var(--primary))] px-6 py-3 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
          >
            View Projects
          </a>
          <a
            href="https://github.com/CaioSilva93"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] px-6 py-3 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--accent))]"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <a href="#about" aria-label="Scroll down">
          <ArrowDown className="h-5 w-5 animate-bounce text-[hsl(var(--muted-foreground))]" />
        </a>
      </motion.div>
    </section>
  );
}
