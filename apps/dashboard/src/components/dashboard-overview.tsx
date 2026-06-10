"use client";

import { MetricCard } from "@/components/metric-card";
import { RevenueChart } from "@/components/revenue-chart";
import { CustomerGrowthChart } from "@/components/customer-growth-chart";
import { PlanDistributionChart } from "@/components/plan-distribution-chart";
import { ActivityFeed } from "@/components/activity-feed";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { DollarSign, Users, UserPlus, TrendingUp } from "lucide-react";
import { useRealtime } from "@/hooks/use-realtime";
import { motion } from "framer-motion";

interface Metrics {
  totalRevenue: number;
  activeCustomers: number;
  newSignups: number;
  mrrGrowth: number;
  revenueByDate: { date: string; revenue: number }[];
  customerGrowth: { month: string; new: number; churned: number }[];
  planDistribution: { name: string; value: number }[];
}

interface DashboardOverviewProps {
  metrics: Metrics;
  teamId: string;
}

export function DashboardOverview({ metrics, teamId }: DashboardOverviewProps) {
  useRealtime({ teamId });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Your analytics overview at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={metrics.totalRevenue}
          format={formatCurrency}
          trend={12.5}
          icon={DollarSign}
        />
        <MetricCard
          title="Active Customers"
          value={metrics.activeCustomers}
          format={formatNumber}
          trend={4.2}
          icon={Users}
        />
        <MetricCard
          title="New Signups"
          value={metrics.newSignups}
          format={formatNumber}
          trend={8.1}
          icon={UserPlus}
        />
        <MetricCard
          title="MRR Growth"
          value={Math.round(metrics.mrrGrowth * 10) / 10}
          format={formatPercent}
          trend={metrics.mrrGrowth}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChart data={metrics.revenueByDate} />
        <CustomerGrowthChart data={metrics.customerGrowth} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PlanDistributionChart data={metrics.planDistribution} />
        <ActivityFeed teamId={teamId} />
      </div>
    </motion.div>
  );
}
