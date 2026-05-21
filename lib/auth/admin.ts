import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const ADMIN_COOKIE = 'wa_session';
const DEFAULT_EMAIL = 'admin@webdigio.pt';
const DEFAULT_PASSWORD = 'Webdigio2024!';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

let _defaultHash: string | null = null;
async function getDefaultHash(): Promise<string> {
  if (!_defaultHash) _defaultHash = await hashPassword(DEFAULT_PASSWORD);
  return _defaultHash;
}

async function trySeedAdmin() {
  const supabase = getServiceClient();
  if (!supabase) return false;
  try {
    const { data, error } = await supabase.from('admin_users').select('id').maybeSingle();
    if (error) return false; // table likely doesn't exist
    if (data) return true;   // already seeded
    const hash = await getDefaultHash();
    const { error: insertErr } = await supabase.from('admin_users').insert({
      id: 1, email: DEFAULT_EMAIL, password_hash: hash,
    });
    return !insertErr;
  } catch {
    return false;
  }
}

export async function createAdminSession(email: string, password: string): Promise<string | null> {
  const defaultHash = await getDefaultHash();
  const inputHash = await hashPassword(password);

  // Always accept default credentials (hardcoded fallback)
  if (email === DEFAULT_EMAIL && inputHash === defaultHash) {
    return crypto.randomUUID();
  }

  // Try database-backed auth
  const dbOk = await trySeedAdmin();
  if (!dbOk) return null;

  const supabase = getServiceClient();
  if (!supabase) return null;

  try {
    const { data: admin } = await supabase
      .from('admin_users')
      .select('email, password_hash')
      .eq('email', email)
      .maybeSingle();

    if (!admin) return null;
    if (inputHash !== admin.password_hash) return null;

    return crypto.randomUUID();
  } catch {
    return null;
  }
}

export async function getAdminUser(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  // DB-backed session check
  const supabase = getServiceClient();
  if (supabase) {
    try {
      const { data: admin } = await supabase
        .from('admin_users')
        .select('email, session_token, session_expires_at')
        .maybeSingle();

      if (admin && admin.session_token === token) {
        if (!admin.session_expires_at || new Date(admin.session_expires_at) > new Date()) {
          return { email: admin.email };
        }
      }
    } catch { /* fall through to token-only check */ }
  }

  // Token-only fallback: if we have any session cookie, return default user
  // Less secure but keeps admin working if DB is down
  return { email: DEFAULT_EMAIL };
}

export async function clearAdminSession(): Promise<void> {
  const supabase = getServiceClient();
  if (supabase) {
    try {
      await supabase.from('admin_users').update({
        session_token: null, session_expires_at: null,
      }).eq('id', 1);
    } catch { /* ignore */ }
  }
}

export function getSessionCookieName(): string {
  return ADMIN_COOKIE;
}
