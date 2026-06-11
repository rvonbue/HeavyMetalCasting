create table order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references orders(id) on delete cascade,

  product_id bigint references products(id) on delete set null,

  product_name text not null,
  product_price numeric(10,2) not null,
  quantity int2 not null default 1,

  metal_type bigint,
  size_chart bigint,

  line_total numeric(10,2) not null
);