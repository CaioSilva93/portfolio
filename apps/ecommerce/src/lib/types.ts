export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface LocalCartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  stripe_checkout_session_id: string | null;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  total: number;
  customer_email: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_price: number;
  quantity: number;
  created_at: string;
  product?: Pick<Product, "name" | "slug" | "image_url">;
}

export interface ShopProfile {
  id: string;
  user_id: string;
  role: "customer" | "admin";
  created_at: string;
}
