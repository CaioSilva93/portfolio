import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { invalidateCache } from "@/lib/redis";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;
  const admin = createAdminClient();

  const { data: existingOrder } = await admin
    .from("shop_orders")
    .select("id")
    .eq("stripe_checkout_session_id", session.id)
    .single();

  if (existingOrder) {
    return NextResponse.json({ received: true });
  }

  const userId = session.client_reference_id;
  const email = session.customer_details?.email;

  if (!userId || !session.metadata?.items) {
    console.error("Missing user_id or items in session metadata");
    return NextResponse.json(
      { error: "Missing metadata" },
      { status: 400 }
    );
  }

  let parsedItems: { product_id: string; quantity: number }[];
  try {
    parsedItems = JSON.parse(session.metadata.items);
  } catch {
    console.error("Failed to parse items metadata");
    return NextResponse.json(
      { error: "Invalid items metadata" },
      { status: 400 }
    );
  }

  const productIds = parsedItems.map((i) => i.product_id);
  const { data: products, error: productsError } = await admin
    .from("shop_products")
    .select("id, name, price")
    .in("id", productIds);

  if (productsError || !products) {
    console.error("Failed to fetch products:", productsError);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }

  const orderItems = parsedItems.map((item) => {
    const product = products.find((p) => p.id === item.product_id);
    return {
      product_id: item.product_id,
      quantity: item.quantity,
      product_name: product?.name ?? "Unknown Product",
      product_price: product?.price ?? 0,
    };
  });

  const { error: rpcError } = await admin.rpc("shop_create_order", {
    p_stripe_session_id: session.id,
    p_user_id: userId,
    p_customer_email: email ?? null,
    p_items: orderItems,
  });

  if (rpcError) {
    console.error("shop_create_order failed:", rpcError);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }

  await invalidateCache();

  return NextResponse.json({ received: true });
}
