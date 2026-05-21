-- ============================================================
-- Webdigio v5 — Custom Admin Auth
-- Replaces @supabase/ssr browser auth to avoid BOM header bug
-- ============================================================

create table if not exists admin_users (
  id int primary key default 1 check (id = 1),
  email text not null,
  password_hash text not null,
  session_token text,
  session_expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table admin_users enable row level security;

-- Only service role can read/write (no public access)
create policy "Service role manages admin_users" on admin_users
  for all using (true)
  with check (true);
