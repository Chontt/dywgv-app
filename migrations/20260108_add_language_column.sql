-- Add authoritative 'language' column for Global Language Infrastructure
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brand_profiles' AND column_name = 'language') THEN
        ALTER TABLE public.brand_profiles ADD COLUMN language text DEFAULT 'en';
    END IF;
END $$;
