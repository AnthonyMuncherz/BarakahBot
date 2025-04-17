import { NextResponse } from 'next/server';
import { account } from '@/lib/appwrite-server'; // Use server-side SDK
import { AppwriteException } from 'node-appwrite';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create session using the server-side SDK
    const session = await account.createEmailPasswordSession(email, password);

    // Create the response object first
    const response = NextResponse.json({ success: true, sessionId: session.$id });

    // Set the cookie on the response
    response.cookies.set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(session.expire),
    });

    // Optionally, you could fetch the user details here if needed on the client
    // const user = await account.get(); 

    return response; // Return the response with the cookie

  } catch (error) {
    console.error('[LOGIN_POST] Appwrite error:', error);
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if (error instanceof AppwriteException) {
      errorMessage = error.message;
      // Appwrite uses 401 for invalid credentials
      if (error.code === 401) {
         statusCode = 401;
         errorMessage = 'Invalid email or password';
      } else {
        statusCode = error.code || 500;
      }
    }
    
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
} 