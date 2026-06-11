import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { invalidateCache } from "@/lib/redis";
import { productFormSchema } from "@/lib/validators";
import { ProductForm } from "@/components/product-form";

export default async function NewProductPage() {
  const admin = createAdminClient();
  const { data: categories } = await admin
    .from("shop_categories")
    .select("*")
    .order("name");

  async function createProduct(
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
    const { error } = await adminClient.from("shop_products").insert({
      ...rest,
      price: Math.round(price * 100),
      category_id: category_id || null,
      image_url: image_url || null,
    });

    if (error) {
      return { error: error.message };
    }

    await invalidateCache();
    redirect("/admin/products");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Add Product</h1>
      <ProductForm categories={categories ?? []} action={createProduct} />
    </div>
  );
}
