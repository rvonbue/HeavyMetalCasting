-- Store the selected theme (light / dark) in store settings.
insert into store_settings (key, value)
values ('theme', 'light')
on conflict (key) do nothing;
