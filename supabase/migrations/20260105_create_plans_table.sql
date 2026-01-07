-- Create plans table
create table if not exists plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  type text not null check (type in ('7_day', '30_day')),
  inputs jsonb not null,
  content jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table plans enable row level security;

-- Create policies
create policy "Users can insert their own plans"
  on plans for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own plans"
  on plans for select
  using (auth.uid() = user_id);

create policy "Users can update their own plans"
  on plans for update
  using (auth.uid() = user_id);

create policy "Users can delete their own plans"
  on plans for delete
  using (auth.uid() = user_id);
