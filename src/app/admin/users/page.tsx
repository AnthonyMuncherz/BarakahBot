'use client'; // Convert to Client Component for state and interactions

import { useState, useEffect } from "react"; 
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
import { users as serverUsersApi } from "@/lib/appwrite-server";
import { Query } from 'node-appwrite';
import { LoadingPage } from "@/components/ui/loading"; // Restore LoadingPage import
import { Edit2, Trash2, Search } from "lucide-react";
// Import the EditUserDialog component
import { EditUserDialog } from "@/components/ui/admin/EditUserDialog"; 
import { toast } from 'sonner'; // Import toast for potential error messages here too

// Align the User type with EditUserDialog (remove status/registration if not used)
interface AppwriteUser {
  $id: string;
  name: string;
  email: string;
  emailVerification: boolean;
  // status: boolean; // Removed for type alignment
  labels: string[];
  // registration: string; // Removed for type alignment
}

// Keep this interface if you plan to implement edit/create modals later
// interface EditUserFormData {
//   name: string;
//   email: string;
//   status: boolean; // Use boolean for status
//   labels: string[]; // Use string[] for labels
//   // Add password fields if you allow password change
// }

// Remove async from component signature, fetch data in useEffect
export default function UsersPage() {
  const [usersList, setUsersList] = useState<AppwriteUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppwriteUser | null>(null);

  // Fetch users client-side using an API route or keep initial server fetch logic?
  // Let's stick to fetching client-side for simplicity with search/state
  const fetchUsers = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      // We need an API route to list users securely from the client
      // Let's assume one exists at /api/admin/users
      // TODO: Create GET /api/admin/users route if it doesn't exist
      const response = await fetch(`/api/admin/users?search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch users (status ${response.status})`);
      }
      const data = await response.json();
      // Ensure the data fetched from the API aligns with the simplified AppwriteUser type
      const mappedUsers = (data.users || []).map((user: any) => ({
        $id: user.$id,
        name: user.name,
        email: user.email,
        emailVerification: user.emailVerification,
        labels: user.labels || [],
        // Ensure status and registration are not expected here if removed from type
      }));
      setUsersList(mappedUsers); 
      // setTotalUsers(data.total || 0); // If pagination is needed
    } catch (error: any) {
      console.error('Error fetching users:', error);
      const errorMsg = error.message || 'Failed to fetch users';
      setFetchError(errorMsg);
      toast.error(errorMsg);
      setUsersList([]); // Clear list on error
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and fetch on search term change
  useEffect(() => {
    fetchUsers();
  }, [searchTerm]); // Re-fetch when searchTerm changes

  const handleEditClick = (user: AppwriteUser) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUserUpdated = (updatedUser: AppwriteUser) => {
    // Update the user list state (type should now match)
    setUsersList(currentUsers => 
      currentUsers.map(u => (u.$id === updatedUser.$id ? updatedUser : u))
    );
  };

  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      // Basic debounce could be added here if needed
  };

  return (
    <AdminLayout> 
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Management</h1>

        <div className="flex justify-between items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={handleSearchChange} 
              className="pl-10 w-64" // Make search wider
            />
          </div>
          {/* TODO: Implement Add User Dialog/Button */}
          <Button disabled> {/* Keep Add User disabled for now */}
            Add User
          </Button>
        </div>

        <Card>
          <div className="p-6">
            {isLoading ? (
                <LoadingPage />
            ) : fetchError ? (
              <div className="text-center text-red-600 py-10">Error: {fetchError}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Labels</TableHead>
                    <TableHead>Actions</TableHead> 
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        {searchTerm ? `No users found matching "${searchTerm}".` : 'No users found.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    usersList.map((user) => (
                      <TableRow key={user.$id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.emailVerification ? "Yes" : "No"}</TableCell>
                        <TableCell>{user.labels.join(", ") || 'None'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="p-2" 
                              onClick={() => handleEditClick(user)} // Enable edit button
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            {/* TODO: Implement Delete User */}
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
            {/* Optional: Add client-side pagination here if needed */}
          </div>
        </Card>
      </div>
      
      {/* Render the Edit User Dialog */}
      <EditUserDialog
        user={selectedUser}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUserUpdated={handleUserUpdated}
      />

    </AdminLayout>
  );
}