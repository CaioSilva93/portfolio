import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ratelimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin !== process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (ratelimit) {
    const { success } = await ratelimit.limit(`seed:${user.id}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
  }

  const admin = createAdminClient();

  const { data: admins } = await admin
    .from("shop_profiles")
    .select("user_id")
    .eq("role", "admin")
    .limit(1);

  if (!admins || admins.length === 0) {
    await admin
      .from("shop_profiles")
      .upsert(
        { user_id: user.id, role: "admin" },
        { onConflict: "user_id" }
      );
  } else {
    const { data: callerProfile } = await admin
      .from("shop_profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!callerProfile || callerProfile.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }
  }

  const { error: seedError } = await admin.rpc("shop_reset_seed_data");

  if (seedError) {
    return NextResponse.json(
      { error: seedError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
