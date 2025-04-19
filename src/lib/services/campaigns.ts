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
  slug?: string;
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

    console.log('Fetching campaigns with params:', { search, category, sortBy });

    if (search) {
      // Use the fulltext index for title search
      queries.push(Query.search('title', search));
      console.log('Added search query for:', search);
    }

    if (category) {
      queries.push(Query.equal('category', category));
      console.log('Added category filter for:', category);
    }

    // Add sorting
    switch (sortBy) {
      case 'goal_desc':
        queries.push(Query.orderDesc('goal'));
        console.log('Added sorting: goal descending');
        break;
      case 'goal_asc':
        queries.push(Query.orderAsc('goal'));
        console.log('Added sorting: goal ascending');
        break;
      case 'newest':
      default:
        queries.push(Query.orderDesc('$createdAt'));
        console.log('Added sorting: newest first');
        break;
    }

    console.log('Final Appwrite query:', queries);

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      CAMPAIGNS_COLLECTION_ID,
      queries
    );

    console.log('Fetched campaigns count:', response.documents.length);
    console.log('First campaign:', response.documents[0]);

    return response.documents as unknown as Campaign[];
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    console.error('Error details:', {
      code: error?.code,
      type: error?.type,
      message: error?.message
    });
    
    if (error?.code === 400 && error?.type === 'general_query_invalid') {
      console.warn('Search index might not be ready yet. Retrying without search...');
      // Retry without search query
      return getCampaigns({ category, sortBy });
    }
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
    // Cast the single document response
    return response as unknown as Campaign;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    throw error; // Re-throw the error for the caller to handle
  }
}

// ✅ New: Fetch a campaign by slug (used for detail page)
export async function getCampaignBySlug(slug: string) {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      CAMPAIGNS_COLLECTION_ID,
      [
        Query.equal('slug', slug),
        Query.limit(1)
      ]
    );

    return response.documents[0] as unknown as Campaign;
  } catch (error) {
    console.error('Error fetching campaign by slug:', error);
    return null;
  }
}