-- Fix: Drop restrictive unique index that prevents multiple profiles per user
-- We want users to be able to-- 1. Try dropping as a constraint (most likely if created via UNIQUE)
ALTER TABLE public.brand_profiles DROP CONSTRAINT IF EXISTS brand_profiles_user_id_idx;

-- 2. Try dropping as an index (if created via CREATE UNIQUE INDEX)
DROP INDEX IF EXISTS brand_profiles_user_id_idx;

-- 3. Re-create as a standard non-unique index for performance
CREATE INDEX IF NOT EXISTS brand_profiles_user_id_idx ON public.brand_profiles(user_id);
