"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { ShortenForm } from "@/components/shorten-form";
import { UrlResult } from "@/components/url-result";
import {
  Link2,
  BarChart3,
  Zap,
  Code2,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Eye,
  Globe,
  QrCode,
  Timer,
  Copy,
} from "lucide-react";

interface ShortenResult {
  shortUrl: string;
  slug: string;
  originalUrl: string;
  qrSvg: string;
}

export default function Home() {
  const [result, setResult] = useState<ShortenResult | null>(null);

  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />

      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-[200px] top-[60px] h-[700px] w-[700px] rounded-full bg-[hsl(250,95%,55%)] opacity-[0.12] blur-[150px]" />
        <div className="absolute -right-[150px] top-[200px] h-[600px] w-[600px] rounded-full bg-[hsl(280,90%,50%)] opacity-[0.08] blur-[130px]" />
        <div className="absolute bottom-[100px] left-[30%] h-[500px] w-[500px] rounded-full bg-[hsl(250,95%,60%)] opacity-[0.06] blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-16 sm:pt-24">
        <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          {/* Left Column */}
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.5] px-4 py-1.5 text-sm text-[hsl(var(--muted-foreground))]">
              <Zap className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
              Redis-cached redirects in ~5ms
            </div>

            <h1 className="text-[3.5rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-[hsl(var(--foreground))] sm:text-[4.5rem] lg:text-[5.5rem]">
              Shorten
              <br />
              <span className="text-[hsl(var(--primary))]">your</span> links
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
              Powerful, fast, and reliable short links with
              analytics built for modern teams.
            </p>

            <div className="mt-4 flex items-center gap-6 text-sm text-[hsl(var(--muted-foreground))]">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                Instant short links
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                Secure &amp; trusted
              </span>
            </div>

            {/* Shorten Form */}
            <div className="mt-10 max-w-xl">
              <ShortenForm onResult={setResult} />
              {result && (
                <div className="mt-4">
                  <UrlResult
                    shortUrl={result.shortUrl}
                    originalUrl={result.originalUrl}
                    qrSvg={result.qrSvg}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column — QR Preview Card */}
          <div className="hidden pt-24 lg:block">
            <div className="animate-float glass glow-sm rounded-2xl p-6">
              <div className="mb-4 flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                <QrCode className="h-4 w-4 text-[hsl(var(--primary))]" />
                <span>Scan to preview</span>
              </div>
              <div className="mx-auto w-fit rounded-xl bg-white p-5">
                <svg width="140" height="140" viewBox="0 0 140 140" className="block">
                  <rect width="140" height="140" fill="white"/>
                  {/* Top-left position pattern */}
                  <rect x="8" y="8" width="36" height="36" rx="4" fill="hsl(250,40%,20%)" />
                  <rect x="14" y="14" width="24" height="24" rx="2" fill="white" />
                  <rect x="20" y="20" width="12" height="12" rx="1" fill="hsl(250,40%,20%)" />
                  {/* Top-right position pattern */}
                  <rect x="96" y="8" width="36" height="36" rx="4" fill="hsl(250,40%,20%)" />
                  <rect x="102" y="14" width="24" height="24" rx="2" fill="white" />
                  <rect x="108" y="20" width="12" height="12" rx="1" fill="hsl(250,40%,20%)" />
                  {/* Bottom-left position pattern */}
                  <rect x="8" y="96" width="36" height="36" rx="4" fill="hsl(250,40%,20%)" />
                  <rect x="14" y="102" width="24" height="24" rx="2" fill="white" />
                  <rect x="20" y="108" width="12" height="12" rx="1" fill="hsl(250,40%,20%)" />
                  {/* Data modules */}
                  <rect x="52" y="12" width="8" height="8" rx="1" fill="hsl(250,60%,45%)" opacity="0.8"/>
                  <rect x="64" y="12" width="8" height="8" rx="1" fill="hsl(250,40%,20%)"/>
                  <rect x="76" y="12" width="8" height="8" rx="1" fill="hsl(250,60%,45%)" opacity="0.8"/>
                  <rect x="52" y="24" width="8" height="8" rx="1" fill="hsl(250,40%,20%)"/>
                  <rect x="76" y="24" width="8" height="8" rx="1" fill="hsl(250,40%,20%)"/>
                  <rect x="52" y="52" width="8" height="8" rx="1" fill="hsl(250,40%,20%)"/>
                  <rect x="64" y="52" width="8" height="8" rx="1" fill="hsl(250,60%,45%)" opacity="0.8"/>
                  <rect x="76" y="52" width="8" height="8" rx="1" fill="hsl(250,40%,20%)"/>
                  <rect x="52" y="64" width="8" height="8" rx="1" fill="hsl(250,60%,45%)" opacity="0.8"/>
                  <rect x="64" y="64" width="8" height="8" rx="1" fill="hsl(250,40%,20%)"/>
                  <rect x="76" y="64" width="8" height="8" rx="1" fill="hsl(250,60%,45%)" opacity="0.8"/>
                  <rect x="52" y="76" width="8" height="8" rx="1" fill="hsl(250,40%,20%)"/>
                  <rect x="64" y="76" width="8" height="8" rx="1" fill="hsl(250,60%,45%)" opacity="0.8"/>
                  <rect x="96" y="52" width="8" height="8" rx="1" fill="hsl(250,40%,20%)"/>
                  <rect x="108" y="52" width="8" height="8" rx="1" fill="hsl(250,60%,45%)" opacity="0.8"/>
                  <rect x="120" y="52" width="8" height="8" rx="1" fill="hsl(250,40%,20%)"/>
                  <rect x="96" y="64" width="8" height="8" rx="1" fill="hsl(250,60%,45%)" opacity="0.8"/>
                  <rect x="108" y="64" width="8" height="8" rx="1" fill="hsl(250,40%,20%)"/>
                  <rect x="120" y="64" width="8" height="8" rx="1" fill="hsl(250,60%,45%)" opacity="0.8"/>
                  <rect x="96" y="96" width="8" height="8" rx="1" fill="hsl(250,40%,20%)"/>
                  <rect x="108" y="96" width="8" height="8" rx="1" fill="hsl(250,60%,45%)" opacity="0.8"/>
                  <rect x="120" y="96" width="8" height="8" rx="1" fill="hsl(250,40%,20%)"/>
                  <rect x="52" y="96" width="8" height="8" rx="1" fill="hsl(250,40%,20%)"/>
                  <rect x="64" y="108" width="8" height="8" rx="1" fill="hsl(250,60%,45%)" opacity="0.8"/>
                  <rect x="76" y="96" width="8" height="8" rx="1" fill="hsl(250,60%,45%)" opacity="0.8"/>
                  <rect x="52" y="120" width="8" height="8" rx="1" fill="hsl(250,60%,45%)" opacity="0.8"/>
                  <rect x="76" y="120" width="8" height="8" rx="1" fill="hsl(250,40%,20%)"/>
                </svg>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="font-[family-name:var(--font-mono)] text-xs text-[hsl(var(--muted-foreground))]">
                    shrinkr.co/abc123
                  </span>
                </div>
                <button className="rounded-md p-1 text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Fast */}
          <div className="glass-card rounded-2xl p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/10">
              <Zap className="h-5 w-5 text-[hsl(var(--primary))]" />
            </div>
            <h3 className="font-semibold text-[hsl(var(--foreground))]">Fast</h3>
            <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
              Shorten links instantly with global edge infrastructure.
            </p>
            <p className="mt-4 font-[family-name:var(--font-mono)] text-3xl font-bold text-[hsl(var(--primary))]">
              {"<"}5ms
            </p>
            <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
              99.99% uptime
            </p>
          </div>

          {/* Analytics */}
          <div className="glass-card rounded-2xl p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/10">
              <BarChart3 className="h-5 w-5 text-[hsl(var(--primary))]" />
            </div>
            <h3 className="font-semibold text-[hsl(var(--foreground))]">Analytics</h3>
            <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
              Track clicks, referrers, locations, and devices in real time.
            </p>
            <p className="mt-4 font-[family-name:var(--font-mono)] text-3xl font-bold text-[hsl(var(--primary))]">
              Real-time
            </p>
            <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
              Real-time metrics
            </p>
          </div>

          {/* API */}
          <div className="glass-card rounded-2xl p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/10">
              <Code2 className="h-5 w-5 text-[hsl(var(--primary))]" />
            </div>
            <h3 className="font-semibold text-[hsl(var(--foreground))]">API</h3>
            <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
              Integrate powerful link management into your product with our API.
            </p>
            <p className="mt-4 font-[family-name:var(--font-mono)] text-3xl font-bold text-[hsl(var(--primary))]">
              REST
            </p>
            <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
              Developer friendly
            </p>
          </div>
        </div>

        {/* Secondary features */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-[hsl(var(--border))/0.5] bg-[hsl(var(--card))/0.3] px-5 py-3.5">
            <QrCode className="h-4 w-4 shrink-0 text-[hsl(var(--primary))]" />
            <span className="text-sm text-[hsl(var(--muted-foreground))]">QR codes for every link</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[hsl(var(--border))/0.5] bg-[hsl(var(--card))/0.3] px-5 py-3.5">
            <Globe className="h-4 w-4 shrink-0 text-[hsl(var(--primary))]" />
            <span className="text-sm text-[hsl(var(--muted-foreground))]">Country &amp; device tracking</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[hsl(var(--border))/0.5] bg-[hsl(var(--card))/0.3] px-5 py-3.5">
            <Timer className="h-4 w-4 shrink-0 text-[hsl(var(--primary))]" />
            <span className="text-sm text-[hsl(var(--muted-foreground))]">Non-blocking analytics</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="glass glow-primary rounded-2xl p-10 text-center sm:p-14">
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] sm:text-3xl">
            Want to see detailed analytics?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[hsl(var(--muted-foreground))]">
            Create a free account to track every click with charts, country breakdowns, device stats, and more.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-8 py-3.5 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:brightness-110 hover:shadow-[0_0_30px_hsl(var(--primary)/0.35)]"
          >
            Create free account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Built with AI */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
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
              title: "RLS policies allowed full URL enumeration",
              desc: 'The AI generated a SELECT USING (true) policy on short_urls, letting any anonymous user query every URL in the database. I restricted the policy to only allow owners and anonymous URLs, and moved the redirect handler to use the service_role client that bypasses RLS.',
            },
            {
              type: "critical" as const,
              title: "Click injection via open INSERT policy",
              desc: 'The short_clicks table had INSERT WITH CHECK (true), allowing anyone to inject fake analytics data through the Supabase API. I removed the policy entirely — click tracking now runs server-side via service_role.',
            },
            {
              type: "critical" as const,
              title: "RPC function callable by anonymous users",
              desc: 'The increment_click_count function was a SECURITY DEFINER function exposed to anon and public roles, letting anyone inflate click counts. I added REVOKE EXECUTE and set a fixed search_path to prevent schema injection.',
            },
            {
              type: "warning" as const,
              title: "301 redirects broke analytics and URL management",
              desc: "The AI used 301 (permanent) redirects, causing browsers to cache the destination forever. I changed to 302 (temporary) redirects so every click hits the server and is recorded.",
            },
            {
              type: "warning" as const,
              title: "Synchronous click tracking added ~200ms latency",
              desc: "Click analytics were recorded before sending the redirect response. I moved tracking to Next.js after() API, which runs asynchronously — redirects now complete in ~5ms.",
            },
            {
              type: "warning" as const,
              title: "user_id spoofing on URL creation",
              desc: 'The INSERT policy used WITH CHECK (true), allowing any authenticated user to set an arbitrary user_id. I tightened the policy to WITH CHECK (user_id IS NULL OR user_id = auth.uid()).',
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

        <div className="mt-6 glass rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Eye className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--primary))]" />
            <div>
              <h3 className="font-semibold text-[hsl(var(--foreground))]">
                Why this matters
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                AI code generation is powerful, but it consistently produces plausible-looking code with
                subtle security holes and architectural mistakes. In this project alone, I identified
                and fixed 3 critical security vulnerabilities and 3 architectural warnings &mdash; none
                of which the AI caught on its own.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))/0.5] py-8 text-center">
        <p className="font-[family-name:var(--font-mono)] text-xs text-[hsl(var(--muted-foreground))]">
          Built by Caio Silva &middot; Next.js &middot; Supabase &middot; Redis &middot; Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
