-- Baseline: existing RPC functions before product_variants

create or replace function get_app_data()
returns json
language sql
as $$
  select json_build_object(
    'products',
      (
        select coalesce(json_agg(product_row), '[]'::json)
        from (
          select
            p.*,
            coalesce(
              (
                select json_agg(pi order by pi.sort_order, pi.id)
                from product_images pi
                where pi.product_id = p.id
              ),
              '[]'::json
            ) as product_images
          from products p
          order by p.id
        ) product_row
      ),

    'product_categories',
      (
        select coalesce(json_agg(pc order by pc.id), '[]'::json)
        from product_categories pc
      ),

    'size_charts',
      (
        select coalesce(json_agg(sc order by sc.id), '[]'::json)
        from size_charts sc
      ),

    'metal_types',
      (
        select coalesce(json_agg(mt order by mt.id), '[]'::json)
        from metal_types mt
      )
  );
$$;


create or replace function get_product_fields()
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


create or replace function update_product_image_sort_order(image_updates jsonb)
returns jsonb
language plpgsql
as $$
declare
  updated_rows jsonb;
begin
  update product_images pi
  set sort_order = u.sort_order
  from (
    select
      (item->>'id')::bigint as id,
      (item->>'sort_order')::integer as sort_order
    from jsonb_array_elements(image_updates) item
  ) u
  where pi.id = u.id;

  select coalesce(jsonb_agg(to_jsonb(pi) order by pi.sort_order, pi.id), '[]'::jsonb)
  into updated_rows
  from product_images pi
  where pi.id in (
    select (item->>'id')::bigint
    from jsonb_array_elements(image_updates) item
  );

  return updated_rows;
end;
$$;
