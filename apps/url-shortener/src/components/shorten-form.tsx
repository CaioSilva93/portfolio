"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface ShortenResult {
  shortUrl: string;
  slug: string;
  originalUrl: string;
  qrSvg: string;
}

interface ShortenFormProps {
  onResult: (result: ShortenResult) => void;
}

export function ShortenForm({ onResult }: ShortenFormProps) {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          ...(showCustom && customSlug ? { customSlug } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      onResult(data);
      setUrl("");
      setCustomSlug("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-[hsl(var(--foreground))]">
              Paste your long URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Link2 className="mr-2 h-4 w-4" />
                    Shorten
                  </>
                )}
              </Button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCustom(!showCustom)}
            className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
          >
            {showCustom ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            Custom slug
          </button>

          {showCustom && (
            <div className="space-y-2">
              <Label htmlFor="customSlug" className="text-sm text-[hsl(var(--muted-foreground))]">
                Custom slug (optional)
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[hsl(var(--muted-foreground))]">
                  {process.env.NEXT_PUBLIC_APP_URL || "short.caiosilva.dev"}/s/
                </span>
                <Input
                  id="customSlug"
                  placeholder="my-link"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value.toLowerCase())}
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-md bg-[hsl(var(--destructive))]/10 p-3 text-sm text-[hsl(var(--destructive))]">
              {error}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
