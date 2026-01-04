-- Migration: add profile_id to content_projects
-- Created: 2026-01-01

BEGIN;

-- 1) add nullable foreign key column referencing brand_profiles(id)
ALTER TABLE content_projects
  ADD COLUMN IF NOT EXISTS profile_id uuid REFERENCES brand_profiles(id);

-- 2) populate existing rows: set profile_id to the most-recent profile for that user (if any)
UPDATE content_projects cp
SET profile_id = bp.id
FROM brand_profiles bp
WHERE cp.profile_id IS NULL
  AND bp.user_id = cp.user_id
  AND bp.created_at = (
    SELECT MAX(created_at) FROM brand_profiles bp2 WHERE bp2.user_id = cp.user_id
  );

-- 3) index for faster lookups
CREATE INDEX IF NOT EXISTS idx_content_projects_profile_id ON content_projects(profile_id);

COMMIT;
