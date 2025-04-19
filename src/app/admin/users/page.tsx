// app/admin/users/page.tsx
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LoadingPage } from "@/components/ui/loading";
import { databases } from "@/lib/appwrite-server";
import { Models } from "appwrite";
import { Edit2, Trash2, Search } from "lucide-react";

interface User extends Models.Document {
  name: string;
  email: string;
  status: boolean;
  labels: string[];
}

interface EditUserFormData {
  name: string;
  email: string;
  status: string;
  isAdmin: boolean;
}

export default async function UsersPage() {
  const users = (await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!
  )).documents as User[];

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Labels</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.$id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.status ? "Active" : "Inactive"}</TableCell>
              <TableCell>{user.labels.join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}