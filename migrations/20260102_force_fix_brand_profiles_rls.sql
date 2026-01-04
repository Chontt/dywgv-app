-- FORCE FIX: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own brand_profiles" ON public.brand_profiles;
DROP POLICY IF EXISTS "Users can view their own brand_profiles" ON public.brand_profiles;
DROP POLICY IF EXISTS "Users can update their own brand_profiles" ON public.brand_profiles;

-- Re-enable RLS
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;

-- Re-create Allow Insert Policy
CREATE POLICY "Users can insert their own brand_profiles"
ON public.brand_profiles
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Re-create Allow Select Policy
CREATE POLICY "Users can view their own brand_profiles"
ON public.brand_profiles
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- Re-create Allow Update Policy (allow updating only own rows and ensure updated row remains owned)
CREATE POLICY "Users can update their own brand_profiles"
ON public.brand_profiles
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);
