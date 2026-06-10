import { createClient } from "@/lib/supabase/server";
import { ensureTeam } from "@/lib/ensure-team";
import { redirect } from "next/navigation";
import { customerFiltersSchema } from "@/lib/validators";
import { CustomerTable } from "@/components/customer-table";
import { createAdminClient } from "@/lib/supabase/admin";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CustomersPage({ searchParams }: Props) {
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

  const rawParams = await searchParams;
  const params: Record<string, string | undefined> = {};
  for (const [key, val] of Object.entries(rawParams)) {
    params[key] = Array.isArray(val) ? val[0] : val;
  }

  const filters = customerFiltersSchema.parse(params);

  let query = supabase
    .from("dash_customers")
    .select("*", { count: "exact" })
    .eq("team_id", teamId);

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }
  if (filters.plan !== "all") {
    query = query.eq("plan", filters.plan);
  }
  if (filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  query = query.order(filters.sort, { ascending: filters.order === "asc" });

  const from = (filters.page - 1) * filters.pageSize;
  const to = from + filters.pageSize - 1;
  query = query.range(from, to);

  const { data: customers, count } = await query;

  return (
    <CustomerTable
      customers={customers ?? []}
      total={count ?? 0}
      filters={filters}
      role={role}
      teamId={teamId}
    />
  );
}
