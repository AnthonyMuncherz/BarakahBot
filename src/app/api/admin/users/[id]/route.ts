import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/lib/appwrite-server'; // Use server SDK
import { AppwriteException } from 'node-appwrite';
import { getUserFromSession } from '@/lib/auth-utils'; // Utility to get user and check admin

interface UpdateUserData {
    name?: string;
    email?: string;
    emailVerification?: boolean;
    labels?: string[];
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const userIdToUpdate = params.id;

    if (!userIdToUpdate) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        // 1. Authenticate and authorize the request
        const { user: adminUser, error: authError } = await getUserFromSession();
        if (authError || !adminUser) {
            return NextResponse.json({ error: 'Unauthorized: ' + (authError || 'Not logged in') }, { status: 401 });
        }
        
        // Check if the logged-in user is an admin (has 'admin' label)
        if (!adminUser.labels.includes('admin')) {
             return NextResponse.json({ error: 'Forbidden: Admin privileges required' }, { status: 403 });
        }

        // 2. Parse the request body
        const body: UpdateUserData = await request.json();
        const { name, email, emailVerification, labels } = body;

        // 3. Perform updates using Appwrite server SDK
        let updateError = null;
        let updatedUser = null;

        // You might want to fetch the current user details first if needed, 
        // but Appwrite update functions often handle partial updates.

        if (name !== undefined) {
            try {
                updatedUser = await users.updateName(userIdToUpdate, name);
            } catch (e: any) {
                console.error(`Error updating name for user ${userIdToUpdate}:`, e);
                updateError = updateError ? `${updateError}; Name update failed` : 'Name update failed';
            }
        }

        if (email !== undefined) {
             // Ensure email is not empty or invalid if required by your logic
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                 return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
            }
            try {
                updatedUser = await users.updateEmail(userIdToUpdate, email);
            } catch (e: any) {
                 console.error(`Error updating email for user ${userIdToUpdate}:`, e);
                 // Check for specific Appwrite errors like email already exists
                 if (e instanceof AppwriteException && e.code === 409) { // 409 Conflict (User already exists)
                     updateError = updateError ? `${updateError}; Email already exists` : 'Email already exists';
                 } else {
                    updateError = updateError ? `${updateError}; Email update failed` : 'Email update failed';
                 }
            }
        }

        if (emailVerification !== undefined) {
            try {
                updatedUser = await users.updateEmailVerification(userIdToUpdate, emailVerification);
            } catch (e: any) {
                 console.error(`Error updating email verification for user ${userIdToUpdate}:`, e);
                 updateError = updateError ? `${updateError}; Email verification update failed` : 'Email verification update failed';
            }
        }

        if (labels !== undefined) {
             // Basic validation for labels (e.g., ensure it's an array of strings)
            if (!Array.isArray(labels) || !labels.every(label => typeof label === 'string')) {
                return NextResponse.json({ error: 'Invalid labels format, must be an array of strings' }, { status: 400 });
            }
            try {
                updatedUser = await users.updateLabels(userIdToUpdate, labels);
            } catch (e: any) {
                 console.error(`Error updating labels for user ${userIdToUpdate}:`, e);
                 updateError = updateError ? `${updateError}; Labels update failed` : 'Labels update failed';
            }
        }

        // 4. Handle potential errors during updates
        if (updateError) {
            // If only some updates failed, consider returning partial success or specific errors
             return NextResponse.json({ error: `Failed to update user: ${updateError}` }, { status: 400 }); // Or 500 if server-side issue
        }
        
         // If at least one update was attempted, fetch the final user state
        if (updatedUser) {
           const finalUser = await users.get(userIdToUpdate);
            return NextResponse.json(finalUser, { status: 200 });
        } else {
             // No updates were requested or all failed silently (should have error)
            // Fetch the user anyway to return current state
             const currentUser = await users.get(userIdToUpdate);
             return NextResponse.json(currentUser, { status: 200 }); // Or return an error if no fields provided?
        }

    } catch (error: any) {
        console.error(`Unhandled error updating user ${userIdToUpdate}:`, error);
        // Distinguish between Appwrite errors and other errors
        if (error instanceof AppwriteException) {
            return NextResponse.json({ error: `Appwrite error: ${error.message}` }, { status: error.code || 500 });
        }
        if (error instanceof SyntaxError) { // JSON parsing error
             return NextResponse.json({ error: 'Invalid request body: Malformed JSON' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Optional: Implement GET, DELETE if needed for this specific route
// export async function GET(...) {}
// export async function DELETE(...) {} 