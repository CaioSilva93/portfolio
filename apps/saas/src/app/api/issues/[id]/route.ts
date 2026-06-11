import { NextResponse } from "next/server";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import { z } from "zod";

const updateIssueSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(10000).optional(),
  status: z.enum(["backlog", "todo", "in_progress", "in_review", "done", "cancelled"]).optional(),
  priority: z.enum(["urgent", "high", "medium", "low", "none"]).optional(),
  assignee_id: z.string().uuid().nullable().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("saas_issues")
    .select("*, saas_projects(name, emoji), saas_comments(*, author:author_id(id, email:raw_user_meta_data->email)), saas_issue_labels(label_id, saas_labels(*))")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateIssueSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from("saas_issues")
    .select("workspace_id, status, priority, assignee_id")
    .eq("id", id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("saas_issues")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const actorId = user.id;
  const workspaceId = existing.workspace_id;
  after(async () => {
    try {
      const changes: Record<string, unknown> = {};
      if (parsed.data.status && parsed.data.status !== existing.status) {
        changes.status = { from: existing.status, to: parsed.data.status };
      }
      if (parsed.data.priority && parsed.data.priority !== existing.priority) {
        changes.priority = { from: existing.priority, to: parsed.data.priority };
      }
      if (parsed.data.assignee_id !== undefined && parsed.data.assignee_id !== existing.assignee_id) {
        changes.assignee = { from: existing.assignee_id, to: parsed.data.assignee_id };
      }

      if (Object.keys(changes).length > 0) {
        await logActivity({
          workspaceId,
          issueId: id,
          actorId,
          action: "issue_updated",
          metadata: changes,
        });
      }
    } catch (err) {
      console.error("Activity logging failed:", err);
    }
  });

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("saas_issues")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
