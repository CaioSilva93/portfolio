import { createClient } from "@/lib/supabase/server";
import { getPlanCache, setPlanCache } from "@/lib/redis";

const PLAN_LIMITS = {
  free: { members: 3, issues: 50, storage: 0, projects: 2 },
  pro: { members: 10, issues: Infinity, storage: 100_000_000, projects: Infinity },
  business: { members: Infinity, issues: Infinity, storage: 1_000_000_000, projects: Infinity },
} as const;

type PlanKey = keyof typeof PLAN_LIMITS;
type Resource = keyof (typeof PLAN_LIMITS)[PlanKey];

async function getWorkspacePlan(workspaceId: string): Promise<PlanKey> {
  const cached = await getPlanCache(workspaceId);
  if (cached && cached in PLAN_LIMITS) return cached as PlanKey;

  const supabase = await createClient();
  const { data } = await supabase
    .from("saas_subscriptions")
    .select("plan")
    .eq("workspace_id", workspaceId)
    .eq("status", "active")
    .single();

  const plan = (data?.plan as PlanKey) ?? "free";
  await setPlanCache(workspaceId, plan);
  return plan;
}

export async function checkLimit(
  workspaceId: string,
  resource: Resource
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const plan = await getWorkspacePlan(workspaceId);
  const limit = PLAN_LIMITS[plan][resource];

  const supabase = await createClient();
  let current = 0;

  switch (resource) {
    case "members": {
      const { count } = await supabase
        .from("saas_members")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId);
      current = count ?? 0;
      break;
    }
    case "issues": {
      const { count } = await supabase
        .from("saas_issues")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId);
      current = count ?? 0;
      break;
    }
    case "projects": {
      const { count } = await supabase
        .from("saas_projects")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId);
      current = count ?? 0;
      break;
    }
    case "storage": {
      const { data } = await supabase
        .from("saas_attachments")
        .select("file_size")
        .eq(
          "issue_id",
          supabase
            .from("saas_issues")
            .select("id")
            .eq("workspace_id", workspaceId)
        );
      current = data?.reduce((sum, a) => sum + (a.file_size ?? 0), 0) ?? 0;
      break;
    }
  }

  return { allowed: current < limit, current, limit };
}

export function getPlanLimits(plan: PlanKey) {
  return PLAN_LIMITS[plan];
}
