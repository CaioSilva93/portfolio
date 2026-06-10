"use client";

import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Moon, Sun, LogOut, Database } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface NavbarProps {
  user: { id: string; email: string };
  teamId: string;
  role: string;
}

export function Navbar({ user, teamId, role }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [seeding, setSeeding] = useState(false);
  const initials = user.email.slice(0, 2).toUpperCase();

  async function handleSeed() {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to seed data");
      } else {
        toast.success(`Seeded ${data.counts?.customers ?? 0} customers, ${data.counts?.revenue_events ?? 0} revenue events`);
        window.location.reload();
      }
    } catch {
      toast.error("Failed to seed data");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2 pl-10 md:pl-0">
        <Badge variant="secondary" className="text-xs">
          {role}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSeed}
            disabled={seeding}
          >
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">{seeding ? "Seeding…" : "Seed Data"}</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">{role}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action="/auth/signout" method="POST" className="w-full">
                <button type="submit" className="flex w-full items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
