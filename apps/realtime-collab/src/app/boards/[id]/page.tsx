import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { KanbanBoard } from "@/components/kanban-board";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BoardPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Check membership
  const { data: membership } = await supabase
    .from("collab_board_members")
    .select("role")
    .eq("board_id", id)
    .eq("user_id", user.id)
    .single();

  if (!membership) notFound();

  // Fetch board
  const { data: board } = await supabase
    .from("collab_boards")
    .select("*")
    .eq("id", id)
    .single();

  if (!board) notFound();

  // Fetch columns
  const { data: columns } = await supabase
    .from("collab_columns")
    .select("*")
    .eq("board_id", id)
    .order("position", { ascending: true });

  // Fetch cards
  const { data: cards } = await supabase
    .from("collab_cards")
    .select("*")
    .eq("board_id", id)
    .order("position", { ascending: true });

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex items-center gap-3 border-b px-4 py-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/boards">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold">{board.title}</h1>
          {board.description && (
            <p className="text-xs text-muted-foreground">{board.description}</p>
          )}
        </div>
      </div>
      <KanbanBoard
        boardId={id}
        userId={user.id}
        email={user.email ?? ""}
        initialColumns={columns ?? []}
        initialCards={cards ?? []}
      />
    </div>
  );
}
