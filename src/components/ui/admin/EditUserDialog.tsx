'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner'; // Assuming you use sonner for toasts
import { Loader2 } from 'lucide-react';

// Define the user type expected by this component
interface AppwriteUser {
    $id: string;
    name: string;
    email: string;
    emailVerification: boolean;
    labels: string[];
    // Add other fields if needed, e.g., status
}

interface EditUserDialogProps {
    user: AppwriteUser | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onUserUpdated: (updatedUser: AppwriteUser) => void; // Callback after successful update
}

export function EditUserDialog({ user, isOpen, onOpenChange, onUserUpdated }: EditUserDialogProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [labels, setLabels] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Update form state when the user prop changes (dialog opens)
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setIsVerified(user.emailVerification || false);
            setLabels(user.labels || []);
            setError(null); // Clear previous errors
        } else {
            // Optionally reset form if user is null (dialog closed or no user selected)
            setName('');
            setEmail('');
            setIsVerified(false);
            setLabels([]);
        }
    }, [user, isOpen]); // Rerun when user changes or dialog opens/closes

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Simple comma-separated input for labels
        const inputLabels = e.target.value.split(',').map(label => label.trim()).filter(Boolean);
        setLabels(inputLabels);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/admin/users/${user.$id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    emailVerification: isVerified,
                    labels,
                }),
            });

            const updatedUserData = await response.json();

            if (!response.ok) {
                throw new Error(updatedUserData.error || `Failed to update user (status ${response.status})`);
            }

            toast.success('User updated successfully!');
            onUserUpdated(updatedUserData); // Notify parent component
            onOpenChange(false); // Close the dialog

        } catch (err: any) {
            console.error("Update user error:", err);
            const errorMessage = err.message || 'An unexpected error occurred.';
            setError(errorMessage);
            toast.error(`Update failed: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit User: {user?.name || '...'}</DialogTitle>
                </DialogHeader>
                {user ? (
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                         {error && (
                            <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md">{error}</p>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="col-span-3"
                                disabled={isLoading}
                            />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="labels" className="text-right">
                                Labels
                            </Label>
                            <Input
                                id="labels"
                                placeholder="admin,tester (comma-separated)"
                                value={labels.join(', ')}
                                onChange={handleLabelChange}
                                className="col-span-3"
                                disabled={isLoading}
                            />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="verified" className="text-right">
                                Verified
                            </Label>
                            <Switch
                                id="verified"
                                checked={isVerified}
                                onCheckedChange={setIsVerified}
                                className="col-span-3 justify-self-start"
                                disabled={isLoading}
                            />
                        </div>
                         <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                ) : (
                    <p>Loading user data...</p> // Or some placeholder
                )}
            </DialogContent>
        </Dialog>
    );
} 