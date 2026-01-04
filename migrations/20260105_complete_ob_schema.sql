-- Comprehensive migration to ensure all Brain Builder columns exist
-- Run this to fix "column not found" errors in Onboarding

DO $$
BEGIN
    -- 1. brand_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'brand_name') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN brand_name text;
    END IF;

    -- 2. industry
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'industry') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN industry text;
    END IF;

    -- 3. tone
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'tone') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN tone text;
    END IF;

    -- 4. goal
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'goal') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN goal text;
    END IF;

    -- 5. main_language
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'main_language') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN main_language text;
    END IF;

    -- 6. platforms (Array of text)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'platforms') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN platforms text[];
    END IF;

    -- 8. mode
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'mode') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN mode text;
    END IF;

    -- 9. niche
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'niche') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN niche text;
    END IF;

    -- 10. target_audience
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'target_audience') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN target_audience text;
    END IF;

    -- 11. style
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'style') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN style text;
    END IF;

    -- 7. strategic_profile (JSONB)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'strategic_profile') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN strategic_profile jsonb DEFAULT '{}'::jsonb;
    END IF;

END $$;

-- Update RLS to be safe
DROP POLICY IF EXISTS "Users can insert their own brand_profiles" ON public.brand_profiles;
CREATE POLICY "Users can insert their own brand_profiles"
ON public.brand_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
