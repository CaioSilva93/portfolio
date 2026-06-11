"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { CartItemRow } from "@/components/cart-item-row";
import { useCart } from "@/hooks/use-cart";
import { saveCartToCookie } from "@/components/cart-provider";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const router = useRouter();
  const { items, updateQuantity, removeItem } = useCart();

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
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
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
            <div>
              <p className="font-medium">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add products to get started
              </p>
            </div>
            <Button variant="outline" asChild onClick={() => onOpenChange(false)}>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-2">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItemRow
                    key={item.productId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    compact
                  />
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
              </div>

              <Separator className="my-3" />

              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button className="w-full" onClick={handleCheckout}>
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                  onClick={() => onOpenChange(false)}
                >
                  <Link href="/cart">View Cart</Link>
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
