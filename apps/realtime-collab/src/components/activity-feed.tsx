"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRealtime } from "@/hooks/use-realtime";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRelativeTime } from "@/lib/utils";
import { Activity } from "lucide-react";

interface ActivityItem {
  id: string;
  action: string;
  entity_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
  user_id: string;
}

interface ActivityFeedProps {
  boardId: string;
}

function formatAction(item: ActivityItem): string {
  const meta = item.metadata as { title?: string; from_column?: string; to_column?: string };
  switch (item.action) {
    case "card_created":
      return `created card "${meta.title || "Untitled"}"`;
    case "card_moved":
      return `moved card "${meta.title || ""}" to ${meta.to_column || "another column"}`;
    case "card_updated":
      return `updated card "${meta.title || ""}"`;
    case "card_deleted":
      return `deleted a card`;
    case "column_created":
      return `created column "${meta.title || ""}"`;
    case "column_deleted":
      return `deleted a column`;
    default:
      return item.action.replace(/_/g, " ");
  }
}

export function ActivityFeed({ boardId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("collab_activity_log")
      .select("*")
      .eq("board_id", boardId)
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => {
        if (data) setActivities(data as ActivityItem[]);
      });
  }, [boardId]);

  const handleRealtimeEvent = useCallback((event: { table: string; eventType: string; new: Record<string, unknown> }) => {
    if (event.table === "collab_activity_log" && event.eventType === "INSERT") {
      const newItem = event.new as unknown as ActivityItem;
      setActivities((prev) => [newItem, ...prev].slice(0, 30));
    }
  }, []);

  useRealtime({
    boardId,
    tables: ["collab_activity_log"],
    onEvent: handleRealtimeEvent,
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Activity</h3>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-3 py-3">
          {activities.length === 0 && (
            <p className="text-xs text-muted-foreground">No activity yet</p>
          )}
          {activities.map((item) => (
            <div key={item.id} className="text-xs">
              <p className="text-foreground">{formatAction(item)}</p>
              <p className="text-muted-foreground">{formatRelativeTime(item.created_at)}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
