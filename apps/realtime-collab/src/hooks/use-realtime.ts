"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type TableName = "collab_columns" | "collab_cards" | "collab_activity_log";

interface RealtimeEvent {
  table: TableName;
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: Record<string, unknown>;
  old: Record<string, unknown>;
}

interface UseRealtimeOptions {
  boardId: string;
  tables?: TableName[];
  enabled?: boolean;
  onEvent?: (event: RealtimeEvent) => void;
}

const DEFAULT_TABLES: TableName[] = ["collab_columns", "collab_cards", "collab_activity_log"];

export function useRealtime({ boardId, tables, enabled = true, onEvent }: UseRealtimeOptions) {
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  });

  useEffect(() => {
    if (!enabled || !boardId) return;

    const supabase = createClient();
    const channelName = `board:${boardId}:${crypto.randomUUID()}`;
    const channel = supabase.channel(channelName);
    const subscribedTables = tables ?? DEFAULT_TABLES;

    for (const table of subscribedTables) {
      channel.on(
        "postgres_changes" as const,
        {
          event: "*",
          schema: "public",
          table,
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => {
          const event: RealtimeEvent = {
            table,
            eventType: payload.eventType as RealtimeEvent["eventType"],
            new: (payload.new as Record<string, unknown>) ?? {},
            old: (payload.old as Record<string, unknown>) ?? {},
          };
          setLastEvent(event);
          onEventRef.current?.(event);
        }
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId, enabled, tables]);

  return { lastEvent };
}
