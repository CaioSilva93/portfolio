import { redirect } from "next/navigation";
import { getUserWorkspaces } from "@/lib/ensure-workspace";

export default async function RootAppPage() {
  const workspaces = await getUserWorkspaces();

  if (workspaces.length === 0) {
    redirect("/onboarding");
  }

  const firstWorkspace = workspaces[0].saas_workspaces;
  redirect(`/${firstWorkspace.slug}`);
}
