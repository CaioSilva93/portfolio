import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-[family-name:var(--font-mono)] text-6xl font-bold text-[hsl(var(--primary))]">
        404
      </h1>
      <p className="text-[hsl(var(--muted-foreground))]">
        This link doesn&apos;t exist or has expired.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-lg bg-[hsl(var(--primary))] px-6 py-3 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
      >
        Shorten a URL
      </Link>
    </div>
  );
}
