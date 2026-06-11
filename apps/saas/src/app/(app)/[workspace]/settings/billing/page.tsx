"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2, CheckCircle, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

interface Subscription {
  plan: string;
  status: string;
  current_period_end: string | null;
  stripe_subscription_id: string | null;
}

interface Usage {
  members: { current: number; limit: number; allowed: boolean };
  issues: { current: number; limit: number; allowed: boolean };
  projects: { current: number; limit: number; allowed: boolean };
  storage: { current: number; limit: number; allowed: boolean };
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    features: ["3 members", "50 issues", "2 projects", "No file uploads"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12/mo",
    features: ["10 members", "Unlimited issues", "Unlimited projects", "100MB storage", "Email notifications"],
    priceEnv: "STRIPE_PRICE_PRO",
  },
  {
    id: "business",
    name: "Business",
    price: "$29/mo",
    features: ["Unlimited members", "Unlimited issues", "Unlimited projects", "1GB storage", "Priority support"],
    priceEnv: "STRIPE_PRICE_BUSINESS",
  },
];

export default function BillingPage() {
  const params = useParams();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const workspaceSlug = params.workspace as string;

  useEffect(() => {
    loadBilling();
  }, []);

  async function loadBilling() {
    const supabase = createClient();
    const { data: ws } = await supabase
      .from("saas_workspaces")
      .select("id")
      .eq("slug", workspaceSlug)
      .single();

    if (!ws) return;

    const { data: sub } = await supabase
      .from("saas_subscriptions")
      .select("*")
      .eq("workspace_id", ws.id)
      .single();

    setSubscription(sub);

    const usageRes = await fetch(`/api/billing/usage?workspace_id=${ws.id}`);
    if (usageRes.ok) {
      setUsage(await usageRes.json());
    }

    setLoading(false);
  }

  async function handleUpgrade(priceId: string) {
    setUpgrading(priceId);
    const supabase = createClient();
    const { data: ws } = await supabase
      .from("saas_workspaces")
      .select("id")
      .eq("slug", workspaceSlug)
      .single();

    if (!ws) return;

    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspace_id: ws.id, price_id: priceId }),
    });

    if (!res.ok) {
      toast.error("Failed to start checkout");
      setUpgrading(null);
      return;
    }

    const { url } = await res.json();
    window.location.href = url;
  }

  async function handleManage() {
    const supabase = createClient();
    const { data: ws } = await supabase
      .from("saas_workspaces")
      .select("id")
      .eq("slug", workspaceSlug)
      .single();

    if (!ws) return;

    const res = await fetch("/api/billing/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspace_id: ws.id }),
    });

    if (!res.ok) {
      toast.error("Failed to open portal");
      return;
    }

    const { url } = await res.json();
    window.location.href = url;
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and view usage
        </p>
      </div>

      {subscription?.stripe_subscription_id && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Plan: <span className="capitalize">{subscription.plan}</span>
            </CardTitle>
            <CardDescription>
              Status: <span className="capitalize">{subscription.status}</span>
              {subscription.current_period_end && (
                <> &middot; Renews {new Date(subscription.current_period_end).toLocaleDateString()}</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleManage}>
              <ArrowUpRight className="h-4 w-4" />
              Manage Subscription
            </Button>
          </CardContent>
        </Card>
      )}

      {usage && (
        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <UsageBar label="Members" current={usage.members.current} limit={usage.members.limit} />
            <UsageBar label="Issues" current={usage.issues.current} limit={usage.issues.limit} />
            <UsageBar label="Projects" current={usage.projects.current} limit={usage.projects.limit} />
            <UsageBar
              label="Storage"
              current={Math.round(usage.storage.current / 1024 / 1024)}
              limit={Math.round(usage.storage.limit / 1024 / 1024)}
              unit="MB"
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={subscription?.plan === plan.id ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription className="text-2xl font-bold text-foreground">
                {plan.price}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              {subscription?.plan === plan.id ? (
                <Button variant="outline" className="w-full" disabled>
                  Current plan
                </Button>
              ) : plan.id !== "free" ? (
                <Button
                  className="w-full"
                  onClick={() => handleUpgrade(plan.id === "pro" ? "STRIPE_PRICE_PRO" : "STRIPE_PRICE_BUSINESS")}
                  disabled={upgrading !== null}
                >
                  {upgrading === plan.id && <Loader2 className="animate-spin" />}
                  Upgrade
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function UsageBar({
  label,
  current,
  limit,
  unit = "",
}: {
  label: string;
  current: number;
  limit: number;
  unit?: string;
}) {
  const percentage = limit === Infinity ? 0 : Math.min((current / limit) * 100, 100);
  const isUnlimited = limit === Infinity || limit > 999_999;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {current}{unit} / {isUnlimited ? "∞" : `${limit}${unit}`}
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${isUnlimited ? 0 : percentage}%` }}
        />
      </div>
    </div>
  );
}
