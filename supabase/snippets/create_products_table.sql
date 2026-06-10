create table products (
  id bigint generated always as identity primary key,
  name text not null,
  product_categories text[] default '{}',
  size_chart text,
  live boolean default false,
  price numeric(10,2) default 0,
  stock integer default 0,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);