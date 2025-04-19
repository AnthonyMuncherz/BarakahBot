import { cookies } from 'next/headers';
// Import Client from node-appwrite directly
import { Client, Account, AppwriteException, Models } from 'node-appwrite';
// We no longer need the shared account from appwrite-server here
// import { account as sharedAccount } from './appwrite-server'; 

// Define the expected user type based on Appwrite's Models.User
// You might want to extend or simplify this based on your needs
export type LoggedInUser = Models.User<Models.Preferences>;

interface AuthResult {
    user: LoggedInUser | null;
    error: string | null;
}

// This function is designed for SERVER-SIDE use (Route Handlers, Server Components)
export async function getUserFromSession(): Promise<AuthResult> {
    const cookieStore = await cookies();
    // Ensure you use the correct cookie name set during login
    const sessionCookie = cookieStore.get('appwrite-session'); // Default name, verify yours

    if (!sessionCookie || !sessionCookie.value) {
        console.log('No session cookie found.');
        return { user: null, error: 'No session cookie found' };
    }

    try {
        // Create a new client instance specifically for session validation
        // IMPORTANT: Only set endpoint and project, DO NOT set the API key
        const sessionClient = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); 

        // Set the session cookie on this new client
        sessionClient.setSession(sessionCookie.value);

        // Create an Account service using this session-based client
        const sessionAccount = new Account(sessionClient);

        // Verify the session and get user details
        const user = await sessionAccount.get();

        return { user, error: null };

    } catch (error: any) {
        console.error("Error getting user from session:", error);
        
        // No shared client state to clean up here

        let errorMessage = 'Failed to retrieve user session';
        if (error instanceof AppwriteException) {
            // Specifically check for session-related errors if needed (e.g., 401 Unauthorized)
            errorMessage = `Appwrite error (${error.code}): ${error.message}`;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        // Important: Return the error status correctly in the API routes based on this error
        return { user: null, error: errorMessage }; 
    }
} 