import { z } from "zod";

export const createBoardSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional().default(""),
});

export const createColumnSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title too long"),
  position: z.number().int().min(0),
});

export const createCardSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(2000, "Description too long").optional().default(""),
  column_id: z.string().uuid("Invalid column"),
  position: z.number().int().min(0),
  color: z.string().nullable().optional(),
});

export const updateCardSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  color: z.string().nullable().optional(),
  assigned_to: z.string().uuid().nullable().optional(),
});

export const reorderSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    column_id: z.string().uuid().optional(),
    position: z.number().int().min(0),
  })),
  type: z.enum(["card", "column"]),
});

export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email"),
  role: z.enum(["editor", "viewer"]).default("editor"),
});
