"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PresenceAvatarsProps {
  users: { user_id: string; email: string }[];
  currentUserId: string;
}

const COLORS = [
  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500",
  "bg-pink-500", "bg-yellow-500", "bg-red-500", "bg-indigo-500",
];

function getColor(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash + userId.charCodeAt(i)) | 0;
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function PresenceAvatars({ users, currentUserId }: PresenceAvatarsProps) {
  const otherUsers = users.filter((u) => u.user_id !== currentUserId);

  if (otherUsers.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="flex items-center -space-x-2">
        {otherUsers.slice(0, 5).map((user) => (
          <Tooltip key={user.user_id}>
            <TooltipTrigger asChild>
              <Avatar className="h-7 w-7 border-2 border-background">
                <AvatarFallback className={`${getColor(user.user_id)} text-[10px] text-white`}>
                  {user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.email}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {otherUsers.length > 5 && (
          <Avatar className="h-7 w-7 border-2 border-background">
            <AvatarFallback className="bg-muted text-[10px]">
              +{otherUsers.length - 5}
            </AvatarFallback>
          </Avatar>
        )}
        <span className="ml-3 text-xs text-muted-foreground">
          {otherUsers.length} online
        </span>
      </div>
    </TooltipProvider>
  );
}
