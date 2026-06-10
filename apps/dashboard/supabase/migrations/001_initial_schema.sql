-- ============================================================
-- Dashboard SaaS Analytics — Initial Schema
-- Table prefix: dash_
-- ============================================================

-- 1. Teams
CREATE TABLE IF NOT EXISTS dash_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'My Team',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Team members (join table: auth.users <-> dash_teams)
CREATE TABLE IF NOT EXISTS dash_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES dash_teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (team_id, user_id)
);

-- 3. Customers
CREATE TABLE IF NOT EXISTS dash_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES dash_teams(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'churned', 'trial')),
  mrr integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (team_id, email)
);

-- 4. Revenue events
CREATE TABLE IF NOT EXISTS dash_revenue_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES dash_teams(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES dash_customers(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  event_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Activity log
CREATE TABLE IF NOT EXISTS dash_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES dash_teams(id) ON DELETE CASCADE,
  actor_name text NOT NULL,
  action text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_dash_team_members_user_id ON dash_team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_dash_team_members_team_id ON dash_team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_dash_customers_team_id ON dash_customers(team_id);
CREATE INDEX IF NOT EXISTS idx_dash_customers_status ON dash_customers(team_id, status);
CREATE INDEX IF NOT EXISTS idx_dash_customers_plan ON dash_customers(team_id, plan);
CREATE INDEX IF NOT EXISTS idx_dash_revenue_events_team_id ON dash_revenue_events(team_id);
CREATE INDEX IF NOT EXISTS idx_dash_revenue_events_date ON dash_revenue_events(team_id, event_date);
CREATE INDEX IF NOT EXISTS idx_dash_activity_log_team_id ON dash_activity_log(team_id);

-- ============================================================
-- Helper functions (SECURITY DEFINER, STABLE)
-- ============================================================

CREATE OR REPLACE FUNCTION get_my_team_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT team_id FROM dash_team_members WHERE user_id = auth.uid();
$$;

REVOKE ALL ON FUNCTION get_my_team_ids() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_my_team_ids() TO authenticated;

CREATE OR REPLACE FUNCTION is_team_admin(p_team_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM dash_team_members
    WHERE team_id = p_team_id
      AND user_id = auth.uid()
      AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION is_team_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_team_admin(uuid) TO authenticated;

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE dash_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE dash_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE dash_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dash_revenue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE dash_activity_log ENABLE ROW LEVEL SECURITY;

-- dash_teams
CREATE POLICY "teams_select" ON dash_teams
  FOR SELECT TO authenticated
  USING (id IN (SELECT get_my_team_ids()));

CREATE POLICY "teams_insert" ON dash_teams
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- dash_team_members
CREATE POLICY "team_members_select" ON dash_team_members
  FOR SELECT TO authenticated
  USING (team_id IN (SELECT get_my_team_ids()));

CREATE POLICY "team_members_insert" ON dash_team_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "team_members_update" ON dash_team_members
  FOR UPDATE TO authenticated
  USING (is_team_admin(team_id));

-- dash_customers
CREATE POLICY "customers_select" ON dash_customers
  FOR SELECT TO authenticated
  USING (team_id IN (SELECT get_my_team_ids()));

CREATE POLICY "customers_insert" ON dash_customers
  FOR INSERT TO authenticated
  WITH CHECK (is_team_admin(team_id));

CREATE POLICY "customers_update" ON dash_customers
  FOR UPDATE TO authenticated
  USING (is_team_admin(team_id));

CREATE POLICY "customers_delete" ON dash_customers
  FOR DELETE TO authenticated
  USING (is_team_admin(team_id));

-- dash_revenue_events
CREATE POLICY "revenue_select" ON dash_revenue_events
  FOR SELECT TO authenticated
  USING (team_id IN (SELECT get_my_team_ids()));

CREATE POLICY "revenue_insert" ON dash_revenue_events
  FOR INSERT TO authenticated
  WITH CHECK (is_team_admin(team_id));

-- dash_activity_log
CREATE POLICY "activity_select" ON dash_activity_log
  FOR SELECT TO authenticated
  USING (team_id IN (SELECT get_my_team_ids()));

CREATE POLICY "activity_insert" ON dash_activity_log
  FOR INSERT TO authenticated
  WITH CHECK (is_team_admin(team_id));

-- ============================================================
-- Seed function (SECURITY DEFINER — bypasses RLS)
-- ============================================================

CREATE OR REPLACE FUNCTION seed_team_data(p_team_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_ids uuid[];
  v_id uuid;
  v_names text[] := ARRAY['Alice Johnson','Bob Smith','Carol White','David Brown','Eva Martinez','Frank Lee','Grace Kim','Henry Wilson','Irene Davis','Jack Taylor','Kate Anderson','Leo Thomas','Mia Garcia','Noah Robinson','Olivia Clark'];
  v_plans text[] := ARRAY['free','starter','pro','enterprise'];
  v_statuses text[] := ARRAY['active','active','active','churned','trial'];
  v_actions text[] := ARRAY['signed_up','upgraded_plan','made_payment','contacted_support','cancelled_subscription','renewed_subscription','invited_member'];
  v_mrr_map jsonb := '{"free":0,"starter":2900,"pro":9900,"enterprise":29900}';
  v_plan text;
  v_mrr int;
BEGIN
  DELETE FROM dash_activity_log WHERE team_id = p_team_id;
  DELETE FROM dash_revenue_events WHERE team_id = p_team_id;
  DELETE FROM dash_customers WHERE team_id = p_team_id;

  FOR i IN 1..array_length(v_names, 1) LOOP
    v_plan := v_plans[1 + floor(random() * array_length(v_plans, 1))::int];
    v_mrr := (v_mrr_map ->> v_plan)::int;
    v_id := gen_random_uuid();
    v_customer_ids := array_append(v_customer_ids, v_id);

    INSERT INTO dash_customers (id, team_id, name, email, plan, status, mrr, created_at)
    VALUES (
      v_id,
      p_team_id,
      v_names[i],
      lower(replace(v_names[i], ' ', '.')) || '@example.com',
      v_plan,
      v_statuses[1 + floor(random() * array_length(v_statuses, 1))::int],
      v_mrr,
      now() - (random() * interval '180 days')
    );
  END LOOP;

  FOR i IN 1..60 LOOP
    INSERT INTO dash_revenue_events (team_id, customer_id, amount, event_date, created_at)
    VALUES (
      p_team_id,
      v_customer_ids[1 + floor(random() * array_length(v_customer_ids, 1))::int],
      (500 + floor(random() * 30000))::int,
      CURRENT_DATE - (floor(random() * 180))::int,
      now()
    );
  END LOOP;

  FOR i IN 1..25 LOOP
    INSERT INTO dash_activity_log (team_id, actor_name, action, created_at)
    VALUES (
      p_team_id,
      v_names[1 + floor(random() * array_length(v_names, 1))::int],
      v_actions[1 + floor(random() * array_length(v_actions, 1))::int],
      now() - (random() * interval '30 days')
    );
  END LOOP;

  RETURN jsonb_build_object(
    'customers', array_length(v_customer_ids, 1),
    'revenue_events', 60,
    'activity_logs', 25
  );
END;
$$;

REVOKE ALL ON FUNCTION seed_team_data(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION seed_team_data(uuid) TO authenticated;

-- ============================================================
-- Realtime publication
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE dash_customers;
ALTER PUBLICATION supabase_realtime ADD TABLE dash_revenue_events;
ALTER PUBLICATION supabase_realtime ADD TABLE dash_activity_log;
