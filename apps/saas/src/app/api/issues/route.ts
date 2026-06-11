import { NextResponse } from "next/server";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import { z } from "zod";

const createIssueSchema = z.object({
  project_id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(10000).optional(),
  status: z.enum(["backlog", "todo", "in_progress", "in_review", "done", "cancelled"]).optional(),
  priority: z.enum(["urgent", "high", "medium", "low", "none"]).optional(),
  assignee_id: z.string().uuid().nullable().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspace_id");
  const projectId = searchParams.get("project_id");
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const search = searchParams.get("search");

  if (!workspaceId) {
    return NextResponse.json({ error: "workspace_id required" }, { status: 400 });
  }

  const supabase = await createClient();
  let query = supabase
    .from("saas_issues")
    .select("*, saas_projects(name, emoji)")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (projectId) query = query.eq("project_id", projectId);
  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (search) query = query.ilike("title", `%${search}%`);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createIssueSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.rpc("saas_create_issue", {
    p_project_id: parsed.data.project_id,
    p_workspace_id: parsed.data.workspace_id,
    p_title: parsed.data.title,
    p_description: parsed.data.description ?? "",
    p_status: parsed.data.status ?? "backlog",
    p_priority: parsed.data.priority ?? "none",
    p_assignee_id: parsed.data.assignee_id ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const actorId = user.id;
  const workspaceId = parsed.data.workspace_id;
  after(async () => {
    try {
      await logActivity({
        workspaceId,
        issueId: data,
        actorId,
        action: "issue_created",
        metadata: { title: parsed.data.title },
      });
    } catch (err) {
      console.error("Activity logging failed:", err);
    }
  });

  return NextResponse.json({ id: data }, { status: 201 });
}
