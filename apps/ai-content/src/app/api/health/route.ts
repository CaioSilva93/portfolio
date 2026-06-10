import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const checks: Record<string, string> = {};

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("ai_generations")
      .select("id")
      .limit(1);
    checks.supabase = error ? `error: ${error.message}` : "ok";
  } catch {
    checks.supabase = "error: connection failed";
  }

  const healthy = checks.supabase === "ok";
  return NextResponse.json(
    { status: healthy ? "healthy" : "degraded", checks },
    { status: healthy ? 200 : 503 }
  );
}
