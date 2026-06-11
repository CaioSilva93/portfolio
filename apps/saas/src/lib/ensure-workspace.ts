import { createClient } from "@/lib/supabase/server";

interface WorkspaceMember {
  workspace_id: string;
  role: string;
  saas_workspaces: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
  };
}

export async function getUserWorkspaces(): Promise<WorkspaceMember[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("saas_members")
    .select("workspace_id, role, saas_workspaces(id, name, slug, logo_url)")
    .eq("user_id", user.id);

  return (data ?? []) as unknown as WorkspaceMember[];
}

export async function resolveWorkspaceSlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("saas_workspaces")
    .select("id, name, slug, logo_url, owner_id")
    .eq("slug", slug)
    .single();

  return data;
}

export async function verifyMembership(workspaceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("saas_members")
    .select("id, role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single();

  return data;
}
