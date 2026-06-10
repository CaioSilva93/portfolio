import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("short_urls")
    .select("slug, original_url, clicks_count, created_at, expires_at")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "URL not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      slug: data.slug,
      originalUrl: data.original_url,
      clicksCount: data.clicks_count,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
    },
  });
}
