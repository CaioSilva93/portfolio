"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface PresenceUser {
  user_id: string;
  email: string;
  online_at: string;
}

interface UsePresenceOptions {
  boardId: string;
  userId: string;
  email: string;
  enabled?: boolean;
}

export function usePresence({ boardId, userId, email, enabled = true }: UsePresenceOptions) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  useEffect(() => {
    if (!enabled || !boardId || !userId) return;

    const supabase = createClient();
    const channel = supabase.channel(`presence:${boardId}`);
    channelRef.current = channel;

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<PresenceUser>();
        const users: PresenceUser[] = [];
        const seen = new Set<string>();
        for (const key of Object.keys(state)) {
          const presences = state[key];
          if (presences && presences.length > 0) {
            const p = presences[0] as PresenceUser;
            if (!seen.has(p.user_id)) {
              seen.add(p.user_id);
              users.push(p);
            }
          }
        }
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: userId,
            email,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [boardId, userId, email, enabled]);

  return { onlineUsers };
}
