'use client';

import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

function sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
  const clean: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    let cleanValue = '';
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      if (code <= 255) {
        cleanValue += value[i];
      }
    }
    if (cleanValue !== value) {
      console.warn('[supabase] stripped non-ISO-8859-1 chars from header', key);
    }
    clean[key] = cleanValue;
  }
  return clean;
}

function createSafeFetch(): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    if (init?.headers) {
      if (init.headers instanceof Headers) {
        const plain: Record<string, string> = {};
        init.headers.forEach((v, k) => { plain[k] = v; });
        const clean = sanitizeHeaders(plain);
        const h = new Headers();
        Object.entries(clean).forEach(([k, v]) => h.set(k, v));
        init = { ...init, headers: h };
      } else {
        init = { ...init, headers: sanitizeHeaders(init.headers as Record<string, string>) };
      }
    }
    return fetch(input, init);
  };
}

export function createSupabaseBrowserClient() {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: createSafeFetch(),
      },
    }
  );
  return client;
}
