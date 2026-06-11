"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  body: string;
  author_id: string;
  created_at: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  issue_number: number;
  creator_id: string;
  assignee_id: string | null;
  created_at: string;
  updated_at: string;
  saas_projects: { name: string; emoji: string } | null;
  saas_comments: Comment[];
}

const STATUS_OPTIONS = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Cancelled" },
];

const PRIORITY_OPTIONS = [
  { value: "none", label: "None" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspace as string;
  const issueId = params.id as string;

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    loadIssue();
  }, []);

  async function loadIssue() {
    const res = await fetch(`/api/issues/${issueId}`);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    setIssue(data);
    setLoading(false);
  }

  async function handleStatusChange(newStatus: string) {
    const res = await fetch(`/api/issues/${issueId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setIssue((prev) => prev ? { ...prev, status: newStatus } : prev);
      toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
    }
  }

  async function handlePriorityChange(newPriority: string) {
    const res = await fetch(`/api/issues/${issueId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: newPriority }),
    });

    if (res.ok) {
      setIssue((prev) => prev ? { ...prev, priority: newPriority } : prev);
      toast.success("Priority updated");
    }
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setSubmittingComment(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issue_id: issueId, body: commentBody }),
    });

    if (!res.ok) {
      toast.error("Failed to add comment");
      setSubmittingComment(false);
      return;
    }

    const newComment = await res.json();
    setIssue((prev) =>
      prev ? { ...prev, saas_comments: [...prev.saas_comments, newComment] } : prev
    );
    setCommentBody("");
    setSubmittingComment(false);
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Issue not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/${workspaceSlug}/issues`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground font-mono">
            {issue.saas_projects?.emoji ?? "📋"}-{issue.issue_number}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{issue.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Created {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
              </p>
            </div>

            {issue.description && (
              <Card>
                <CardContent className="pt-6 prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {issue.description}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                Comments ({issue.saas_comments?.length ?? 0})
              </h2>

              {issue.saas_comments?.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-mono">
                        {comment.author_id.slice(0, 8)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {comment.body}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input
                  placeholder="Add a comment (supports markdown)"
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={submittingComment || !commentBody.trim()}>
                  {submittingComment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={issue.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={issue.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                >
                  {PRIORITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {issue.saas_projects?.emoji} {issue.saas_projects?.name}
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
