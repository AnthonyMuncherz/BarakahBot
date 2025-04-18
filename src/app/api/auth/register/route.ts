/**
 * User Registration Route Handler
 * 
 * This module handles new user registration using Appwrite authentication service
 * and sends verification emails using Mailgun. It creates a new user account,
 * generates a verification token, and sends a verification email.
 * 
 * Environment Variables Required:
 * - MAILGUN_API_KEY: API key for Mailgun service
 * - MAILGUN_DOMAIN: Mailgun domain for sending emails
 * - NEXT_PUBLIC_APP_URL: Application URL for verification links
 * - NEXT_PUBLIC_APPWRITE_DATABASE_ID: Appwrite database ID
 */

import { NextResponse } from 'next/server';
import { users, ID, databases } from '@/lib/appwrite-server';
import { AppwriteException } from 'node-appwrite';
import { Query } from 'node-appwrite';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

// Initialize Mailgun
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
  url: "https://api.eu.mailgun.net"
});

/**
 * POST request handler for user registration
 * 
 * @param {Request} request - The incoming HTTP request object containing registration data
 * @returns {Promise<NextResponse>} JSON response with user details or error message
 * 
 * Expected Request Body:
 * {
 *   email: string,    // User's email address
 *   password: string, // User's password
 *   name?: string     // Optional user's name
 * }
 * 
 * Success Response:
 * {
 *   userId: string,
 *   email: string,
 *   name?: string,
 *   message: string   // Success message with next steps
 * }
 * 
 * Error Response:
 * {
 *   error: string,    // Error message
 *   status: number    // HTTP status code
 * }
 * 
 * Error Codes:
 * - 400: Missing required fields
 * - 409: Email already exists
 * - 500: Unexpected server error
 * 
 * Database Collections Used:
 * - email_verifications: Stores verification tokens
 *   {
 *     user_id: string,
 *     token: string,
 *     expires_at: string (ISO date)
 *   }
 */
export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create the user
    const newUser = await users.create(
      ID.unique(),
      email,
      undefined, // phone
      password,
      name || undefined
    );

    // Generate verification token
    const verificationToken = ID.unique();
    
    try {
      // Store verification token in database
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        'email_verifications',
        ID.unique(),
        {
          user_id: newUser.$id,
          token: verificationToken,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        }
      );

      // Send verification email using Mailgun
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}&userId=${newUser.$id}`;
      
      await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
        from: `BarakahBot <noreply@${process.env.MAILGUN_DOMAIN}>`,
        to: [email],
        subject: "Verify your email address",
        text: `Please verify your email address by clicking this link: ${verificationUrl}`,
        html: `
          <h2>Welcome to BarakahBot!</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
          <p>Or copy and paste this link in your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        `
      });

      return NextResponse.json({ 
        userId: newUser.$id, 
        email: newUser.email, 
        name: newUser.name,
        message: 'Registration successful. Please check your email for verification.'
      });
    } catch (error) {
      console.error('[EMAIL_VERIFICATION_SETUP_ERROR]:', error);
      // If email sending fails, still return success but with a different message
      return NextResponse.json({ 
        userId: newUser.$id, 
        email: newUser.email, 
        name: newUser.name,
        message: 'Registration successful. Please contact support for email verification.'
      });
    }
  } catch (error) {
    console.error('[REGISTER_POST] Error:', error);
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if (error instanceof AppwriteException) {
      errorMessage = error.message;
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
