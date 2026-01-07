-- Create daily_goals table
create table if not exists daily_goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  goal_text text not null,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table daily_goals enable row level security;

-- Create policies
-- 1. Insert
drop policy if exists "Users can insert their own goals" on daily_goals;
create policy "Users can insert their own goals"
  on daily_goals for insert
  with check (auth.uid() = user_id);

-- 2. View 
drop policy if exists "Users can view their own goals" on daily_goals;
create policy "Users can view their own goals"
  on daily_goals for select
  using (auth.uid() = user_id);

-- 3. Update
drop policy if exists "Users can update their own goals" on daily_goals;
create policy "Users can update their own goals"
  on daily_goals for update
  using (auth.uid() = user_id);

-- 4. Delete
drop policy if exists "Users can delete their own goals" on daily_goals;
create policy "Users can delete their own goals"
  on daily_goals for delete
  using (auth.uid() = user_id);
