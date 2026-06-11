"use client";

import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CheckoutFormProps {
  clientSecret: string;
}

export function CheckoutForm({ clientSecret }: CheckoutFormProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout className="rounded-xl" />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
