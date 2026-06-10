import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-[hsl(var(--muted-foreground))]">Page not found</p>
      <Link
        href="/"
        className="rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-[hsl(var(--primary-foreground))] transition-colors hover:opacity-90"
      >
        Go home
      </Link>
    </div>
  );
}
