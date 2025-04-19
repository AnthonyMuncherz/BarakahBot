'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCampaign, Campaign } from '@/lib/services/campaigns';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CampaignDetailPage() {
  const { slug } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const data = await getCampaign(slug as string);
        setCampaign(data);
      } catch (err) {
        console.error(err);
        setCampaign(null);
      } finally {
        setLoading(false);
      }
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
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <img
        src={campaign.imageUrl || '/placeholder.png'}
        alt={campaign.title}
        className="w-full h-[300px] object-cover rounded-xl mb-6"
      />
      <h1 className="text-3xl font-bold text-[#2c5c4b] mb-4">{campaign.title}</h1>
      <p className="text-gray-700 text-lg leading-relaxed mb-6">{campaign.description}</p>

      <h2 className="text-2xl font-semibold text-[#2c5c4b] mt-10 mb-3">How We Use Your Donations</h2>
      <p className="text-gray-700 mb-4">
        Your contributions are securely collected and allocated directly to the campaign’s specific needs. We work with verified partners to ensure transparency and effectiveness. Funds are used for:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Purchasing essential supplies</li>
        <li>Distributing aid to targeted locations</li>
        <li>Monitoring and reporting donation usage</li>
        <li>Ensuring compliance with donation ethics and policy</li>
      </ul>

      <div className="flex gap-4 mt-8">
        <Link href={`/campaigns/${slug}/donate`}>
          <Button>Donate Again</Button>
        </Link>
        <Link href="/campaigns">
          <Button variant="outline">Back to Campaigns</Button>
        </Link>
      </div>
    </div>
  );
}