'use client';

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { 
  CalendarIcon, 
  HeartIcon, 
  LockIcon, 
  BellIcon, 
  KeyIcon,
  UserIcon,
  EditIcon,
  CheckCircleIcon
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

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

  const mockDonations = [
    { date: "Mar 15, 2024", campaign: "Monthly Zakat", amount: "RM 2,500", status: "Completed" },
    { date: "Mar 10, 2024", campaign: "Education Fund", amount: "RM 1,000", status: "Completed" },
    { date: "Mar 1, 2024", campaign: "Emergency Relief", amount: "RM 500", status: "Completed" },
    { date: "Feb 15, 2024", campaign: "Monthly Zakat", amount: "RM 2,500", status: "Completed" },
    { date: "Feb 1, 2024", campaign: "Food Bank", amount: "RM 750", status: "Completed" }
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
        <Button variant="outline" className="flex items-center gap-2">
          <EditIcon className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Donations</p>
              <h3 className="text-2xl font-bold">{mockStats.totalDonations}</h3>
              <p className="text-sm text-green-600">{mockStats.growth}</p>
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
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">DATE</th>
                  <th className="pb-2">CAMPAIGN</th>
                  <th className="pb-2">AMOUNT</th>
                  <th className="pb-2">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {mockDonations.map((donation, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">{donation.date}</td>
                    <td className="py-3">{donation.campaign}</td>
                    <td className="py-3">{donation.amount}</td>
                    <td className="py-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {donation.status}
                      </Badge>
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