import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/forgot-password', '/api'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('Authentication')?.value;
  const workspace = request.cookies.get('workspace')?.value;

  // Helper function to check if path starts with any public prefix
  const isPublicPath = (pathname: string) => {
    return publicRoutes.some(
      route => pathname === route || pathname.startsWith(route)
    );
  };

  const workspaceHomePath = `/${workspace}/home`;

  if (token) {
    // --- Authenticated User Logic ---
    if (!workspace || workspace === '') {
      // User is authenticated but no workspace selected/set
      // Redirect to /workspace unless already there or accessing API
      if (path !== '/workspace' && !path.startsWith('/api')) {
        console.log(
          '[Middleware] Auth + No Workspace -> Redirecting to /workspace'
        );
        return NextResponse.redirect(new URL('/workspace', request.url));
      }
    } else if (
      path === '/' ||
      path === '/login' ||
      path === '/signup' ||
      path === '/forgot-password'
    ) {
      // User is authenticated AND has a workspace selected
      // Only redirect from explicit public pages to workspace home
      console.log(
        `[Middleware] Auth + Workspace + Public Route -> Redirecting to ${workspaceHomePath}`
      );
      return NextResponse.redirect(new URL(workspaceHomePath, request.url));
    }
  } else {
    // --- Unauthenticated User Logic ---
    // Allow access to public routes (including /login, /signup, etc.) and the root path
    if (isPublicPath(path) || path === '/') {
      return NextResponse.next();
    }

    // For all other paths, redirect unauthenticated users to the login page
    console.log(
      '[Middleware] No Auth + Protected Route -> Redirecting to /login'
    );
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
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
