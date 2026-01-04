-- Enable RLS on daily_goals if not already enabled
ALTER TABLE public.daily_goals ENABLE ROW LEVEL SECURITY;

-- Idempotent policy creation using a DO block
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'daily_goals'
      AND policyname = 'Users can manage own goals'
  ) THEN
    CREATE POLICY "Users can manage own goals" ON public.daily_goals
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;
