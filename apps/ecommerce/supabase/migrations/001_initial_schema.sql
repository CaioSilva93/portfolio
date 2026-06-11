-- ============================================================
-- Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS public.shop_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shop_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.shop_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price integer NOT NULL CHECK (price >= 0),
  compare_at_price integer CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  image_url text,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  featured boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shop_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  full_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shop_cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.shop_products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.shop_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total integer NOT NULL CHECK (total >= 0),
  stripe_payment_intent_id text UNIQUE,
  shipping_address jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shop_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.shop_orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.shop_products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price integer NOT NULL CHECK (unit_price >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- shop_is_admin(): check if current user has admin role
-- ============================================================

CREATE OR REPLACE FUNCTION public.shop_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.shop_profiles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.shop_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.shop_is_admin() TO authenticated;

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_shop_products_category ON public.shop_products(category_id);
CREATE INDEX IF NOT EXISTS idx_shop_products_slug ON public.shop_products(slug);
CREATE INDEX IF NOT EXISTS idx_shop_products_featured ON public.shop_products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_shop_products_active ON public.shop_products(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_shop_cart_items_user ON public.shop_cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_shop_orders_user ON public.shop_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_shop_orders_status ON public.shop_orders(status);
CREATE INDEX IF NOT EXISTS idx_shop_order_items_order ON public.shop_order_items(order_id);

-- ============================================================
-- Trigger function: auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.shop_update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_shop_products_updated_at
  BEFORE UPDATE ON public.shop_products
  FOR EACH ROW EXECUTE FUNCTION public.shop_update_updated_at();

CREATE OR REPLACE TRIGGER trg_shop_orders_updated_at
  BEFORE UPDATE ON public.shop_orders
  FOR EACH ROW EXECUTE FUNCTION public.shop_update_updated_at();

-- ============================================================
-- shop_create_order(): atomic order creation
-- ============================================================

CREATE OR REPLACE FUNCTION public.shop_create_order(p_shipping_address jsonb DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id uuid;
  v_order_id uuid;
  v_total integer := 0;
  v_item record;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  FOR v_item IN
    SELECT ci.product_id, ci.quantity, p.price, p.stock, p.name
    FROM public.shop_cart_items ci
    JOIN public.shop_products p ON p.id = ci.product_id
    WHERE ci.user_id = v_user_id
    FOR UPDATE OF p
  LOOP
    IF v_item.stock < v_item.quantity THEN
      RAISE EXCEPTION 'Insufficient stock for product: %', v_item.name;
    END IF;

    UPDATE public.shop_products
    SET stock = stock - v_item.quantity
    WHERE id = v_item.product_id;

    v_total := v_total + (v_item.price * v_item.quantity);
  END LOOP;

  IF v_total = 0 THEN
    RAISE EXCEPTION 'Cart is empty';
  END IF;

  INSERT INTO public.shop_orders (user_id, total, shipping_address)
  VALUES (v_user_id, v_total, p_shipping_address)
  RETURNING id INTO v_order_id;

  INSERT INTO public.shop_order_items (order_id, product_id, quantity, unit_price)
  SELECT v_order_id, ci.product_id, ci.quantity, p.price
  FROM public.shop_cart_items ci
  JOIN public.shop_products p ON p.id = ci.product_id
  WHERE ci.user_id = v_user_id;

  DELETE FROM public.shop_cart_items WHERE user_id = v_user_id;

  RETURN v_order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.shop_create_order(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.shop_create_order(jsonb) TO authenticated;

-- ============================================================
-- shop_reset_seed_data(): wipe and re-insert seed data
-- ============================================================

CREATE OR REPLACE FUNCTION public.shop_reset_seed_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.shop_order_items;
  DELETE FROM public.shop_orders;
  DELETE FROM public.shop_cart_items;
  DELETE FROM public.shop_products;
  DELETE FROM public.shop_categories;

  INSERT INTO public.shop_categories (id, name, slug, description, image_url) VALUES
    ('a1b2c3d4-0001-4000-8000-000000000001', 'Electronics', 'electronics', 'Gadgets, devices, and accessories', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'),
    ('a1b2c3d4-0002-4000-8000-000000000002', 'Clothing', 'clothing', 'Apparel and fashion items', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'),
    ('a1b2c3d4-0003-4000-8000-000000000003', 'Home & Garden', 'home-garden', 'Furniture, decor, and garden supplies', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400'),
    ('a1b2c3d4-0004-4000-8000-000000000004', 'Books', 'books', 'Physical and digital books', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400');

  INSERT INTO public.shop_products (category_id, name, slug, description, price, compare_at_price, image_url, stock, featured) VALUES
    ('a1b2c3d4-0001-4000-8000-000000000001', 'Wireless Headphones', 'wireless-headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life', 9999, 12999, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 50, true),
    ('a1b2c3d4-0001-4000-8000-000000000001', 'Mechanical Keyboard', 'mechanical-keyboard', 'RGB mechanical keyboard with Cherry MX switches', 14999, NULL, 'https://images.unsplash.com/photo-1541140532154-b024d7c40b79?w=400', 30, true),
    ('a1b2c3d4-0001-4000-8000-000000000001', 'USB-C Hub', 'usb-c-hub', '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader', 4999, 5999, 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400', 100, false),
    ('a1b2c3d4-0002-4000-8000-000000000002', 'Cotton T-Shirt', 'cotton-tshirt', 'Premium organic cotton t-shirt, available in multiple colors', 2499, NULL, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 200, false),
    ('a1b2c3d4-0002-4000-8000-000000000002', 'Denim Jacket', 'denim-jacket', 'Classic denim jacket with modern fit', 7999, 9999, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400', 40, true),
    ('a1b2c3d4-0002-4000-8000-000000000002', 'Running Shoes', 'running-shoes', 'Lightweight running shoes with responsive cushioning', 11999, NULL, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 60, true),
    ('a1b2c3d4-0003-4000-8000-000000000003', 'Desk Lamp', 'desk-lamp', 'Adjustable LED desk lamp with wireless charging base', 5999, 7499, 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400', 80, false),
    ('a1b2c3d4-0003-4000-8000-000000000003', 'Indoor Plant Set', 'indoor-plant-set', 'Set of 3 low-maintenance indoor plants with ceramic pots', 3999, NULL, 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400', 25, false),
    ('a1b2c3d4-0004-4000-8000-000000000004', 'TypeScript Handbook', 'typescript-handbook', 'Comprehensive guide to TypeScript for modern development', 3499, 3999, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 150, false),
    ('a1b2c3d4-0004-4000-8000-000000000004', 'Design Patterns', 'design-patterns', 'Essential design patterns for software engineers', 4499, NULL, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 120, false);
END;
$$;

REVOKE ALL ON FUNCTION public.shop_reset_seed_data() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.shop_reset_seed_data() TO authenticated;

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE public.shop_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_order_items ENABLE ROW LEVEL SECURITY;

-- shop_categories: public read, admin write
CREATE POLICY shop_categories_select ON public.shop_categories
  FOR SELECT USING (true);

CREATE POLICY shop_categories_insert ON public.shop_categories
  FOR INSERT TO authenticated WITH CHECK (public.shop_is_admin());

CREATE POLICY shop_categories_update ON public.shop_categories
  FOR UPDATE TO authenticated USING (public.shop_is_admin());

CREATE POLICY shop_categories_delete ON public.shop_categories
  FOR DELETE TO authenticated USING (public.shop_is_admin());

-- shop_products: public read, admin write
CREATE POLICY shop_products_select ON public.shop_products
  FOR SELECT USING (true);

CREATE POLICY shop_products_insert ON public.shop_products
  FOR INSERT TO authenticated WITH CHECK (public.shop_is_admin());

CREATE POLICY shop_products_update ON public.shop_products
  FOR UPDATE TO authenticated USING (public.shop_is_admin());

CREATE POLICY shop_products_delete ON public.shop_products
  FOR DELETE TO authenticated USING (public.shop_is_admin());

-- shop_profiles: users read own, admin reads all, user inserts own
CREATE POLICY shop_profiles_select_own ON public.shop_profiles
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.shop_is_admin());

CREATE POLICY shop_profiles_insert_own ON public.shop_profiles
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY shop_profiles_update_own ON public.shop_profiles
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- shop_cart_items: user manages own cart
CREATE POLICY shop_cart_items_select_own ON public.shop_cart_items
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY shop_cart_items_insert_own ON public.shop_cart_items
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY shop_cart_items_update_own ON public.shop_cart_items
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY shop_cart_items_delete_own ON public.shop_cart_items
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- shop_orders: user reads own, admin reads all
CREATE POLICY shop_orders_select_own ON public.shop_orders
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.shop_is_admin());

CREATE POLICY shop_orders_insert_own ON public.shop_orders
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY shop_orders_update_admin ON public.shop_orders
  FOR UPDATE TO authenticated USING (public.shop_is_admin());

-- shop_order_items: user reads own order items, admin reads all
CREATE POLICY shop_order_items_select_own ON public.shop_order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.shop_orders o
      WHERE o.id = order_id
        AND (o.user_id = auth.uid() OR public.shop_is_admin())
    )
  );

CREATE POLICY shop_order_items_insert_own ON public.shop_order_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shop_orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

-- ============================================================
-- Realtime
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.shop_orders;

-- ============================================================
-- Seed data
-- ============================================================

SELECT public.shop_reset_seed_data();
