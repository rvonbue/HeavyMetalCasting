-- Fix infinite recursion in admin policy
-- Drop the problematic admin policy
drop policy if exists "Admins can read all users" on public.users;

-- Create a new admin policy without self-reference
-- Admins are identified by having role = 'admin' in the auth token or by checking a safer method
-- For now, we'll keep it simple: users can only read their own data
-- Admin functionality can be added via service role or through application logic

-- Verify existing policies are correct
drop policy if exists "Users can read their own data" on public.users;
drop policy if exists "Users can insert their own data" on public.users;
drop policy if exists "Users can update their own data" on public.users;

-- Recreate policies without recursion
create policy "Users can read their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can insert their own data" on public.users
  for insert with check (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);
