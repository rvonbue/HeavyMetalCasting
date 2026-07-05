-- Add row-level styling to shop_page_blocks (margin, alignment, justify-content)
alter table shop_page_blocks
add column margin_top varchar default 'mb-0',
add column margin_bottom varchar default 'mb-0',
add column vertical_align varchar default 'items-start',
add column justify_content varchar default 'flex-start';
