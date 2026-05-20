import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/^﻿/, '');
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.replace(/^﻿/, '');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === '/admin/login';

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Already logged in → redirect away from login page
  if (isLoginPage && user) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Not logged in → send to login page
  if (!isLoginPage && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
