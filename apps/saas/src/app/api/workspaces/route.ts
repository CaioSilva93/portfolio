import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9]([a-z0-9-]{1,38}[a-z0-9])?$/),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createWorkspaceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.rpc("saas_create_workspace", {
    p_name: parsed.data.name,
    p_slug: parsed.data.slug,
  });

  if (error) {
    if (error.message.includes("duplicate key") || error.message.includes("unique")) {
      return NextResponse.json(
        { error: "A workspace with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data, slug: parsed.data.slug }, { status: 201 });
}
