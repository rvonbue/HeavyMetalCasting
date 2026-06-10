alter table products enable row level security;

create policy "Allow public read products"
on products
for select
using (true);

create policy "Allow public insert products"
on products
for insert
with check (true);

create policy "Allow public update products"
on products
for update
using (true)
with check (true);

create policy "Allow public delete products"
on products
for delete
using (true);