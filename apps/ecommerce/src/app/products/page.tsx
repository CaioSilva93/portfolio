import { createStaticClient } from "@/lib/supabase/static";
import { getCached } from "@/lib/redis";
import { productFilterSchema } from "@/lib/validators";
import { StoreHeader } from "@/components/store-header";
import { ProductGrid } from "@/components/product-grid";
import { ProductFilters } from "@/components/product-filters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product, Category } from "@/lib/types";

export const revalidate = 60;

const PRODUCTS_PER_PAGE = 12;

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function getCategories(): Promise<Category[]> {
  return getCached("shop:categories", 300, async () => {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("shop_categories")
      .select("*")
      .order("name");
    return (data as Category[]) || [];
  });
}

async function getProducts(params: {
  category: string;
  sort: string;
  search: string;
  page: number;
}): Promise<{ products: Product[]; total: number }> {
  const { category, sort, search, page } = params;
  const cacheKey = `shop:products:${category}:${sort}:${search}:${page}`;

  return getCached(cacheKey, 60, async () => {
    const supabase = createStaticClient();
    const from = (page - 1) * PRODUCTS_PER_PAGE;
    const to = from + PRODUCTS_PER_PAGE - 1;

    let query = supabase
      .from("shop_products")
      .select("*, category:shop_categories(id, name, slug)", { count: "exact" })
      .eq("active", true);

    if (category !== "all") {
      const { data: cat } = await supabase
        .from("shop_categories")
        .select("id")
        .eq("slug", category)
        .single();
      if (cat) {
        query = query.eq("category_id", cat.id);
      }
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    switch (sort) {
      case "price-asc":
        query = query.order("price", { ascending: true });
        break;
      case "price-desc":
        query = query.order("price", { ascending: false });
        break;
      case "name":
        query = query.order("name", { ascending: true });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data, count } = await query.range(from, to);

    return {
      products: (data as Product[]) || [],
      total: count || 0,
    };
  });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const rawParams = await searchParams;
  const params = productFilterSchema.parse({
    category: rawParams.category,
    sort: rawParams.sort,
    search: rawParams.search,
    page: rawParams.page,
  });

  const [{ products, total }, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
  const currentPage = params.page;

  function buildPageUrl(page: number) {
    const p = new URLSearchParams();
    if (params.category !== "all") p.set("category", params.category);
    if (params.sort !== "newest") p.set("sort", params.sort);
    if (params.search) p.set("search", params.search);
    if (page > 1) p.set("page", String(page));
    const qs = p.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="min-h-screen">
      <StoreHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-2 text-muted-foreground">
            Browse our collection of {total} product{total !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="mb-8">
          <ProductFilters categories={categories} />
        </div>

        <ProductGrid products={products} />

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {currentPage > 1 ? (
              <Link href={buildPageUrl(currentPage - 1)}>
                <Button variant="outline" size="sm">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1
                )
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                    acc.push("...");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <Link key={p} href={buildPageUrl(p as number)}>
                      <Button
                        variant={p === currentPage ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        {p}
                      </Button>
                    </Link>
                  )
                )}
            </div>

            {currentPage < totalPages ? (
              <Link href={buildPageUrl(currentPage + 1)}>
                <Button variant="outline" size="sm">
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
