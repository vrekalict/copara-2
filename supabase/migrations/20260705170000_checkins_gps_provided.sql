-- Rename misleading column: coords are validated as GPS ranges, not proximity to event.
alter table public.checkins
  rename column location_verified to gps_provided;
