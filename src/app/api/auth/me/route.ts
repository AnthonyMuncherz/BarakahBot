import { NextResponse } from 'next/server';
import { Client, Account } from 'node-appwrite';
import { cookies } from 'next/headers';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setSession(sessionCookie);

    const account = new Account(client);
    
    try {
        const user = await account.get();
        return NextResponse.json({ 
            user: { 
                $id: user.$id,
                name: user.name,
                email: user.email,
                emailVerification: user.emailVerification,
                prefs: user.prefs 
            }
        }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ user: null }, { status: 200 });
    }

  } catch (error) {
    console.error('[ME_GET] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 