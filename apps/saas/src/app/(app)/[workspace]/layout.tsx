import { notFound, redirect } from "next/navigation";
import { resolveWorkspaceSlug, verifyMembership } from "@/lib/ensure-workspace";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspace: string }>;
}) {
  const { workspace: slug } = await params;

  const workspace = await resolveWorkspaceSlug(slug);
  if (!workspace) {
    notFound();
  }

  const membership = await verifyMembership(workspace.id);
  if (!membership) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
