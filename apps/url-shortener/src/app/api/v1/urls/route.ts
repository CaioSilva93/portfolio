import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { shortenUrlSchema } from "@/lib/validators";
import { generateUniqueSlug, validateCustomSlug } from "@/lib/slug";
import { setCachedUrl } from "@/lib/redis";
import { getApiRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const rateLimiter = getApiRateLimit();
  if (rateLimiter) {
    const identifier = request.headers.get("x-forwarded-for") ?? "anonymous";
    const { success } = await rateLimiter.limit(identifier);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = shortenUrlSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { url, customSlug } = parsed.data;
  const supabase = createAdminClient();

  let slug: string;
  if (customSlug) {
    const err = validateCustomSlug(customSlug);
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    const { data: existing } = await supabase
      .from("short_urls")
      .select("id")
      .eq("slug", customSlug)
      .single();
    if (existing) return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
    slug = customSlug;
  } else {
    try {
      slug = await generateUniqueSlug(async (s) => {
        const { data } = await supabase.from("short_urls").select("id").eq("slug", s).single();
        return !!data;
      });
    } catch {
      return NextResponse.json({ error: "Failed to generate slug" }, { status: 500 });
    }
  }

  const { error: insertError } = await supabase.from("short_urls").insert({
    slug,
    original_url: url,
    user_id: null,
  });

  if (insertError) {
    return NextResponse.json({ error: "Failed to create URL" }, { status: 500 });
  }

  await setCachedUrl(slug, url, null);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  return NextResponse.json({
    success: true,
    data: {
      slug,
      shortUrl: `${baseUrl}/s/${slug}`,
      originalUrl: url,
    },
  }, { status: 201 });
}
