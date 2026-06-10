-- URL Shortener Schema
-- Tables prefixed with short_ (shared Supabase project)

CREATE TABLE short_urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(30) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_short_urls_user_id ON short_urls(user_id);

CREATE TABLE short_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url_id UUID REFERENCES short_urls(id) ON DELETE CASCADE NOT NULL,
  clicked_at TIMESTAMPTZ DEFAULT now(),
  country VARCHAR(2),
  city VARCHAR(100),
  device VARCHAR(20),
  browser VARCHAR(50),
  os VARCHAR(50),
  referrer TEXT
);

CREATE INDEX idx_short_clicks_url_id ON short_clicks(url_id);
CREATE INDEX idx_short_clicks_clicked_at ON short_clicks(url_id, clicked_at);
CREATE INDEX idx_short_clicks_country ON short_clicks(url_id, country);
CREATE INDEX idx_short_clicks_device ON short_clicks(url_id, device);

-- RLS
ALTER TABLE short_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE short_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own and anonymous URLs" ON short_urls
  FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can insert own URLs" ON short_urls
  FOR INSERT WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can update own URLs" ON short_urls
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own URLs" ON short_urls
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "URL owners can read clicks" ON short_clicks
  FOR SELECT USING (
    url_id IN (SELECT id FROM short_urls WHERE user_id = auth.uid())
  );

-- Increment function (service_role only)
CREATE OR REPLACE FUNCTION increment_click_count(url_slug VARCHAR)
RETURNS VOID AS $$
  UPDATE short_urls SET clicks_count = clicks_count + 1 WHERE slug = url_slug;
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION increment_click_count FROM public, anon, authenticated;
