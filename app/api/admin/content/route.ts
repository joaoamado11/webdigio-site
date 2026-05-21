import { getAdminUser } from '@/lib/auth/admin';
import { createSupabaseAdminClient, clearSiteContentCache } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { rows } = await req.json() as {
    rows: Array<{ section: string; key: string; value_pt: string; value_en: string }>;
  };

  if (!Array.isArray(rows) || rows.length === 0) {
    return Response.json({ error: 'No rows provided' }, { status: 400 });
  }

  const admin = await createSupabaseAdminClient();
  const { error } = await admin
    .from('site_content')
    .upsert(rows, { onConflict: 'section,key' });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  clearSiteContentCache();
  return Response.json({ ok: true });
}
