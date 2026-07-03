-- Shop-page layout now lives in shop_page_blocks, so remove those concerns from
-- admin_product_fields and return it to being purely the product edit-form schema.

-- Drop the non-column seed rows if they were ever inserted (guarded by
-- column_name so this works whether or not the `component` column exists).
delete from admin_product_fields where column_name in ('stock_message', 'buy_controls');

alter table admin_product_fields
  drop column if exists visible_to_customer,
  drop column if exists customer_sort_order,
  drop column if exists customer_row,
  drop column if exists customer_col,
  drop column if exists source,
  drop column if exists component;

-- Dedupe before restoring uniqueness: keep the lowest id per column_name.
-- First repoint any shop_page_blocks that reference a duplicate to the survivor
-- (the FK is ON DELETE CASCADE, so this prevents losing those blocks).
update shop_page_blocks spb
set field_id = keep.min_id
from (
  select column_name, min(id) as min_id
  from admin_product_fields
  group by column_name
) keep
join admin_product_fields dup
  on dup.column_name = keep.column_name
where spb.field_id = dup.id
  and dup.id <> keep.min_id;

-- Then remove the duplicate rows.
delete from admin_product_fields a
using (
  select column_name, min(id) as min_id
  from admin_product_fields
  group by column_name
) keep
where a.column_name = keep.column_name
  and a.id <> keep.min_id;

-- One row per product column again.
alter table admin_product_fields
  add constraint admin_product_fields_column_name_unique unique (column_name);
