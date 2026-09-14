import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'pravah_session';

function decodeSessionPayload(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const jsonStr = atob(b64);
    const payload = JSON.parse(jsonStr);
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets, internal paths, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
  const session = sessionCookie ? decodeSessionPayload(sessionCookie) : null;

  // 1. If accessing login while already authenticated
  if (pathname === '/login') {
    if (session) {
      if (session.role === 'CITIZEN') {
        return NextResponse.redirect(new URL('/citizen/grievances', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 2. Role check for citizen accessing authority dashboard
  if (pathname.startsWith('/dashboard')) {
    if (session && session.role === 'CITIZEN') {
      return NextResponse.redirect(new URL('/citizen/grievances', request.url));
    }
    // Super Admin check for /dashboard/admin
    if (pathname.startsWith('/dashboard/admin')) {
      if (session && session.role !== 'SUPER_ADMIN' && session.role !== 'NODAL_OFFICER') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/citizen/:path*', '/login'],
};
