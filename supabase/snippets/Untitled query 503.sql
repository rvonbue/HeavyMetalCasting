update admin_product_fields
set group_id = 1, field_sort_order = 10, field_width = 'large'
where column_name = 'name';

update admin_product_fields
set group_id = 1, field_sort_order = 20, field_width = 'small'
where column_name = 'price';

update admin_product_fields
set group_id = 1, field_sort_order = 30, field_width = 'tiny'
where column_name = 'live';

update admin_product_fields
set group_id = 2, field_sort_order = 10, field_width = 'medium'
where column_name = 'size_chart';

update admin_product_fields
set group_id = 2, field_sort_order = 20, field_width = 'medium'
where column_name = 'product_categories';

update admin_product_fields
set group_id = 2, field_sort_order = 30, field_width = 'xlarge'
where column_name = 'metal_types';

update admin_product_fields
set group_id = 3, field_sort_order = 10, field_width = 'full'
where column_name = 'description';

update admin_product_fields
set group_id = 4, field_sort_order = 10, field_width = 'small'
where column_name = 'max_quantity_per_order';