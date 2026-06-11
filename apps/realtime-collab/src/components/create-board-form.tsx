"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { createBoardSchema } from "@/lib/validators";

export function CreateBoardForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const parsed = createBoardSchema.safeParse({ title: title.trim(), description: description.trim() });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // Atomic RPC: creates board + owner membership + default columns in one transaction
      const { data: boardId, error: rpcError } = await supabase.rpc("collab_create_board", {
        p_title: parsed.data.title,
        p_description: parsed.data.description,
      });

      if (rpcError) throw rpcError;

      toast.success("Board created!");
      router.push(`/boards/${boardId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create board");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create a new board</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Board title</Label>
            <Input
              id="title"
              placeholder="My Project Board"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="A brief description of this board"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading || !title.trim()}>
            {loading && <Loader2 className="animate-spin" />}
            Create Board
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
