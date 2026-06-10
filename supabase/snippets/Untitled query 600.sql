create or replace function get_product_edit_fields()
returns json
language sql
as $$
  select json_build_array(
    json_build_object(
      'name', 'name',
      'label', 'Product Name',
      'type', 'text',
      'editable', true
    ),
    json_build_object(
      'name', 'price',
      'label', 'Price',
      'type', 'number',
      'editable', true
    ),
    json_build_object(
      'name', 'stock',
      'label', 'Stock',
      'type', 'number',
      'editable', true
    ),
    json_build_object(
      'name', 'live',
      'label', 'Live',
      'type', 'checkbox',
      'editable', true
    )
  );
$$;