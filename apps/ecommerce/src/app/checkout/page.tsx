"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { StoreHeader } from "@/components/store-header";
import { CheckoutForm } from "@/components/checkout-form";
import { useCart } from "@/hooks/use-cart";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, isLoading: cartLoading } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login?next=/checkout");
      }
    });
  }, [router]);

  useEffect(() => {
    if (cartLoading) return;
    if (items.length === 0) {
      setLoading(false);
      return;
    }

    async function createCheckoutSession() {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
            })),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to create checkout session");
          toast.error(data.error || "Checkout failed");
          setLoading(false);
          return;
        }

        setClientSecret(data.clientSecret);
        setLoading(false);
      } catch {
        setError("Failed to create checkout session");
        toast.error("Something went wrong");
        setLoading(false);
      }
    }

    createCheckoutSession();
  }, [cartLoading, items]);

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              Preparing your checkout...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-destructive">{error}</p>
            <button
              onClick={() => router.push("/cart")}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Return to cart
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium">Your cart is empty</p>
            <button
              onClick={() => router.push("/products")}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Browse products
            </button>
          </div>
        ) : clientSecret ? (
          <CheckoutForm clientSecret={clientSecret} />
        ) : null}
      </main>
    </div>
  );
}
