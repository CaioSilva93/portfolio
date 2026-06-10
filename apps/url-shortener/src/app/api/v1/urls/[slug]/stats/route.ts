import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const period = Number(searchParams.get("period") || "30");

  const supabase = createAdminClient();

  const { data: urlData } = await supabase
    .from("short_urls")
    .select("id, slug, original_url, clicks_count")
    .eq("slug", slug)
    .single();

  if (!urlData) {
    return NextResponse.json({ error: "URL not found" }, { status: 404 });
  }

  const since = new Date();
  since.setDate(since.getDate() - period);

  const { data: clicks } = await supabase
    .from("short_clicks")
    .select("clicked_at, country, device, browser")
    .eq("url_id", urlData.id)
    .gte("clicked_at", since.toISOString());

  const allClicks = clicks ?? [];

  function aggregate(field: "country" | "device" | "browser") {
    const map = new Map<string, number>();
    allClicks.forEach((c) => {
      const key = c[field] || "unknown";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Object.fromEntries(
      Array.from(map).sort((a, b) => b[1] - a[1])
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      slug: urlData.slug,
      originalUrl: urlData.original_url,
      totalClicks: urlData.clicks_count,
      period: `${period}d`,
      clicksInPeriod: allClicks.length,
      countries: aggregate("country"),
      devices: aggregate("device"),
      browsers: aggregate("browser"),
    },
  });
}
