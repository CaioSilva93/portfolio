import { resolveWorkspaceSlug } from "@/lib/ensure-workspace";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Bug, FolderKanban, Users, Activity, CheckCircle, Clock } from "lucide-react";

export default async function WorkspaceDashboard({
  params,
}: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace: slug } = await params;
  const workspace = await resolveWorkspaceSlug(slug);
  if (!workspace) notFound();

  const supabase = await createClient();

  const [issuesRes, projectsRes, membersRes, recentRes, doneRes] = await Promise.all([
    supabase
      .from("saas_issues")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .not("status", "in", '("done","cancelled")'),
    supabase
      .from("saas_projects")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id),
    supabase
      .from("saas_members")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id),
    supabase
      .from("saas_activities")
      .select("action, created_at, metadata")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("saas_issues")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .eq("status", "done"),
  ]);

  const openIssues = issuesRes.count ?? 0;
  const totalProjects = projectsRes.count ?? 0;
  const totalMembers = membersRes.count ?? 0;
  const doneIssues = doneRes.count ?? 0;
  const recentActivities = recentRes.data ?? [];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{workspace.name}</h1>
        <p className="text-muted-foreground">
          Workspace overview and recent activity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bug className="h-4 w-4" />
            Open Issues
          </div>
          <p className="mt-2 text-3xl font-bold">{openIssues}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4" />
            Completed
          </div>
          <p className="mt-2 text-3xl font-bold">{doneIssues}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FolderKanban className="h-4 w-4" />
            Projects
          </div>
          <p className="mt-2 text-3xl font-bold">{totalProjects}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            Members
          </div>
          <p className="mt-2 text-3xl font-bold">{totalMembers}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        {recentActivities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-center gap-3">
                <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm">
                  {activity.action.replace(/_/g, " ")}
                  {(activity.metadata as Record<string, unknown>)?.title && (
                    <span className="font-medium">
                      {" "}&quot;{String((activity.metadata as Record<string, unknown>).title)}&quot;
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
