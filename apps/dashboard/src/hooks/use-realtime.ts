"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type TableName = "dash_customers" | "dash_revenue_events" | "dash_activity_log";

const DEFAULT_TABLES: TableName[] = [
  "dash_customers",
  "dash_revenue_events",
  "dash_activity_log",
];

interface RealtimeEvent {
  table: TableName;
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: Record<string, unknown>;
  old: Record<string, unknown>;
}

interface UseRealtimeOptions {
  teamId: string;
  tables?: TableName[];
  paused?: boolean;
  onEvent?: (event: RealtimeEvent) => void;
}

export function useRealtime({
  teamId,
  tables,
  paused = false,
  onEvent,
}: UseRealtimeOptions) {
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const stableTables = useMemo(
    () => tables ?? DEFAULT_TABLES,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tables?.join(",")]
  );

  useEffect(() => {
    if (paused || !teamId) return;

    let cancelled = false;
    const supabase = createClient();
    const channelName = `dashboard:${teamId}:${crypto.randomUUID()}`;
    const channel = supabase.channel(channelName);

    for (const table of stableTables) {
      channel.on(
        "postgres_changes" as const,
        {
          event: "*",
          schema: "public",
          table,
          filter: `team_id=eq.${teamId}`,
        },
        (payload) => {
          if (cancelled) return;
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
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [teamId, stableTables, paused]);

  return { lastEvent };
}
