"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["hsl(186, 100%, 50%)", "hsl(186, 100%, 35%)", "hsl(217, 33%, 45%)", "hsl(215, 20%, 65%)", "hsl(240, 4.8%, 60%)"];

interface ClicksByDay { date: string; clicks: number; }
interface ClicksByField { name: string; value: number; }

interface AnalyticsChartsProps {
  clicksByDay: ClicksByDay[];
  clicksByCountry: ClicksByField[];
  clicksByDevice: ClicksByField[];
  clicksByBrowser: ClicksByField[];
}

export function AnalyticsCharts({
  clicksByDay, clicksByCountry, clicksByDevice, clicksByBrowser,
}: AnalyticsChartsProps) {
  return (
    <div className="space-y-6">
      <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <CardHeader>
          <CardTitle className="text-sm text-[hsl(var(--foreground))]">Clicks over time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clicksByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
              <XAxis dataKey="date" stroke="hsl(215, 20%, 65%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }}
                labelStyle={{ color: "hsl(210, 40%, 98%)" }}
                itemStyle={{ color: "hsl(186, 100%, 50%)" }}
              />
              <Line type="monotone" dataKey="clicks" stroke="hsl(186, 100%, 50%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <CardHeader>
            <CardTitle className="text-sm text-[hsl(var(--foreground))]">Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={clicksByCountry.slice(0, 5)} layout="vertical">
                <XAxis type="number" stroke="hsl(215, 20%, 65%)" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(215, 20%, 65%)" fontSize={12} width={40} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }}
                />
                <Bar dataKey="value" fill="hsl(186, 100%, 50%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <CardHeader>
            <CardTitle className="text-sm text-[hsl(var(--foreground))]">Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={clicksByDevice} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name }) => name}>
                  {clicksByDevice.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <CardHeader>
            <CardTitle className="text-sm text-[hsl(var(--foreground))]">Browsers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={clicksByBrowser} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name }) => name}>
                  {clicksByBrowser.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
