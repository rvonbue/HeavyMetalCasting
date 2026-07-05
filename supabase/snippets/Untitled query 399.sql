-- Drop the problematic admin policy
drop policy if exists "Admins can read all users" on public.users;

-- Recreate policies without recursion
drop policy if exists "Users can read their own data" on public.users;
drop policy if exists "Users can insert their own data" on public.users;
drop policy if exists "Users can update their own data" on public.users;

create policy "Users can read their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can insert their own data" on public.users
  for insert with check (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);