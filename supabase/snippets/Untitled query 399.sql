-- Add user preferences to users table
alter table public.users
add column theme text default 'light' check (theme in ('light', 'dark')),
add column subscribe_marketing boolean default false;

-- Create shipping addresses table
create table public.shipping_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  street_address text not null,
  city text not null,
  state text not null,
  zip_code text not null,
  country text not null default 'USA',
  phone text,
  is_default boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  constraint shipping_addresses_user_id_fkey foreign key (user_id) references public.users (id) on delete cascade
);

-- Create index for faster lookups
create index idx_shipping_addresses_user_id on public.shipping_addresses(user_id);
create index idx_shipping_addresses_is_default on public.shipping_addresses(user_id, is_default);

-- Enable RLS
alter table public.shipping_addresses enable row level security;

-- RLS Policies for shipping addresses
create policy "Users can read their own addresses" on public.shipping_addresses
  for select using (auth.uid() = user_id);

create policy "Users can insert their own addresses" on public.shipping_addresses
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own addresses" on public.shipping_addresses
  for update using (auth.uid() = user_id);

create policy "Users can delete their own addresses" on public.shipping_addresses
  for delete using (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
create trigger update_shipping_addresses_updated_at before update on public.shipping_addresses
  for each row execute function public.update_updated_at_column();