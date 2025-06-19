import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Ignorer les routes publiques et assets
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/manifest') ||
    pathname === '/auth/login' ||
    pathname === '/'
  ) {
    return NextResponse.next()
  }

  // Vérifier l'authentification pour les routes protégées
  if (pathname.startsWith('/t/')) {
    const sessionCookie = getSessionCookie(request)
    
    if (!sessionCookie) {
      // Rediriger vers la page de connexion
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) 
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
