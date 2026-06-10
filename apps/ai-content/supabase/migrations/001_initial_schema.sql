-- AI Content Generator Schema
-- Tables prefixed with ai_ (shared Supabase project)

CREATE TABLE ai_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template TEXT NOT NULL,
  input_data JSONB NOT NULL,
  output TEXT,
  model TEXT NOT NULL DEFAULT 'gemini-2.0-flash',
  tokens_used INTEGER,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generations"
  ON ai_generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations"
  ON ai_generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generations"
  ON ai_generations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own generations"
  ON ai_generations FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_ai_generations_user ON ai_generations(user_id, created_at DESC, id DESC);
CREATE INDEX idx_ai_generations_favorite ON ai_generations(user_id, is_favorite) WHERE is_favorite = TRUE;
