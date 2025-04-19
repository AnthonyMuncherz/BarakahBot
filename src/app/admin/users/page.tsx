// Keep "use client"; - This seems incorrect, let's make this a Server Component too for initial load
// Remove "use client";

// Keep state for potential client-side interactions later if needed, but initial fetch is server-side
// import { useState, useEffect } from "react"; 
import AdminLayout from "@/components/ui/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
// Remove client-side Appwrite import
// import { databases } from "@/lib/appwrite-client"; 
// Import server-side Appwrite SDK and Query directly from node-appwrite
import { users } from "@/lib/appwrite-server";
import { Query, Models } from 'node-appwrite';
// Remove Loader2 import if not used on initial server render
// import { LoadingPage } from "@/components/ui/loading"; 
import { Edit2, Trash2, Search } from "lucide-react";

// Define our custom User type
interface AppwriteUser {
  $id: string;
  name: string;
  email: string;
  emailVerification: boolean;
  status: boolean;
  labels: string[];
  registration: string;
}

// Keep this interface if you plan to implement edit/create modals later
// interface EditUserFormData {
//   name: string;
//   email: string;
//   status: boolean; // Use boolean for status
//   labels: string[]; // Use string[] for labels
//   // Add password fields if you allow password change
// }

// Make the page component async to fetch data server-side
export default async function UsersPage() {
  let usersList: AppwriteUser[] = [];
  let totalUsers = 0;
  let fetchError: string | null = null;

  try {
    // Fetch users directly on the server using the server SDK
    const response = await users.list([
      Query.limit(100) // Fetch up to 100 users, adjust as needed
      // Add more queries for sorting, pagination, filtering if required
    ]);
    
    // Safely cast the response to our type
    usersList = response.users.map(user => ({
      $id: user.$id,
      name: user.name,
      email: user.email,
      emailVerification: user.emailVerification,
      status: user.status || false,
      labels: user.labels || [],
      registration: user.registration
    }));
    totalUsers = response.total;

  } catch (error: any) {
    console.error('Error fetching users server-side:', error);
    fetchError = error.message || 'Failed to fetch users';
  }

  return (
    <AdminLayout> {/* Assuming AdminLayout handles client-side user/admin check */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Management</h1>

        {/* Add search and filter UI here if needed for client-side interaction */}
        <div className="flex justify-between items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search users..."
              // value={searchTerm} // Needs client state
              // onChange={(e) => setSearchTerm(e.target.value)} // Needs client state
              className="pl-10"
            />
          </div>
          {/* Add filter/sort selects here */}
          <Button>
            {/* Add Plus icon if adding create user functionality */}
            {/* <Plus className="w-4 h-4 mr-2" /> */}
            Add User
          </Button>
        </div>


        <Card>
          <div className="p-6">
            {fetchError ? (
              <div className="text-center text-red-600">{fetchError}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Verified</TableHead> {/* Use Appwrite's emailVerification */}
                    <TableHead>Labels</TableHead>
                    <TableHead>Actions</TableHead> {/* Placeholder for edit/delete */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    usersList.map((user) => (
                      <TableRow key={user.$id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.emailVerification ? "Yes" : "No"}</TableCell> {/* Display verification status */}
                        <TableCell>{user.labels.join(", ") || 'None'}</TableCell>
                        <TableCell>
                          {/* Placeholder for Edit/Delete buttons */}
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="p-2" disabled>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" className="p-2" disabled>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
            {/* Optional: Add pagination here based on totalUsers */}
            {totalUsers > usersList.length && (
              <div className="mt-4 text-center text-gray-600">
                Displaying {usersList.length} of {totalUsers} users. Add pagination to see more.
              </div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}