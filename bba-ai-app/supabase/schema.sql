-- ============================================================
-- BBA AI App — Supabase Schema
-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- Then run policies.sql to enable RLS + per-row policies.
--
-- Tables managed by Supabase Auth (do not create yourself):
--   - auth.users
-- ============================================================


-- ── 1. PROFILES ───────────────────────────────────────────────
-- Extends auth.users with app-specific fields. Auto-populated for
-- every new signup via the handle_new_user() trigger below.

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── 2. MODULES ────────────────────────────────────────────────
-- One row per ParsedModule. The fundamental unit of work.
-- Column names mirror lib/types.ts ParsedModule (snake_case).

create table if not exists public.modules (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  semester          int  not null,
  module            int  not null,   -- matches ParsedModule.module
  title             text not null,
  hours             int  not null,
  topics            text[] not null,
  tools             text[] not null,
  indian_case_study text,
  global_case_study text,
  learning_outcomes text[],
  source_filename   text,            -- e.g. "BBA_Syllabus_2025.pdf"
  created_at        timestamptz default now()
);


-- ── 3. ARTIFACTS ──────────────────────────────────────────────
-- One row per generated artifact (notes, workbook, pptx).
-- notes/workbook: markdown lives in `content`.
-- pptx:           file path in Supabase Storage lives in `storage_path`.

create table if not exists public.artifacts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  module_id     uuid references public.modules(id) on delete set null,
  artifact_type text not null check (artifact_type in ('notes', 'workbook', 'pptx')),
  title         text not null,

  -- notes / workbook: store markdown directly in the row (typically 15–30 KB)
  content       text,

  -- pptx: path inside the Supabase Storage 'artifacts' bucket
  storage_path  text,

  -- pptx metadata
  slide_count   int,
  theme         text,   -- e.g. 'modern-minimal', 'campus-ai'

  -- pptx assets: array of { index, type, path, ts } objects pointing at
  -- per-slide PNGs uploaded to the 'artifacts' bucket. Re-renders the deck
  -- by listing this array and signing each path.
  assets        jsonb,

  -- notes / workbook metadata
  word_count    int,

  -- generation lifecycle state
  status        text not null default 'incomplete'
                  check (status in ('completed', 'incomplete')),

  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- For DBs that pre-date the assets column, add it idempotently.
alter table public.artifacts add column if not exists assets jsonb;

-- Auto-update updated_at on every write
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists artifacts_updated_at on public.artifacts;
create trigger artifacts_updated_at
  before update on public.artifacts
  for each row execute procedure public.set_updated_at();


-- ── 4. INDEXES ────────────────────────────────────────────────
-- Speed up user-scoped queries.

create index if not exists modules_user_id_idx   on public.modules(user_id, created_at desc);
create index if not exists artifacts_user_id_idx on public.artifacts(user_id, created_at desc);
create index if not exists artifacts_module_id_idx on public.artifacts(module_id);


-- ── 5. STORAGE BUCKET (for PPTX exports) ──────────────────────
-- Private bucket; share via signed URLs.
-- Files are stored under artifacts/<user_id>/<filename>.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'artifacts',
  'artifacts',
  false,            -- private; use createSignedUrl() to share
  52428800,         -- 50 MB max per file
  array[
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/json'
  ]
)
on conflict (id) do nothing;

-- Keep allowlist current on already-created buckets (image generators may
-- return JPEG / WEBP in addition to PNG).
update storage.buckets
set allowed_mime_types = array[
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/json'
]
where id = 'artifacts';
