-- Dedicated table for the customer product-page layout. Each block is one of
-- three kinds:
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
  ('product', (select id from admin_product_fields where column_name = 'price' limit 1),       null::text,            null::text,                          1, 0),
  ('user',    null::bigint,                                                                     null::text,            'Only a few left — cast to order.',  1, 1),
  ('widget',  null::bigint,                                                                     'metal_selector',      null::text,                          2, 0),
  ('widget',  null::bigint,                                                                     'size_selector',       null::text,                          3, 0),
  ('widget',  null::bigint,                                                                     'buy_controls',        null::text,                          4, 0),
  ('product', (select id from admin_product_fields where column_name = 'name' limit 1),        null::text,            null::text,                          5, 0),
  ('product', (select id from admin_product_fields where column_name = 'description' limit 1), null::text,            null::text,                          6, 0)
) as v(block_type, field_id, component, content, grid_row, grid_col)
where not exists (select 1 from shop_page_blocks);
