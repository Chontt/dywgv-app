-- Migration: Influence OS Schema Updates

-- 1. Update daily_goals to support specific dates (for history/streaks)
ALTER TABLE daily_goals 
ADD COLUMN IF NOT EXISTS goal_date DATE DEFAULT CURRENT_DATE;

-- Optional: rename goal_text to title if strict adherence is needed, but mapping in code is easier.
-- ALTER TABLE daily_goals RENAME COLUMN goal_text TO title;

-- 2. Update daily_guidance for new "Influence OS" fields
ALTER TABLE daily_guidance 
ADD COLUMN IF NOT EXISTS reason TEXT,
ADD COLUMN IF NOT EXISTS anti_goal TEXT;

-- 3. Ensure content_projects has status constraint (soft check)
-- ALTER TABLE content_projects ADD CONSTRAINT status_check CHECK (status IN ('draft', 'completed'));
