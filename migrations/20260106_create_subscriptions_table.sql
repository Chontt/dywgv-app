-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    stripe_customer_id text,
    stripe_subscription_id text,
    status text, -- 'active', 'past_due', 'canceled', 'trialing'
    price_id text,
    current_period_end timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add RLS policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" 
    ON subscriptions FOR SELECT 
    USING (auth.uid() = user_id);

-- Only service role (webhooks) should insert/update
-- But for simplicity in dev, we might verify via webhook logic using admin client
