import { NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite-server';
import { Client, Account } from 'node-appwrite';
import { cookies } from 'next/headers';

// --- Admin Verification Helper ---
async function verifyAdminSession(): Promise<boolean> {
    try {
        const cookieStore = await cookies(); // Await here
        const sessionCookie = cookieStore.get('appwrite-session')?.value;

        if (!sessionCookie) {
            console.log('Admin verification: No session cookie found.');
            return false;
        }

        // Create a temporary client with the session cookie to check validity
        const tempClient = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
            .setSession(sessionCookie); // Set the session from the cookie

        const userAccount = new Account(tempClient);
        const user = await userAccount.get(); // Await here
        console.log('Admin verification: User labels:', user.labels);
        // Check if the user has the 'admin' label
        return user.labels?.includes('admin') || false;
    } catch (error) {
        console.error('Admin verification failed in API route [id]:', error);
        // Handle cases where the session might be invalid or expired
        return false;
    }
}
// --- End Admin Verification Helper ---

// PUT handler to update a campaign
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    // 1. Perform async verification FIRST
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
        console.log(`PUT request denied: Not an admin.`); // Log denial reason
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Now access params.id AFTER the first await
    const campaignId = params.id;
    console.log(`PUT request received for campaign ID: ${campaignId}`);

    // 3. Validate campaignId presence
    if (!campaignId) {
        return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    // Continue with the rest of the logic...
    try {
        // Fetch the document first to ensure it exists (optional but good practice)
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

        const data = await request.json(); // Await request body parsing
        console.log(`PUT request received data for ID ${campaignId}:`, data);

        // Explicitly construct the payload of fields we want to update
        const updatePayload: { [key: string]: any } = {};
        if (data.title !== undefined) updatePayload.title = data.title;
        if (data.description !== undefined) updatePayload.description = data.description;
        if (data.imageUrl !== undefined) updatePayload.imageUrl = data.imageUrl;
        if (data.goal !== undefined) updatePayload.goal = data.goal;
        if (data.category !== undefined) updatePayload.category = data.category;
        // Exclude fields like raised, daysLeft, etc., unless explicitly allowed by API

        // Check if there's anything to update
        if (Object.keys(updatePayload).length === 0) {
            console.log(`PUT request for ID ${campaignId}: No valid fields to update.`);
            return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
        }

        // Log the exact payload being sent
        console.log(`Attempting Appwrite update for ID ${campaignId} with payload:`, updatePayload);

        const updatedCampaign = await databases.updateDocument( // Await database update
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            'campaigns',
            campaignId,
            updatePayload // Pass the explicitly constructed payload
        );

        console.log(`PUT request successful for ID ${campaignId}:`, updatedCampaign);
        return NextResponse.json(updatedCampaign);
    } catch (error: any) {
        console.error(`Error updating campaign server-side (ID: ${campaignId}):`, error);
        // Provide more specific error message if possible
        if (error.code === 404) { // Handle potential 404 from updateDocument if check above missed
            return NextResponse.json({ error: `Campaign with ID ${campaignId} not found.` }, { status: 404 });
        }
        // Check for JSON parsing error
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update campaign', details: error.message || 'Unknown error' }, { status: 500 });
    }
}

// DELETE handler to delete a campaign
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    // 1. Verify admin session first
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
        console.log(`DELETE request denied: Not an admin.`);
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Access params.id after the first await
    const campaignId = params.id;
    console.log(`DELETE request received for campaign ID: ${campaignId}`);

    // 3. Validate campaignId presence
    if (!campaignId) {
        return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    // Continue with delete logic...
    try {
        await databases.deleteDocument( // Await database deletion
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            'campaigns',
            campaignId
        );

        console.log(`DELETE request successful for ID ${campaignId}.`);
        // Return a success response with no content for DELETE
        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        console.error(`Error deleting campaign server-side (ID: ${campaignId}):`, error);
        // Provide more specific error message if possible
        if (error.code === 404) { // Handle 404 if document doesn't exist
            return NextResponse.json({ error: `Campaign with ID ${campaignId} not found.` }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete campaign', details: error.message || 'Unknown error' }, { status: 500 });
    }
}