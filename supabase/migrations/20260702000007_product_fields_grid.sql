-- 2D grid layout for the customer product page. Each field row gets a
-- customer_row + customer_col position, a source (product / developer / user),
-- and a component key for non-column items (stock message, buy controls).

alter table admin_product_fields
  add column if not exists customer_row integer,
  add column if not exists customer_col integer,
  add column if not exists source text not null default 'product',
  add column if not exists component text;

-- Place the existing product fields per the default shop layout.
update admin_product_fields set visible_to_customer = true, source = 'product', customer_row = 1, customer_col = 0 where column_name = 'price';
update admin_product_fields set visible_to_customer = true, source = 'product', customer_row = 2, customer_col = 0 where column_name = 'metal_types';
update admin_product_fields set visible_to_customer = true, source = 'product', customer_row = 3, customer_col = 0 where column_name = 'size_chart';
update admin_product_fields set visible_to_customer = true, source = 'product', customer_row = 5, customer_col = 0 where column_name = 'name';
update admin_product_fields set visible_to_customer = true, source = 'product', customer_row = 6, customer_col = 0 where column_name = 'description';

-- Seed the non-product grid items (idempotent).
insert into admin_product_fields
  (column_name, label, input_type, source, component, visible_to_customer, is_editable, customer_row, customer_col, customer_sort_order)
select 'stock_message', 'Stock Message', 'text', 'user', 'stock_message', true, false, 1, 1, 1
where not exists (select 1 from admin_product_fields where component = 'stock_message');

insert into admin_product_fields
  (column_name, label, input_type, source, component, visible_to_customer, is_editable, customer_row, customer_col, customer_sort_order)
select 'buy_controls', 'Add to Cart', 'text', 'developer', 'buy_controls', true, false, 4, 0, 4
where not exists (select 1 from admin_product_fields where component = 'buy_controls');
