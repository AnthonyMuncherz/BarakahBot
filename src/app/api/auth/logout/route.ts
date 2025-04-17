import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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