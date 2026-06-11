"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, Loader2, ChevronDown, ChevronUp, Settings2 } from "lucide-react";

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
    <div className="glass glow-primary rounded-2xl p-5 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Link2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              type="url"
              placeholder="https://example.com/very/long/url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="h-12 w-full rounded-xl border border-[hsl(var(--border))/0.4] bg-[hsl(var(--background))/0.4] pl-11 pr-4 text-[15px] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))/0.6] backdrop-blur-sm transition-all focus:border-[hsl(var(--primary))/0.4] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.15]"
            />
          </div>
          <div className="hidden items-center sm:flex">
            <select aria-label="Link options" className="h-12 rounded-xl border border-[hsl(var(--border))/0.4] bg-[hsl(var(--background))/0.4] px-3 text-sm text-[hsl(var(--muted-foreground))] backdrop-blur-sm focus:outline-none">
              <option>Custom slug</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-6 font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:brightness-110 hover:shadow-[0_0_25px_hsl(var(--primary)/0.35)] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Shorten Link
                <span className="ml-1">→</span>
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--primary))]"
        >
          <Settings2 className="h-3.5 w-3.5" />
          {showCustom ? "Hide options" : "Advanced options"}
          {showCustom ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {showCustom && (
          <div className="rounded-xl border border-[hsl(var(--border))/0.3] bg-[hsl(var(--background))/0.3] p-4">
            <label htmlFor="customSlug" className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">
              Custom slug (optional)
            </label>
            <div className="flex items-center gap-2">
              <span className="font-[family-name:var(--font-mono)] text-sm text-[hsl(var(--muted-foreground))]">
                {process.env.NEXT_PUBLIC_APP_URL || "short.caiosilva.dev"}/s/
              </span>
              <Input
                id="customSlug"
                placeholder="my-link"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.toLowerCase())}
                className="flex-1 rounded-lg border-[hsl(var(--border))/0.4] bg-[hsl(var(--background))/0.4]"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-xl bg-[hsl(var(--destructive))]/10 p-3 text-sm text-[hsl(var(--destructive))]">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
