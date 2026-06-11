import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getCached } from "@/lib/redis";
import { StoreHeader } from "@/components/store-header";
import { ProductGrid } from "@/components/product-grid";
import { ProductImage } from "@/components/product-image";
import { PriceDisplay } from "@/components/price-display";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package } from "lucide-react";
import type { Product } from "@/lib/types";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  return getCached(`shop:product:${slug}`, 60, async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("shop_products")
      .select("*, category:shop_categories(id, name, slug)")
      .eq("slug", slug)
      .eq("active", true)
      .single();
    return data as Product | null;
  });
}

async function getRelatedProducts(
  categoryId: string | null,
  excludeId: string
): Promise<Product[]> {
  if (!categoryId) return [];
  return getCached(`shop:products:related:${categoryId}:${excludeId}`, 60, async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("shop_products")
      .select("*, category:shop_categories(id, name, slug)")
      .eq("category_id", categoryId)
      .eq("active", true)
      .neq("id", excludeId)
      .limit(4);
    return (data as Product[]) || [];
  });
}

async function getUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | Shop`,
    description: product.description || `Buy ${product.name} for ${(product.price / 100).toFixed(2)}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, user] = await Promise.all([getProduct(slug), getUser()]);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(
    product.category_id,
    product.id
  );

  const imageUrl = product.image_url || `/products/${product.slug}.svg`;

  return (
    <div className="min-h-screen">
      <StoreHeader user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Products
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            <ProductImage
              src={imageUrl}
              alt={product.name}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <PriceDisplay
              priceInCents={product.price}
              className="mt-4 text-3xl font-bold text-primary"
            />

            <Separator className="my-6" />

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="mt-6 flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              {product.stock === 0 ? (
                <Badge variant="destructive">Out of Stock</Badge>
              ) : product.stock < 5 ? (
                <span className="text-sm text-amber-500">
                  Only {product.stock} left in stock
                </span>
              ) : (
                <span className="text-sm text-green-500">In Stock</span>
              )}
            </div>

            <div className="mt-8">
              <AddToCartButton product={product} size="lg" className="w-full sm:w-auto" />
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <Separator className="mb-8" />
            <h2 className="text-2xl font-bold tracking-tight">
              Related Products
            </h2>
            <div className="mt-6">
              <ProductGrid products={relatedProducts} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
