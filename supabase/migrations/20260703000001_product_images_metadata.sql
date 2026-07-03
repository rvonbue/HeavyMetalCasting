-- Per-image metadata for product images: which metals appear in the image,
-- searchable text, the view angle, and a free-text description/notes field.

alter table product_images
  add column if not exists metal_types bigint[] not null default '{}',
  add column if not exists search_text text not null default '',
  add column if not exists view_type text,
  add column if not exists product_description text not null default '';

-- Saving these fields from the client is a direct UPDATE (the sort-order path
-- uses an RPC because there was no UPDATE policy). Add one so the image editor
-- can persist. Permissive to match the current access model; tighten with auth
-- gating later.
drop policy if exists "product_images_update" on product_images;
create policy "product_images_update"
  on product_images
  for update
  using (true)
  with check (true);
