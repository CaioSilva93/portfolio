import { formatPrice } from "@/lib/utils";

interface PriceDisplayProps {
  priceInCents: number;
  className?: string;
}

export function PriceDisplay({ priceInCents, className }: PriceDisplayProps) {
  return <span className={className}>{formatPrice(priceInCents)}</span>;
}
