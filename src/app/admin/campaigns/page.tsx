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
  target_amount: number;
  current_amount: number;
  status: string; // e.g., 'active', 'scheduled', 'completed'
  start_date: string;
  end_date: string;
  $createdAt: string;
}

// Add state for forms
const initialCampaignFormData = {
  title: "",
  description: "",
  target_amount: 0,
  current_amount: 0, // Usually starts at 0 for new campaigns
  status: "scheduled", // Default status
  start_date: new Date().toISOString().split('T')[0], // Default to today
  end_date: new Date().toISOString().split('T')[0], // Default to today
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
      // Call the new protected API route for creation
      const response = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
      // Call a new protected API route for update (e.g., PUT /api/admin/campaigns/[id])
      // You'll need to create this route handler
      const response = await fetch(`/api/admin/campaigns/${currentCampaign.$id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

  const openEditDialog = (campaign: Campaign) => {
    setCurrentCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      target_amount: campaign.target_amount,
      current_amount: campaign.current_amount,
      status: campaign.status,
      start_date: new Date(campaign.start_date).toISOString().split('T')[0],
      end_date: new Date(campaign.end_date).toISOString().split('T')[0],
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
                    <Label htmlFor="target_amount">Target Amount (MYR)</Label>
                    <Input id="target_amount" name="target_amount" type="number" value={formData.target_amount} onChange={handleFormChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select id="status" name="status" value={formData.status} onChange={handleFormChange} className="border rounded-md p-2">
                      <option value="scheduled">Scheduled</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input id="start_date" name="start_date" type="date" value={formData.start_date} onChange={handleFormChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input id="end_date" name="end_date" type="date" value={formData.end_date} onChange={handleFormChange} required />
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
                    <Label htmlFor="edit-target_amount">Target Amount (MYR)</Label>
                    <Input id="edit-target_amount" name="target_amount" type="number" value={formData.target_amount} onChange={handleFormChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-current_amount">Current Amount (MYR)</Label>
                    <Input id="edit-current_amount" name="current_amount" type="number" value={formData.current_amount} onChange={handleFormChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <select id="edit-status" name="status" value={formData.status} onChange={handleFormChange} className="border rounded-md p-2">
                      <option value="scheduled">Scheduled</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-start_date">Start Date</Label>
                    <Input id="edit-start_date" name="start_date" type="date" value={formData.start_date} onChange={handleFormChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-end_date">End Date</Label>
                    <Input id="edit-end_date" name="end_date" type="date" value={formData.end_date} onChange={handleFormChange} required />
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
                  <TableHead>Status</TableHead>
                  <TableHead>Target Amount</TableHead>
                  <TableHead>Current Amount</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
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
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${campaign.status === "active"
                              ? "bg-green-100 text-green-800"
                              : campaign.status === "scheduled"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {campaign.status}
                        </span>
                      </TableCell>
                      <TableCell>RM {campaign.target_amount.toFixed(2)}</TableCell>
                      <TableCell>RM {campaign.current_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(campaign.start_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(campaign.end_date).toLocaleDateString()}
                      </TableCell>
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