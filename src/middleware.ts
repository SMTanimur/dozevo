import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
// Removed root '/' as it will be handled by authenticated logic
const publicRoutes = ['/','/login', '/signup', '/forgot-password', '/api'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('Authentication')?.value;
  const workspace = request.cookies.get('workspace')?.value;

  // Helper function to check if path starts with any public prefix
  const isPublicPath = (pathname: string) => {
    return publicRoutes.some(route => pathname.startsWith(route));
  };

  if (token) {
    // --- Authenticated User Logic ---
    if (!workspace || workspace === '') {
      // User is authenticated but no workspace selected/set
      // Redirect to /workspace unless already there or accessing API
      if (path !== '/workspace' && !path.startsWith('/api')) {
        console.log('[Middleware] Auth + No Workspace -> Redirecting to /workspace');
        return NextResponse.redirect(new URL('/workspace', request.url));
      }
    } else {
      // User is authenticated AND has a workspace selected
      const workspaceHomePath = `/${workspace}/home`;

      // Redirect to their workspace home if they are not already there,
      // not trying to access /workspace, and not accessing an API route.
      if (path !== workspaceHomePath && path !== '/workspace' && !path.startsWith('/api')) {
        console.log(`[Middleware] Auth + Workspace -> Redirecting to ${workspaceHomePath}`);
        return NextResponse.redirect(new URL(workspaceHomePath, request.url));
      }
    }
  } else {
    // --- Unauthenticated User Logic ---
    // If the route is not public and there's no token, redirect to login
    if (!isPublicPath(path) && path !== '/') { // Allow access to root for unauthenticated
      console.log('[Middleware] No Auth + Protected Route -> Redirecting to /login');
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow the request to proceed if none of the above conditions caused a redirect
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
