// Remove "use client"

import AdminLayout from "@/components/ui/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";
// Import server-side Appwrite SDK and Query directly from node-appwrite
import { databases, users } from "@/lib/appwrite-server";
import { Query } from 'node-appwrite';
// No longer need client-side hooks or client SDK here
// import { useEffect, useState } from "react";
// import { databases, account } from "@/lib/appwrite-client";

interface DashboardMetrics {
  totalUsers: number;
  totalCampaigns: number;
  totalDonations: number;
  // activeUsers: number; // Not easily available with current setup
}

// Make the page component async to fetch data server-side
export default async function AdminDashboard() {
  // Fetch metrics directly on the server using the server SDK
  let metrics: DashboardMetrics = {
    totalUsers: 0,
    totalCampaigns: 0,
    totalDonations: 0,
  };

  try {
    // Fetch total campaigns
    // Use limit(1) and total property for count
    const campaignsResponse = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!, // Use env var for database ID
      'campaigns', // Use collection ID
      [
        Query.limit(1),
      ]
    );

    // Fetch total donations
    const donationsResponse = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!, // Use env var for database ID
      'donation_history', // Use collection ID
      [
        Query.limit(1),
      ]
    );

    // Note: Fetching total *users* count directly via the server SDK `users.list()`
    // might fetch all user data, which could be inefficient for a large number of users.
    // A more scalable approach might involve a dedicated Appwrite Function or a separate
    // user stats mechanism if the count is very large. For simplicity, we'll use a placeholder
    // or fetch a small list and use the total property if available and efficient.
    // Appwrite's `users.list()` *does* return a `total` property efficiently without fetching all data.
    let totalUsers = 0;
    try {
      const usersListResponse = await users.list([Query.limit(1)]);
      totalUsers = usersListResponse.total;
    } catch (userFetchError) {
      console.error("Error fetching total users:", userFetchError);
      // Continue with totalUsers = 0 if fetching fails
    }


    metrics = {
      totalUsers: totalUsers,
      totalCampaigns: campaignsResponse.total,
      totalDonations: donationsResponse.total,
    };
  } catch (error) {
    console.error("Error fetching metrics server-side:", error);
    // Handle error: maybe show an error message on the page or return empty metrics
  }

  const metricsCards = [
    {
      title: "Total Users",
      value: metrics.totalUsers,
      icon: <Users className="w-8 h-8 text-blue-500" />,
      description: "Registered users",
    },
    {
      title: "Total Campaigns",
      value: metrics.totalCampaigns,
      icon: <Calendar className="w-8 h-8 text-green-500" />,
      description: "Running campaigns",
    },
    {
      title: "Total Donations",
      value: metrics.totalDonations,
      icon: <DollarSign className="w-8 h-8 text-yellow-500" />,
      description: "All-time donations",
    },
    // Success rate calculation might be misleading with just total counts,
    // removing for now or recalculate if needed.
    // {
    //   title: "Success Rate",
    //   value: metrics.totalCampaigns > 0 
    //     ? Math.round((metrics.totalDonations / metrics.totalCampaigns) * 100) + '%'
    //     : '0%',
    //   icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
    //   description: "Donation success rate",
    // },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metricsCards.map((metric) => (
            <Card key={metric.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <h3 className="text-2xl font-bold mt-2">{metric.value}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {metric.description}
                  </p>
                </div>
                {metric.icon}
              </div>
            </Card>
          ))}
        </div>

        {/* Add more dashboard components here */}
      </div>
    </AdminLayout>
  );
}