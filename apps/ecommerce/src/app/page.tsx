import dynamic from "next/dynamic";
import { createStaticClient } from "@/lib/supabase/static";
import { getCached } from "@/lib/redis";
import { StoreHeader } from "@/components/store-header";
import {
  ArrowRight,
  Gem,
  Shield,
  Truck,
  CreditCard,
} from "lucide-react";
import type { Product } from "@/lib/types";
import Link from "next/link";

export const revalidate = 60;

const BelowFold = dynamic(() => import("@/components/landing/below-fold"), {
  ssr: true,
});

async function getFeaturedProducts(): Promise<Product[]> {
  return getCached("shop:products:featured", 60, async () => {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("shop_products")
      .select("*, category:shop_categories(id, name, slug)")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(4);
    return (data as Product[]) || [];
  });
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen">
      <StoreHeader />

      <main>
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

      <BelowFold products={products} />

      </main>

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
