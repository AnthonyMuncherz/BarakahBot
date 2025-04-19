'use server';

import { databases } from '@/lib/appwrite-server';
import { Query } from 'appwrite';

export interface Campaign {
  $id: string;
  title: string;
  description: string;
  imageUrl: string;
  goal: number;
  raised: number;
  daysLeft: number;
}

export async function getCampaigns() {
  try {
    const response = await databases.listDocuments(
      'barakah_db',
      'campaigns',
      [
        Query.orderDesc('$createdAt'),
      ]
    );
    return response.documents as Campaign[];
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
}

export async function getCampaign(id: string) {
  try {
    const response = await databases.getDocument(
      'barakah_db',
      'campaigns',
      id
    );
    return response as Campaign;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    throw error;
  }
} 