"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const params = useParams();
  const workspaceSlug = params.workspace as string;

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage workspace preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Workspace Settings
          </CardTitle>
          <CardDescription>
            Configure your workspace. Billing and advanced settings will be available in a future update.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Workspace slug: <code className="rounded bg-muted px-1.5 py-0.5">{workspaceSlug}</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
