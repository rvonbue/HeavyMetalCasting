create table site_images (
  id integer generated always as identity primary key,
  image_url text not null,
  image_path text not null,
  thumbnail_url text,
  thumbnail_path text,
  context text not null default 'general',
  alt_text text,
  file_size integer,
  file_extension text,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create table events (
  id integer generated always as identity primary key,
  title text not null,
  description text,
  url text,
  image_id integer references site_images(id) on delete set null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index on events(sort_order);
