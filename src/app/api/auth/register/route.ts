import { NextResponse } from 'next/server';
import { users, ID } from '@/lib/appwrite-server'; // Use server-side SDK
import { AppwriteException } from 'node-appwrite';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const newUser = await users.create(
      ID.unique(),
      email,
      undefined, // phone
      password,
      name || undefined // name
    );

    // You might want to automatically log the user in here or send a verification email
    // For now, just return the created user info (excluding sensitive data)

    return NextResponse.json({ userId: newUser.$id, email: newUser.email, name: newUser.name });
  } catch (error) {
    console.error('[REGISTER_POST] Appwrite error:', error);
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if (error instanceof AppwriteException) {
      errorMessage = error.message;
      // Appwrite often uses 409 for conflicts like user already exists
      if (error.code === 409) {
        statusCode = 409;
        errorMessage = 'User with this email already exists';
      } else {
        statusCode = error.code || 500;
      }
    } 
    
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
