-- Shop page layout feature.
--
-- The customer product page is composed of positionable blocks stored here.
-- Each block is one of three kinds:
--   product : displays a value from the product record (field_id -> admin_product_fields)
--   widget  : an interactive developer component (component name)
--   user    : static admin-authored text (content)
-- Blocks are positioned on a grid via grid_row / grid_col.

create table if not exists shop_page_blocks (
  id          bigint generated always as identity primary key,
  block_type  text not null check (block_type in ('product', 'widget', 'user')),
  field_id    bigint references admin_product_fields(id) on delete cascade,
  component   text,
  content     text,
  label       text,
  grid_row    integer not null default 1,
  grid_col    integer not null default 0,
  visible     boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table shop_page_blocks enable row level security;

drop policy if exists "shop_page_blocks_select" on shop_page_blocks;
create policy "shop_page_blocks_select" on shop_page_blocks for select using (true);

drop policy if exists "shop_page_blocks_insert" on shop_page_blocks;
create policy "shop_page_blocks_insert" on shop_page_blocks for insert with check (true);

drop policy if exists "shop_page_blocks_update" on shop_page_blocks;
create policy "shop_page_blocks_update" on shop_page_blocks for update using (true) with check (true);

drop policy if exists "shop_page_blocks_delete" on shop_page_blocks;
create policy "shop_page_blocks_delete" on shop_page_blocks for delete using (true);

grant select, insert, update, delete on shop_page_blocks to anon, authenticated;

-- Seed the default layout (only if the table is empty).
insert into shop_page_blocks (block_type, field_id, component, content, grid_row, grid_col)
select v.block_type, v.field_id, v.component, v.content, v.grid_row, v.grid_col
from (values
  ('product', (select id from admin_product_fields where column_name = 'price' limit 1),       null::text,       null::text,                          1, 0),
  ('user',    null::bigint,                                                                     null::text,       'Only a few left — cast to order.',  1, 1),
  ('widget',  null::bigint,                                                                     'metal_selector', null::text,                          2, 0),
  ('widget',  null::bigint,                                                                     'size_selector',  null::text,                          3, 0),
  ('widget',  null::bigint,                                                                     'buy_controls',   null::text,                          4, 0),
  ('product', (select id from admin_product_fields where column_name = 'name' limit 1),        null::text,       null::text,                          5, 0),
  ('product', (select id from admin_product_fields where column_name = 'description' limit 1), null::text,       null::text,                          6, 0)
) as v(block_type, field_id, component, content, grid_row, grid_col)
where not exists (select 1 from shop_page_blocks);

-- App bootstrap payload: include the customer-visible shop page blocks, joined
-- to the field definition so the client gets column_name / input_type.
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
