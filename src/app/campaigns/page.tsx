import { Metadata } from "next";
import { CampaignGrid } from "@/components/campaigns/CampaignGrid";

export const metadata: Metadata = {
  title: "Campaigns | BarakahBot",
  description: "Browse and support our ongoing charitable campaigns",
};

export default function CampaignsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Active Campaigns</h1>
      <CampaignGrid />
    </div>
  );
} 