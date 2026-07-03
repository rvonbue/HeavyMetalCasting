-- Per-block styling for shop page blocks: a font-size token and a label
-- visibility toggle (used by widget blocks).
alter table shop_page_blocks
  add column if not exists font_size text,
  add column if not exists show_label boolean not null default true;

-- Split the combined buy_controls widget into two: a standalone quantity input
-- and an add-to-cart button. For each buy_controls block, make room in its row,
-- turn it into add_to_cart, and insert a quantity block just before it.
do $$
declare b record;
begin
  for b in select * from shop_page_blocks where component = 'buy_controls' loop
    update shop_page_blocks
      set grid_col = grid_col + 1
      where grid_row = b.grid_row and grid_col > b.grid_col and id <> b.id;

    update shop_page_blocks
      set component = 'add_to_cart', grid_col = b.grid_col + 1
      where id = b.id;

    insert into shop_page_blocks (block_type, component, grid_row, grid_col, visible)
      values ('widget', 'quantity', b.grid_row, b.grid_col, true);
  end loop;
end $$;
