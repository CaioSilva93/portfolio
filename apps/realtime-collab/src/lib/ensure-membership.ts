import { createAdminClient } from "@/lib/supabase/admin";

export async function ensureBoardMembership(userId: string, boardId: string) {
  const admin = createAdminClient();

  const { data: membership } = await admin
    .from("collab_board_members")
    .select("role")
    .eq("board_id", boardId)
    .eq("user_id", userId)
    .single();

  return membership;
}

export async function ensureOwnerMembership(userId: string, boardId: string): Promise<string> {
  const admin = createAdminClient();

  const { data } = await admin
    .from("collab_board_members")
    .select("role")
    .eq("board_id", boardId)
    .eq("user_id", userId)
    .eq("role", "owner")
    .single();

  if (!data) throw new Error("Not board owner");
  return data.role;
}
