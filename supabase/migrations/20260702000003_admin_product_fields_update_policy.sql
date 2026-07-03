-- Reads from admin_product_fields work but updates affect 0 rows (PGRST116:
-- "Cannot coerce the result to a single JSON object" / "0 rows"), which means
-- RLS is enabled on this table with a SELECT policy but no UPDATE policy.
--
-- Add the missing UPDATE policy. This mirrors the current access model where the
-- client writes directly (same as the products table). Tighten `using`/`with
-- check` to an authenticated/admin condition once auth gating exists.
--
-- NOTE: intentionally NOT calling `enable row level security` here — RLS is
-- already enabled (that's why updates return 0 rows). Enabling it when it was
-- off would instead break reads/inserts.

drop policy if exists "admin_product_fields_update" on admin_product_fields;

create policy "admin_product_fields_update"
  on admin_product_fields
  for update
  using (true)
  with check (true);
