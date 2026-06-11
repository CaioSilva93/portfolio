import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const BelowFold = dynamic(() => import("@/components/landing/below-fold"), {
  ssr: true,
});

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

      <main>
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

      <BelowFold ctaHref={ctaHref} />

      </main>

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
