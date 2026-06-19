alter table product_images
  add column if not exists file_size integer,
  add column if not exists file_extension text,
  add column if not exists width integer,
  add column if not exists height integer;
