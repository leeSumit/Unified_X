This acts as a rough scratchpad for implementing the complete backend for the content engine.

**1. Create the database schemas for 3 tables (excluding `auth.users`, which is auto-created by Supabase Auth) and migrate to Supabase.**

The tables are:

```sql
-- Supabase manages auth.users automatically (email, id, created_at, etc.)
-- You never create this table yourself.

-- 1. PROFILES
-- Extends auth.users with app-specific fields
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- Auto-populate a profiles row for every new signup (captures Google OAuth metadata)
create or replace function handle_new_user()
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- 2. MODULES
-- One row per ParsedModule. The fundamental unit of work.
create table modules (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  semester            int  not null,
  module              int  not null,   -- matches ParsedModule.module in lib/types.ts
  title               text not null,
  hours               int  not null,
  topics              text[] not null,
  tools               text[] not null,
  indian_case_study   text,
  global_case_study   text,
  learning_outcomes   text[],
  source_filename     text,   -- e.g. "BBA_Syllabus_2025.pdf"
  created_at          timestamptz default now()
);

-- 3. ARTIFACTS
-- One row per generated artifact (notes, workbook, pptx)
create table artifacts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  module_id     uuid references modules(id) on delete set null,
  artifact_type text not null check (artifact_type in ('notes', 'workbook', 'pptx')),
  title         text not null,

  -- notes / workbook: store markdown directly in the row (typically 15–30 KB)
  content       text,

  -- pptx: path inside Supabase Storage bucket
  storage_path  text,

  -- pptx metadata
  slide_count   int,
  theme         text,   -- e.g. 'modern-minimal', 'campus-ai'

  -- notes / workbook metadata
  word_count    int,

  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Auto-update updated_at on every write
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger artifacts_updated_at
  before update on artifacts
  for each row execute procedure set_updated_at();

-- Indexes for user-scoped queries
create index on modules(user_id);
create index on artifacts(user_id);
create index on artifacts(module_id);
```

**2. Set up the Supabase storage bucket**, which will be used to store the final PPTX artifacts.

**3. Install and configure the Supabase client** (`@supabase/ssr`) in the Next.js app. Add the following to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

**4. Set up Supabase Auth with a login popup/modal.** Users should not be able to start a chat without being logged in. Set up Google OAuth 2.0 as well through Supabase.

**5. [UI Change] Once they successfully log in**, below the "Start Chat" button they should be able to see the previous artifacts they created. These are fetched from the `artifacts` table linked to the storage bucket.

**6. [UI Change] Below the artifacts**, they can also see the different modules that have been parsed. This will be fetched from the `modules` table.

**7. [Issue — Caching] When the user begins a chat and parses the curriculum**, the model that parses the curriculum should also check whether the same modules (>90% match) already exist in the database and alert the user accordingly.

If they do not exist, the modules are shown to the user and saved to the database. The user can then select a module and start artifact generation.

**8. On artifact generation completion:**
- **Notes / Workbook:** Save the markdown directly to the database.
- **PPTX:** Convert the generated images to a `.pptx` file and save it to the storage bucket. Completion for PPTX is defined as all images finishing generation. If a user regenerates a slide, the old `.pptx` is deleted from the bucket and replaced with the new one.

**9. Users can visit any artifact and make edits (notes: directly in markdown; PPTX: per-slide regeneration), then finalize.** This will update both the database and the storage bucket accordingly.

**10. Clicking on any module** shows the module details and its linked artifacts. A search bar can also be added for both the artifacts and modules sections.
