'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCampaignBySlug, Campaign } from '@/lib/services/campaigns';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CampaignDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : (params.slug as string);

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      const result = await getCampaignBySlug(slug);
      setCampaign(result);
      setLoading(false);
    };

    if (slug) fetchCampaign();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!campaign) {
    return <div className="text-center py-20 text-red-500">Campaign not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <img
          src={campaign.imageUrl || '/placeholder.png'}
          alt={campaign.title}
          className="w-full h-[300px] object-cover rounded-xl"
        />

        <h1 className="text-4xl font-bold text-[#2c5c4b]">{campaign.title}</h1>
        <p className="text-gray-700 leading-relaxed">{campaign.description}</p>

        <div className="flex gap-4 mt-6">
          <Link href={`/campaigns/${campaign.slug}/donate`}>
            <Button size="lg">Donate Now</Button>
          </Link>
          <Link href={`/campaigns/${campaign.slug}/report`}>
            <Button variant="outline" size="lg">Learn More</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}