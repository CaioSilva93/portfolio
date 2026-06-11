"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function AddToCartButton({ product, size = "sm", className }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const outOfStock = product.stock === 0;

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock || loading) return;

    setLoading(true);
    try {
      await addItem(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size={size}
      className={`cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-md active:scale-[0.97] ${className ?? ""}`}
      disabled={outOfStock || loading}
      onClick={handleClick}
    >
      {added ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </>
      )}
    </Button>
  );
}
