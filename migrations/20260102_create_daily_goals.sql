-- Migration: create daily_goals table
-- Created: 2026-01-02

BEGIN;

CREATE TABLE IF NOT EXISTS daily_goals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  is_done boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Index for querying by user
CREATE INDEX IF NOT EXISTS idx_daily_goals_user_id ON daily_goals(user_id);

COMMIT;
