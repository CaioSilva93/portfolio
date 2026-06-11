import { Package, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const admin = createAdminClient();

  const [productsRes, ordersRes, revenueRes, lowStockRes, recentOrdersRes] =
    await Promise.all([
      admin
        .from("shop_products")
        .select("id", { count: "exact", head: true }),
      admin
        .from("shop_orders")
        .select("id", { count: "exact", head: true }),
      admin
        .from("shop_orders")
        .select("total")
        .neq("status", "cancelled"),
      admin
        .from("shop_products")
        .select("id, name, stock")
        .lt("stock", 5)
        .eq("active", true)
        .order("stock", { ascending: true }),
      admin
        .from("shop_orders")
        .select("id, customer_email, status, total, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const totalProducts = productsRes.count ?? 0;
  const totalOrders = ordersRes.count ?? 0;
  const totalRevenue =
    revenueRes.data?.reduce(
      (sum: number, o: { total: number }) => sum + o.total,
      0
    ) ?? 0;
  const lowStockProducts = lowStockRes.data ?? [];
  const recentOrders = recentOrdersRes.data ?? [];

  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Low Stock",
      value: lowStockProducts.length.toString(),
      icon: AlertTriangle,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map(
                  (order: {
                    id: string;
                    customer_email: string | null;
                    status: string;
                    total: number;
                    created_at: string;
                  }) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {order.customer_email ?? "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
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
                        <span className="text-sm font-bold">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                All products are well-stocked
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map(
                  (p: { id: string; name: string; stock: number }) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <span className="text-sm font-medium">{p.name}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          p.stock === 0
                            ? "bg-red-500/10 text-red-600"
                            : "bg-yellow-500/10 text-yellow-600"
                        }`}
                      >
                        {p.stock} left
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
