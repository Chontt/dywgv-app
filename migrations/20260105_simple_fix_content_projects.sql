-- SIMPLE FORCE FIX
-- Run this to absolutely ensure the columns exist.

ALTER TABLE public.content_projects ADD COLUMN IF NOT EXISTS form_json jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.content_projects ADD COLUMN IF NOT EXISTS output_text text;
ALTER TABLE public.content_projects ADD COLUMN IF NOT EXISTS content_kind text;
ALTER TABLE public.content_projects ADD COLUMN IF NOT EXISTS mode text;
ALTER TABLE public.content_projects ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.content_projects ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';
ALTER TABLE public.content_projects ADD COLUMN IF NOT EXISTS profile_id uuid REFERENCES public.brand_profiles(id);

-- Toggling RLS to force the schema cache to refresh
ALTER TABLE public.content_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_projects ENABLE ROW LEVEL SECURITY;
