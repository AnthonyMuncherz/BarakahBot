import { NextRequest, NextResponse } from 'next/server';
import { users, ID } from '@/lib/appwrite-server';
import { AppwriteException } from 'node-appwrite';

export async function POST(request: NextRequest) {
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
      name
    );

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    console.error('[REGISTER_POST] Appwrite Error:', error);

    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if (error instanceof AppwriteException) {
      errorMessage = error.message;
      statusCode = error.code || 500;
      // Appwrite specific error handling (e.g., user_already_exists)
      if (error.code === 409) { // Conflict
        errorMessage = 'User with this email already exists';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 