"use client";

import Link from "next/link";
import { BarChart3, Copy, Check, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";

interface UrlItem {
  id: string;
  slug: string;
  original_url: string;
  clicks_count: number;
  created_at: string;
  expires_at: string | null;
}

export function UrlList({ urls: initialUrls }: { urls: UrlItem[] }) {
  const [urls, setUrls] = useState(initialUrls);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  async function handleCopy(slug: string) {
    await navigator.clipboard.writeText(`${baseUrl}/s/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  async function handleDelete(id: string, slug: string) {
    const supabase = createClient();
    const { error } = await supabase.from("short_urls").delete().eq("id", id);
    if (!error) {
      setUrls((prev) => prev.filter((u) => u.id !== id));
    }
  }

  if (urls.length === 0) {
    return (
      <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-[hsl(var(--muted-foreground))]">No URLs yet.</p>
          <Link href="/" className="mt-2 text-[hsl(var(--primary))] hover:underline">
            Shorten your first URL
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <CardHeader>
        <CardTitle className="text-[hsl(var(--foreground))]">Your URLs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short URL</TableHead>
              <TableHead className="hidden sm:table-cell">Original</TableHead>
              <TableHead className="text-center">Clicks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urls.map((url) => (
              <TableRow key={url.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-mono)] text-sm text-[hsl(var(--primary))]">
                      /s/{url.slug}
                    </span>
                    {url.expires_at && new Date(url.expires_at) < new Date() && (
                      <Badge variant="destructive" className="text-xs">Expired</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden max-w-[200px] truncate text-sm text-[hsl(var(--muted-foreground))] sm:table-cell">
                  {url.original_url}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{url.clicks_count}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(url.slug)} title="Copy URL">
                      {copiedSlug === url.slug ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Link href={`/dashboard/${url.slug}`}>
                      <Button variant="ghost" size="icon" title="Analytics">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(url.id, url.slug)} title="Delete">
                      <Trash2 className="h-4 w-4 text-[hsl(var(--destructive))]" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
