alter table store_settings add column group_name text;

update store_settings set group_name = 'General' where key in ('store_name', 'tagline', 'contact_email');
update store_settings set group_name = 'About Us' where key in ('about_us_text', 'instagram_url', 'facebook_url');
update store_settings set group_name = 'Sales' where key in ('sale_active', 'sale_banner_text', 'sale_discount_percent');