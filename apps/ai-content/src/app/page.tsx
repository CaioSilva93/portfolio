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
import { Separator } from "@/components/ui/separator";
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
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Navigation */}
      <nav className="border-b border-[hsl(var(--border))]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[hsl(var(--primary))]" />
            <span className="text-lg font-bold">AI Content Generator</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary)/0.05)] to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:py-32">
          <Badge variant="secondary" className="mb-6">
            Powered by Google Gemini
          </Badge>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Generate{" "}
            <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(280,80%,60%)] bg-clip-text text-transparent">
              Marketing Content
            </span>
            <br />
            in Seconds
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            Create ad copy, emails, social media posts, product descriptions and
            blog articles with AI. Choose a template, fill in the details, and
            get professional content instantly.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href={ctaHref}>
              <Button size="lg" className="gap-2 px-8">
                Start Generating
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#templates">
              <Button variant="outline" size="lg" className="px-8">
                View Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.1)]">
              <Zap className="h-6 w-6 text-[hsl(var(--primary))]" />
            </div>
            <h3 className="mb-2 font-semibold">Lightning Fast</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Get high-quality content in seconds, not hours. Streaming
              responses let you see results instantly.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.1)]">
              <Shield className="h-6 w-6 text-[hsl(var(--primary))]" />
            </div>
            <h3 className="mb-2 font-semibold">Secure & Private</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Your data is protected with authentication, rate limiting, and
              secure API handling.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.1)]">
              <Globe className="h-6 w-6 text-[hsl(var(--primary))]" />
            </div>
            <h3 className="mb-2 font-semibold">Multiple Formats</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              From ads to blog posts, generate content for any platform with
              specialized templates.
            </p>
          </div>
        </div>
      </section>

      {/* Built with AI, reviewed by a human */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
            Built with AI, reviewed by a human
          </h2>
          <p className="mx-auto max-w-2xl text-[hsl(var(--muted-foreground))]">
            This project was generated by AI agents, but every critical flaw below was caught
            and fixed through my experience directing AI workflows. Without human oversight,
            these issues would have shipped to production.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-red-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-red-500">
                    CRITICAL
                  </span>
                  <h3 className="font-semibold text-[hsl(var(--foreground))]">
                    AI SDK version mismatch broke the entire streaming pipeline
                  </h3>
                </div>
                <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                  The AI generated code using the v4 API signature
                  (<code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">toDataStreamResponse()</code>,{" "}
                  <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">useChat(&#123; api &#125;)</code>)
                  while installing v5 of the SDK &mdash; none of those functions exist in that version.
                  I caught the incompatibility, upgraded to AI SDK v6, and rewrote the streaming layer to use the correct
                  {" "}<code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">toUIMessageStreamResponse()</code> and
                  {" "}<code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">DefaultChatTransport</code> APIs.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-red-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-red-500">
                    CRITICAL
                  </span>
                  <h3 className="font-semibold text-[hsl(var(--foreground))]">
                    onFinish callback used the wrong signature &mdash; generations never saved
                  </h3>
                </div>
                <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                  The AI wrote the <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">onFinish</code> callback
                  using <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">&#123; text, usage, finishReason &#125;</code> &mdash;
                  a v5 <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">streamText</code> signature that doesn&apos;t exist
                  in v6&apos;s <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">toUIMessageStreamResponse</code>.
                  I verified the actual v6 type and fixed it to extract text
                  from <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">responseMessage.parts</code>,
                  which is how the SDK actually delivers streamed content.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-red-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-red-500">
                    CRITICAL
                  </span>
                  <h3 className="font-semibold text-[hsl(var(--foreground))]">
                    Missing consumeStream &mdash; onFinish silently never fired on abort
                  </h3>
                </div>
                <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                  Without <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">consumeSseStream: consumeStream</code>,
                  the SSE stream would hang open if a user closed their browser mid-generation. The server
                  would never detect the disconnect, <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">onFinish</code> would
                  never fire, and the generation would be lost. I added the consume option so the server
                  actively drains the stream and reliably triggers the save callback.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-yellow-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-yellow-500">
                    WARNING
                  </span>
                  <h3 className="font-semibold text-[hsl(var(--foreground))]">
                    Stale closure caused a new WebSocket on every keystroke
                  </h3>
                </div>
                <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                  The AI memoized <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">DefaultChatTransport</code> with
                  {" "}<code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">formData</code> as a dependency, creating a
                  brand-new transport instance every time the user typed a character. This would
                  break the streaming connection mid-generation. I memoized the transport with an
                  empty dependency array and passed dynamic data
                  via <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">sendMessage</code>&apos;s
                  second argument instead.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-yellow-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-yellow-500">
                    WARNING
                  </span>
                  <h3 className="font-semibold text-[hsl(var(--foreground))]">
                    Type assertion instead of validation exposed the route to crashes
                  </h3>
                </div>
                <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                  The AI used <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">body as &#123; messages, template, inputData &#125;</code> to
                  destructure the request &mdash; a compile-time cast that does nothing at runtime.
                  A malformed request would crash inside{" "}
                  <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">convertToModelMessages</code> with
                  an unhelpful 500 error. I replaced it with a Zod schema that validates the full
                  request body before any processing starts.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-yellow-500/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs font-semibold text-yellow-500">
                    WARNING
                  </span>
                  <h3 className="font-semibold text-[hsl(var(--foreground))]">
                    Aborted generations saved as complete content
                  </h3>
                </div>
                <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                  When a user closed the tab mid-stream, <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">onFinish</code> would
                  save whatever partial text had been generated as if it were a complete output. Users
                  would see truncated, broken content in their history with no indication it was incomplete.
                  I added an <code className="rounded bg-[hsl(var(--muted))]/50 px-1 font-[family-name:var(--font-mono)] text-xs">isAborted</code> check
                  to skip saving and wrapped the entire callback in a try-catch to prevent silent failures.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <div className="flex items-start gap-3">
            <Eye className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--primary))]" />
            <div>
              <h3 className="font-semibold text-[hsl(var(--foreground))]">
                Why this matters
              </h3>
              <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                AI code generation is powerful, but it consistently produces plausible-looking code with
                subtle bugs that only surface at runtime. Across 4 review cycles of this project, I identified
                and fixed 5 critical issues, 9 architectural warnings, and multiple convention violations &mdash;
                including an entire streaming pipeline built against the wrong SDK version. AI writes code fast,
                but shipping it requires someone who understands what the code actually does.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* Templates Section */}
      <section id="templates" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold">Content Templates</h2>
          <p className="text-[hsl(var(--muted-foreground))]">
            Choose from {templates.length} specialized templates for different
            content types
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => {
            const Icon = iconMap[t.icon] ?? Sparkles;
            return (
              <Card
                key={t.slug}
                className="group transition-colors hover:border-[hsl(var(--primary))]"
              >
                <CardHeader>
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-[hsl(var(--primary)/0.1)]">
                    <Icon className="h-5 w-5 text-[hsl(var(--primary))]" />
                  </div>
                  <CardTitle className="text-base">{t.name}</CardTitle>
                  <CardDescription>{t.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {t.inputFields.map((f) => (
                      <Badge
                        key={f.name}
                        variant="outline"
                        className="text-xs"
                      >
                        {f.label}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* Tech Stack */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold">Built With</h2>
          <p className="text-[hsl(var(--muted-foreground))]">
            Modern technologies for a production-ready application
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "Google Gemini",
              desc: "State-of-the-art language model for content generation",
            },
            {
              name: "Next.js 16",
              desc: "React framework with App Router and server components",
            },
            {
              name: "Supabase",
              desc: "Authentication, database, and real-time subscriptions",
            },
            {
              name: "Vercel AI SDK",
              desc: "Streaming AI responses with the AI SDK v6",
            },
          ].map((tech) => (
            <Card key={tech.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{tech.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {tech.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Card className="bg-gradient-to-r from-[hsl(var(--primary)/0.1)] to-[hsl(280,80%,60%,0.05)]">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
              Ready to create?
            </h2>
            <p className="mb-8 max-w-md text-[hsl(var(--muted-foreground))]">
              Start generating professional content in seconds. No credit card
              required.
            </p>
            <Link href={ctaHref}>
              <Button size="lg" className="gap-2 px-8">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[hsl(var(--primary))]" />
            <span className="text-sm font-medium">AI Content Generator</span>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Built by Caio Cesar Amorim Silva &middot; Portfolio Project
          </p>
        </div>
      </footer>
    </div>
  );
}
