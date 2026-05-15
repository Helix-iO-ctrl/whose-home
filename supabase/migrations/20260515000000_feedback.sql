-- Whose Home — feedback table for in-app feedback capture.
-- Run once in Supabase SQL editor (or via supabase db push if using the CLI).

create extension if not exists "pgcrypto";

create table if not exists public.feedback (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  user_id       text not null default 'anonymous',
  page_route    text not null,
  module_id     text,
  module_label  text,
  body          text not null,
  user_agent    text,
  metadata      jsonb default '{}'::jsonb
);

create index if not exists feedback_created_at_idx
  on public.feedback (created_at desc);

-- Open RLS so the prototype anon key can write + read. Tighten before going to production.
alter table public.feedback enable row level security;

drop policy if exists "feedback_anon_insert" on public.feedback;
create policy "feedback_anon_insert"
  on public.feedback for insert
  to anon
  with check (true);

drop policy if exists "feedback_anon_select" on public.feedback;
create policy "feedback_anon_select"
  on public.feedback for select
  to anon
  using (true);
