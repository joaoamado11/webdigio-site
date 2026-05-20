'use client';

import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/^﻿/, '');
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.replace(/^﻿/, '');
  client = createBrowserClient(url, key);
  return client;
}
