"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { CartItemWithProduct } from "@/components/cart-provider";

interface CartItemRowProps {
  item: CartItemWithProduct;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  compact?: boolean;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  compact = false,
}: CartItemRowProps) {
  const { product, quantity, productId } = item;
  const imageUrl = product.image_url || `/products/${product.slug}.svg`;
  const lineTotal = product.price * quantity;
  const lowStock = product.stock > 0 && quantity > product.stock;

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
        <ProductImage
          src={imageUrl}
          alt={product.name}
          sizes="64px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="line-clamp-1 text-sm font-medium">{product.name}</h4>
          {!compact && (
            <span className="shrink-0 text-sm font-semibold">
              {formatPrice(lineTotal)}
            </span>
          )}
        </div>

        <span className="text-xs text-muted-foreground">
          {formatPrice(product.price)} each
        </span>

        {lowStock && (
          <span className="text-xs font-medium text-destructive">
            Only {product.stock} in stock
          </span>
        )}

        <div className="mt-1 flex items-center gap-2">
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-r-none"
              onClick={() => onUpdateQuantity(productId, quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="flex h-7 w-8 items-center justify-center text-xs font-medium">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-l-none"
              onClick={() => onUpdateQuantity(productId, quantity + 1)}
              disabled={quantity >= product.stock}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(productId)}
            aria-label="Remove item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>

          {compact && (
            <span className="ml-auto text-sm font-semibold">
              {formatPrice(lineTotal)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
