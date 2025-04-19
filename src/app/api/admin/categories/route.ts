import { NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite-server';
import { ID } from 'appwrite';

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Get all categories
export async function GET() {
  try {
    const response = await databases.listDocuments(
      'barakah_db',
      'categories'
    );
    return NextResponse.json(response.documents);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// Create a new category
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    // Create a slug from the name
    const slug = createSlug(name);

    const category = await databases.createDocument(
      'barakah_db',
      'categories',
      ID.unique(),
      { 
        name,
        slug 
      }
    );

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
} 