-- Returns the real column list of the products table so the Product Fields
-- admin page can populate its Column dropdown from the schema rather than
-- inferring keys from a sample product row (which requires a product to exist).
--
-- security definer so it can read information_schema regardless of the caller's
-- direct privileges; it only exposes column names/types, no row data.

create or replace function get_product_columns()
returns table (column_name text, data_type text)
language sql
stable
security definer
set search_path = public
as $$
  select c.column_name::text, c.data_type::text
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'products'
  order by c.ordinal_position;
$$;

grant execute on function get_product_columns() to anon, authenticated;
