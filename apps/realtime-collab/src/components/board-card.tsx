"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface BoardCardProps {
  id: string;
  title: string;
  description: string;
  role: string;
  memberCount: number;
  updatedAt: string;
}

export function BoardCard({ id, title, description, role, memberCount, updatedAt }: BoardCardProps) {
  return (
    <Link href={`/boards/${id}`}>
      <Card className="transition-colors hover:border-primary/50 hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant={role === "owner" ? "default" : "secondary"} className="text-xs">
              {role}
            </Badge>
          </div>
          {description && (
            <CardDescription className="line-clamp-2">{description}</CardDescription>
          )}
          <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {memberCount}
            </span>
            <span>Updated {formatRelativeTime(updatedAt)}</span>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
