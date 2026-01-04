-- Create table only if it doesn't exist
CREATE TABLE IF NOT EXISTS public.content_projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  title text,
  mode text,
  content_kind text,
  form_json jsonb,
  output_text text,
  created_at timestamptz DEFAULT now()
);

-- Ensure profile_id exists (required by Dashboard logic)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'content_projects' AND column_name = 'profile_id'
  ) THEN
    ALTER TABLE public.content_projects ADD COLUMN profile_id uuid REFERENCES public.brand_profiles(id);
  END IF;
END $$;

-- Add RLS policies if not present
ALTER TABLE public.content_projects ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'content_projects'
      AND policyname = 'Users can manage own projects'
  ) THEN
    CREATE POLICY "Users can manage own projects" ON public.content_projects
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;
