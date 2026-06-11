-- Realtime Collaborative Board Schema
-- Table prefix: collab_

-- Boards
CREATE TABLE collab_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Board members (multi-user collaboration)
CREATE TABLE collab_board_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES collab_boards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('owner', 'editor', 'viewer')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(board_id, user_id)
);

-- Kanban columns
CREATE TABLE collab_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES collab_boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Kanban cards
CREATE TABLE collab_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  column_id UUID NOT NULL REFERENCES collab_columns(id) ON DELETE CASCADE,
  board_id UUID NOT NULL REFERENCES collab_boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0,
  color TEXT DEFAULT NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activity log
CREATE TABLE collab_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES collab_boards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_collab_board_members_user ON collab_board_members(user_id);
CREATE INDEX idx_collab_board_members_board ON collab_board_members(board_id);
CREATE INDEX idx_collab_columns_board ON collab_columns(board_id);
CREATE INDEX idx_collab_columns_position ON collab_columns(board_id, position);
CREATE INDEX idx_collab_cards_column ON collab_cards(column_id);
CREATE INDEX idx_collab_cards_board ON collab_cards(board_id);
CREATE INDEX idx_collab_cards_position ON collab_cards(column_id, position);
CREATE INDEX idx_collab_activity_board ON collab_activity_log(board_id, created_at DESC);

-- Helper function for RLS: get boards user is member of
CREATE OR REPLACE FUNCTION collab_get_user_board_ids(uid UUID)
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT board_id FROM collab_board_members WHERE user_id = uid
$$;

REVOKE EXECUTE ON FUNCTION collab_get_user_board_ids FROM PUBLIC;
GRANT EXECUTE ON FUNCTION collab_get_user_board_ids TO authenticated;

-- Helper: check if user is editor+ on a board
CREATE OR REPLACE FUNCTION collab_is_editor(uid UUID, bid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM collab_board_members
    WHERE board_id = bid AND user_id = uid AND role IN ('owner', 'editor')
  )
$$;

REVOKE EXECUTE ON FUNCTION collab_is_editor FROM PUBLIC;
GRANT EXECUTE ON FUNCTION collab_is_editor TO authenticated;

-- SECURITY DEFINER function: create board + owner membership + default columns atomically
CREATE OR REPLACE FUNCTION collab_create_board(
  p_title TEXT,
  p_description TEXT DEFAULT ''
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_board_id UUID;
  v_user_id UUID := auth.uid();
BEGIN
  INSERT INTO collab_boards (title, description, owner_id)
  VALUES (p_title, p_description, v_user_id)
  RETURNING id INTO v_board_id;

  INSERT INTO collab_board_members (board_id, user_id, role)
  VALUES (v_board_id, v_user_id, 'owner');

  INSERT INTO collab_columns (board_id, title, position) VALUES
    (v_board_id, 'To Do', 0),
    (v_board_id, 'In Progress', 1),
    (v_board_id, 'Done', 2);

  RETURN v_board_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION collab_create_board FROM PUBLIC;
GRANT EXECUTE ON FUNCTION collab_create_board TO authenticated;

-- SECURITY DEFINER function: reorder items in batch (avoids N+1 updates)
CREATE OR REPLACE FUNCTION collab_reorder_cards(p_updates JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item JSONB;
  v_board_id UUID;
BEGIN
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_updates)
  LOOP
    SELECT board_id INTO v_board_id FROM collab_cards WHERE id = (v_item->>'id')::UUID;
    IF NOT collab_is_editor(auth.uid(), v_board_id) THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
    UPDATE collab_cards
    SET position = (v_item->>'position')::INT,
        column_id = (v_item->>'column_id')::UUID
    WHERE id = (v_item->>'id')::UUID;
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION collab_reorder_cards FROM PUBLIC;
GRANT EXECUTE ON FUNCTION collab_reorder_cards TO authenticated;

CREATE OR REPLACE FUNCTION collab_reorder_columns(p_updates JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item JSONB;
  v_board_id UUID;
BEGIN
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_updates)
  LOOP
    SELECT board_id INTO v_board_id FROM collab_columns WHERE id = (v_item->>'id')::UUID;
    IF NOT collab_is_editor(auth.uid(), v_board_id) THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
    UPDATE collab_columns
    SET position = (v_item->>'position')::INT
    WHERE id = (v_item->>'id')::UUID;
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION collab_reorder_columns FROM PUBLIC;
GRANT EXECUTE ON FUNCTION collab_reorder_columns TO authenticated;

-- RLS Policies
ALTER TABLE collab_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE collab_board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE collab_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE collab_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE collab_activity_log ENABLE ROW LEVEL SECURITY;

-- collab_boards policies
CREATE POLICY "Members can view boards" ON collab_boards
  FOR SELECT USING (id IN (SELECT collab_get_user_board_ids(auth.uid())));
CREATE POLICY "Authenticated can insert boards" ON collab_boards
  FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owner can update boards" ON collab_boards
  FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Owner can delete boards" ON collab_boards
  FOR DELETE USING (owner_id = auth.uid());

-- collab_board_members policies
CREATE POLICY "Members can view members" ON collab_board_members
  FOR SELECT USING (board_id IN (SELECT collab_get_user_board_ids(auth.uid())));
CREATE POLICY "Owner can insert members" ON collab_board_members
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM collab_boards WHERE id = board_id AND owner_id = auth.uid())
  );
CREATE POLICY "Owner can update members" ON collab_board_members
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM collab_boards WHERE id = board_id AND owner_id = auth.uid())
  );
CREATE POLICY "Owner can delete members" ON collab_board_members
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM collab_boards WHERE id = board_id AND owner_id = auth.uid())
    OR user_id = auth.uid()
  );

-- collab_columns policies
CREATE POLICY "Members can view columns" ON collab_columns
  FOR SELECT USING (board_id IN (SELECT collab_get_user_board_ids(auth.uid())));
CREATE POLICY "Editors can insert columns" ON collab_columns
  FOR INSERT WITH CHECK (collab_is_editor(auth.uid(), board_id));
CREATE POLICY "Editors can update columns" ON collab_columns
  FOR UPDATE USING (collab_is_editor(auth.uid(), board_id));
CREATE POLICY "Editors can delete columns" ON collab_columns
  FOR DELETE USING (collab_is_editor(auth.uid(), board_id));

-- collab_cards policies
CREATE POLICY "Members can view cards" ON collab_cards
  FOR SELECT USING (board_id IN (SELECT collab_get_user_board_ids(auth.uid())));
CREATE POLICY "Editors can insert cards" ON collab_cards
  FOR INSERT WITH CHECK (collab_is_editor(auth.uid(), board_id));
CREATE POLICY "Editors can update cards" ON collab_cards
  FOR UPDATE USING (collab_is_editor(auth.uid(), board_id));
CREATE POLICY "Editors can delete cards" ON collab_cards
  FOR DELETE USING (collab_is_editor(auth.uid(), board_id));

-- collab_activity_log policies
CREATE POLICY "Members can view activity" ON collab_activity_log
  FOR SELECT USING (board_id IN (SELECT collab_get_user_board_ids(auth.uid())));
CREATE POLICY "Editors can insert activity" ON collab_activity_log
  FOR INSERT WITH CHECK (collab_is_editor(auth.uid(), board_id));

-- Realtime publication (idempotent)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE collab_columns;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE collab_cards;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE collab_activity_log;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Updated_at triggers
CREATE OR REPLACE FUNCTION collab_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER collab_boards_updated_at
  BEFORE UPDATE ON collab_boards
  FOR EACH ROW EXECUTE FUNCTION collab_update_updated_at();

CREATE TRIGGER collab_cards_updated_at
  BEFORE UPDATE ON collab_cards
  FOR EACH ROW EXECUTE FUNCTION collab_update_updated_at();
