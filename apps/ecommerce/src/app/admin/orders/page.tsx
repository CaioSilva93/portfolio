import { redirect } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { orderStatusSchema } from "@/lib/validators";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";

interface AdminOrdersPageProps {
  searchParams: Promise<{ page?: string }>;
}

const statuses = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const perPage = 20;
  const offset = (page - 1) * perPage;

  const admin = createAdminClient();
  const { data: orders, count } = await admin
    .from("shop_orders")
    .select("*, shop_order_items(id, product_name, product_price, quantity)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  const totalPages = Math.ceil((count ?? 0) / perPage);

  async function updateStatus(formData: FormData) {
    "use server";
    const raw = {
      orderId: formData.get("orderId"),
      status: formData.get("status"),
    };

    const parsed = orderStatusSchema.safeParse(raw);
    if (!parsed.success) return;

    const adminClient = createAdminClient();
    await adminClient
      .from("shop_orders")
      .update({
        status: parsed.data.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.orderId);

    redirect(`/admin/orders?page=${page}`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Orders</h1>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Update Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(!orders || orders.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No orders found
                </TableCell>
              </TableRow>
            )}
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  {order.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {order.customer_email ?? "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  <OrderStatusBadge
                    status={
                      order.status as
                        | "pending"
                        | "paid"
                        | "shipped"
                        | "delivered"
                        | "cancelled"
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {formatPrice(order.total)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <form action={updateStatus} className="flex items-center justify-end gap-2">
                    <input type="hidden" name="orderId" value={order.id} />
                    <Select name="status" defaultValue={order.status}>
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="submit" size="sm" variant="outline">
                      Update
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/orders?page=${page - 1}`}>Previous</Link>
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/orders?page=${page + 1}`}>Next</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
