"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bug, LayoutDashboard, FolderKanban, Users, Settings, Activity, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

interface Workspace {
  workspace_id: string;
  role: string;
  saas_workspaces: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
  };
}

interface AppShellProps {
  user: User;
  workspaces: Workspace[];
  children: React.ReactNode;
}

export function AppShell({ user, workspaces, children }: AppShellProps) {
  const pathname = usePathname();

  const currentSlug = pathname.split("/")[1];
  const currentWorkspace = workspaces.find(
    (w) => w.saas_workspaces.slug === currentSlug
  );

  const navItems = currentWorkspace
    ? [
        { href: `/${currentSlug}`, label: "Dashboard", icon: LayoutDashboard },
        { href: `/${currentSlug}/issues`, label: "Issues", icon: Bug },
        { href: `/${currentSlug}/projects`, label: "Projects", icon: FolderKanban },
        { href: `/${currentSlug}/members`, label: "Members", icon: Users },
        { href: `/${currentSlug}/activity`, label: "Activity", icon: Activity },
        { href: `/${currentSlug}/settings`, label: "Settings", icon: Settings },
      ]
    : [];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-shrink-0 border-r bg-card md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Bug className="h-5 w-5 text-primary" />
              <span>Tracker</span>
            </Link>
          </div>

          {currentWorkspace && (
            <div className="border-b px-4 py-3">
              <p className="text-sm font-medium truncate">
                {currentWorkspace.saas_workspaces.name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {currentWorkspace.role}
              </p>
            </div>
          )}

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== `/${currentSlug}` && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
              <form action="/auth/signout" method="POST">
                <Button variant="ghost" size="icon" type="submit">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
