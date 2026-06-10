import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { UrlList } from "@/components/url-list";

export const metadata = {
  title: "Dashboard | Short",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: urls } = await supabase
    .from("short_urls")
    .select("id, slug, original_url, clicks_count, created_at, expires_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">Dashboard</h1>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">
          Manage your shortened URLs and view analytics.
        </p>
        <div className="mt-8">
          <UrlList urls={urls ?? []} />
        </div>
      </div>
    </>
  );
}
