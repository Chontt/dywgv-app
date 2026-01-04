-- Unified Schema Migration for Brand Profiles & Identity Layer
-- Run this to insure ALL columns exist for the new Profile & Studio features.

DO $$
BEGIN
    -- Base Columns (from your provided schema)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'brand_name') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN brand_name text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'industry') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN industry text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'tone') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN tone text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'goal') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN goal text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'main_language') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN main_language text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'platforms') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN platforms text[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'mode') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN mode text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'niche') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN niche text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'target_audience') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN target_audience text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'style') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN style text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'strategic_profile') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN strategic_profile jsonb DEFAULT '{}'::jsonb;
    END IF;

    -- Advanced Identity Layer Columns (Required for New Profile Page)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'authority_level') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN authority_level text DEFAULT 'beginner';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'emoji_preference') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN emoji_preference text DEFAULT 'minimal';
    END IF;
    -- Note: 'content_goal' might be similar to 'goal', but we use 'content_goal' in the UI. 
    -- Best to have both or migrate one. For safety, adding 'content_goal'.
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'content_goal') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN content_goal text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'platform_focus') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN platform_focus text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'positioning_statement') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN positioning_statement text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'emotional_impact') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN emotional_impact text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'role') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN role text;
    END IF;

END $$;
