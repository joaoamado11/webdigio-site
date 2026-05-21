import { NextResponse } from 'next/server';
import { clearAdminSession, getSessionCookieName } from '@/lib/auth/admin';

export async function POST() {
  try {
    await clearAdminSession();

    const response = NextResponse.json({ success: true });
    response.cookies.set(getSessionCookieName(), '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
