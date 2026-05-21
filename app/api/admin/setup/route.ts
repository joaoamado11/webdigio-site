import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/admin';
import postgres from 'postgres';

export async function POST() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sql = `
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
    drop policy if exists "Service role manages admin_users" on admin_users;
    create policy "Service role manages admin_users" on admin_users for all using (true) with check (true);
  `;

  try {
    const url = process.env.SUPABASE_DB_URL;
    if (!url) {
      return NextResponse.json({
        error: 'SUPABASE_DB_URL not set. Add your Supabase database connection string to .env.local.',
        hint: 'Format: postgresql://postgres:[YOUR-DB-PASSWORD]@db.qbcqsdakghzmcmqetuac.supabase.co:5432/postgres',
      }, { status: 500 });
    }

    const db = postgres(url, { ssl: 'require', connect_timeout: 10 });
    await db.unsafe(sql);
    await db.end();

    return NextResponse.json({ ok: true, message: 'admin_users table created.' });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({
      error: `Migration failed: ${message}`,
      hint: 'Run supabase/migrations/002_admin_auth.sql manually in the Supabase Dashboard SQL Editor as a fallback.',
    }, { status: 500 });
  }
}
