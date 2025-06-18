import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const PUBLIC_PATHS = ['/login', '/register', '/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value

  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!)
    return NextResponse.next()
  } catch (err) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/chat/:path*', '/profile/:path*'], // Protect these routes
}
