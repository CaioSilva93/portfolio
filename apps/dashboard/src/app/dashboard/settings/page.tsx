import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureTeam } from "@/lib/ensure-team";
import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsContent } from "@/components/settings-content";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const teamId = await ensureTeam(user.id);

  const admin = createAdminClient();
  const { data: membership } = await admin
    .from("dash_team_members")
    .select("role")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .single();

  if (membership?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: team } = await admin
    .from("dash_teams")
    .select("*")
    .eq("id", teamId)
    .single();

  const { data: members } = await admin
    .from("dash_team_members")
    .select("id, user_id, role, created_at")
    .eq("team_id", teamId)
    .order("created_at");

  return (
    <SettingsContent
      team={team}
      members={members ?? []}
    />
  );
}
