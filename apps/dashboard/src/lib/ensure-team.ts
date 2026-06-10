import { createAdminClient } from "@/lib/supabase/admin";

export async function ensureTeam(userId: string): Promise<string> {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("dash_team_members")
    .select("team_id")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (existing) return existing.team_id;

  const { data: team, error: teamError } = await admin
    .from("dash_teams")
    .insert({ name: "My Team" })
    .select("id")
    .single();

  if (teamError || !team) throw new Error("Failed to create team");

  const { error: memberError } = await admin
    .from("dash_team_members")
    .upsert(
      { team_id: team.id, user_id: userId, role: "admin" },
      { onConflict: "team_id,user_id" }
    );

  if (memberError) throw new Error("Failed to add team member");

  return team.id;
}
