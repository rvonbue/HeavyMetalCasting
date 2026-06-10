drop function if exists update_product_image_sort_order(jsonb);

create or replace function update_product_image_sort_order(image_updates jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
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