-- Drop old policies
drop policy if exists "Users can read their own data" on public.users;
drop policy if exists "Users can update their own data" on public.users;
drop policy if exists "Users can insert their own data" on public.users;
drop policy if exists "Admins can read all users" on public.users;

-- Create new policies
create policy "Users can read their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can insert their own data" on public.users
  for insert with check (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

create policy "Admins can read all users" on public.users
  for select using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );