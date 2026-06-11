"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  emoji: string;
}

export default function NewIssuePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspace as string;

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("backlog");
  const [priority, setPriority] = useState("none");
  const [creating, setCreating] = useState(false);
  const [workspaceId, setWorkspaceId] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const supabase = createClient();
    const { data: ws } = await supabase
      .from("saas_workspaces")
      .select("id")
      .eq("slug", workspaceSlug)
      .single();

    if (!ws) return;
    setWorkspaceId(ws.id);

    const { data } = await supabase
      .from("saas_projects")
      .select("id, name, emoji")
      .eq("workspace_id", ws.id)
      .order("name");

    setProjects(data ?? []);
    if (data && data.length > 0 && data[0]) {
      setProjectId(data[0].id);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId) {
      toast.error("Please select a project");
      return;
    }

    setCreating(true);
    const res = await fetch("/api/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: projectId,
        workspace_id: workspaceId,
        title,
        description,
        status,
        priority,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error || "Failed to create issue");
      setCreating(false);
      return;
    }

    const { id } = await res.json();
    toast.success("Issue created");
    router.push(`/${workspaceSlug}/issues/${id}`);
  }

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/${workspaceSlug}/issues`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">New Issue</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You need at least one project to create an issue.</p>
                <Button
                  className="mt-4"
                  onClick={() => router.push(`/${workspaceSlug}/projects`)}
                >
                  Create a Project
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <select
                    id="project"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    required
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.emoji} {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Add more context (supports markdown)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">Todo</option>
                      <option value="in_progress">In Progress</option>
                      <option value="in_review">In Review</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="none">None</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={creating}>
                    {creating && <Loader2 className="animate-spin" />}
                    Create Issue
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/${workspaceSlug}/issues`)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
