import { z } from "zod";

export const productFilterSchema = z.object({
  category: z.string().optional().default("all"),
  sort: z.enum(["newest", "price-asc", "price-desc", "name"]).optional().default("newest"),
  search: z.string().optional().default(""),
  page: z.coerce.number().int().positive().optional().default(1),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  description: z.string().max(2000).optional(),
  price: z.coerce.number().positive("Price must be positive"),
  image_url: z.string().url().optional().or(z.literal("")),
  category_id: z.string().uuid().optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  active: z.boolean().default(true),
});

export const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.coerce.number().int().positive(),
  })).min(1, "Cart is empty"),
});

export const orderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
});
