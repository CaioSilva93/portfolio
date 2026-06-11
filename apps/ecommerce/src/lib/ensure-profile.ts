import { createAdminClient } from "@/lib/supabase/admin";

export async function ensureProfile(
  userId: string
): Promise<{ user_id: string; role: string }> {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("shop_profiles")
    .select("user_id, role")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (existing) return existing;

  await admin
    .from("shop_profiles")
    .upsert({ user_id: userId, role: "customer" }, { onConflict: "user_id" });

  const { data: profile } = await admin
    .from("shop_profiles")
    .select("user_id, role")
    .eq("user_id", userId)
    .limit(1)
    .single();

  return profile!;
}
