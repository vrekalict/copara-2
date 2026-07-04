-- Fix onboarding bootstrap: circle creator must read/return the new row and
-- add themselves as the first parent before circle_role() can succeed.

drop policy if exists "circles_select" on public.circles;
create policy "circles_select" on public.circles for select
  using (public.is_circle_member(id) or created_by = auth.uid());

drop policy if exists "circle_members_insert" on public.circle_members;
create policy "circle_members_insert" on public.circle_members for insert
  with check (
    public.circle_role(circle_id) = 'parent'
    or (
      user_id = auth.uid()
      and role = 'parent'
      and exists (
        select 1 from public.circles
        where id = circle_id
          and created_by = auth.uid()
      )
    )
  );
