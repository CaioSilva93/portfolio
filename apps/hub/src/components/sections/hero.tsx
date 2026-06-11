import { ArrowDown } from "lucide-react";
import { GithubIcon } from "@/components/icons";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6">
      <div className="mx-auto max-w-4xl text-center">
        <p className="hero-animate font-[family-name:var(--font-mono)] text-sm text-[hsl(var(--primary))]">
          Hi, my name is
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-7xl lg:text-8xl">
          Caio Silva.
        </h1>

        <h2 className="hero-animate hero-delay-1 mt-3 text-2xl font-bold tracking-tight text-[hsl(var(--muted-foreground))] sm:text-4xl lg:text-5xl">
          I build things for the web.
        </h2>

        <p className="hero-animate hero-delay-2 mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
          Fullstack Developer with 5+ years building scalable web applications.
          Background in digital marketing brings a product-minded perspective.
          AI-augmented workflow — every project reviewed through adversarial cycles.
        </p>

        <div className="hero-animate hero-delay-3 mt-10 flex items-center justify-center gap-4">
          <a
            href="#projects"
            className="rounded-md bg-[hsl(var(--primary))] px-6 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
          >
            View Projects
          </a>
          <a
            href="https://github.com/CaioSilva93"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md border border-[hsl(var(--border))] px-6 py-3 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--accent))]"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>

      <div className="hero-animate hero-delay-4 absolute bottom-10 left-1/2 -translate-x-1/2">
        <a href="#about" aria-label="Scroll down">
          <ArrowDown className="h-5 w-5 animate-bounce text-[hsl(var(--muted-foreground))]" />
        </a>
      </div>
    </section>
  );
}
