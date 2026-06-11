"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { StoreHeader } from "@/components/store-header";
import { CartItemRow } from "@/components/cart-item-row";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { saveCartToCookie } from "@/components/cart-provider";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, isLoading } = useCart();

  useEffect(() => {
    if (!isLoading && items.length > 0) {
      const stale = items.filter(
        (i) => !i.product.active || i.product.stock === 0
      );
      if (stale.length > 0) {
        toast.warning(
          `${stale.length} item(s) in your cart are no longer available`
        );
      }

      const overStock = items.filter(
        (i) => i.product.active && i.quantity > i.product.stock && i.product.stock > 0
      );
      if (overStock.length > 0) {
        toast.warning(
          "Some items exceed available stock. Quantities will be adjusted."
        );
      }
    }
  }, [isLoading, items]);

  const validItems = items.filter(
    (i) => i.product.active && i.product.stock > 0
  );
  const subtotal = validItems.reduce(
    (sum, i) => sum + i.product.price * Math.min(i.quantity, i.product.stock),
    0
  );

  async function handleCheckout() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      saveCartToCookie(
        items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      );
      router.push("/auth/login?next=/checkout");
    } else {
      router.push("/checkout");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <h1 className="mb-8 text-3xl font-bold tracking-tight">
          Shopping Cart
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
            <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Discover great products and add them to your cart.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="divide-y p-4 sm:p-6">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.productId}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({validItems.length} items)
                    </span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-xl font-bold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={validItems.length === 0}
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
