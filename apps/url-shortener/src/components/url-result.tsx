"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="border-[hsl(var(--primary))]/20 bg-[hsl(var(--card))]">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Your shortened URL</p>
            <div className="mt-1 flex items-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-[hsl(var(--primary))] hover:underline"
              >
                {shortUrl}
              </a>
              <ExternalLink className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </div>
          </div>

          <p className="truncate text-sm text-[hsl(var(--muted-foreground))]">
            {originalUrl}
          </p>

          <div className="flex gap-2">
            <Button onClick={handleCopy} variant="outline" size="sm">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
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
              <Button onClick={() => setShowQr(!showQr)} variant="outline" size="sm">
                <QrCode className="mr-2 h-4 w-4" />
                {showQr ? "Hide QR" : "Show QR"}
              </Button>
            )}
          </div>

          {showQr && qrSvg && (
            <div
              className="mx-auto w-fit rounded-lg bg-white p-4"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
