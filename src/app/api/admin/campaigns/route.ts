import { NextResponse } from 'next/server';
import { databases, ID } from '@/lib/appwrite-server';
import { Client, Account, Query } from 'node-appwrite'; // Use node-appwrite
import { cookies } from 'next/headers';

// Initialize Appwrite client for server-side checks (distinct from lib/appwrite-server if needed, but can reuse)
const appwriteClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!); // Use API Key for server-side verification

const account = new Account(appwriteClient);

// Helper function to verify admin session
async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session')?.value;

    if (!sessionCookie) {
      return false;
    }

    // Use a temporary client initialized with the session cookie to get the user
    const tempClient = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setSession(sessionCookie);

    const userAccount = new Account(tempClient);
    const user = await userAccount.get();

    // Check if user has admin label
    return user.labels?.includes('admin') || false;
  } catch (error) {
    console.error('Admin verification failed in API route:', error);
    return false;
  }
}


// GET handler to fetch campaigns (for admin view)
export async function GET(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // You can add query parsing here if needed for search/filter from the client
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search');
    const statusFilter = searchParams.get('status');
    // Add pagination, sorting etc. as needed

    const queries = [];
    if (searchTerm) {
      // Assuming you have a fulltext index on 'title' or other relevant fields
      queries.push(Query.search('title', searchTerm)); // Or Query.or([Query.search('title', searchTerm), Query.search('description', searchTerm)])
    }
    if (statusFilter && statusFilter !== 'all') {
      queries.push(Query.equal('status', statusFilter));
    }
    // Add default sorting if none specified
    queries.push(Query.orderDesc('$createdAt'));


    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      'campaigns',
      queries
    );

    return NextResponse.json(response.documents);
  } catch (error) {
    console.error('Error fetching campaigns server-side:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

// POST handler to create a campaign
export async function POST(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const data = await request.json();
    // Add validation for incoming data here

    const newCampaign = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      'campaigns',
      ID.unique(),
      data,
      // Add appropriate permissions - e.g., read for 'any', write for 'role:admin'
      [`read("any")`, `write("role:admin")`]
    );

    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign server-side:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

// You would add PUT (update) and DELETE handlers in a dynamic route like /api/admin/campaigns/[id]/route.ts