import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { CriticalErrors } from "@/components/sections/critical-errors";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <CriticalErrors />
      <Skills />
      <Experience />
      <Contact />
      <footer className="border-t border-[hsl(var(--border))] py-8 text-center">
        <p className="font-[family-name:var(--font-mono)] text-xs text-[hsl(var(--muted-foreground))]">
          Built by Caio Silva &middot; Next.js &middot; TypeScript &middot;
          Tailwind CSS
        </p>
      </footer>
    </>
  );
}
