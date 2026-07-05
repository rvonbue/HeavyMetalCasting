-- Add custom icon URLs to store_settings
alter table public.store_settings
add column user_icon_url text,
add column shopping_cart_icon_url text;
