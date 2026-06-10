import { z } from "zod";

export const seedSchema = z.object({
  teamId: z.string().uuid(),
});

export const customerFiltersSchema = z.object({
  search: z.string().optional().default(""),
  plan: z.enum(["all", "free", "starter", "pro", "enterprise"]).optional().default("all"),
  status: z.enum(["all", "active", "churned", "trial"]).optional().default("all"),
  sort: z.enum(["name", "email", "plan", "status", "mrr", "created_at"]).optional().default("name"),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type CustomerFilters = z.infer<typeof customerFiltersSchema>;
