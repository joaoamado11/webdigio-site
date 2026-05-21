import { createClient } from '@supabase/supabase-js';

export function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

type ContentRow = { section: string; key: string; value_pt: string; value_en: string };

// Cached content for server-side reads
let _contentCache: ContentRow[] | null = null;

export async function getSiteContent(): Promise<ContentRow[]> {
  if (_contentCache) return _contentCache;

  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from('site_content')
    .select('section, key, value_pt, value_en')
    .order('section')
    .order('key');

  _contentCache = data ?? [];
  return _contentCache;
}

export function clearSiteContentCache() {
  _contentCache = null;
}
