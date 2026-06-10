import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTemplate } from "@/lib/templates";
import { GenerateClient } from "./generate-client";

export default async function GeneratePage({
  params,
}: {
  params: Promise<{ template: string }>;
}) {
  const { template: slug } = await params;
  const templateConfig = getTemplate(slug);
  if (!templateConfig) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  return <GenerateClient template={templateConfig} />;
}
