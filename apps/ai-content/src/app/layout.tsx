import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
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
  title: "AI Content Generator | Caio Silva",
  description:
    "Generate marketing copy, emails, social media posts and more with AI. Powered by Google Gemini.",
  keywords: ["AI", "Content Generator", "Marketing", "Gemini", "Copywriting"],
  authors: [{ name: "Caio Cesar Amorim Silva" }],
  openGraph: {
    title: "AI Content Generator | Caio Silva",
    description: "Generate marketing copy, emails, social media posts and more with AI.",
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
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
