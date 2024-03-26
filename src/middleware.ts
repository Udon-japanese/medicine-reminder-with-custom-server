import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const BASE_URL = process.env.NEXTAUTH_URL!;
  const pathname = req.nextUrl.pathname;
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set('x-pathname', pathname);

  if (pathname === '/login' || pathname === '/') {
    return NextResponse.next({
      headers: reqHeaders,
    });
  }

  const loginURL = new URL('/login', BASE_URL);
  loginURL.searchParams.set('callbackUrl', `${BASE_URL}${pathname}`);
  const LOGIN_URL = loginURL.href;
  const c = cookies();
  const allCookies = c
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  if (!c.get(process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME!)?.value?.trim()) {
    return NextResponse.redirect(LOGIN_URL);
  }

  const headers = {
    'Content-Type': 'application/json',
    Cookie: allCookies,
  };
  const sessionAPIURL = new URL(`/api/auth/session`, BASE_URL);
  const response = await fetch(sessionAPIURL.href, {
    headers,
    cache: 'no-store',
  });

  if (response.ok) {
    const session = await response.json();

    if (new Date(session.expires) < new Date()) {
      return NextResponse.redirect(LOGIN_URL);
    }

    return NextResponse.next({
      headers: reqHeaders,
    });
  }

  return NextResponse.redirect(LOGIN_URL);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)'],
};
