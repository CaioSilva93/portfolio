import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "svg";

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const shortUrl = `${baseUrl}/s/${slug}`;

  try {
    if (format === "png") {
      const dataUrl = await QRCode.toDataURL(shortUrl, { width: 400, margin: 2 });
      return NextResponse.json({ success: true, data: { dataUrl } });
    }

    const svg = await QRCode.toString(shortUrl, { type: "svg", width: 400, margin: 2 });
    return new NextResponse(svg, {
      headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}
