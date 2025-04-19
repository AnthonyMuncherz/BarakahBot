'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminVerificationPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">📑 Verification Requests</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Document Review</h2>
        <p>Review uploaded NGO documents</p>
        <Input type="file" className="mt-2" />
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Checklist</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Valid Registration Certificate</li>
          <li>Proof of Campaign Purpose</li>
          <li>Shariah Compliance Confirmed</li>
        </ul>
        <div className="mt-4 flex gap-4">
          <Button variant="destructive">Reject</Button>
          <Button>Approve</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Organizer Communication</h2>
        <Input placeholder="Write message to organizer..." />
        <Button className="mt-2">Send Message</Button>
      </Card>
    </div>
  );
}