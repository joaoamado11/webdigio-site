'use client';

import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  if (client) return client;

  const isBrowser = typeof document !== 'undefined';

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: isBrowser
        ? {
            getAll() {
              const cookies = document.cookie.split(';').reduce<{ name: string; value: string }[]>(
                (acc, cookie) => {
                  const trimmed = cookie.trim();
                  const eq = trimmed.indexOf('=');
                  if (eq > -1) {
                    const name = trimmed.slice(0, eq);
                    const raw = trimmed.slice(eq + 1);
                    try {
                      acc.push({ name, value: decodeURIComponent(raw) });
                    } catch {
                      acc.push({ name, value: raw });
                    }
                  }
                  return acc;
                },
                []
              );
              return cookies;
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                const encoded = encodeURIComponent(value);
                let cookieStr = `${name}=${encoded}`;
                if (options?.maxAge !== undefined) cookieStr += `; Max-Age=${options.maxAge}`;
                if (options?.domain) cookieStr += `; Domain=${options.domain}`;
                if (options?.path) cookieStr += `; Path=${options.path}`;
                if (options?.sameSite) cookieStr += `; SameSite=${options.sameSite}`;
                if (options?.secure) cookieStr += '; Secure';
                document.cookie = cookieStr;
              });
            },
          }
        : undefined,
    }
  );
  return client;
}
