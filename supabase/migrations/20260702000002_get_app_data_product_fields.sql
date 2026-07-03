-- Version-controlled definition of get_app_data(), with product_fields added
-- so the customer app receives the customer-visible admin_product_fields config.
--
-- NOTE: verify the function header (return type, volatility, security) matches
-- what the dashboard shows under Database -> Functions -> get_app_data. If the
-- live function is `returns jsonb`, `security definer`, or sets search_path,
-- adjust the header below to match before running.

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
    'product_fields',
      (
        select coalesce(json_agg(apf order by apf.customer_sort_order, apf.id), '[]'::json)
        from admin_product_fields apf
        where apf.visible_to_customer = true
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
