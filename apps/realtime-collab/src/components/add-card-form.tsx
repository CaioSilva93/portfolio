"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { createCardSchema } from "@/lib/validators";

interface AddCardFormProps {
  boardId: string;
  columnId: string;
  position: number;
}

export function AddCardForm({ boardId, columnId, position }: AddCardFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const parsed = createCardSchema.safeParse({
      title: title.trim(),
      column_id: columnId,
      position,
    });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("collab_cards")
        .insert({
          board_id: boardId,
          column_id: parsed.data.column_id,
          title: parsed.data.title,
          position: parsed.data.position,
        });

      if (error) throw error;

      setTitle("");
      setIsAdding(false);

      // Activity logging is non-critical — fire and forget
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          void supabase.from("collab_activity_log").insert({
            board_id: boardId,
            user_id: user.id,
            action: "card_created",
            entity_type: "card",
            metadata: { title: parsed.data.title },
          });
        }
      }, () => {});
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create card");
    } finally {
      setLoading(false);
    }
  }

  if (!isAdding) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="mr-1 h-3 w-3" />
        Add card
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-1">
      <Input
        placeholder="Card title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        maxLength={200}
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
  );
}
