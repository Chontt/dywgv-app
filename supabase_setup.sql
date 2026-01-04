-- SUPABASE SETUP: USER FEEDBACK TABLE
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.user_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sentiment TEXT NOT NULL, -- 'positive', 'neutral', 'negative'
    blocker TEXT NOT NULL,
    details TEXT,
    page_context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
-- Drop existing policies if they exist to avoid "already exists" errors
DROP POLICY IF EXISTS "Users can insert their own feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.user_feedback;

-- Users can only insert their own feedback
CREATE POLICY "Users can insert their own feedback" 
ON public.user_feedback 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Only authenticated users can see their own feedback (optional, usually admin only)
CREATE POLICY "Users can view their own feedback" 
ON public.user_feedback 
FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Grant access to the 'anon' and 'authenticated' roles
GRANT ALL ON public.user_feedback TO authenticated;
GRANT ALL ON public.user_feedback TO service_role;
