// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/', '/login', '/register'] 

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  if (token && PUBLIC_PATHS.includes(pathname)) {
    try {
      
      jwtVerify(token, secret); 
      console.log('Middleware: Token verified. Redirecting to /chat');
      const url = request.nextUrl.clone();
      url.pathname = '/chat';
      return NextResponse.redirect(url);
    } catch (e) {
      console.error('Middleware: Token verification failed:', (e as Error).message);
      return NextResponse.next();
    }
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    console.log('Middleware: Public path, no token. Allowing access.');
    return NextResponse.next();
  }

  if (!token) {
    console.log('Middleware: Private path, no token. Redirecting to /login');
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
 
    jwtVerify(token, secret); 
    console.log('Middleware: Private path, token valid. Allowing access.');
    return NextResponse.next();
  } catch (e) {
    console.error('Middleware: Private path, token invalid. Redirecting to /login:', (e as Error).message);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/', '/login', '/register', '/chat/:path*', '/profile/:path*'],
}