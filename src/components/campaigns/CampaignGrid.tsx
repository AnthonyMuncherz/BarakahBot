'use client';

import { useEffect, useState } from 'react';
import CampaignCard from './CampaignCard';
import { Campaign } from '@/lib/services/campaigns';

interface CampaignGridProps {
  initialCampaigns: Campaign[];
}

export function CampaignGrid({ initialCampaigns }: CampaignGridProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const filtered = initialCampaigns.filter((campaign) => {
      const hasImage = campaign.imageUrl && campaign.imageUrl.startsWith('http');
      const notAyonima = campaign.title.trim().toLowerCase() !== 'ayonima';
      const isActive = campaign.raised > 0; // 👈 hide upcoming
      return hasImage && notAyonima && isActive;
    });

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