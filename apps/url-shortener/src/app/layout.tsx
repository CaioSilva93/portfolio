import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Short | URL Shortener with Analytics",
  description:
    "Shorten URLs, track clicks, and analyze traffic. Built with Next.js, Supabase, and Redis.",
  keywords: ["URL Shortener", "Analytics", "Link Shortener", "QR Code"],
  authors: [{ name: "Caio Cesar Amorim Silva" }],
  openGraph: {
    title: "Short | URL Shortener with Analytics",
    description: "Shorten URLs, track clicks, and analyze traffic.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[hsl(var(--background))] font-[family-name:var(--font-sans)] antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
