export function GET() {
  return Response.json({ status: "ok", app: "saas", timestamp: new Date().toISOString() });
}
