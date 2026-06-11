import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCached } from "@/lib/redis";
import { StoreHeader } from "@/components/store-header";
import { ProductGrid } from "@/components/product-grid";
import {
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Eye,
  Gem,
  Shield,
  Truck,
  CreditCard,
} from "lucide-react";
import type { Product } from "@/lib/types";

async function getFeaturedProducts(): Promise<Product[]> {
  return getCached("shop:products:featured", 60, async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("shop_products")
      .select("*, category:shop_categories(id, name, slug)")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(4);
    return (data as Product[]) || [];
  });
}

async function getUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export default async function HomePage() {
  const [products, user] = await Promise.all([
    getFeaturedProducts(),
    getUser(),
  ]);

  return (
    <div className="min-h-screen">
      <StoreHeader user={user} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="luxury-gradient absolute inset-0 -z-10" />
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-[200px] top-[100px] h-[500px] w-[500px] rounded-full bg-[hsl(38,92%,50%)] opacity-[0.04] blur-[150px]" />
          <div className="absolute -right-[100px] top-[200px] h-[400px] w-[400px] rounded-full bg-[hsl(30,70%,40%)] opacity-[0.03] blur-[120px]" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))/0.5] px-4 py-1.5 text-sm text-[hsl(var(--muted-foreground))]">
              <Gem className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
              Premium E-commerce Experience
            </div>

            <h1 className="text-[3rem] font-bold leading-[1.1] tracking-[-0.03em] sm:text-[4rem] lg:text-[5rem]">
              Welcome to
              <br />
              the <span className="text-gold">Shop</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
              A production-grade e-commerce platform with secure Stripe checkout,
              real-time inventory, and server-side caching.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-8 py-3.5 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:brightness-110 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-[hsl(var(--border))]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-0 divide-x divide-[hsl(var(--border))] px-0 sm:grid-cols-4">
          {[
            { icon: Shield, label: "Secure Checkout", sub: "Stripe powered" },
            { icon: Truck, label: "Fast Delivery", sub: "Redis cached" },
            { icon: CreditCard, label: "Easy Payments", sub: "Cards & wallets" },
            { icon: Gem, label: "Quality Products", sub: "Curated catalog" },
          ].map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-2 px-4 py-6 text-center">
              <b.icon className="h-5 w-5 text-[hsl(var(--primary))]" />
              <span className="text-sm font-medium text-[hsl(var(--foreground))]">{b.label}</span>
              <span className="text-xs text-[hsl(var(--muted-foreground))]">{b.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-medium text-[hsl(var(--primary))] transition-colors hover:brightness-110"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      </section>

      {/* Built with AI */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built with AI, reviewed by a human
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[hsl(var(--muted-foreground))]">
            This project was generated by AI agents, but every critical flaw below
            was caught and fixed through my experience directing AI workflows.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              type: "critical" as const,
              title: "RLS policies allowed admin privilege escalation",
              desc: "The AI generated RLS policies on shop_profiles without restricting the role column, letting any user self-promote to admin. I added explicit AND role = 'customer' constraints.",
            },
            {
              type: "critical" as const,
              title: "Non-transactional webhook handler could corrupt orders",
              desc: "The Stripe webhook handler had separate sequential queries without a transaction. If the order insert failed after stock was decremented, inventory would be permanently lost. I replaced it with an atomic PL/pgSQL function.",
            },
            {
              type: "critical" as const,
              title: "Seed route granted admin role without authorization",
              desc: "The /api/seed route set the calling user as admin with no guard. I implemented a bootstrap guard where only the first user becomes admin, plus rate limiting.",
            },
            {
              type: "critical" as const,
              title: "Missing Stripe client packages would break checkout",
              desc: "The AI planned Embedded Checkout but never added @stripe/stripe-js or @stripe/react-stripe-js to dependencies. The build would have failed at the checkout page.",
            },
            {
              type: "warning" as const,
              title: "No webhook idempotency — duplicate orders on retry",
              desc: "Stripe can send the same checkout.session.completed event multiple times. I added a UNIQUE constraint on stripe_checkout_session_id and a check-before-insert guard.",
            },
            {
              type: "warning" as const,
              title: "Redis KEYS scan would block the server at scale",
              desc: "The AI used redis.keys('shop:*') for cache invalidation — an O(N) blocking command. I replaced it with a version-key counter pattern for O(1) invalidation.",
            },
            {
              type: "warning" as const,
              title: "No stock validation before checkout",
              desc: "Users could purchase out-of-stock items. I added pre-checkout validation plus atomic stock decrement with a FOR UPDATE row lock to prevent overselling.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`rounded-xl border p-5 ${
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
                      className={`rounded-md px-2 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold ${
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

        <div className="mt-6 luxury-card rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Eye className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--primary))]" />
            <div>
              <h3 className="font-semibold text-[hsl(var(--foreground))]">Why this matters</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                AI code generation is powerful, but it consistently produces plausible-looking code
                with subtle security holes. Across 3 review cycles, I identified and fixed 4 critical
                security vulnerabilities, 26 architectural warnings, and 12 convention issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] py-8 text-center">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[hsl(var(--muted-foreground))]">
          Built by Caio Silva &middot; Next.js &middot; Supabase &middot; Stripe
          &middot; Redis &middot; Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
