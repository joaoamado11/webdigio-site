'use client';

import { createClient } from '@supabase/supabase-js';

const COOKIE_KEY = 'sb-qbcqsdakghzmcmqetuac-auth-token';

let client: ReturnType<typeof createClient> | null = null;

function toBase64URL(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function writeSessionCookie(session: object | null) {
  if (session) {
    const encoded = 'base64-' + toBase64URL(JSON.stringify(session));
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(encoded)}; Path=/; Max-Age=34560000; SameSite=Lax`;
  } else {
    document.cookie = `${COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
  }
}

export function createSupabaseBrowserClient() {
  if (client) return client;

  client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: 'pkce',
      },
    }
  );

  // Mirror session to cookies so the server middleware (using @supabase/ssr) can read it
  client.auth.onAuthStateChange((event, session) => {
    if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      writeSessionCookie(session);
    } else if (event === 'SIGNED_OUT') {
      writeSessionCookie(null);
    }
  });

  return client;
}
