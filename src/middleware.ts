import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if maintenance mode is enabled in the environment variables
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  // The path the user is trying to access
  const path = request.nextUrl.pathname;

  // If maintenance mode is ON, and they are NOT already on the coming-soon page, redirect them.
  // We also make sure not to block API routes or static files so the coming soon page works.
  if (
    isMaintenanceMode &&
    path !== '/coming-soon' &&
    !path.startsWith('/api/') &&
    !path.startsWith('/_next/') &&
    !path.match(/\.(ico|png|jpg|jpeg|svg|webp)$/)
  ) {
    return NextResponse.redirect(new URL('/coming-soon', request.url));
  }

  // If maintenance mode is OFF, but they try to visit the coming-soon page, redirect to home.
  if (!isMaintenanceMode && path === '/coming-soon') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
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
};
