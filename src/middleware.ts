import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set('x-pathname', pathname);

  if (pathname === '/login' || pathname === '/') {
    return NextResponse.next({
      headers: reqHeaders,
    });
  }

  const loginURL = new URL('/login', req.nextUrl);
  loginURL.searchParams.set('callbackUrl', req.nextUrl.href);
  const LOGIN_URL = loginURL.href;
  const c = cookies();
  const allCookies = c
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  if (!c.get('next-auth.session-token')?.value?.trim()) {
    return NextResponse.redirect(LOGIN_URL);
  }

  const headers = {
    'Content-Type': 'application/json',
    Cookie: allCookies,
  };
  const sessionAPIURL = new URL(`/api/auth/session`, req.nextUrl);
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
