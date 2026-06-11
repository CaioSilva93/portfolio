"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  action: string;
  metadata: Record<string, unknown>;
  actor_id: string;
  created_at: string;
}

const ACTION_LABELS: Record<string, string> = {
  issue_created: "created an issue",
  issue_updated: "updated an issue",
  comment_added: "added a comment",
  project_created: "created a project",
};

export default function ActivityPage() {
  const params = useParams();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const workspaceSlug = params.workspace as string;

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    const supabase = createClient();
    const { data: ws } = await supabase
      .from("saas_workspaces")
      .select("id")
      .eq("slug", workspaceSlug)
      .single();

    if (!ws) return;

    const { data } = await supabase
      .from("saas_activities")
      .select("*")
      .eq("workspace_id", ws.id)
      .order("created_at", { ascending: false })
      .limit(50);

    setActivities(data ?? []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
        <p className="text-muted-foreground">Recent activity in your workspace</p>
      </div>

      {activities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">No activity yet</p>
            <p className="text-sm text-muted-foreground">
              Activity will appear here as your team works
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-lg border p-3"
            >
              <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-mono text-xs text-muted-foreground">
                    {activity.actor_id.slice(0, 8)}
                  </span>{" "}
                  <span>{ACTION_LABELS[activity.action] ?? activity.action}</span>
                  {activity.metadata && !!(activity.metadata as Record<string, unknown>).title && (
                    <span className="font-medium">
                      {" "}&quot;{String((activity.metadata as Record<string, unknown>).title)}&quot;
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
