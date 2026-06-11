import { createAdminClient } from "@/lib/supabase/admin";

interface ActivityPayload {
  workspaceId: string;
  issueId?: string;
  actorId: string;
  action: string;
  metadata?: Record<string, unknown>;
}

export async function logActivity(payload: ActivityPayload) {
  const supabase = createAdminClient();

  await supabase.from("saas_activities").insert({
    workspace_id: payload.workspaceId,
    issue_id: payload.issueId ?? null,
    actor_id: payload.actorId,
    action: payload.action,
    metadata: payload.metadata ?? {},
  });
}
