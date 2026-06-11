import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { templates } from "@/lib/templates";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Megaphone,
  Mail,
  Camera,
  Briefcase,
  ShoppingBag,
  FileText,
  LogOut,
  Sparkles,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { FavoriteButton } from "./favorite-button";

const iconMap: Record<string, LucideIcon> = {
  Megaphone,
  Mail,
  Camera,
  Briefcase,
  ShoppingBag,
  FileText,
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: generations } = await supabase
    .from("ai_generations")
    .select("id, template, input_data, output, model, is_favorite, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="border-b border-[hsl(var(--border))]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-[hsl(var(--primary))]" />
            <h1 className="text-xl font-bold">AI Content Generator</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[hsl(var(--muted-foreground))]">
              {user.email}
            </span>
            <form action="/auth/signout" method="post">
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Templates Section */}
        <section className="mb-10">
          <h2 className="mb-1 text-lg font-semibold">Templates</h2>
          <p className="mb-5 text-sm text-[hsl(var(--muted-foreground))]">
            Choose a template to start generating content
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => {
              const Icon = iconMap[t.icon] ?? Sparkles;
              return (
                <Link key={t.slug} href={`/generate/${t.slug}`}>
                  <Card className="group cursor-pointer transition-colors hover:border-[hsl(var(--primary))]">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--primary)/0.1)]">
                          <Icon className="h-5 w-5 text-[hsl(var(--primary))]" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {t.name}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{t.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <Separator className="mb-8" />

        {/* History Section */}
        <section>
          <h2 className="mb-1 text-lg font-semibold">Recent Generations</h2>
          <p className="mb-5 text-sm text-[hsl(var(--muted-foreground))]">
            Your latest generated content
          </p>

          {!generations || generations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Sparkles className="mb-4 h-12 w-12 text-[hsl(var(--muted-foreground))]" />
                <h3 className="mb-2 text-base font-medium">
                  No generations yet
                </h3>
                <p className="mb-6 max-w-sm text-sm text-[hsl(var(--muted-foreground))]">
                  Pick a template above to generate your first piece of
                  AI-powered content.
                </p>
                <Link href={`/generate/${templates[0]?.slug}`}>
                  <Button>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Try {templates[0]?.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {generations.map((gen) => {
                const tpl = templates.find((t) => t.slug === gen.template);
                const Icon = tpl
                  ? (iconMap[tpl.icon] ?? Sparkles)
                  : Sparkles;
                const preview = gen.output
                  ? gen.output.length > 120
                    ? gen.output.slice(0, 120) + "..."
                    : gen.output
                  : "No output";

                return (
                  <Card key={gen.id} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-[hsl(var(--primary))]" />
                          <Badge variant="secondary" className="text-xs">
                            {tpl?.name ?? gen.template}
                          </Badge>
                        </div>
                        <FavoriteButton
                          generationId={gen.id}
                          initialFavorite={gen.is_favorite ?? false}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between gap-3">
                      <p className="text-sm leading-relaxed text-[hsl(var(--foreground)/0.8)]">
                        {preview}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(gen.created_at)}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
