import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";

const About = dynamic(() =>
  import("@/components/sections/about").then((m) => m.About)
);
const Projects = dynamic(() =>
  import("@/components/sections/projects").then((m) => m.Projects)
);
const CriticalErrors = dynamic(() =>
  import("@/components/sections/critical-errors").then(
    (m) => m.CriticalErrors
  )
);
const Skills = dynamic(() =>
  import("@/components/sections/skills").then((m) => m.Skills)
);
const Experience = dynamic(() =>
  import("@/components/sections/experience").then((m) => m.Experience)
);
const Contact = dynamic(() =>
  import("@/components/sections/contact").then((m) => m.Contact)
);

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <div className="lazy-section">
        <Projects />
      </div>
      <div className="lazy-section">
        <CriticalErrors />
      </div>
      <div className="lazy-section">
        <Skills />
      </div>
      <div className="lazy-section">
        <Experience />
      </div>
      <div className="lazy-section">
        <Contact />
      </div>
      <footer className="border-t border-[hsl(var(--border))] py-8 text-center">
        <p className="font-[family-name:var(--font-mono)] text-xs text-[hsl(var(--muted-foreground))]">
          Built by Caio Silva &middot; Next.js &middot; TypeScript &middot;
          Tailwind CSS
        </p>
      </footer>
    </>
  );
}
