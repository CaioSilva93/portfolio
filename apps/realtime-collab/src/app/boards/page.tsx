import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BoardCard } from "@/components/board-card";
import { CreateBoardForm } from "@/components/create-board-form";
import { Kanban } from "lucide-react";

export default async function BoardsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: memberships } = await supabase
    .from("collab_board_members")
    .select("board_id, role, collab_boards(id, title, description, updated_at)")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  const boards = (memberships ?? []).map((m) => {
    const board = m.collab_boards as unknown as {
      id: string;
      title: string;
      description: string;
      updated_at: string;
    };
    return {
      id: board.id,
      title: board.title,
      description: board.description,
      role: m.role,
      updatedAt: board.updated_at,
    };
  });

  // Get member counts
  const boardIds = boards.map((b) => b.id);
  const { data: memberCounts } = await supabase
    .from("collab_board_members")
    .select("board_id")
    .in("board_id", boardIds.length > 0 ? boardIds : ["none"]);

  const countMap: Record<string, number> = {};
  (memberCounts ?? []).forEach((m) => {
    countMap[m.board_id] = (countMap[m.board_id] || 0) + 1;
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <Kanban className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">My Boards</h1>
      </div>

      {boards.length > 0 ? (
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              id={board.id}
              title={board.title}
              description={board.description}
              role={board.role}
              memberCount={countMap[board.id] || 1}
              updatedAt={board.updatedAt}
            />
          ))}
        </div>
      ) : (
        <p className="mb-8 text-muted-foreground">You don&apos;t have any boards yet. Create one below!</p>
      )}

      <CreateBoardForm />
    </main>
  );
}
