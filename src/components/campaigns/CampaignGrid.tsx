'use client';

import { useEffect, useState } from 'react';
import CampaignCard from './CampaignCard'; // ✅ default import
import { Campaign } from '@/lib/services/campaigns';

interface CampaignGridProps {
  initialCampaigns: Campaign[];
}

export function CampaignGrid({ initialCampaigns }: CampaignGridProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    // ✅ Filter out unwanted campaigns (e.g., test data)
    const filtered = initialCampaigns.filter(
      (campaign) =>
        campaign.title.trim().toLowerCase() !== 'ayonima' &&
        campaign.imageUrl &&
        campaign.imageUrl.startsWith('http')
    );
    setCampaigns(filtered);
  }, [initialCampaigns]);

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No active campaigns at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.$id} campaign={campaign} />
      ))}
    </div>
  );
}