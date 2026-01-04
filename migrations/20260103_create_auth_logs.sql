CREATE TABLE IF NOT EXISTS public.auth_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  event text NOT NULL,
  detail jsonb NULL,
  ip text NULL, -- Changed from inet to text to avoid potential parsing issues with some proxies/headers
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_logs_user ON public.auth_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_logs_event_time ON public.auth_logs(event, created_at);

-- Add RLS to allow service role full access but restrict users
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can insert/select by default.
-- Users should NOT be able to insert their own logs directly via client SDK to prevent spoofing.
-- Admin/Support policies can be added later as needed.
