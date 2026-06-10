import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ratelimit } from "@/lib/rate-limit";
import { seedSchema } from "@/lib/validators";
import { invalidateCache } from "@/lib/redis";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && origin && origin !== appUrl) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (ratelimit) {
    const { success } = await ratelimit.limit(`seed:${user.id}`);
    if (!success) {
      return NextResponse.json({ error: "Rate limited. Try again in 30 seconds." }, { status: 429 });
    }
  }

  const body = await request.json();
  const parsed = seedSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: membership } = await admin
    .from("dash_team_members")
    .select("role")
    .eq("team_id", parsed.data.teamId)
    .eq("user_id", user.id)
    .single();

  if (membership?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { data, error } = await supabase.rpc("seed_team_data", {
    p_team_id: parsed.data.teamId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await invalidateCache(`dash:*:${parsed.data.teamId}`);

  return NextResponse.json({ success: true, counts: data });
}
