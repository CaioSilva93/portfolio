import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { ratelimit } from "@/lib/rate-limit";
import { checkoutSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin !== process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (ratelimit) {
    const { success } = await ratelimit.limit(user.id);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { items } = parsed.data;
  const admin = createAdminClient();
  const productIds = items.map((i) => i.productId);

  const { data: products, error: dbError } = await admin
    .from("shop_products")
    .select("*")
    .in("id", productIds);

  if (dbError || !products) {
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }

  const errors: string[] = [];
  const lineItems: {
    price_data: {
      currency: string;
      product_data: { name: string; description?: string };
      unit_amount: number;
    };
    quantity: number;
  }[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      errors.push(`Product ${item.productId} not found`);
      continue;
    }
    if (!product.active) {
      errors.push(`${product.name} is no longer available`);
      continue;
    }
    if (product.stock === 0) {
      errors.push(`${product.name} is out of stock`);
      continue;
    }
    if (product.stock < item.quantity) {
      errors.push(
        `${product.name} only has ${product.stock} in stock (requested ${item.quantity})`
      );
      continue;
    }

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          description: product.description || undefined,
        },
        unit_amount: product.price,
      },
      quantity: item.quantity,
    });
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      line_items: lineItems,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        items: JSON.stringify(
          items.map((i) => ({
            product_id: i.productId,
            quantity: i.quantity,
          }))
        ),
      },
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
