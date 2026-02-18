import { getSessionCookie } from 'better-auth/cookies'
import { type NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const { pathname } = request.nextUrl

  const isPublicRoute =
    pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')

  if (!sessionCookie && !isPublicRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  if (sessionCookie && isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
