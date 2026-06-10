import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "API Docs | Short",
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-[hsl(var(--secondary))] p-4 font-[family-name:var(--font-mono)] text-sm text-[hsl(var(--foreground))]">
      <code>{children}</code>
    </pre>
  );
}

export default function DocsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://short.caiosilva.dev";

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">API Documentation</h1>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">
          Use the REST API to create and manage short URLs programmatically.
        </p>

        <div className="mt-8 space-y-8">
          <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-600 text-white">POST</Badge>
                <CardTitle className="font-[family-name:var(--font-mono)] text-lg text-[hsl(var(--foreground))]">
                  /api/v1/urls
                </CardTitle>
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Create a new short URL</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-[hsl(var(--foreground))]">Request</p>
                <CodeBlock>{`curl -X POST ${baseUrl}/api/v1/urls \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/long-url", "customSlug": "my-link"}'`}</CodeBlock>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-[hsl(var(--foreground))]">Response (201)</p>
                <CodeBlock>{`{
  "success": true,
  "data": {
    "slug": "my-link",
    "shortUrl": "${baseUrl}/s/my-link",
    "originalUrl": "https://example.com/long-url"
  }
}`}</CodeBlock>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-600 text-white">GET</Badge>
                <CardTitle className="font-[family-name:var(--font-mono)] text-lg text-[hsl(var(--foreground))]">
                  /api/v1/urls/:slug
                </CardTitle>
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Get URL information</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-[hsl(var(--foreground))]">Request</p>
                <CodeBlock>{`curl ${baseUrl}/api/v1/urls/my-link`}</CodeBlock>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-[hsl(var(--foreground))]">Response (200)</p>
                <CodeBlock>{`{
  "success": true,
  "data": {
    "slug": "my-link",
    "originalUrl": "https://example.com/long-url",
    "clicksCount": 42,
    "createdAt": "2026-06-10T12:00:00Z",
    "expiresAt": null
  }
}`}</CodeBlock>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-600 text-white">GET</Badge>
                <CardTitle className="font-[family-name:var(--font-mono)] text-lg text-[hsl(var(--foreground))]">
                  /api/v1/urls/:slug/stats
                </CardTitle>
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Get click analytics</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-[hsl(var(--foreground))]">Request</p>
                <CodeBlock>{`curl "${baseUrl}/api/v1/urls/my-link/stats?period=30"`}</CodeBlock>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-[hsl(var(--foreground))]">Response (200)</p>
                <CodeBlock>{`{
  "success": true,
  "data": {
    "slug": "my-link",
    "totalClicks": 42,
    "period": "30d",
    "clicksInPeriod": 28,
    "countries": { "US": 15, "BR": 10, "DE": 3 },
    "devices": { "desktop": 20, "mobile": 8 },
    "browsers": { "Chrome": 18, "Safari": 7, "Firefox": 3 }
  }
}`}</CodeBlock>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-600 text-white">GET</Badge>
                <CardTitle className="font-[family-name:var(--font-mono)] text-lg text-[hsl(var(--foreground))]">
                  /api/qr/:slug
                </CardTitle>
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Generate a QR code for a short URL</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-[hsl(var(--foreground))]">SVG (default)</p>
                <CodeBlock>{`curl ${baseUrl}/api/qr/my-link`}</CodeBlock>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-[hsl(var(--foreground))]">PNG (base64 data URL)</p>
                <CodeBlock>{`curl "${baseUrl}/api/qr/my-link?format=png"`}</CodeBlock>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <CardHeader>
              <CardTitle className="text-lg text-[hsl(var(--foreground))]">Rate Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                <li>API endpoints: <strong>100 requests/hour</strong> per IP</li>
                <li>Web shortener: <strong>20 requests/hour</strong> (anonymous), <strong>60/hour</strong> (authenticated)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
