import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  },
  paid: {
    label: "Paid",
    className: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  shipped: {
    label: "Shipped",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-600/10 text-emerald-700 border-emerald-600/20",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.pending;
  return (
    <Badge
      variant="outline"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
