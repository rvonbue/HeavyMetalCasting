-- Allow multiple admin_product_fields rows for the same column_name so a field
-- can appear more than once on the customer page (e.g. a small price near the
-- top and a large price at the bottom). Rows are still uniquely identified by id.

alter table admin_product_fields
  drop constraint if exists admin_product_fields_column_name_unique;
