"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Bug, Search, Loader2 } from "lucide-react";

interface Issue {
  id: string;
  title: string;
  status: string;
  priority: string;
  issue_number: number;
  created_at: string;
  saas_projects: { name: string; emoji: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  backlog: "bg-gray-500",
  todo: "bg-blue-500",
  in_progress: "bg-yellow-500",
  in_review: "bg-purple-500",
  done: "bg-green-500",
  cancelled: "bg-red-500",
};

const STATUS_LABELS: Record<string, string> = {
  backlog: "Backlog",
  todo: "Todo",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
  cancelled: "Cancelled",
};

const PRIORITY_LABELS: Record<string, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
  none: "",
};

export default function IssuesPage() {
  const params = useParams();
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  const workspaceSlug = params.workspace as string;

  useEffect(() => {
    loadIssues();
  }, [statusFilter, priorityFilter]);

  async function loadIssues() {
    setLoading(true);
    const supabase = createClient();
    const { data: ws } = await supabase
      .from("saas_workspaces")
      .select("id")
      .eq("slug", workspaceSlug)
      .single();

    if (!ws) return;

    let query = supabase
      .from("saas_issues")
      .select("*, saas_projects(name, emoji)")
      .eq("workspace_id", ws.id)
      .order("created_at", { ascending: false });

    if (statusFilter) query = query.eq("status", statusFilter);
    if (priorityFilter) query = query.eq("priority", priorityFilter);
    if (search) query = query.ilike("title", `%${search}%`);

    const { data } = await query;
    setIssues(data ?? []);
    setLoading(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadIssues();
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
          <p className="text-muted-foreground">Track and manage issues across projects</p>
        </div>
        <Button onClick={() => router.push(`/${workspaceSlug}/issues/new`)}>
          <Plus className="h-4 w-4" />
          New Issue
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : issues.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bug className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">No issues found</p>
            <p className="text-sm text-muted-foreground">
              {search || statusFilter || priorityFilter
                ? "Try adjusting your filters"
                : "Create your first issue to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-1">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => router.push(`/${workspaceSlug}/issues/${issue.id}`)}
            >
              <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${STATUS_COLORS[issue.status] ?? "bg-gray-400"}`} />
              <span className="text-xs text-muted-foreground font-mono shrink-0">
                {issue.saas_projects?.emoji ?? "📋"}-{issue.issue_number}
              </span>
              <span className="flex-1 font-medium truncate">{issue.title}</span>
              {issue.priority !== "none" && (
                <span className="text-xs rounded-full bg-secondary px-2 py-0.5 text-muted-foreground capitalize shrink-0">
                  {PRIORITY_LABELS[issue.priority]}
                </span>
              )}
              <span className="text-xs text-muted-foreground capitalize shrink-0">
                {STATUS_LABELS[issue.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
