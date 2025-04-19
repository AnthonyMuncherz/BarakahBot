import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Client, Account } from 'node-appwrite'; // Use node-appwrite for server-side checks
import { cookies } from 'next/headers';

// Initialize Appwrite client for session verification on the server
// This client does NOT need the API key to verify a session cookie.
// It only needs the endpoint and project ID.
const appwriteClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
// Do NOT set .setKey() here for session verification

const account = new Account(appwriteClient);


async function verifySession(sessionCookie: string): Promise<{ isValid: boolean; isAdmin: boolean }> {
  try {
    // Set the session cookie on the client instance
    appwriteClient.setSession(sessionCookie);

    // Attempt to get the user associated with the session
    const user = await account.get();

    // Check if user exists and has the 'admin' label
    const isAdmin = user.labels?.includes('admin') || false;

    return { isValid: true, isAdmin }; // Session is valid
  } catch (error) {
    console.error('[Middleware] Session verification failed:', error);
    // Session is invalid or expired, or user not found
    return { isValid: false, isAdmin: false };
  }
}


export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('appwrite-session')?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes that require *any* valid session
  const protectedRoutes = ['/dashboard']; // Add other user-specific routes here

  // Define admin-only routes
  const adminRoutes = ['/admin', '/api/admin']; // Paths starting with /admin or /api/admin

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));


  // Handle admin routes first
  if (isAdminRoute) {
    if (!sessionCookie) {
      // No session cookie, redirect to login
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify session and check for admin label
    const { isValid, isAdmin } = await verifySession(sessionCookie);

    if (!isValid) {
      // Invalid session, redirect to login and clear cookie
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('redirectedFrom', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set('appwrite-session', '', { expires: new Date(0), path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      return response;
    }

    if (!isAdmin) {
      // Valid session, but not admin, redirect to access denied
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }

    // Valid session and is admin, allow access
    return NextResponse.next();
  }

  // Handle other protected routes (require any logged-in user)
  if (isProtectedRoute) {
    if (!sessionCookie) {
      // No session cookie, redirect to login
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify session (admin check is not needed here)
    const { isValid } = await verifySession(sessionCookie);

    if (!isValid) {
      // Invalid session, redirect to login and clear cookie
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('redirectedFrom', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set('appwrite-session', '', { expires: new Date(0), path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      return response;
    }

    // Valid session, allow access
    return NextResponse.next();
  }

  // Handle public auth routes (/login, /register) - redirect if already logged in
  const publicAuthRoutes = ['/login', '/register'];
  const isPublicAuthRoute = publicAuthRoutes.some(route => pathname.startsWith(route));

  if (isPublicAuthRoute && sessionCookie) {
    const { isValid } = await verifySession(sessionCookie);
    if (isValid) {
      // Valid session, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // If session is invalid, let the user proceed to login/register (cookie will be cleared by the redirect response above if it was a protected route that failed)
  }

  // Allow access to all other public routes
  return NextResponse.next();
}

// Configures which paths the middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images folder if you have one)
     */
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
    // Explicitly include protected/admin routes to be sure
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/login',
    '/register',
  ],
};