"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, Bug } from "lucide-react";

interface Issue {
  id: string;
  title: string;
  status: string;
  priority: string;
  issue_number: number;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

const STATUS_COLORS: Record<string, string> = {
  backlog: "bg-gray-500",
  todo: "bg-blue-500",
  in_progress: "bg-yellow-500",
  in_review: "bg-purple-500",
  done: "bg-green-500",
  cancelled: "bg-red-500",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const workspaceSlug = params.workspace as string;
  const projectId = params.id as string;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();

    const { data: proj } = await supabase
      .from("saas_projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (proj) setProject(proj);

    const { data: issueList } = await supabase
      .from("saas_issues")
      .select("*")
      .eq("project_id", projectId)
      .order("issue_number", { ascending: false });

    setIssues(issueList ?? []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/${workspaceSlug}/projects`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {project.emoji} {project.name}
          </h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
      </div>

      {issues.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bug className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">No issues yet</p>
            <p className="text-sm text-muted-foreground">
              Create an issue from the Issues page
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => router.push(`/${workspaceSlug}/issues/${issue.id}`)}
            >
              <div className={`h-2.5 w-2.5 rounded-full ${STATUS_COLORS[issue.status] ?? "bg-gray-400"}`} />
              <span className="text-xs text-muted-foreground font-mono">
                {project.emoji}-{issue.issue_number}
              </span>
              <span className="flex-1 font-medium truncate">{issue.title}</span>
              <span className="text-xs text-muted-foreground capitalize">
                {issue.priority !== "none" ? issue.priority : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
