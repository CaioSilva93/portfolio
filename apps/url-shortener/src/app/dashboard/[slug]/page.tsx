import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MousePointerClick, Globe, Smartphone } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `Analytics: ${slug} | Short` };
}

export default async function AnalyticsPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ period?: string }>;
}) {
  const { slug } = await params;
  const { period = "30" } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: urlData } = await supabase
    .from("short_urls")
    .select("id, slug, original_url, clicks_count, created_at")
    .eq("slug", slug)
    .eq("user_id", user.id)
    .single();

  if (!urlData) notFound();

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - Number(period));

  const { data: clicks } = await supabase
    .from("short_clicks")
    .select("clicked_at, country, device, browser")
    .eq("url_id", urlData.id)
    .gte("clicked_at", daysAgo.toISOString())
    .order("clicked_at", { ascending: true });

  const allClicks = clicks ?? [];

  const clicksByDayMap = new Map<string, number>();
  allClicks.forEach((c) => {
    const day = new Date(c.clicked_at).toISOString().split("T")[0]!;
    clicksByDayMap.set(day, (clicksByDayMap.get(day) ?? 0) + 1);
  });
  const clicksByDay = Array.from(clicksByDayMap, ([date, clicks]) => ({ date, clicks }));

  function aggregate(field: "country" | "device" | "browser") {
    const map = new Map<string, number>();
    allClicks.forEach((c) => {
      const key = c[field] || "Unknown";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map, ([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }

  const periods = [
    { label: "7d", value: "7" },
    { label: "30d", value: "30" },
    { label: "90d", value: "90" },
    { label: "All", value: "3650" },
  ];

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">
            <span className="font-[family-name:var(--font-mono)] text-[hsl(var(--primary))]">/s/{urlData.slug}</span>
          </h1>
          <p className="mt-1 truncate text-sm text-[hsl(var(--muted-foreground))]">
            {urlData.original_url}
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <CardContent className="flex items-center gap-4 pt-6">
              <MousePointerClick className="h-8 w-8 text-[hsl(var(--primary))]" />
              <div>
                <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{urlData.clicks_count}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Total clicks</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <CardContent className="flex items-center gap-4 pt-6">
              <Globe className="h-8 w-8 text-[hsl(var(--primary))]" />
              <div>
                <p className="text-2xl font-bold text-[hsl(var(--foreground))]">
                  {new Set(allClicks.map((c) => c.country).filter(Boolean)).size}
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Countries</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <CardContent className="flex items-center gap-4 pt-6">
              <Smartphone className="h-8 w-8 text-[hsl(var(--primary))]" />
              <div>
                <p className="text-2xl font-bold text-[hsl(var(--foreground))]">
                  {new Set(allClicks.map((c) => c.device).filter(Boolean)).size}
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Device types</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex gap-2">
          {periods.map((p) => (
            <Link
              key={p.value}
              href={`/dashboard/${slug}?period=${p.value}`}
              className="inline-block"
            >
              <Badge variant={period === p.value ? "default" : "secondary"}>
                {p.label}
              </Badge>
            </Link>
          ))}
        </div>

        <AnalyticsCharts
          clicksByDay={clicksByDay}
          clicksByCountry={aggregate("country")}
          clicksByDevice={aggregate("device")}
          clicksByBrowser={aggregate("browser")}
        />
      </div>
    </>
  );
}
