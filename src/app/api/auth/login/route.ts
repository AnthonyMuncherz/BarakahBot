import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Server-side login/session creation with email/password using the Node SDK
  // is typically NOT done for security reasons. The Appwrite Client SDK
  // (Web, Flutter, etc.) should handle account.createEmailPasswordSession()
  // directly on the frontend.

  // This endpoint is a placeholder. Your frontend should call Appwrite directly.

  // Example: You could potentially use this endpoint to trigger
  // something *after* client-side login, but it shouldn't handle the login itself.

  console.warn(
    '[LOGIN_POST] Warning: This server-side login endpoint was called. ' +
      'Typically, login should be handled client-side with the Appwrite Web SDK.'
  );

  return NextResponse.json(
    {
      message:
        "Login should be handled client-side using Appwrite Web SDK's `createEmailPasswordSession`.",
      info: "This server route is likely unnecessary.",
    },
    { status: 405 } // Method Not Allowed (or another appropriate status)
  );
} 