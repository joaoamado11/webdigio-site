import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { meta_title, meta_description, og_image, keywords } = body;

    const admin = await createSupabaseAdminClient();
    const { error } = await admin
      .from('seo_config')
      .update({ meta_title, meta_description, og_image, keywords })
      .eq('id', 1);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
