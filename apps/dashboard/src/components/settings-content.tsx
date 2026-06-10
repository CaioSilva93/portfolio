"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Settings, Users } from "lucide-react";

interface Team {
  id: string;
  name: string;
  created_at: string;
}

interface Member {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

interface SettingsContentProps {
  team: Team | null;
  members: Member[];
}

export function SettingsContent({ team, members }: SettingsContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your team and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4" />
            Team Information
          </CardTitle>
          <CardDescription>Details about your current team.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-1">
            <span className="text-sm text-muted-foreground">Team Name</span>
            <span className="font-medium">{team?.name ?? "Unknown"}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-sm text-muted-foreground">Team ID</span>
            <code className="font-mono text-xs text-muted-foreground">{team?.id}</code>
          </div>
          <div className="grid gap-1">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="text-sm">
              {team?.created_at ? new Date(team.created_at).toLocaleDateString() : "—"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Team Members
          </CardTitle>
          <CardDescription>{members.length} member{members.length !== 1 && "s"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-mono text-xs">
                    {member.user_id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(member.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
