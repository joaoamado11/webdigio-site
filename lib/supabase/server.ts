import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/^\uFEFF/, '');
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').replace(/^\uFEFF/, '');
  return createServerClient(url, key, {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch { /* Server Component — ignore */ }
        },
      },
    }
  );
}

export async function createSupabaseAdminClient() {
  const cookieStore = await cookies();
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/^\uFEFF/, '');
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').replace(/^\uFEFF/, '');
  return createServerClient(url, serviceKey, {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch { /* ignore */ }
        },
      },
    }
  );
}
