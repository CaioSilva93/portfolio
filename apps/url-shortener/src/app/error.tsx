"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-[family-name:var(--font-mono)] text-4xl font-bold text-[hsl(var(--destructive))]">
        Something went wrong
      </h1>
      <p className="text-[hsl(var(--muted-foreground))]">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-[hsl(var(--primary))] px-6 py-3 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
