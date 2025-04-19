"use client";

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
  DialogFooter // Added for create/edit forms
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label"; // Added for forms
import { Textarea } from "@/components/ui/textarea"; // Added for description
import { Plus, Edit2, Trash2, Search, Loader2 } from "lucide-react";
// Remove direct Appwrite client import
// import { databases } from "@/lib/appwrite-client"; 

interface Campaign {
  $id: string;
  title: string;
  description: string;
  imageUrl?: string; // Make optional if not always present
  goal: number;      // Changed from target_amount
  raised: number;    // Changed from current_amount
  daysLeft?: number;  // Added, make optional
  category?: string; // Added, make optional
  $createdAt: string;
}

// Add state for forms
const initialCampaignFormData = {
  title: "",
  description: "",
  imageUrl: "",     // Added
  goal: 0,         // Changed
  raised: 0,       // Added (might be needed for edit display, but not set in create)
  daysLeft: 0,     // Added (might be needed for edit display, but not set in create)
  category: "",     // Added
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");

  // State for Create/Edit Dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState(initialCampaignFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    fetchCampaigns();
    // Add status and searchTerm as dependencies to refetch when filters change
  }, [searchTerm, selectedStatus]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      // Fetch campaigns from the new protected API route
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.set('search', searchTerm);
      if (selectedStatus !== 'all') queryParams.set('status', selectedStatus);

      const response = await fetch(`/api/admin/campaigns?${queryParams.toString()}`);

      if (!response.ok) {
        // Handle non-OK responses, potentially redirect to login/access-denied if 401/403
        console.error('Error fetching campaigns API:', response.status, await response.text());
        // Optionally check status and redirect
        if (response.status === 401 || response.status === 403) {
          // Redirect to login or access denied - middleware might handle this, but redundant check is safe
          // router.push('/access-denied'); 
        }
        setCampaigns([]); // Clear campaigns on error
        return;
      }

      const data = await response.json();
      console.log('Received campaigns data:', data); // Add logging
      setCampaigns(data as Campaign[]);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setCampaigns([]); // Clear campaigns on error
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Ensure formData aligns with what API expects (e.g., using 'goal')
      const payload = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl, // Include if editing/creating
        goal: formData.goal,       // Use goal
        category: formData.category, // Include if editing/creating
        // Do not send 'raised' or 'daysLeft' if they are calculated/managed server-side
      };

      const response = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Send the corrected payload
      });

      if (!response.ok) {
        console.error('Error creating campaign API:', response.status, await response.text());
        // Handle error response (e.g., show toast)
        return;
      }

      // Assuming success returns the new campaign data, though not strictly needed for refetch
      // const newCampaign = await response.json();

      fetchCampaigns(); // Refresh the list
      setIsCreateDialogOpen(false); // Close dialog
      setFormData(initialCampaignFormData); // Reset form
    } catch (error) {
      console.error("Error creating campaign:", error);
      // Handle error (e.g., show toast)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCampaign) return;
    setIsSubmitting(true);
    try {
      // Ensure formData aligns with what API expects (e.g., using 'goal', 'raised')
      // When updating, you might only want to send editable fields.
      // 'raised' and 'daysLeft' are often calculated/managed by backend logic or separate processes (like donations).
      // Only include them if your API explicitly allows updating them directly.
      const payload = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        goal: formData.goal,
        category: formData.category,
        // raised: formData.raised, // Likely shouldn't send this
        // daysLeft: formData.daysLeft, // Likely shouldn't send this
      };

      const response = await fetch(`/api/admin/campaigns/${currentCampaign.$id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Send the corrected payload
      });

      if (!response.ok) {
        console.error('Error updating campaign API:', response.status, await response.text());
        // Handle error response
        return;
      }

      fetchCampaigns(); // Refresh the list
      setIsEditDialogOpen(false); // Close dialog
      setCurrentCampaign(null); // Clear current campaign
      setFormData(initialCampaignFormData); // Reset form
    } catch (error) {
      console.error("Error updating campaign:", error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleDeleteCampaign = async (campaignId: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        // Call a new protected API route for deletion (e.g., DELETE /api/admin/campaigns/[id])
        // You'll need to create this route handler
        const response = await fetch(`/api/admin/campaigns/${campaignId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          console.error('Error deleting campaign API:', response.status, await response.text());
          // Handle error response
          return;
        }

        fetchCampaigns(); // Refresh the list
      } catch (error) {
        console.error("Error deleting campaign:", error);
        // Handle error
      }
    }
  };

  // Helper function to safely format dates
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) { // Check if the date is valid
        console.warn('Invalid date string encountered:', dateString);
        return 'Invalid Date';
      }
      return date.toLocaleDateString();
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return 'Invalid Date';
    }
  };

  const openEditDialog = (campaign: Campaign) => {
    console.log('Opening edit dialog for:', campaign); // Add logging
    setCurrentCampaign(campaign);

    setFormData({
      title: campaign.title ?? '',
      description: campaign.description ?? '',
      imageUrl: campaign.imageUrl ?? '', 
      goal: campaign.goal ?? 0,          
      raised: campaign.raised ?? 0,        // Use raised for display in edit form
      daysLeft: campaign.daysLeft ?? 0,    // Use daysLeft for display in edit form
      category: campaign.category ?? '', 
    });
    setIsEditDialogOpen(true);
  };


  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Campaign Management</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border rounded-md p-2 text-sm" // Adjusted classname
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </select>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCampaign} className="space-y-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleFormChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleFormChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleFormChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="goal">Goal Amount (MYR)</Label>
                    <Input id="goal" name="goal" type="number" value={formData.goal} onChange={handleFormChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <select id="category" name="category" value={formData.category} onChange={handleFormChange} className="border rounded-md p-2">
                      <option value="">Select Category</option>
                      <option value="Education">Education</option>
                      <option value="Medical Aid">Medical Aid</option>
                      <option value="Mosque Building">Mosque Building</option>
                      <option value="Food Bank">Food Bank</option>
                    </select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Campaign</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateCampaign} className="space-y-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input id="edit-title" name="title" value={formData.title} onChange={handleFormChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea id="edit-description" name="description" value={formData.description} onChange={handleFormChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-imageUrl">Image URL</Label>
                    <Input id="edit-imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleFormChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-goal">Goal Amount (MYR)</Label>
                    <Input id="edit-goal" name="goal" type="number" value={formData.goal} onChange={handleFormChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-raised">Raised Amount (MYR)</Label>
                    <Input id="edit-raised" name="raised" type="number" value={formData.raised} onChange={handleFormChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-daysLeft">Days Left</Label>
                    <Input id="edit-daysLeft" name="daysLeft" type="number" value={formData.daysLeft} onChange={handleFormChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <select id="edit-category" name="category" value={formData.category} onChange={handleFormChange} className="border rounded-md p-2">
                      <option value="">Select Category</option>
                      <option value="Education">Education</option>
                      <option value="Medical Aid">Medical Aid</option>
                      <option value="Mosque Building">Mosque Building</option>
                      <option value="Food Bank">Food Bank</option>
                    </select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

          </div>
        </div>

        <Card>
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Goal Amount</TableHead>
                  <TableHead>Raised Amount</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No campaigns found.
                    </TableCell>
                  </TableRow>
                ) : (
                  campaigns.map((campaign) => (
                    <TableRow key={campaign.$id}>
                      <TableCell>{campaign.title}</TableCell>
                      <TableCell>{campaign.category ?? 'N/A'}</TableCell>
                      <TableCell>RM {campaign.goal?.toFixed(2) ?? '0.00'}</TableCell>
                      <TableCell>RM {campaign.raised?.toFixed(2) ?? '0.00'}</TableCell>
                      <TableCell>{campaign.daysLeft ?? 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2"
                            onClick={() => openEditDialog(campaign)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="p-2"
                            onClick={() => handleDeleteCampaign(campaign.$id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}