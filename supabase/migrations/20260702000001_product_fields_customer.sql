-- Customer-facing rendering config for admin_product_fields.
-- Only the "simple" scalar field types (text, textarea, checkbox, float) are
-- driven by this config on the customer product page. The array_lookup /
-- single_lookup fields (metal_types, size_chart, product_categories) stay
-- hardcoded as interactive widgets and are NOT governed by visible_to_customer.

alter table admin_product_fields
  add column if not exists visible_to_customer boolean not null default false,
  add column if not exists customer_sort_order integer;

-- Turn on the simple fields we want rendered from config, in display order.
update admin_product_fields set visible_to_customer = true, customer_sort_order = 1 where column_name = 'name';
update admin_product_fields set visible_to_customer = true, customer_sort_order = 2 where column_name = 'price';
update admin_product_fields set visible_to_customer = true, customer_sort_order = 3 where column_name = 'description';

-- live and the lookup fields stay visible_to_customer = false (default).
