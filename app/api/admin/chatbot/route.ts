import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { system_prompt_pt, system_prompt_en, greeting_pt, greeting_en } = body;

    const admin = await createSupabaseAdminClient();
    const { error } = await admin
      .from('chatbot_config')
      .update({ system_prompt_pt, system_prompt_en, greeting_pt, greeting_en })
      .eq('id', 1);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
