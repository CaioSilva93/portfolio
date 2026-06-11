import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/price-display";
import { ProductImage } from "@/components/product-image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image_url || `/products/${product.slug}.svg`;

  return (
    <Card className="group relative flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="flex-1">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <ProductImage
            src={imageUrl}
            alt={product.name}
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {product.stock === 0 && (
            <Badge variant="destructive" className="absolute left-2 top-2">
              Out of Stock
            </Badge>
          )}
          {product.stock > 0 && product.stock < 5 && (
            <Badge variant="secondary" className="absolute left-2 top-2">
              Only {product.stock} left
            </Badge>
          )}
        </div>
        <CardContent className="flex flex-1 flex-col gap-1 p-4">
          {product.category && (
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {product.category.name}
            </span>
          )}
          <h3 className="line-clamp-1 font-semibold">{product.name}</h3>
          <PriceDisplay
            priceInCents={product.price}
            className="text-lg font-bold text-primary"
          />
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <AddToCartButton product={product} className="w-full" />
      </CardFooter>
    </Card>
  );
}
