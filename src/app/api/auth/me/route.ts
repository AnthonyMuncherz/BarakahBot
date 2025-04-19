/**
 * User Profile Route Handler
 * 
 * This module retrieves the current user's profile information using
 * their session cookie. It's a protected route that requires authentication
 * via an Appwrite session cookie.
 * 
 * Environment Variables Required:
 * - NEXT_PUBLIC_APPWRITE_ENDPOINT: Appwrite server endpoint
 * - NEXT_PUBLIC_APPWRITE_PROJECT_ID: Appwrite project ID
 */

import { NextResponse } from 'next/server';
import { Client, Account } from 'node-appwrite';
import { cookies } from 'next/headers';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * GET request handler for retrieving user profile
 * 
 * @param {Request} request - The incoming HTTP request object
 * @returns {Promise<NextResponse>} JSON response with user data or null
 * 
 * Success Response (Authenticated):
 * {
 *   user: {
 *     $id: string,
 *     name: string,
 *     email: string,
 *     emailVerification: boolean,
 *     prefs: object
 *   }
 * }
 * 
 * Success Response (Not Authenticated):
 * {
 *   user: null
 * }
 * 
 * Error Response:
 * {
 *   error: string,
 *   status: number
 * }
 * 
 * Cookie Requirements:
 * - Requires 'appwrite-session' cookie for authentication
 * 
 * Note: Returns user: null for both missing session and invalid session
 * to avoid leaking authentication status
 */
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setSession(sessionCookie);

    const account = new Account(client);
    
    try {
        const user = await account.get();
        return NextResponse.json({ 
            user: { 
                $id: user.$id,
                name: user.name,
                email: user.email,
                emailVerification: user.emailVerification,
                prefs: user.prefs,
                labels: user.labels
            }
        }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ user: null }, { status: 200 });
    }

  } catch (error) {
    console.error('[ME_GET] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 