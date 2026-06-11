alter table admin_product_fields
drop constraint admin_product_fields_pkey;

alter table admin_product_fields
add column id bigint generated always as identity primary key;

alter table admin_product_fields
add constraint admin_product_fields_column_name_unique
unique (column_name);