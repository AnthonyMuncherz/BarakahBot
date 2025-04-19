import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/lib/appwrite-server'; // Use server SDK
import { Query, AppwriteException } from 'node-appwrite';
import { getUserFromSession } from '@/lib/auth-utils'; // Reuse the auth utility

export async function GET(request: NextRequest) {
    try {
        // 1. Authenticate and authorize the request
        const { user: adminUser, error: authError } = await getUserFromSession();
        if (authError || !adminUser) {
            return NextResponse.json({ error: 'Unauthorized: ' + (authError || 'Not logged in') }, { status: 401 });
        }

        // Check if the logged-in user is an admin
        if (!adminUser.labels.includes('admin')) {
            return NextResponse.json({ error: 'Forbidden: Admin privileges required' }, { status: 403 });
        }

        // 2. Handle search query parameter
        const { searchParams } = new URL(request.url);
        const searchQuery = searchParams.get('search') || '';
        
        // 3. Build Appwrite queries
        const queries: string[] = [
            Query.limit(100), // Adjust limit as needed
            Query.orderDesc('$createdAt') // Example sorting
        ];

        if (searchQuery) {
            // Add search query for name OR email
            // Note: Appwrite search syntax might vary slightly depending on version/
            // configuration. This attempts a basic search filter.
            // For robust search, consider specific indexes and query structures.
            queries.push(Query.search('search', searchQuery)); 
            // Or potentially use multiple Query.equal/Query.contains if search() isn't indexed/suitable
            // queries.push(Query.equal('name', searchQuery)); 
            // queries.push(Query.equal('email', searchQuery)); 
            // You might need indexes on name/email for efficient searching.
        }

        // 4. Fetch users from Appwrite
        const response = await users.list(queries);

        // 5. Return the list of users (ensure the structure matches client expectation)
        return NextResponse.json({
            users: response.users, // The list of user documents
            total: response.total   // Total count for potential pagination
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching users list:', error);
        if (error instanceof AppwriteException) {
            return NextResponse.json({ error: `Appwrite error: ${error.message}` }, { status: error.code || 500 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 