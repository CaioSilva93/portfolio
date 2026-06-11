"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product, LocalCartItem } from "@/lib/types";

export interface CartItemWithProduct {
  productId: string;
  quantity: number;
  product: Product;
}

interface CartContextValue {
  items: CartItemWithProduct[];
  cartItemCount: number;
  addItem: (product: Product, qty?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "shop-cart";
const CART_BACKUP_KEY = "shop-cart-backup";

function getLocalCart(): LocalCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalCart(items: LocalCartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function clearLocalCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}

export function saveCartToCookie(items: LocalCartItem[]) {
  if (typeof document === "undefined") return;
  document.cookie = `${CART_BACKUP_KEY}=${encodeURIComponent(JSON.stringify(items))};path=/;max-age=3600;SameSite=Lax`;
}

export function getCartFromCookie(): LocalCartItem[] {
  if (typeof document === "undefined") return [];
  try {
    const match = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${CART_BACKUP_KEY}=`));
    if (!match) return [];
    return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("=")));
  } catch {
    return [];
  }
}

export function clearCartCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${CART_BACKUP_KEY}=;path=/;max-age=0`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const loadGuestCart = useCallback(async () => {
    const local = getLocalCart();
    if (local.length === 0) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const ids = local.map((i) => i.productId);
    const { data: products } = await supabase
      .from("shop_products")
      .select("*, shop_categories(*)")
      .in("id", ids)
      .eq("active", true);

    if (!products) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const mapped: CartItemWithProduct[] = local
      .map((li) => {
        const product = products.find((p: Product) => p.id === li.productId);
        if (!product) return null;
        return {
          productId: li.productId,
          quantity: li.quantity,
          product: {
            ...product,
            category: product.shop_categories ?? product.category,
          } as Product,
        };
      })
      .filter(Boolean) as CartItemWithProduct[];

    setItems(mapped);
    setIsLoading(false);
  }, [supabase]);

  const loadDbCart = useCallback(async () => {
    const { data } = await supabase
      .from("shop_cart_items")
      .select("product_id, quantity, shop_products(*, shop_categories(*))")
      .order("created_at", { ascending: true });

    if (!data) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const mapped: CartItemWithProduct[] = data
      .map((row: Record<string, unknown>) => {
        const product = row.shop_products as Record<string, unknown> | null;
        if (!product) return null;
        const cat = (product as Record<string, unknown>).shop_categories;
        return {
          productId: row.product_id as string,
          quantity: row.quantity as number,
          product: { ...product, category: cat } as unknown as Product,
        };
      })
      .filter(Boolean) as CartItemWithProduct[];

    setItems(mapped);
    setIsLoading(false);
  }, [supabase]);

  const mergeLocalCartIntoDB = useCallback(
    async (uid: string) => {
      const local = getLocalCart();
      const cookieCart = getCartFromCookie();
      const toMerge = [...local, ...cookieCart];

      if (toMerge.length > 0) {
        const deduped = new Map<string, number>();
        for (const item of toMerge) {
          const existing = deduped.get(item.productId) ?? 0;
          deduped.set(item.productId, Math.max(existing, item.quantity));
        }

        for (const [productId, quantity] of deduped) {
          await supabase.from("shop_cart_items").upsert(
            { user_id: uid, product_id: productId, quantity },
            { onConflict: "user_id,product_id" }
          );
        }

        clearLocalCart();
        clearCartCookie();
      }

      await loadDbCart();
    },
    [supabase, loadDbCart]
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        mergeLocalCartIntoDB(user.id);
      } else {
        setUserId(null);
        loadGuestCart();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUserId(session.user.id);
        mergeLocalCartIntoDB(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUserId(null);
        setItems([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, loadGuestCart, mergeLocalCartIntoDB]);

  const addItem = useCallback(
    async (product: Product, qty = 1) => {
      if (userId) {
        const existing = items.find((i) => i.productId === product.id);
        const newQty = (existing?.quantity ?? 0) + qty;
        await supabase.from("shop_cart_items").upsert(
          { user_id: userId, product_id: product.id, quantity: newQty },
          { onConflict: "user_id,product_id" }
        );
        await loadDbCart();
      } else {
        const local = getLocalCart();
        const idx = local.findIndex((i) => i.productId === product.id);
        if (idx >= 0) {
          local[idx].quantity += qty;
        } else {
          local.push({ productId: product.id, quantity: qty });
        }
        setLocalCart(local);

        setItems((prev) => {
          const eIdx = prev.findIndex((i) => i.productId === product.id);
          if (eIdx >= 0) {
            const updated = [...prev];
            updated[eIdx] = {
              ...updated[eIdx],
              quantity: updated[eIdx].quantity + qty,
            };
            return updated;
          }
          return [...prev, { productId: product.id, quantity: qty, product }];
        });
      }
    },
    [userId, items, supabase, loadDbCart]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (userId) {
        await supabase
          .from("shop_cart_items")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", productId);
        await loadDbCart();
      } else {
        const local = getLocalCart().filter((i) => i.productId !== productId);
        setLocalCart(local);
        setItems((prev) => prev.filter((i) => i.productId !== productId));
      }
    },
    [userId, supabase, loadDbCart]
  );

  const updateQuantity = useCallback(
    async (productId: string, qty: number) => {
      if (qty <= 0) {
        await removeItem(productId);
        return;
      }
      if (userId) {
        await supabase
          .from("shop_cart_items")
          .update({ quantity: qty })
          .eq("user_id", userId)
          .eq("product_id", productId);
        await loadDbCart();
      } else {
        const local = getLocalCart();
        const idx = local.findIndex((i) => i.productId === productId);
        if (idx >= 0) {
          local[idx].quantity = qty;
          setLocalCart(local);
        }
        setItems((prev) =>
          prev.map((i) =>
            i.productId === productId ? { ...i, quantity: qty } : i
          )
        );
      }
    },
    [userId, removeItem, supabase, loadDbCart]
  );

  const clearCart = useCallback(async () => {
    if (userId) {
      await supabase
        .from("shop_cart_items")
        .delete()
        .eq("user_id", userId);
      setItems([]);
    } else {
      clearLocalCart();
      setItems([]);
    }
  }, [userId, supabase]);

  const cartItemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      cartItemCount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isLoading,
    }),
    [items, cartItemCount, addItem, removeItem, updateQuantity, clearCart, isLoading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
