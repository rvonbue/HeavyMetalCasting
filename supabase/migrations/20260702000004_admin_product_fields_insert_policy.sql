-- Allow inserting new admin_product_fields rows from the client (Add Field
-- modal). Same access model as the UPDATE policy; tighten to an admin/
-- authenticated check once auth gating exists.

drop policy if exists "admin_product_fields_insert" on admin_product_fields;

create policy "admin_product_fields_insert"
  on admin_product_fields
  for insert
  with check (true);
