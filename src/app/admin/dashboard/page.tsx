"use client";

import AdminLayout from "@/components/ui/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite-client";

interface DashboardMetrics {
  totalUsers: number;
  totalCampaigns: number;
  totalDonations: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    totalCampaigns: 0,
    totalDonations: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch total users
        const usersResponse = await databases.listDocuments(
          "barakah_db",
          "users"
        );
        
        // Fetch total campaigns
        const campaignsResponse = await databases.listDocuments(
          "barakah_db",
          "campaigns"
        );

        // Fetch total donations
        const donationsResponse = await databases.listDocuments(
          "barakah_db",
          "donations"
        );

        setMetrics({
          totalUsers: usersResponse.total,
          totalCampaigns: campaignsResponse.total,
          totalDonations: donationsResponse.total,
          activeUsers: usersResponse.documents.filter(
            (user: any) => user.status === "active"
          ).length,
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  const metricsCards = [
    {
      title: "Total Users",
      value: metrics.totalUsers,
      icon: <Users className="w-8 h-8 text-blue-500" />,
      description: "Registered users",
    },
    {
      title: "Active Campaigns",
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
    {
      title: "Active Users",
      value: metrics.activeUsers,
      icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
      description: "Currently active users",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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