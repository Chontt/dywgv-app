-- Migration: Phase 1 Foundation v2
-- Created: 2026-01-04
-- Goals: Create user_settings, update daily_goals, update content_projects

BEGIN;

-- 1. Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  active_profile_id uuid REFERENCES public.brand_profiles(id),
  preferred_language text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_settings' AND policyname = 'Users can manage own settings'
  ) THEN
    CREATE POLICY "Users can manage own settings" ON public.user_settings
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;


-- 2. Update daily_goals
-- Add goal_date if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_goals' AND column_name = 'goal_date'
  ) THEN
    ALTER TABLE public.daily_goals ADD COLUMN goal_date date DEFAULT CURRENT_DATE;
  END IF;
END $$;


-- 3. Update content_projects
-- Add status, platform, content_parts, last_opened_at, updated_at
DO $$
BEGIN
  -- status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_projects' AND column_name = 'status') THEN
    ALTER TABLE public.content_projects ADD COLUMN status text DEFAULT 'draft';
  END IF;

  -- platform
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_projects' AND column_name = 'platform') THEN
    ALTER TABLE public.content_projects ADD COLUMN platform text;
  END IF;

  -- content_parts
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_projects' AND column_name = 'content_parts') THEN
    ALTER TABLE public.content_projects ADD COLUMN content_parts jsonb DEFAULT '{}'::jsonb;
  END IF;

  -- last_opened_at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_projects' AND column_name = 'last_opened_at') THEN
    ALTER TABLE public.content_projects ADD COLUMN last_opened_at timestamptz DEFAULT now();
  END IF;

  -- updated_at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_projects' AND column_name = 'updated_at') THEN
    ALTER TABLE public.content_projects ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

COMMIT;
