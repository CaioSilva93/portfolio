import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCached } from "@/lib/redis";
import { StoreHeader } from "@/components/store-header";
import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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

      <section className="relative overflow-hidden border-b">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Welcome to the{" "}
              <span className="text-primary">Shop</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              A demo e-commerce platform built with Next.js, Supabase, and
              Stripe. Browse products, add to cart, and checkout with a
              complete payment flow.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/products">
                <Button size="lg">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,hsl(var(--primary)/0.12),transparent)]" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            Built by Caio Silva &middot; Next.js &middot; Supabase &middot;
            Stripe &middot; Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
