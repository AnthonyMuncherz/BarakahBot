// app/admin/fraud/page.tsx
'use client';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function FraudMonitoringPage() {
  const [open, setOpen] = useState(false);

  const alerts = [
    {
      id: 1,
      message: 'Unusual login location',
      time: '5m ago'
    },
    {
      id: 2,
      message: 'Multiple failed donation attempts',
      time: '20m ago'
    },
    {
      id: 3,
      message: 'Account flagged for review',
      time: '1h ago'
    }
  ];

  const historicalLogs = [
    {
      id: 'L1',
      action: 'User login attempt failed',
      timestamp: '2024-04-16 09:15 AM'
    },
    {
      id: 'L2',
      action: 'New campaign submitted for review',
      timestamp: '2024-04-16 08:47 AM'
    },
    {
      id: 'L3',
      action: 'Donation refund requested',
      timestamp: '2024-04-15 11:30 PM'
    }
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">🚨 Fraud Monitoring</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Suspicious Activity Feed</h2>
        <ul className="space-y-4">
          {alerts.map(alert => (
            <li key={alert.id} className="flex justify-between items-center">
              <span>{alert.message} <Badge variant="secondary" className="ml-2">{alert.time}</Badge></span>
              <div className="flex gap-2">
                <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                  Resolve
                </Button>
                <Button variant="outline">Dismiss</Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">User Activity Timeline</h2>
        <p className="mb-4">[User activity chart / timeline will go here]</p>
        <Button onClick={() => setOpen(true)}>View Historical Logs</Button>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>📚 Historical Logs</DialogTitle>
            <DialogDescription>Review past system actions and events</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {historicalLogs.map(log => (
              <div key={log.id} className="border p-3 rounded-md">
                <p className="font-medium">{log.action}</p>
                <p className="text-sm text-muted-foreground">{log.timestamp}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
