import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { invalidateCache } from "@/lib/redis";
import { productFormSchema } from "@/lib/validators";
import { ProductForm } from "@/components/product-form";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const admin = createAdminClient();

  const [productRes, categoriesRes] = await Promise.all([
    admin.from("shop_products").select("*").eq("id", id).single(),
    admin.from("shop_categories").select("*").order("name"),
  ]);

  if (!productRes.data) {
    notFound();
  }

  const product = productRes.data;
  const categories = categoriesRes.data ?? [];

  async function updateProduct(
    formData: FormData
  ): Promise<{ error?: string }> {
    "use server";

    const raw = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description") || undefined,
      price: formData.get("price"),
      stock: formData.get("stock"),
      category_id: formData.get("category_id") || "",
      image_url: formData.get("image_url") || "",
      active: formData.get("active") === "on",
    };

    const parsed = productFormSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        error: parsed.error.issues.map((i) => i.message).join(", "),
      };
    }

    const { price, category_id, image_url, ...rest } = parsed.data;

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("shop_products")
      .update({
        ...rest,
        price: Math.round(price * 100),
        category_id: category_id || null,
        image_url: image_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    await invalidateCache();
    redirect("/admin/products");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
      <ProductForm
        product={product}
        categories={categories}
        action={updateProduct}
      />
    </div>
  );
}
