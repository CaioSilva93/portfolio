import Link from "next/link";
import {
  Zap,
  Shield,
  Globe,
  FileText,
  Wand2,
  Bot,
  ShieldAlert,
  AlertTriangle,
  Eye,
  Sparkles,
  Megaphone,
  Mail,
  Camera,
  Briefcase,
  ShoppingBag,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { templates } from "@/lib/templates";

const iconMap: Record<string, LucideIcon> = {
  Megaphone,
  Mail,
  Camera,
  Briefcase,
  ShoppingBag,
  FileText,
};

interface BelowFoldProps {
  ctaHref: string;
}

export default function BelowFold({ ctaHref }: BelowFoldProps) {
  return (
    <>
      {/* Features */}
      <section className="lazy-section mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Lightning Fast",
              desc: "Get high-quality content in seconds. Streaming responses let you see results instantly.",
              stat: "~2s",
              statLabel: "Average generation",
            },
            {
              icon: Shield,
              title: "Secure & Private",
              desc: "Your data is protected with authentication, rate limiting, and secure API handling.",
              stat: "E2E",
              statLabel: "Encrypted pipeline",
            },
            {
              icon: Globe,
              title: "Multiple Formats",
              desc: "From ads to blog posts, generate content for any platform with specialized templates.",
              stat: `${templates.length}`,
              statLabel: "Templates available",
            },
          ].map((f) => (
            <div key={f.title} className="glass-card-aurora rounded-2xl p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/10">
                <f.icon className="h-5 w-5 text-[hsl(var(--primary))]" />
              </div>
              <h2 className="font-semibold text-[hsl(var(--foreground))]">{f.title}</h2>
              <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">{f.desc}</p>
              <p className="mt-4 font-[family-name:var(--font-mono)] text-3xl font-bold text-[hsl(var(--primary))]">
                {f.stat}
              </p>
              <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{f.statLabel}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="lazy-section mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          How it works
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { step: "01", icon: FileText, title: "Pick a Template", desc: "Choose from ad copy, emails, blog posts, and more." },
            { step: "02", icon: Wand2, title: "Fill Details", desc: "Add your product, audience, tone, and key points." },
            { step: "03", icon: Bot, title: "Generate", desc: "AI creates polished content streamed in real time." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[hsl(var(--border))/0.3] bg-[hsl(var(--card))/0.4]">
                <s.icon className="h-6 w-6 text-[hsl(var(--primary))]" />
              </div>
              <span className="font-[family-name:var(--font-mono)] text-xs text-[hsl(var(--primary))]">{s.step}</span>
              <h3 className="mt-1 font-semibold text-[hsl(var(--foreground))]">{s.title}</h3>
              <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="lazy-section mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight">Content Templates</h2>
          <p className="text-[hsl(var(--muted-foreground))]">
            Choose from {templates.length} specialized templates for different content types
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => {
            const Icon = iconMap[t.icon] ?? Sparkles;
            return (
              <div
                key={t.slug}
                className="glass-card-aurora group rounded-2xl p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/10">
                  <Icon className="h-5 w-5 text-[hsl(var(--primary))]" />
                </div>
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{t.name}</h3>
                <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">{t.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {t.inputFields.map((f) => (
                    <span
                      key={f.name}
                      className="rounded-md border border-[hsl(var(--border))/0.5] bg-[hsl(var(--card))/0.3] px-2 py-0.5 text-xs text-[hsl(var(--muted-foreground))]"
                    >
                      {f.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Built with AI */}
      <section className="lazy-section mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built with AI, reviewed by a human
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[hsl(var(--muted-foreground))]">
            This project was generated by AI agents, but every critical flaw below was caught
            and fixed through my experience directing AI workflows.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              type: "critical" as const,
              title: "AI SDK version mismatch broke the entire streaming pipeline",
              desc: "The AI generated code using the v4 API signature (toDataStreamResponse(), useChat({ api })) while installing v5 of the SDK. I caught the incompatibility, upgraded to AI SDK v6, and rewrote the streaming layer to use the correct toUIMessageStreamResponse() and DefaultChatTransport APIs.",
            },
            {
              type: "critical" as const,
              title: "onFinish callback used the wrong signature — generations never saved",
              desc: "The AI wrote the onFinish callback using { text, usage, finishReason } — a v5 streamText signature that doesn't exist in v6's toUIMessageStreamResponse. I verified the actual v6 type and fixed it to extract text from responseMessage.parts.",
            },
            {
              type: "critical" as const,
              title: "Missing consumeStream — onFinish silently never fired on abort",
              desc: "Without consumeSseStream: consumeStream, the SSE stream would hang open if a user closed their browser mid-generation. I added the consume option so the server actively drains the stream and reliably triggers the save callback.",
            },
            {
              type: "warning" as const,
              title: "Stale closure caused a new WebSocket on every keystroke",
              desc: "The AI memoized DefaultChatTransport with formData as a dependency, creating a brand-new transport instance every time the user typed. I memoized the transport with an empty dependency array and passed dynamic data via sendMessage's second argument.",
            },
            {
              type: "warning" as const,
              title: "Type assertion instead of validation exposed the route to crashes",
              desc: "The AI used body as { messages, template, inputData } — a compile-time cast that does nothing at runtime. A malformed request would crash with an unhelpful 500 error. I replaced it with a Zod schema that validates the full request body.",
            },
            {
              type: "warning" as const,
              title: "Aborted generations saved as complete content",
              desc: "When a user closed the tab mid-stream, onFinish would save whatever partial text had been generated as if it were complete. I added an isAborted check to skip saving and wrapped the entire callback in a try-catch.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`rounded-2xl border p-5 ${
                item.type === "critical"
                  ? "border-red-500/20 bg-red-500/[0.04]"
                  : "border-amber-500/20 bg-amber-500/[0.04]"
              }`}
            >
              <div className="flex items-start gap-3">
                {item.type === "critical" ? (
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold ${
                        item.type === "critical"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {item.type === "critical" ? "CRITICAL" : "WARNING"}
                    </span>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 glass-aurora rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Eye className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--primary))]" />
            <div>
              <h3 className="font-semibold text-[hsl(var(--foreground))]">Why this matters</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                AI code generation is powerful, but it consistently produces plausible-looking code with
                subtle bugs that only surface at runtime. Across 4 review cycles of this project, I identified
                and fixed 5 critical issues, 9 architectural warnings, and multiple convention violations —
                including an entire streaming pipeline built against the wrong SDK version.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="lazy-section mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight">Built With</h2>
          <p className="text-[hsl(var(--muted-foreground))]">
            Modern technologies for a production-ready application
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Google Gemini", desc: "State-of-the-art language model for content generation" },
            { name: "Next.js 16", desc: "React framework with App Router and server components" },
            { name: "Supabase", desc: "Authentication, database, and real-time subscriptions" },
            { name: "Vercel AI SDK", desc: "Streaming AI responses with the AI SDK v6" },
          ].map((tech) => (
            <div key={tech.name} className="rounded-xl border border-[hsl(var(--border))/0.5] bg-[hsl(var(--card))/0.3] p-5">
              <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{tech.name}</h3>
              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="lazy-section mx-auto max-w-6xl px-6 py-8">
        <div className="glass-aurora glow-aurora rounded-2xl p-10 text-center sm:p-14">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to create?</h2>
          <p className="mx-auto mt-3 max-w-md text-[hsl(var(--muted-foreground))]">
            Start generating professional content in seconds. No credit card required.
          </p>
          <Link href={ctaHref}>
            <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-8 py-3.5 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:brightness-110 hover:shadow-[0_0_30px_hsl(var(--primary)/0.35)]">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
