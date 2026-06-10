"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { formatRelativeTime } from "@/lib/utils";
import { Activity } from "lucide-react";
import { useRealtime } from "@/hooks/use-realtime";

interface ActivityItem {
  id: string;
  actor_name: string;
  action: string;
  created_at: string;
}

interface ActivityFeedProps {
  teamId: string;
}

const actionLabels: Record<string, string> = {
  signed_up: "signed up",
  upgraded_plan: "upgraded their plan",
  made_payment: "made a payment",
  contacted_support: "contacted support",
  cancelled_subscription: "cancelled subscription",
  renewed_subscription: "renewed subscription",
  invited_member: "invited a member",
};

export function ActivityFeed({ teamId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("dash_activity_log")
      .select("id, actor_name, action, created_at")
      .eq("team_id", teamId)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setActivities(data ?? []);
        setLoading(false);
      });
  }, [teamId]);

  useRealtime({
    teamId,
    tables: ["dash_activity_log"],
    onEvent: (event) => {
      if (event.eventType === "INSERT" && event.new) {
        const item = event.new as unknown as ActivityItem;
        setActivities((prev) => [item, ...prev].slice(0, 10));
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[280px] space-y-3 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet. Seed data to get started.</p>
          ) : (
            activities.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between gap-2 rounded-md border p-3 text-sm"
              >
                <div>
                  <span className="font-medium">{a.actor_name}</span>{" "}
                  <span className="text-muted-foreground">
                    {actionLabels[a.action] ?? a.action}
                  </span>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatRelativeTime(a.created_at)}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
