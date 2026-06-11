import { NextResponse } from "next/server";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import { z } from "zod";

const createCommentSchema = z.object({
  issue_id: z.string().uuid(),
  body: z.string().min(1).max(10000),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createCommentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("saas_comments")
    .insert({
      issue_id: parsed.data.issue_id,
      author_id: user.id,
      body: parsed.data.body,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const actorId = user.id;
  const { data: issue } = await supabase
    .from("saas_issues")
    .select("workspace_id")
    .eq("id", parsed.data.issue_id)
    .single();

  if (issue) {
    after(async () => {
      try {
        await logActivity({
          workspaceId: issue.workspace_id,
          issueId: parsed.data.issue_id,
          actorId,
          action: "comment_added",
          metadata: { comment_id: data.id },
        });
      } catch (err) {
        console.error("Activity logging failed:", err);
      }
    });
  }

  return NextResponse.json(data, { status: 201 });
}
