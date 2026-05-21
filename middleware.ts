import { NextResponse, type NextRequest } from 'next/server';
import { getSessionCookieName } from '@/lib/auth/admin';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow login API and the login page itself
  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/login')) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(getSessionCookieName())?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
