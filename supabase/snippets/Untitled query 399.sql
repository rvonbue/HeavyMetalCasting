alter table events
  add column if not exists start_time time,
  add column if not exists end_time time;

update events set start_time = event_time where event_time is not null;

alter table events drop column if exists event_time;