-- Enable RLS (just in case)
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own profiles
CREATE POLICY "Users can insert their own brand_profiles"
ON public.brand_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Also ensure they can select their own profiles (likely already exists, but good to ensure)
CREATE POLICY "Users can view their own brand_profiles"
ON public.brand_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow updates
CREATE POLICY "Users can update their own brand_profiles"
ON public.brand_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);
