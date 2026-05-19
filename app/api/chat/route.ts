import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const MAX_MSG_LEN = 500;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawMessage: unknown = body?.message;

    if (typeof rawMessage !== 'string' || rawMessage.trim().length === 0) {
      return NextResponse.json({ error: 'Empty message.' }, { status: 400 });
    }

    // Sanitize: truncate + strip control characters
    const message = rawMessage.slice(0, MAX_MSG_LEN).replace(/[\x00-\x08\x0B-\x1F\x7F]/g, '');
    const lang: string = typeof body?.lang === 'string' ? body.lang : 'PT';

    // Fetch system prompt from Supabase (chatbot_config row id=1)
    const supabase = await createSupabaseServerClient();
    const { data: config } = await supabase
      .from('chatbot_config')
      .select('system_prompt_pt, system_prompt_en')
      .eq('id', 1)
      .single();

    const systemPrompt = config
      ? (lang === 'EN' ? config.system_prompt_en : config.system_prompt_pt)
      : 'You are a helpful assistant for Webdigio, a Portuguese web design agency. Answer concisely.';

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Service unavailable.' }, { status: 503 });
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: message },
      ],
      max_tokens: 400,
      temperature: 0.6,
    });

    const reply = completion.choices?.[0]?.message?.content ?? '';

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[/api/chat]', err);
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 });
  }
}
