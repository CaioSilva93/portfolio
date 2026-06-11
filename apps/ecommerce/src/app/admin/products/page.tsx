import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProductImage } from "@/components/product-image";
import { invalidateCache } from "@/lib/redis";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";

interface AdminProductsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const perPage = 20;
  const offset = (page - 1) * perPage;

  const admin = createAdminClient();
  const { data: products, count } = await admin
    .from("shop_products")
    .select("*, shop_categories(name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  const totalPages = Math.ceil((count ?? 0) / perPage);

  async function toggleActive(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const currentActive = formData.get("active") === "true";
    const adminClient = createAdminClient();
    await adminClient
      .from("shop_products")
      .update({ active: !currentActive })
      .eq("id", id);
    await invalidateCache();
    redirect(`/admin/products?page=${page}`);
  }

  async function deleteProduct(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const adminClient = createAdminClient();
    await adminClient.from("shop_products").delete().eq("id", id);
    await invalidateCache();
    redirect(`/admin/products?page=${page}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(!products || products.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            )}
            {products?.map((product) => {
              const img =
                product.image_url || `/products/${product.slug}.svg`;
              const cat = product.shop_categories as { name: string } | null;
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                      <ProductImage
                        src={img}
                        alt={product.name}
                        sizes="40px"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {cat?.name ?? "—"}
                  </TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock < 5
                          ? "font-bold text-destructive"
                          : ""
                      }
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.active ? "default" : "secondary"}
                    >
                      {product.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                      <form action={toggleActive}>
                        <input type="hidden" name="id" value={product.id} />
                        <input
                          type="hidden"
                          name="active"
                          value={String(product.active)}
                        />
                        <Button variant="ghost" size="sm" type="submit">
                          {product.active ? "Deactivate" : "Activate"}
                        </Button>
                      </form>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <Button
                          variant="ghost"
                          size="sm"
                          type="submit"
                          className="text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/products?page=${page - 1}`}>Previous</Link>
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/products?page=${page + 1}`}>Next</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
