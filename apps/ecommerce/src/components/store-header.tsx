"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { ShoppingCart, Sun, Moon, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { CartSheet } from "@/components/cart-sheet";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";

interface StoreHeaderProps {
  user?: { email?: string } | null;
}

export function StoreHeader({ user }: StoreHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItemCount } = useCart();

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/cart", label: "Cart" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Shop
            </Link>
            <nav className="hidden items-center gap-4 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartItemCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
                >
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </Badge>
              )}
            </Button>

            <div className="hidden items-center gap-2 md:flex">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                  <form action="/auth/signout" method="POST">
                    <Button variant="ghost" size="icon" type="submit" aria-label="Sign out">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
              )}
            </div>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
                <nav className="mt-6 flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Separator className="my-2" />
                  {user ? (
                    <>
                      <span className="text-sm text-muted-foreground">
                        {user.email}
                      </span>
                      <form action="/auth/signout" method="POST">
                        <Button variant="outline" size="sm" type="submit" className="w-full">
                          Sign Out
                        </Button>
                      </form>
                    </>
                  ) : (
                    <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Login
                      </Button>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
