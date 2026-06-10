import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureTeam } from "@/lib/ensure-team";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardShell } from "@/components/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const role = membership?.role ?? "viewer";

  return (
    <DashboardShell
      user={{ id: user.id, email: user.email ?? "" }}
      teamId={teamId}
      role={role}
    >
      {children}
    </DashboardShell>
  );
}
