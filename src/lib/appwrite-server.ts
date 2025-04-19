import { Client, Account, Users, Databases, ID, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

const users = new Users(client);
const databases = new Databases(client);

// Database and collection IDs
const CAMPAIGNS_DATABASE_ID = 'campaigns_db';
const CAMPAIGNS_COLLECTION_ID = 'campaigns';

export async function listCampaigns() {
  try {
    const response = await databases.listDocuments(
      CAMPAIGNS_DATABASE_ID,
      CAMPAIGNS_COLLECTION_ID,
      [
        Query.orderDesc('$createdAt'),
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
}

export async function getCampaign(campaignId: string) {
  try {
    const campaign = await databases.getDocument(
      CAMPAIGNS_DATABASE_ID,
      CAMPAIGNS_COLLECTION_ID,
      campaignId
    );
    return campaign;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    throw error;
  }
}

export { client, users, databases, ID }; 