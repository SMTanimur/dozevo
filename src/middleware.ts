import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/api'];

export function middleware(request: NextRequest) {
  // Get the path from the request
  const path = request.nextUrl.pathname;

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(
    route => path === route || (path.startsWith(route) && route !== '/')
  );

  // Get the token from cookies
  const token = request.cookies.get('Authentication')?.value;

  // If user is authenticated (has token) and tries to access certain public authentication routes,
  // redirect to projects page
  if (token && ( path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If it's not a public route and there's no token, redirect to login
  if (!isPublicRoute && !token) {
    const loginUrl = new URL('/login', request.url);



    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  // Match all request paths except for the ones starting with:
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - public files (images, etc.)
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
