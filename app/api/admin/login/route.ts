import { NextResponse } from 'next/server';
import { createAdminSession, getSessionCookieName } from '@/lib/auth/admin';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e password são obrigatórios.' }, { status: 400 });
    }

    const token = await createAdminSession(email, password);

    if (!token) {
      return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    if (msg.includes('relation') && msg.includes('does not exist')) {
      return NextResponse.json({
        error: 'Setup needed. Run the SQL migration first: supabase/migrations/002_admin_auth.sql',
      }, { status: 500 });
    }
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 });
  }
}
