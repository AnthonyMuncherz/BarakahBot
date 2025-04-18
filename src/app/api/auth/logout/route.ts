/**
 * Logout Route Handler
 * 
 * This module handles user logout by clearing the session cookie.
 * It ensures secure cookie removal and graceful error handling
 * even if cookie clearing fails.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST request handler for user logout
 * 
 * @returns {Promise<NextResponse>} JSON response indicating logout success
 * 
 * Success Response:
 * {
 *   success: boolean  // Always true, even if cookie clearing fails
 * }
 * 
 * Cookie Operations:
 * - Clears 'appwrite-session' cookie by setting expired date
 * - Sets secure cookie options based on environment
 * 
 * Note: Returns success even if cookie clearing fails to ensure
 * client-side logout proceeds normally
 */
export async function POST() {
  try {
    // Create the response object first
    const response = NextResponse.json({ success: true });

    // Clear the session cookie by setting an expired date
    response.cookies.set('appwrite-session', '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Expire the cookie immediately
    });

    return response;
  } catch (error) {
    console.error('[LOGOUT_POST] Error clearing cookie:', error);
    // Even if cookie clearing fails, return a success response for the client to proceed
    return NextResponse.json({ success: true }, { status: 200 }); 
  }
} 