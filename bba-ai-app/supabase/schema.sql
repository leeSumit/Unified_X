-- ============================================================
-- BBA AI App — Supabase Schema
-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================


-- ── 1. GENERATIONS ────────────────────────────────────────────
-- One row per content generation run (notes / workbook / pptx outline)

create table if not exists public.generations (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- who generated it (null = anonymous / unauthenticated user)
  user_id       uuid references auth.users(id) on delete set null,

  -- what was generated
  artifact_type text not null check (artifact_type in ('notes', 'pptx', 'workbook')),
  module_title  text not null,
  semester      int,
  module_number int,

  -- optional: full markdown/text output (large; skip if you only want metadata)
  content       text,

  -- word count snapshotted at generation time
  word_count    int
);

-- Index for fetching a user's history fast
create index if not exists generations_user_id_idx on public.generations(user_id, created_at desc);


-- ── 2. DESIGN LAB SESSIONS ────────────────────────────────────
-- One row per Design Lab deck (a set of slides with images)

create table if not exists public.design_sessions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  user_id       uuid references auth.users(id) on delete set null,

  -- link back to the generation that seeded this deck (optional)
  generation_id uuid references public.generations(id) on delete set null,

  module_title  text not null,
  template_id   text,          -- 'campus-ai' | 'clean' | 'whiteboard'
  slide_count   int,

  -- full slide JSON array (content + imageUrl per slide)
  slides_json   jsonb
);

create index if not exists design_sessions_user_id_idx on public.design_sessions(user_id, created_at desc);


-- ── 3. ARTIFACTS (storage references) ─────────────────────────
-- Tracks every file uploaded to the 'artifacts' Storage bucket

create table if not exists public.artifacts (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  user_id         uuid references auth.users(id) on delete set null,

  -- which generation / session produced this file (optional, one or the other)
  generation_id   uuid references public.generations(id) on delete cascade,
  design_session_id uuid references public.design_sessions(id) on delete cascade,

  -- Storage bucket path — e.g. "exports/2024/user-id/notes-sem1-mod2.pdf"
  storage_path    text not null unique,

  file_type       text not null check (file_type in ('pptx', 'pdf', 'png', 'json')),
  file_name       text not null,
  file_size_bytes bigint,

  -- public URL (populated after upload if bucket is public)
  public_url      text
);

create index if not exists artifacts_generation_id_idx on public.artifacts(generation_id);
create index if not exists artifacts_design_session_id_idx on public.artifacts(design_session_id);
create index if not exists artifacts_user_id_idx on public.artifacts(user_id, created_at desc);


-- ── 4. STORAGE BUCKET ─────────────────────────────────────────
-- Run this ONCE to create the bucket (or do it in the Dashboard UI)
-- The bucket is private by default; share via signed URLs.

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
    'application/json'
  ]
)
on conflict (id) do nothing;


-- ── 5. ROW LEVEL SECURITY ─────────────────────────────────────
-- Enable RLS on every table (safe default — nothing is readable unless a policy allows it)

alter table public.generations       enable row level security;
alter table public.design_sessions   enable row level security;
alter table public.artifacts         enable row level security;

-- Users can only see / insert their own rows
create policy "own generations"
  on public.generations for all
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "own design sessions"
  on public.design_sessions for all
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "own artifacts"
  on public.artifacts for all
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Storage: users can only access their own folder (artifacts/<user_id>/*)
create policy "own storage objects"
  on storage.objects for all
  using  (bucket_id = 'artifacts' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'artifacts' and (storage.foldername(name))[1] = auth.uid()::text);
