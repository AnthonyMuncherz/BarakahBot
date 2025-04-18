'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { 
  CalendarIcon, 
  HeartIcon, 
  LockIcon, 
  BellIcon, 
  KeyIcon,
  UserIcon,
  EditIcon,
  CheckCircleIcon,
  Loader2Icon
} from 'lucide-react';
import { databases, Query } from '@/lib/appwrite-client';
import { Models } from 'appwrite';
import { formatDate } from '@/lib/utils';

interface Donation {
  $id: string;
  user_id: string;
  amount: number;
  currency: string;
  timestamp: string;
  payment_status: string;
  payment_method: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [donations, setDonations] = useState<Donation[]>([]);
  const [totalDonations, setTotalDonations] = useState(0);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchDonations = async () => {
      try {
        console.log('Current user:', {
          id: user.$id,
          name: user.name,
          email: user.email
        });
        
        // First, check if user exists
        if (!user.$id) {
          console.error('No user ID available');
          setDonations([]);
          setTotalDonations(0);
          return;
        }

        console.log('Fetching donations for user ID:', user.$id);
        
        // Try to list all documents first
        const response = await databases.listDocuments(
          'barakah_db',
          'donation_history'
        );

        console.log('Raw API Response:', response);

        // Filter documents manually for the user
        const userDonations = response.documents.filter(doc => doc.user_id === user.$id);
        console.log('Filtered donations for user:', userDonations);

        if (userDonations.length === 0) {
          console.log('No donations found for user after filtering');
          setDonations([]);
          setTotalDonations(0);
          return;
        }

        // Sort by timestamp descending
        const sortedDonations = userDonations.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        const donationDocs = sortedDonations.map((doc) => {
          console.log('Processing donation document:', {
            id: doc.$id,
            userId: doc.user_id,
            amount: doc.amount,
            status: doc.payment_status,
            timestamp: doc.timestamp
          });
          
          return {
            $id: doc.$id,
            user_id: doc.user_id,
            amount: doc.amount,
            currency: doc.currency,
            timestamp: doc.timestamp,
            payment_status: doc.payment_status,
            payment_method: doc.payment_method,
          };
        });

        console.log('Final processed donations:', donationDocs);
        setDonations(donationDocs);
        
        const total = donationDocs.reduce((sum, doc) => sum + doc.amount, 0);
        console.log('Total donations calculated:', total);
        setTotalDonations(total);
      } catch (error) {
        console.error('Error fetching donations:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          });
        }
        setDonations([]);
        setTotalDonations(0);
      }
    };

    fetchDonations();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // TODO: Implement the update profile API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const mockStats = {
    totalDonations: "RM 12,500",
    growth: "+12.5%",
    activeCampaigns: "8 Active",
    newCampaigns: "+2 new",
    nextPayment: "15 Days",
    nextAmount: "RM 2,500"
  };

  const mockCampaigns = [
    {
      name: "Orphan Support Program",
      target: "RM 50,000",
      progress: 75,
      daysLeft: 5
    },
    {
      name: "Masjid Construction",
      target: "RM 1,000,000",
      progress: 45,
      daysLeft: 60
    },
    {
      name: "Food Bank Initiative",
      target: "RM 25,000",
      progress: 90,
      daysLeft: 2
    }
  ];

  if (!user) {
    return null; // Or a loading state/redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* User Profile Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-gray-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Verified User
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Premium Member
              </Badge>
            </div>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setIsEditModalOpen(true)}
        >
          <EditIcon className="w-4 h-4" />
          Edit Profile
        </Button>

        {/* Edit Profile Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile information here.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Donations</p>
              <h3 className="text-2xl font-bold">RM {totalDonations.toFixed(2)}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Saved Campaigns</p>
              <h3 className="text-2xl font-bold">{mockStats.activeCampaigns}</h3>
              <p className="text-sm text-gray-600">{mockStats.newCampaigns}</p>
            </div>
            <HeartIcon className="w-5 h-5 text-gray-400" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Next Payment</p>
              <h3 className="text-2xl font-bold">{mockStats.nextPayment}</h3>
              <p className="text-sm text-gray-600">{mockStats.nextAmount}</p>
            </div>
            <CalendarIcon className="w-5 h-5 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Donation History */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Donation History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.map((donation) => (
                  <tr key={donation.$id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(donation.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donation.currency} {donation.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={donation.payment_status === 'completed' ? 'secondary' : 'outline'}>
                        {donation.payment_status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donation.payment_method}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Saved Campaigns */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Saved Campaigns</h2>
          <div className="space-y-4">
            {mockCampaigns.map((campaign, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{campaign.name}</h3>
                  <HeartIcon className="w-5 h-5 text-red-500 fill-current" />
                </div>
                <p className="text-sm text-gray-600 mb-2">Target: {campaign.target}</p>
                <Progress value={campaign.progress} className="mb-2" />
                <div className="flex justify-between text-sm">
                  <span>{campaign.progress}% Funded</span>
                  <span>{campaign.daysLeft} days left</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LockIcon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellIcon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Payment Notifications</p>
                  <p className="text-sm text-gray-600">Get notified about activities</p>
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <KeyIcon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Password Management</p>
                  <p className="text-sm text-gray-600">Regularly update for security</p>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 