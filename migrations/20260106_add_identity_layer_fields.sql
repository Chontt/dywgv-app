-- Add Identity Layer columns to brand_profiles
ALTER TABLE brand_profiles
ADD COLUMN IF NOT EXISTS authority_level text DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS emoji_preference text DEFAULT 'minimal',
ADD COLUMN IF NOT EXISTS content_goal text,
ADD COLUMN IF NOT EXISTS platform_focus text,
ADD COLUMN IF NOT EXISTS positioning_statement text,
ADD COLUMN IF NOT EXISTS emotional_impact text;

COMMENT ON COLUMN brand_profiles.authority_level IS 'Identity Level: beginner, growing, authority, elite';
COMMENT ON COLUMN brand_profiles.emoji_preference IS 'none, minimal, allowed';
