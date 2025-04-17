import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Client, Account } from 'node-appwrite'; // Use node-appwrite for server-side checks

// Initialize Appwrite client for server-side checks
// Ensure these environment variables are set in your deployment environment
const appwriteClient = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!); // Use API Key for server-side verification

const account = new Account(appwriteClient);

// This client is only used if you need API key operations elsewhere in the middleware
// const appwriteAdminClient = new Client()
//     .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
//     .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
//     .setKey(process.env.APPWRITE_API_KEY!);
// const adminAccount = new Account(appwriteAdminClient);

async function verifySession(sessionCookie: string): Promise<boolean> {
  try {
    // Create a temporary client *without* API key for session verification
    const tempClient = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setSession(sessionCookie); // Set the session directly

    const account = new Account(tempClient);
    await account.get(); // Attempt to get the user associated with the session
    return true; // Session is valid
  } catch (error) {
    // console.error('Middleware session verification failed:', error);
    return false; // Session is invalid or expired
  }
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('appwrite-session')?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/dashboard']; // Add other routes as needed

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!sessionCookie) {
      // No session cookie, redirect to login
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the session cookie with Appwrite
    const isSessionValid = await verifySession(sessionCookie);

    if (!isSessionValid) {
      // Invalid session, redirect to login and clear the potentially invalid cookie
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('redirectedFrom', pathname);
      
      const response = NextResponse.redirect(loginUrl);
      // Clear the invalid cookie
      response.cookies.set('appwrite-session', '', { expires: new Date(0), path: '/' });
      return response;
    }
  }
  
  // Optional: Redirect logged-in users away from login/register
  const publicAuthRoutes = ['/login', '/register'];
  const isPublicAuthRoute = publicAuthRoutes.some(route => pathname.startsWith(route));
  if (isPublicAuthRoute && sessionCookie) {
    const isSessionValid = await verifySession(sessionCookie); // Re-verify or assume valid if cookie exists
    if (isSessionValid) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Allow the request to proceed
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
     * - images (public images folder if you have one)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    // Explicitly include protected routes if the above regex is too broad
    // '/dashboard/:path*',
  ],
}; 