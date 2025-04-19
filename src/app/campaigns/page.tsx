import { Metadata } from "next";
import Link from "next/link";
import { CampaignGrid } from "@/components/campaigns/CampaignGrid";
import { getCampaigns } from "@/lib/services/campaigns";
import { Button } from "@/components/ui/button"; // ✅ required import

export const metadata: Metadata = {
  title: "Campaigns | BarakahBot",
  description: "Browse and support our ongoing charitable campaigns",
};

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Active Campaigns</h1>
        <Link href="/campaigns/donate">
          <Button className="bg-primary text-white">Donate Now</Button>
        </Link>
      </div>
      <CampaignGrid initialCampaigns={campaigns} />
    </div>
  );
}