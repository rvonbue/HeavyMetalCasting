-- shop_page_blocks: row-styling columns the code writes (missing on both DBs)
ALTER TABLE shop_page_blocks ADD COLUMN IF NOT EXISTS margin_top text DEFAULT 'mt-0';
ALTER TABLE shop_page_blocks ADD COLUMN IF NOT EXISTS margin_bottom text DEFAULT 'mb-0';
ALTER TABLE shop_page_blocks ADD COLUMN IF NOT EXISTS vertical_align text DEFAULT 'items-start';
ALTER TABLE shop_page_blocks ADD COLUMN IF NOT EXISTS justify_content text DEFAULT 'flex-start';

-- users: match live (code uses unsubscribe_marketing + reset_password_*)
ALTER TABLE users DROP COLUMN IF EXISTS subscribe_marketing;
ALTER TABLE users ADD COLUMN IF NOT EXISTS unsubscribe_marketing boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_token varchar UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_expires_at timestamp without time zone;

-- store_settings: vestigial columns live has (harmless, for parity)
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS shopping_cart_bg_image_url varchar;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS navbar_home_button_image_url varchar;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS navbar_home_text varchar DEFAULT 'HMC';