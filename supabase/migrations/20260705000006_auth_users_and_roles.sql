-- Create users table with role-based access
create table public.users (
  id uuid primary key default auth.uid(),
  email text unique not null,
  full_name text,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  email_verified boolean default false,
  email_verified_at timestamp,
  verification_token text unique,
  verification_expires_at timestamp,
  password_reset_token text unique,
  password_reset_expires_at timestamp,
  last_login_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  constraint users_id_fkey foreign key (id) references auth.users (id) on delete cascade
);

-- Create index on email for faster lookups
create index idx_users_email on public.users(email);
create index idx_users_role on public.users(role);

-- Enable RLS
alter table public.users enable row level security;

-- RLS Policies
create policy "Users can read their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

create policy "Admins can read all users" on public.users
  for select using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Trigger to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at before update on public.users
  for each row execute function public.update_updated_at_column();
