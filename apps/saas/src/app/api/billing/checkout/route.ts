import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

const checkoutSchema = z.object({
  workspace_id: z.string().uuid(),
  price_id: z.string(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { data: sub } = await supabase
    .from("saas_subscriptions")
    .select("stripe_customer_id")
    .eq("workspace_id", parsed.data.workspace_id)
    .single();

  const sessionParams: Record<string, unknown> = {
    mode: "subscription",
    line_items: [{ price: parsed.data.price_id, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/{workspace}/settings/billing?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/{workspace}/settings/billing?checkout=cancelled`,
    metadata: { workspace_id: parsed.data.workspace_id },
  };

  if (sub?.stripe_customer_id) {
    sessionParams.customer = sub.stripe_customer_id;
  } else {
    sessionParams.customer_email = user.email;
  }

  const session = await stripe.checkout.sessions.create(
    sessionParams as Parameters<typeof stripe.checkout.sessions.create>[0]
  );

  return NextResponse.json({ url: session.url });
}
