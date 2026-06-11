import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { invalidatePlanCache } from "@/lib/redis";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const workspaceId = session.metadata?.workspace_id;
      if (!workspaceId) break;

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const priceId = subscription.items.data[0]?.price.id ?? "";
      const plan = getPlanFromPrice(priceId);

      await supabase
        .from("saas_subscriptions")
        .update({
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          plan,
          status: "active",
          current_period_end: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
        })
        .eq("workspace_id", workspaceId);

      await invalidatePlanCache(workspaceId);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const { data: sub } = await supabase
        .from("saas_subscriptions")
        .select("workspace_id")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      if (!sub) break;

      const priceId = subscription.items.data[0]?.price.id ?? "";
      const plan = getPlanFromPrice(priceId);
      const status = mapStripeStatus(subscription.status);

      await supabase
        .from("saas_subscriptions")
        .update({
          plan,
          status,
          current_period_end: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);

      await invalidatePlanCache(sub.workspace_id);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const { data: sub } = await supabase
        .from("saas_subscriptions")
        .select("workspace_id")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      if (!sub) break;

      await supabase
        .from("saas_subscriptions")
        .update({
          plan: "free",
          status: "cancelled",
          stripe_subscription_id: null,
          current_period_end: null,
        })
        .eq("stripe_subscription_id", subscription.id);

      await invalidatePlanCache(sub.workspace_id);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string;
      if (!subscriptionId) break;

      const { data: sub } = await supabase
        .from("saas_subscriptions")
        .select("workspace_id")
        .eq("stripe_subscription_id", subscriptionId)
        .single();

      if (!sub) break;

      await supabase
        .from("saas_subscriptions")
        .update({ status: "past_due" })
        .eq("stripe_subscription_id", subscriptionId);

      await invalidatePlanCache(sub.workspace_id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

function getPlanFromPrice(priceId: string): "free" | "pro" | "business" {
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  if (priceId === process.env.STRIPE_PRICE_BUSINESS) return "business";
  return "free";
}

function mapStripeStatus(
  status: Stripe.Subscription.Status
): "active" | "past_due" | "cancelled" | "trialing" {
  switch (status) {
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "trialing":
      return "trialing";
    default:
      return "cancelled";
  }
}
