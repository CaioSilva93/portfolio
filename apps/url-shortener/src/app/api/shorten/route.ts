import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { shortenUrlSchema } from "@/lib/validators";
import { generateUniqueSlug, validateCustomSlug } from "@/lib/slug";
import { setCachedUrl } from "@/lib/redis";
import { getShortenRateLimit } from "@/lib/rate-limit";
import QRCode from "qrcode";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (origin && appUrl && !origin.startsWith(appUrl)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const rateLimiter = getShortenRateLimit();
  if (rateLimiter) {
    const identifier = user?.id ?? request.headers.get("x-forwarded-for") ?? "anonymous";
    const { success, remaining } = await rateLimiter.limit(identifier);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429, headers: { "X-RateLimit-Remaining": String(remaining) } }
      );
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = shortenUrlSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { url, customSlug } = parsed.data;

  let slug: string;
  if (customSlug) {
    const validationError = validateCustomSlug(customSlug);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    const { data: existing } = await supabase
      .from("short_urls")
      .select("id")
      .eq("slug", customSlug)
      .single();
    if (existing) {
      return NextResponse.json({ error: "This custom slug is already taken" }, { status: 409 });
    }
    slug = customSlug;
  } else {
    try {
      slug = await generateUniqueSlug(async (s) => {
        const { data } = await supabase.from("short_urls").select("id").eq("slug", s).single();
        return !!data;
      });
    } catch {
      return NextResponse.json({ error: "Could not generate a unique slug. Try again." }, { status: 500 });
    }
  }

  const { error: insertError } = await supabase.from("short_urls").insert({
    slug,
    original_url: url,
    user_id: user?.id ?? null,
  });

  if (insertError) {
    return NextResponse.json({ error: "Failed to create short URL" }, { status: 500 });
  }

  await setCachedUrl(slug, url, null);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const shortUrl = `${baseUrl}/s/${slug}`;

  let qrSvg = "";
  try {
    qrSvg = await QRCode.toString(shortUrl, { type: "svg", width: 200, margin: 1 });
  } catch {
    // QR generation failed silently
  }

  return NextResponse.json({
    shortUrl,
    slug,
    originalUrl: url,
    qrSvg,
  });
}
