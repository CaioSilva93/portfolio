import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StoreHeader } from "@/components/store-header";
import { ProductImage } from "@/components/product-image";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/orders");
  }

  const { data: orders } = await supabase
    .from("shop_orders")
    .select(
      "*, shop_order_items(*, shop_products(name, slug, image_url))"
    )
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader user={{ email: user.email }} />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <Package className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Your Orders</h1>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
            <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-muted-foreground">
              Once you place an order, it will appear here.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      #{order.id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-lg font-bold">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {order.shop_order_items?.map(
                      (item: {
                        id: string;
                        product_name: string;
                        product_price: number;
                        quantity: number;
                        shop_products?: {
                          name: string;
                          slug: string;
                          image_url: string | null;
                        } | null;
                      }) => {
                        const img =
                          item.shop_products?.image_url ||
                          `/products/${item.shop_products?.slug ?? "placeholder"}.svg`;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3"
                          >
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                              <ProductImage
                                src={img}
                                alt={item.product_name}
                                sizes="48px"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-1 text-sm font-medium">
                                {item.product_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity} &times;{" "}
                                {formatPrice(item.product_price)}
                              </p>
                            </div>
                            <span className="shrink-0 text-sm font-medium">
                              {formatPrice(
                                item.product_price * item.quantity
                              )}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
