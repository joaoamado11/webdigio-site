import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  // Verify the user is authenticated
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { rows } = await req.json() as {
    rows: Array<{ section: string; key: string; value_pt: string; value_en: string }>;
  };

  if (!Array.isArray(rows) || rows.length === 0) {
    return Response.json({ error: 'No rows provided' }, { status: 400 });
  }

  // Use admin client to bypass RLS for writing
  const admin = await createSupabaseAdminClient();
  const { error } = await admin
    .from('site_content')
    .upsert(rows, { onConflict: 'section,key' });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
