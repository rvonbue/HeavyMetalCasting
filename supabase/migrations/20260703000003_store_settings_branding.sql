-- New store_settings keys for branding, homepage/about images, site initials,
-- and the sale banner HTML. Settings are a flat key/value store updated by key,
-- so the rows must exist before the admin page can update them.

insert into store_settings (key, value)
values
  ('site_initials', 'HMC'),
  ('logo_url', ''),
  ('logo_show_in_navbar', 'false'),
  ('homepage_image_desktop_url', ''),
  ('homepage_image_mobile_url', ''),
  ('about_image_url', ''),
  ('sale_banner_html', '')
on conflict (key) do nothing;

-- Carry any existing sale banner text over to the new HTML field.
update store_settings s
set value = t.value
from store_settings t
where s.key = 'sale_banner_html'
  and t.key = 'sale_banner_text'
  and coalesce(t.value, '') <> ''
  and coalesce(s.value, '') = '';
