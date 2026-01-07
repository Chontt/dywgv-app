-- 20240106_entitlements.sql

-- 1. Enums
create type public.subscription_tier as enum ('free', 'premium');
create type public.subscription_status as enum (
  'none', 'active', 'trialing', 'past_due', 'canceled', 'incomplete'
);

-- 2. Subscriptions Table
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tier public.subscription_tier not null default 'free',
  status public.subscription_status not null default 'none',
  current_period_end timestamptz null,
  stripe_customer_id text null,
  stripe_subscription_id text null,
  price_id text null,
  cancel_at_period_end boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Usage Counters Table
create table if not exists public.usage_counters (
  user_id uuid not null references auth.users(id) on delete cascade,
  feature_key text not null,
  period_key text not null,
  count int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, feature_key, period_key)
);

-- 4. Auto-update Trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

drop trigger if exists trg_usage_updated_at on public.usage_counters;
create trigger trg_usage_updated_at
before update on public.usage_counters
for each row execute function public.set_updated_at();

-- 5. RLS Policies
alter table public.subscriptions enable row level security;
alter table public.usage_counters enable row level security;

-- Read Own Subscription
create policy "read_own_subscription"
on public.subscriptions
for select
using (auth.uid() = user_id);

-- Insert Own Subscription (for mocking/setup)
create policy "insert_own_subscription"
on public.subscriptions
for insert
with check (auth.uid() = user_id);

-- Read Own Usage
create policy "read_own_usage"
on public.usage_counters
for select
using (auth.uid() = user_id);

-- 6. Atomic RPC Function for Entitlement Check
create or replace function public.check_and_increment_usage(
  p_user_id uuid,
  p_feature_key text,
  p_period_key text,
  p_limit int
)
returns json
language plpgsql
security definer
as $$
declare
  v_tier public.subscription_tier;
  v_status public.subscription_status;
  v_current_count int;
  v_new_count int;
begin
  -- A) Check Subscription Tier
  select tier, status
  into v_tier, v_status
  from public.subscriptions
  where user_id = p_user_id;

  -- Default to free if no record
  if v_tier is null then
    v_tier := 'free';
  end if;

  -- B) If Premium/Active, allow immediately (Unlimited)
  if v_tier = 'premium' and v_status = 'active' then
    return json_build_object(
      'allowed', true,
      'remaining', -1, -- -1 indicates unlimited
      'tier', 'premium',
      'current_usage', 0
    );
  end if;

  -- C) If Free, check and increment usage
  -- C.1 Ensure counter row exists (Upsert)
  insert into public.usage_counters (user_id, feature_key, period_key, count)
  values (p_user_id, p_feature_key, p_period_key, 0)
  on conflict (user_id, feature_key, period_key) do nothing;

  -- C.2 Read and Lock Row (for atomicity)
  select count into v_current_count
  from public.usage_counters
  where user_id = p_user_id 
    and feature_key = p_feature_key 
    and period_key = p_period_key
  for update;

  -- C.3 Check Limit
  if v_current_count >= p_limit then
    return json_build_object(
      'allowed', false,
      'remaining', 0,
      'tier', 'free',
      'current_usage', v_current_count
    );
  else
    -- Increment
    v_new_count := v_current_count + 1;
    update public.usage_counters
    set count = v_new_count, updated_at = now()
    where user_id = p_user_id 
      and feature_key = p_feature_key 
      and period_key = p_period_key;

    return json_build_object(
      'allowed', true,
      'remaining', p_limit - v_new_count,
      'tier', 'free',
      'current_usage', v_new_count
    );
  end if;
end;
$$;
