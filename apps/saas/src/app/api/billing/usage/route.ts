import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkLimit } from "@/lib/plan-limits";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspace_id");

  if (!workspaceId) {
    return NextResponse.json({ error: "workspace_id required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [members, issues, projects, storage] = await Promise.all([
    checkLimit(workspaceId, "members"),
    checkLimit(workspaceId, "issues"),
    checkLimit(workspaceId, "projects"),
    checkLimit(workspaceId, "storage"),
  ]);

  return NextResponse.json({ members, issues, projects, storage });
}
