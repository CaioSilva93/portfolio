"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  format?: (n: number) => string;
  trend?: number;
  icon: LucideIcon;
}

function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) => format(Math.round(v)));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1,
      ease: "easeOut",
    });
    return controls.stop;
  }, [motionValue, value]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
    return unsubscribe;
  }, [display]);

  return <span ref={ref}>{format(0)}</span>;
}

export function MetricCard({ title, value, format = String, trend, icon: Icon }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={value} format={format} />
          </div>
          {trend !== undefined && (
            <p className={cn(
              "mt-1 flex items-center gap-1 text-xs",
              trend >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {trend >= 0 ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(trend).toFixed(1)}% from last month
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
