import { NextResponse } from "next/server";
import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCachedUrl, setCachedUrl, deleteCachedUrl } from "@/lib/redis";
import { parseUserAgent } from "@/lib/user-agent";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const headers = Object.fromEntries(request.headers.entries());
  const userAgent = headers["user-agent"] ?? null;
  const country = headers["x-vercel-ip-country"] ?? null;
  const city = headers["x-vercel-ip-city"] ?? null;
  const referrer = headers["referer"] ?? null;

  let targetUrl: string | null = null;
  let urlId: string | null = null;

  const cached = await getCachedUrl(slug);
  if (cached) {
    if (cached.expiresAt && new Date(cached.expiresAt) < new Date()) {
      await deleteCachedUrl(slug);
      return NextResponse.json({ error: "This link has expired" }, { status: 410 });
    }
    targetUrl = cached.url;
  }

  const supabase = createAdminClient();

  if (!targetUrl) {
    const { data } = await supabase
      .from("short_urls")
      .select("id, original_url, expires_at")
      .eq("slug", slug)
      .single();

    if (!data) {
      return new NextResponse(null, { status: 404 });
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ error: "This link has expired" }, { status: 410 });
    }

    targetUrl = data.original_url;
    urlId = data.id;
    await setCachedUrl(slug, data.original_url, data.expires_at);
  }

  if (!urlId) {
    const { data } = await supabase
      .from("short_urls")
      .select("id")
      .eq("slug", slug)
      .single();
    urlId = data?.id ?? null;
  }

  after(async () => {
    try {
      if (!urlId) return;
      const admin = createAdminClient();
      const { device, browser, os } = parseUserAgent(userAgent);

      await admin.from("short_clicks").insert({
        url_id: urlId,
        country,
        city: city ? decodeURIComponent(city) : null,
        device,
        browser,
        os,
        referrer,
      });

      await admin.rpc("increment_click_count", { url_slug: slug });
    } catch {
      // Analytics failure should never surface to user
    }
  });

  return NextResponse.redirect(targetUrl!, 302);
}
