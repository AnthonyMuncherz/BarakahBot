'use client';

import { useParams } from 'next/navigation';

export default function CampaignDetailPage() {
  const { slug } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Campaign: {slug}</h1>
      <p>This is the main detail page for the campaign <strong>{slug}</strong>.</p>
    </div>
  );
}