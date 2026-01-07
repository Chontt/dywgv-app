-- Create daily_guidance table
create table if not exists daily_guidance (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  date date not null default CURRENT_DATE,
  role text not null,
  manifestation_text text,
  focus_action text,
  emotion text,
  raw_json jsonb,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure one guidance per user per day
  unique(user_id, date)
);

-- Enable RLS
alter table daily_guidance enable row level security;

-- Policies
create policy "Users can view their own guidance"
  on daily_guidance for select
  using (auth.uid() = user_id);

create policy "Users can insert their own guidance"
  on daily_guidance for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own guidance"
  on daily_guidance for update
  using (auth.uid() = user_id);
