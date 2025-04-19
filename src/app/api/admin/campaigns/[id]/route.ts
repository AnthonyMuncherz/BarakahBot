import { NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite-server';
import { Client, Account } from 'node-appwrite';
import { cookies } from 'next/headers';

// --- Admin Verification Helper (Copied from sibling route.ts - Consider extracting to a shared util) ---
async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session')?.value;

    if (!sessionCookie) {
      console.log('Admin verification: No session cookie found.');
      return false;
    }

    const tempClient = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setSession(sessionCookie);

    const userAccount = new Account(tempClient);
    const user = await userAccount.get();
    console.log('Admin verification: User labels:', user.labels);
    return user.labels?.includes('admin') || false;
  } catch (error) {
    console.error('Admin verification failed in API route [id]:', error);
    return false;
  }
}
// --- End Admin Verification Helper ---

// PUT handler to update a campaign
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const campaignId = params.id;
  console.log(`PUT request received for campaign ID: ${campaignId}`);

  if (!campaignId) {
    return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
  }

  const isAdmin = await verifyAdminSession(); // Await verification *after* ID extraction
  if (!isAdmin) {
    console.log(`PUT request denied for ID ${campaignId}: Not an admin.`);
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // 1. Fetch the document first to ensure it exists (optional but good practice)
    try {
      await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        'campaigns',
        campaignId
      );
    } catch (fetchError: any) {
      if (fetchError.code === 404) {
        console.log(`PUT request failed for ID ${campaignId}: Document not found.`);
        return NextResponse.json({ error: `Campaign with ID ${campaignId} not found.` }, { status: 404 });
      }
      // Rethrow other fetch errors
      throw fetchError;
    }

    const data = await request.json();
    console.log(`PUT request received data for ID ${campaignId}:`, data);

    // 2. Explicitly construct the payload of fields we want to update
    const updatePayload: { [key: string]: any } = {};
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.imageUrl !== undefined) updatePayload.imageUrl = data.imageUrl;
    if (data.goal !== undefined) updatePayload.goal = data.goal;
    if (data.category !== undefined) updatePayload.category = data.category;
    // Exclude fields like raised, daysLeft, etc.

    // Check if there's anything to update
    if (Object.keys(updatePayload).length === 0) {
       console.log(`PUT request for ID ${campaignId}: No valid fields to update.`);
       return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
    }

    // 3. Log the exact payload being sent
    console.log(`Attempting Appwrite update for ID ${campaignId} with payload:`, updatePayload);

    const updatedCampaign = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      'campaigns',
      campaignId,
      updatePayload // Pass the explicitly constructed payload
    );

    console.log(`PUT request successful for ID ${campaignId}:`, updatedCampaign);
    return NextResponse.json(updatedCampaign);
  } catch (error: any) {
     console.error(`Error updating campaign server-side (ID: ${campaignId}):`, error);
     // Provide more specific error message if possible (e.g., not found)
     if (error.code === 404) {
        return NextResponse.json({ error: `Campaign with ID ${campaignId} not found.` }, { status: 404 });
     }
    return NextResponse.json({ error: 'Failed to update campaign', details: error.message }, { status: 500 });
  }
}

// DELETE handler to delete a campaign
export async function DELETE(
  request: Request, // Keep the request parameter even if unused for consistency
  { params }: { params: { id: string } }
) {
  const campaignId = params.id;
  console.log(`DELETE request received for campaign ID: ${campaignId}`);

  if (!campaignId) {
    return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
  }

  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
     console.log(`DELETE request denied for ID ${campaignId}: Not an admin.`);
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      'campaigns',
      campaignId
    );

    console.log(`DELETE request successful for ID ${campaignId}.`);
    // Return a success response with no content
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`Error deleting campaign server-side (ID: ${campaignId}):`, error);
     // Provide more specific error message if possible (e.g., not found)
     if (error.code === 404) {
        return NextResponse.json({ error: `Campaign with ID ${campaignId} not found.` }, { status: 404 });
     }
    return NextResponse.json({ error: 'Failed to delete campaign', details: error.message }, { status: 500 });
  }
} 