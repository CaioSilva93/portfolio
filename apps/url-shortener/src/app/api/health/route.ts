import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const checks: Record<string, string> = {};

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("short_urls").select("id").limit(1);
    checks.supabase = error ? `error: ${error.message}` : "ok";
  } catch {
    checks.supabase = "unreachable";
  }

  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) {
      const res = await fetch(`${url}/ping`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      checks.redis = res.ok ? "ok" : "error";
    } else {
      checks.redis = "not configured";
    }
  } catch {
    checks.redis = "unreachable";
  }

  const healthy = checks.supabase === "ok";

  return NextResponse.json(
    { status: healthy ? "healthy" : "degraded", checks },
    { status: healthy ? 200 : 503 }
  );
}
