-- Ensure content_projects has ALL required columns
-- Run this to fix "column not found" on Studio Save

DO $$
BEGIN
    -- 1. output_text
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_projects' AND column_name = 'output_text') THEN
        ALTER TABLE public.content_projects ADD COLUMN output_text text;
    END IF;

    -- 2. form_json
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_projects' AND column_name = 'form_json') THEN
        ALTER TABLE public.content_projects ADD COLUMN form_json jsonb DEFAULT '{}'::jsonb;
    END IF;

    -- 3. content_kind
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_projects' AND column_name = 'content_kind') THEN
        ALTER TABLE public.content_projects ADD COLUMN content_kind text;
    END IF;

    -- 4. mode
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_projects' AND column_name = 'mode') THEN
        ALTER TABLE public.content_projects ADD COLUMN mode text;
    END IF;

    -- 5. title
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_projects' AND column_name = 'title') THEN
        ALTER TABLE public.content_projects ADD COLUMN title text;
    END IF;

    -- 6. profile_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_projects' AND column_name = 'profile_id') THEN
        ALTER TABLE public.content_projects ADD COLUMN profile_id uuid REFERENCES public.brand_profiles(id);
    END IF;

    -- 7. status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_projects' AND column_name = 'status') THEN
        ALTER TABLE public.content_projects ADD COLUMN status text DEFAULT 'draft';
    END IF;

END $$;
