"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExportButton } from "@/components/export-button";
import { formatCurrency } from "@/lib/utils";
import type { CustomerFilters } from "@/lib/validators";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  mrr: number;
  created_at: string;
}

interface CustomerTableProps {
  customers: Customer[];
  total: number;
  filters: CustomerFilters;
  role: string;
  teamId: string;
}

const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  active: "default",
  trial: "secondary",
  churned: "destructive",
};

export function CustomerTable({ customers, total, filters, role, teamId }: CustomerTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all" && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== "page") params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const toggleSort = useCallback(
    (column: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (filters.sort === column) {
        params.set("order", filters.order === "asc" ? "desc" : "asc");
      } else {
        params.set("sort", column);
        params.set("order", "asc");
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, filters.sort, filters.order]
  );

  const totalPages = Math.ceil(total / filters.pageSize);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            {total} customer{total !== 1 && "s"} total
          </p>
        </div>
        <ExportButton teamId={teamId} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            defaultValue={filters.search}
            onChange={(e) => {
              const timeout = setTimeout(() => updateFilter("search", e.target.value), 300);
              return () => clearTimeout(timeout);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={filters.plan}
          onValueChange={(v) => updateFilter("plan", v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(v) => updateFilter("status", v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="churned">Churned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "plan", label: "Plan" },
                { key: "status", label: "Status" },
                { key: "mrr", label: "MRR" },
                { key: "created_at", label: "Joined" },
              ].map((col) => (
                <TableHead key={col.key}>
                  <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => toggleSort(col.key)}
                  >
                    {col.label}
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No customers found. {role === "admin" && "Try seeding data first."}
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {customer.plan.charAt(0).toUpperCase() + customer.plan.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[customer.status] ?? "secondary"}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(customer.mrr)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {filters.page} of {Math.max(totalPages, 1)}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page <= 1}
            onClick={() => updateFilter("page", String(filters.page - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page >= totalPages}
            onClick={() => updateFilter("page", String(filters.page + 1))}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
