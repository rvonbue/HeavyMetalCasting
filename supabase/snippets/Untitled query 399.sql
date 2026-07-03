-- Replace the product_fields payload with shop_page_blocks (joined to the field
-- definition so the client gets column_name / input_type for product blocks).
--
-- NOTE: verify the function header matches the live definition (return type,
-- security) before running.

create or replace function get_app_data()
returns json
language sql
stable
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
            ) as product_images,
            coalesce(
              (
                select json_agg(pv order by pv.size_chart_id, pv.size_value, pv.metal_type_id)
                from product_variants pv
                where pv.product_id = p.id
              ),
              '[]'::json
            ) as product_variants
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
      ),
    'shop_page_blocks',
      (
        select coalesce(json_agg(b order by b.grid_row, b.grid_col), '[]'::json)
        from (
          select
            spb.*,
            f.column_name,
            f.input_type,
            f.label as field_label
          from shop_page_blocks spb
          left join admin_product_fields f on f.id = spb.field_id
          where spb.visible = true
        ) b
      ),
    'events',
      (
        select coalesce(json_agg(e order by e.sort_order, e.id), '[]'::json)
        from (
          select
            e.*,
            row_to_json(si) as image
          from events e
          left join site_images si on si.id = e.image_id
          where e.active = true
        ) e
      )
  );
$$;