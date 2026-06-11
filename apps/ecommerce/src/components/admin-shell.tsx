"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Menu, Sun, Moon, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/admin-sidebar";

interface AdminShellProps {
  children: React.ReactNode;
  userEmail: string;
}

export function AdminShell({ children, userEmail }: AdminShellProps) {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold tracking-tight">Admin</span>
        </div>
        <AdminSidebar />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="flex h-16 items-center gap-2 border-b px-6">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-lg font-bold">Admin</span>
                </SheetTitle>
                <div onClick={() => setSidebarOpen(false)}>
                  <AdminSidebar />
                </div>
              </SheetContent>
            </Sheet>

            <h2 className="text-lg font-semibold lg:hidden">Admin Panel</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {userEmail}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <form action="/auth/signout" method="POST">
              <Button variant="ghost" size="icon" type="submit" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
