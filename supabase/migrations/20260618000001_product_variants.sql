-- Add product_variants table and update get_app_data to include variants per product

create table product_variants (
  id bigint generated always as identity primary key,
  product_id bigint not null references products(id) on delete cascade,
  size_chart_id bigint not null references size_charts(id),
  size_value text not null,
  metal_type_id bigint not null references metal_types(id),
  stock integer not null default 0,
  unique(product_id, size_chart_id, size_value, metal_type_id)
);

alter table products drop column stock;


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
      )
  );
$$;
