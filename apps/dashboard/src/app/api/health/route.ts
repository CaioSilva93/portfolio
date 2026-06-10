import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("dash_teams").select("id").limit(1);

    if (error) {
      return NextResponse.json(
        { status: "unhealthy", error: error.message },
        { status: 503 }
      );
    }

    return NextResponse.json({ status: "healthy", timestamp: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { status: "unhealthy", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 503 }
    );
  }
}
