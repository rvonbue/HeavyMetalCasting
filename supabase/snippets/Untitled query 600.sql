update size_charts
set options = '[
  {"value":"7","label":"7in"},
  {"value":"8","label":"8in"},
  {"value":"9","label":"9in"},
  {"value":"10","label":"10in"}
]'::jsonb
where id = 1;