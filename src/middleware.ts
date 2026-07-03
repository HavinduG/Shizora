import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the site_unlocked cookie exists
  const isUnlocked = request.cookies.has('site_unlocked');
  const isLockedPage = request.nextUrl.pathname === '/locked';

  // If they are not unlocked and trying to access any page other than /locked, redirect them to /locked
  if (!isUnlocked && !isLockedPage) {
    return NextResponse.redirect(new URL('/locked', request.url));
  }

  // If they are already unlocked and trying to visit /locked, send them to the home page
  if (isUnlocked && isLockedPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except API routes, static assets, and images
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.webp$).*)',
  ],
};