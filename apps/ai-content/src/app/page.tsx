import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Megaphone,
  Mail,
  Camera,
  Briefcase,
  ShoppingBag,
  FileText,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  ShieldAlert,
  AlertTriangle,
  Eye,
  Wand2,
  Bot,
  type LucideIcon,
} from "lucide-react";
import { templates } from "@/lib/templates";
import { createClient } from "@/lib/supabase/server";

const iconMap: Record<string, LucideIcon> = {
  Megaphone,
  Mail,
  Camera,
  Briefcase,
  ShoppingBag,
  FileText,
};

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const ctaHref = user ? "/dashboard" : "/auth/login";

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Aurora Background */}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[hsl(var(--border))/0.3] bg-[hsl(var(--background))/0.6] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-[hsl(var(--foreground))]">
              AI Content
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button size="sm" className="rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:brightness-110">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-[hsl(var(--muted-foreground))]">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:brightness-110">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
        <Badge variant="secondary" className="mb-8 rounded-full border-[hsl(var(--border))/0.5] bg-[hsl(var(--card))/0.5] px-4 py-1.5 text-sm backdrop-blur-sm">
          <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[hsl(var(--primary))]" />
          Powered by Google Gemini
        </Badge>

        <h1 className="text-[3.5rem] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[4.5rem] lg:text-[5.5rem]">
          Generate{" "}
          <span className="text-shimmer">
            Marketing Content
          </span>
          <br />
          in Seconds
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
          Create ad copy, emails, social media posts, product descriptions and
          blog articles with AI. Choose a template, fill in the details, and
          get professional content instantly.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href={ctaHref}>
            <button className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-8 py-3.5 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:brightness-110 hover:shadow-[0_0_30px_hsl(var(--primary)/0.35)]">
              Start Generating
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <Link href="#templates">
            <button className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))/0.5] bg-[hsl(var(--card))/0.3] px-8 py-3.5 text-sm font-semibold text-[hsl(var(--foreground))] backdrop-blur-sm transition-all hover:border-[hsl(var(--primary))/0.3] hover:bg-[hsl(var(--card))/0.5]">
              View Templates
            </button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
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
              <h3 className="font-semibold text-[hsl(var(--foreground))]">{f.title}</h3>
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
      <section className="mx-auto max-w-4xl px-6 py-16">
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
      <section id="templates" className="mx-auto max-w-6xl px-6 py-16">
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
      <section className="mx-auto max-w-4xl px-6 py-16">
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
      <section className="mx-auto max-w-6xl px-6 py-16">
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
      <section className="mx-auto max-w-6xl px-6 py-8">
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

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))/0.3] py-8 text-center">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6">
          <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
          <p className="font-[family-name:var(--font-mono)] text-xs text-[hsl(var(--muted-foreground))]">
            Built by Caio Silva &middot; Next.js &middot; Supabase &middot; Google Gemini &middot; AI SDK
          </p>
        </div>
      </footer>
    </div>
  );
}
