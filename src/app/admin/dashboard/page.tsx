'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Statistics Overview</h2>
          <p>Total Campaigns: 42</p>
          <p>Total Users: 1,230</p>
          <p>Pending Verifications: 6</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Campaign Approvals</h2>
          <p>5 campaigns pending approval</p>
          <Button asChild className="mt-4">
            <Link href="/admin/verification">Go to Verification</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p>Manage and moderate user accounts</p>
          <Button asChild className="mt-4">
            <Link href="/admin/users">View Users</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}