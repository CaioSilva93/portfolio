"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { createColumnSchema } from "@/lib/validators";

interface AddColumnFormProps {
  boardId: string;
  position: number;
}

export function AddColumnForm({ boardId, position }: AddColumnFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const parsed = createColumnSchema.safeParse({ title: title.trim(), position });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("collab_columns")
        .insert({ board_id: boardId, title: parsed.data.title, position: parsed.data.position });

      if (error) throw error;

      setTitle("");
      setIsAdding(false);

      // Activity logging is non-critical — fire and forget
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          void supabase.from("collab_activity_log").insert({
            board_id: boardId,
            user_id: user.id,
            action: "column_created",
            entity_type: "column",
            metadata: { title: parsed.data.title },
          });
        }
      }, () => {});
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create column");
    } finally {
      setLoading(false);
    }
  }

  if (!isAdding) {
    return (
      <Button
        variant="outline"
        className="h-full min-h-[200px] min-w-[280px] border-dashed"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Column
      </Button>
    );
  }

  return (
    <div className="min-w-[280px] rounded-lg border bg-card p-3">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          placeholder="Column title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          maxLength={50}
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={loading || !title.trim()}>
            Add
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => { setIsAdding(false); setTitle(""); }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
