import Link from "next/link";
import { CheckCircle2, ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StoreHeader } from "@/components/store-header";
import { createClient } from "@/lib/supabase/server";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let order = null;
  if (session_id && user) {
    const { data } = await supabase
      .from("shop_orders")
      .select("*, shop_order_items(*)")
      .eq("stripe_checkout_session_id", session_id)
      .single();
    order = data;
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader user={user ? { email: user.email } : null} />
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for your purchase. Your order has been received.
          </p>

          {order && (
            <Card className="mt-8 text-left">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Order ID
                  </span>
                  <span className="font-mono text-sm">
                    {order.id.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600">
                    {order.status}
                  </span>
                </div>
                {order.shop_order_items && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Items
                    </span>
                    <span className="text-sm font-medium">
                      {order.shop_order_items.length} product(s)
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(order.total / 100)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/orders">
                <Package className="mr-2 h-4 w-4" />
                View Orders
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
