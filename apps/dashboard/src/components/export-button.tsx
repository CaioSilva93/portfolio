"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildCsv, downloadCsv, downloadPdf } from "@/lib/export-utils";
import { createClient } from "@/lib/supabase/client";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonProps {
  teamId: string;
}

const HEADERS = ["name", "email", "plan", "status", "mrr", "created_at"];

export function ExportButton({ teamId }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function fetchAllCustomers() {
    const supabase = createClient();
    const { data } = await supabase
      .from("dash_customers")
      .select("name, email, plan, status, mrr, created_at")
      .eq("team_id", teamId)
      .order("name")
      .limit(1000);
    return data ?? [];
  }

  async function handleCsv() {
    setLoading(true);
    try {
      const rows = await fetchAllCustomers();
      const csv = buildCsv(HEADERS, rows);
      downloadCsv("customers.csv", csv);
      toast.success("CSV downloaded");
    } catch {
      toast.error("Failed to export CSV");
    } finally {
      setLoading(false);
    }
  }

  async function handlePdf() {
    setLoading(true);
    try {
      const rows = await fetchAllCustomers();
      await downloadPdf("Customers", HEADERS, rows);
      toast.success("PDF downloaded");
    } catch {
      toast.error("Failed to export PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCsv}>
          <FileSpreadsheet className="h-4 w-4" />
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePdf}>
          <FileText className="h-4 w-4" />
          Export PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
