-- Realtime Broadcast authorization for thread typing indicators.
-- Supabase enables RLS on realtime.messages by default; without policies,
-- authenticated clients cannot join private broadcast channels or send events.

create or replace function public.thread_id_from_realtime_topic()
returns uuid
language sql
stable
set search_path = public
as $$
  select case
    when realtime.topic() ~ '^thread-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      then replace(realtime.topic(), 'thread-', '')::uuid
    else null
  end;
$$;

drop policy if exists "thread_participants_receive_broadcast" on realtime.messages;
create policy "thread_participants_receive_broadcast"
  on realtime.messages
  for select
  to authenticated
  using (
    realtime.messages.extension = 'broadcast'
    and public.is_thread_participant(public.thread_id_from_realtime_topic())
  );

drop policy if exists "thread_participants_send_broadcast" on realtime.messages;
create policy "thread_participants_send_broadcast"
  on realtime.messages
  for insert
  to authenticated
  with check (
    realtime.messages.extension = 'broadcast'
    and public.is_thread_participant(public.thread_id_from_realtime_topic())
  );
