-- ============================================================
-- BBA AI App — Row Level Security Policies
-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- Must be run AFTER schema.sql (tables must already exist).
--
-- Tables covered:
--   public.profiles  — one row per user, auto-created by handle_new_user()
--   public.modules   — parsed ParsedModule rows
--   public.artifacts — generated notes / workbook / pptx rows
--   storage.objects  — the 'artifacts' bucket (PPTX exports)
--
-- This file is idempotent: every policy is dropped before being
-- (re)created, so you can run it as many times as you like.
-- ============================================================


-- ── ENABLE RLS ON ALL TABLES ──────────────────────────────────
-- Safe default: nothing is readable/writable until a policy allows it.

alter table public.profiles  enable row level security;
alter table public.modules   enable row level security;
alter table public.artifacts enable row level security;


-- ── PROFILES ──────────────────────────────────────────────────
-- The handle_new_user() trigger runs as SECURITY DEFINER, so it
-- can INSERT a new profile row without needing a policy here.
-- Users only need to read and update their own profile.

drop policy if exists "profiles: users can read their own row"   on public.profiles;
drop policy if exists "profiles: users can update their own row" on public.profiles;

create policy "profiles: users can read their own row"
  on public.profiles
  for select
  using (id = auth.uid());

create policy "profiles: users can update their own row"
  on public.profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid());


-- ── MODULES ───────────────────────────────────────────────────
-- The parse route writes via the SSR Supabase client using the
-- caller's session, so inserts go through RLS — the insert policy
-- below is what makes that work. Browser reads via anon key + session.

drop policy if exists "modules: users can read their own rows"   on public.modules;
drop policy if exists "modules: users can insert their own rows" on public.modules;
drop policy if exists "modules: users can update their own rows" on public.modules;
drop policy if exists "modules: users can delete their own rows" on public.modules;

create policy "modules: users can read their own rows"
  on public.modules
  for select
  using (user_id = auth.uid());

create policy "modules: users can insert their own rows"
  on public.modules
  for insert
  with check (user_id = auth.uid());

create policy "modules: users can update their own rows"
  on public.modules
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "modules: users can delete their own rows"
  on public.modules
  for delete
  using (user_id = auth.uid());


-- ── ARTIFACTS ─────────────────────────────────────────────────
-- Same pattern as modules: every write happens under the user's
-- session, so user_id must equal auth.uid().

drop policy if exists "artifacts: users can read their own rows"   on public.artifacts;
drop policy if exists "artifacts: users can insert their own rows" on public.artifacts;
drop policy if exists "artifacts: users can update their own rows" on public.artifacts;
drop policy if exists "artifacts: users can delete their own rows" on public.artifacts;

create policy "artifacts: users can read their own rows"
  on public.artifacts
  for select
  using (user_id = auth.uid());

create policy "artifacts: users can insert their own rows"
  on public.artifacts
  for insert
  with check (user_id = auth.uid());

create policy "artifacts: users can update their own rows"
  on public.artifacts
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "artifacts: users can delete their own rows"
  on public.artifacts
  for delete
  using (user_id = auth.uid());


-- ── STORAGE: artifacts bucket ──────────────────────────────────
-- Files are stored under artifacts/<user_id>/<filename>.
-- Each policy checks that the first path segment matches the caller's uid.
-- The bucket itself is created in schema.sql.

drop policy if exists "storage: users can upload to their own folder" on storage.objects;
drop policy if exists "storage: users can read their own objects"     on storage.objects;
drop policy if exists "storage: users can update their own objects"   on storage.objects;
drop policy if exists "storage: users can delete their own objects"   on storage.objects;

create policy "storage: users can upload to their own folder"
  on storage.objects
  for insert
  with check (
    bucket_id = 'artifacts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage: users can read their own objects"
  on storage.objects
  for select
  using (
    bucket_id = 'artifacts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage: users can update their own objects"
  on storage.objects
  for update
  using (
    bucket_id = 'artifacts'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'artifacts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage: users can delete their own objects"
  on storage.objects
  for delete
  using (
    bucket_id = 'artifacts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
