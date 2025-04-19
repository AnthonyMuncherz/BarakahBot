// app/admin/users/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserIcon, TrashIcon } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended';
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Mock data — replace with Appwrite fetch
    setUsers([
      { id: '1', name: 'Arnob Rizwan', email: 'arnob@example.com', status: 'active' },
      { id: '2', name: 'Aiman Hakim', email: 'aiman@example.com', status: 'active' },
      { id: '3', name: 'Alwan Syahmi', email: 'alwan@example.com', status: 'suspended' },
      { id: '4', name: 'Rusaidi Omar', email: 'rusaidi@example.com', status: 'active' }
    ]);
  }, []);

  const handleSuspend = (id: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, status: 'suspended' } : user
      )
    );
  };

  const handleActivate = (id: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, status: 'active' } : user
      )
    );
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">👥 User Management</h1>

      <Input
        placeholder="Search users by name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-6"
      />

      <div className="grid gap-4">
        {filteredUsers.map(user => (
          <Card key={user.id} className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <UserIcon className="w-6 h-6 text-gray-500" />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant={user.status === 'active' ? 'secondary' : 'outline'}
                className={user.status === 'suspended' ? 'text-red-600 border-red-600' : ''}
              >
                {user.status}
              </Badge>
              {user.status === 'active' ? (
                <Button variant="destructive" onClick={() => handleSuspend(user.id)}>
                  Suspend
                </Button>
              ) : (
                <Button onClick={() => handleActivate(user.id)}>
                  Activate
                </Button>
              )}
              <Button variant="outline">
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}