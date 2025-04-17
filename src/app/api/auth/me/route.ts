import { NextResponse } from 'next/server';
import { Client, Account } from 'node-appwrite';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const sessionCookie = cookies().get('appwrite-session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 200 }); // No active session
    }

    // Create a temporary client *without* API key for session verification
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setSession(sessionCookie); // Set the session cookie

    const account = new Account(client);
    
    try {
        const user = await account.get();
        // Return only necessary, non-sensitive user data
        return NextResponse.json({ 
            user: { 
                $id: user.$id,
                name: user.name,
                email: user.email,
                emailVerification: user.emailVerification,
                prefs: user.prefs 
                // Add other fields if needed
            }
        }, { status: 200 });
    } catch (e) {
        // Invalid session
        return NextResponse.json({ user: null }, { status: 200 });
    }

  } catch (error) {
    console.error('[ME_GET] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 