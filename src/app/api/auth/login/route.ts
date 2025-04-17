import { NextResponse } from 'next/server';
import { Client, Account } from 'node-appwrite';
import { AppwriteException } from 'node-appwrite';

// Initialize Appwrite client for server-side operations
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const account = new Account(client);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create session using the server-side SDK - Use correct method name
    const session = await account.createEmailPasswordSession(email, password); // <--- CHANGE HERE

    // Create the response object
    const response = NextResponse.json({
      success: true,
      sessionId: session.$id,
      userId: session.userId
    });

    // Set the session cookie
    response.cookies.set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(session.expire),
    });

    return response;

  } catch (error) {
    console.error('[LOGIN_POST] Error:', error);
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if (error instanceof AppwriteException) {
      errorMessage = error.message;
      if (error.code === 401) { // AppwriteException.USER_INVALID_CREDENTIALS
        statusCode = 401;
        errorMessage = 'Invalid email or password';
      } else if (error.code === 404) { // AppwriteException.USER_NOT_FOUND (although 401 is more common for login)
        statusCode = 404;
        errorMessage = 'User not found';
      } else if (error.code === 429) { // AppwriteException.RATE_LIMIT_EXCEEDED
        statusCode = 429;
        errorMessage = 'Too many login attempts. Please try again later.';
      } else {
        statusCode = error.code || 500;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
