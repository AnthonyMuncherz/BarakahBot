'use server';

import { databases } from '@/lib/appwrite-server';
import { Query } from 'node-appwrite';

// Define collection ID as a constant since it's used in multiple places
const CAMPAIGNS_COLLECTION_ID = 'campaigns';

export interface Campaign {
  $id: string;
  title: string;
  description: string;
  imageUrl: string;
  goal: number;
  raised: number;
  daysLeft: number;
  category?: string;
  $createdAt: string;
}

interface GetCampaignsParams {
  search?: string;
  category?: string;
  sortBy?: 'newest' | 'goal_desc' | 'goal_asc';
}

export async function getCampaigns({ search, category, sortBy = 'newest' }: GetCampaignsParams = {}) {
  try {
    const queries = [];

    if (search) {
      queries.push(Query.search('search_index', search));
    }

    if (category) {
      queries.push(Query.equal('category', category));
    }

    switch (sortBy) {
      case 'goal_desc':
        queries.push(Query.orderDesc('goal'));
        break;
      case 'goal_asc':
        queries.push(Query.orderAsc('goal'));
        break;
      case 'newest':
      default:
        queries.push(Query.orderDesc('$createdAt'));
        break;
    }

    console.log('Executing Appwrite query:', queries);

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      CAMPAIGNS_COLLECTION_ID,
      queries
    );

    return response.documents as unknown as Campaign[];
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
}

export async function getCampaign(id: string) {
  try {
    const response = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      CAMPAIGNS_COLLECTION_ID,
      id
    );
    return response as unknown as Campaign;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    throw error;
  }
} 