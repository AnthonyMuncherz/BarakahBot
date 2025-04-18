/**
 * Email Verification Route Handler
 * 
 * This module handles email verification for newly registered users.
 * It validates the verification token, updates the user's verification status,
 * and cleans up the verification record from the database.
 * 
 * Environment Variables Required:
 * - NEXT_PUBLIC_APPWRITE_DATABASE_ID: Appwrite database ID for verification records
 */

import { NextRequest, NextResponse } from 'next/server';
import { databases, users } from '@/lib/appwrite-server';
import { Query } from 'node-appwrite';

/**
 * POST request handler for email verification
 * 
 * @param {NextRequest} request - The incoming HTTP request object containing verification data
 * @returns {Promise<NextResponse>} JSON response with verification status or error message
 * 
 * Expected Request Body:
 * {
 *   userId: string,  // User's ID in Appwrite
 *   token: string    // Verification token sent via email
 * }
 * 
 * Success Response:
 * {
 *   message: string  // Success confirmation message
 * }
 * 
 * Error Response:
 * {
 *   error: string,   // Error message
 *   status: number   // HTTP status code
 * }
 * 
 * Error Codes:
 * - 400: Missing fields or invalid/expired token
 * - 500: Server error during verification
 * 
 * Database Operations:
 * - Queries 'email_verifications' collection for valid token
 * - Updates user's email verification status
 * - Deletes used verification token
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, token } = await request.json();

    if (!userId || !token) {
      return NextResponse.json(
        { error: 'User ID and token are required' },
        { status: 400 }
      );
    }

    // Find the verification record
    const verifications = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      'email_verifications',
      [
        Query.equal('user_id', userId),
        Query.equal('token', token),
        Query.greaterThan('expires_at', new Date().toISOString())
      ]
    );

    if (verifications.total === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Update user's email verification status
    await users.updateEmailVerification(userId, true);

    // Delete the verification record
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      'email_verifications',
      verifications.documents[0].$id
    );

    return NextResponse.json({
      message: 'Email verification successful'
    });
  } catch (error) {
    console.error('[VERIFY_EMAIL_POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
} 