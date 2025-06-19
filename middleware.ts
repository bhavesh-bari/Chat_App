// middleware.ts (Revised)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    console.log('Middleware: Public path. Allowing access.');
    return NextResponse.next();
  }
  console.log('Middleware: Private path. Allowing access for client-side auth check.');
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/chat/:path*', '/profile/:path*'],
};