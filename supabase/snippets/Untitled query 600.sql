create policy "Anyone can read order items"
on order_items
for select
to anon, authenticated
using (true);