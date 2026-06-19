alter table events
  add column if not exists start_date date,
  add column if not exists end_date date,
  add column if not exists event_time time;
