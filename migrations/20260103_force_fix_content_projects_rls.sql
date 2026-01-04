-- FORCE FIX: Drop potential conflicting policies (renaming issues)
DROP POLICY IF EXISTS "Users can insert own projects" ON public.content_projects;
DROP POLICY IF EXISTS "Users can manage own projects" ON public.content_projects;
DROP POLICY IF EXISTS "Users can view own projects" ON public.content_projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.content_projects;
DROP POLICY IF EXISTS "Users can manage own content_projects" ON public.content_projects;

-- Enable RLS
ALTER TABLE public.content_projects ENABLE ROW LEVEL SECURITY;

-- Unified Policy: Allow all actions for the owner
CREATE POLICY "Users can manage own content_projects"
ON public.content_projects
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
