"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink, QrCode } from "lucide-react";

interface UrlResultProps {
  shortUrl: string;
  originalUrl: string;
  qrSvg: string;
}

export function UrlResult({ shortUrl, originalUrl, qrSvg }: UrlResultProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass glow-primary-sm rounded-2xl p-6">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Your shortened URL
          </p>
          <div className="mt-2 flex items-center gap-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-mono)] text-lg font-semibold text-[hsl(var(--primary))] transition-colors hover:text-[hsl(var(--primary))]/80"
            >
              {shortUrl}
            </a>
            <ExternalLink className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </div>
        </div>

        <p className="truncate font-[family-name:var(--font-mono)] text-sm text-[hsl(var(--muted-foreground))]">
          {originalUrl}
        </p>

        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="rounded-lg border-[hsl(var(--border))/0.5] transition-all hover:border-[hsl(var(--primary))/0.3] hover:bg-[hsl(var(--primary))]/5"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </>
            )}
          </Button>
          {qrSvg && (
            <Button
              onClick={() => setShowQr(!showQr)}
              variant="outline"
              size="sm"
              className="rounded-lg border-[hsl(var(--border))/0.5] transition-all hover:border-[hsl(var(--primary))/0.3] hover:bg-[hsl(var(--primary))]/5"
            >
              <QrCode className="mr-2 h-4 w-4" />
              {showQr ? "Hide QR" : "Show QR"}
            </Button>
          )}
        </div>

        {showQr && qrSvg && (
          <div className="flex justify-center">
            <div
              className="w-fit rounded-xl bg-white p-4 shadow-lg"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
