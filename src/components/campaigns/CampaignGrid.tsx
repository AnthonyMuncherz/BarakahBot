import { CampaignCard } from "./CampaignCard";

// Sample campaign data - replace with actual data from your API/database
const sampleCampaigns = [
  {
    id: "1",
    title: "Emergency Relief Fund",
    description: "Support families affected by natural disasters with emergency supplies and shelter.",
    imageUrl: "/images/campaigns/emergency-relief.jpg",
    goal: 50000,
    raised: 32500,
    daysLeft: 15,
  },
  {
    id: "2",
    title: "Education for All",
    description: "Help provide quality education to underprivileged children in rural areas.",
    imageUrl: "/images/campaigns/education.jpg",
    goal: 25000,
    raised: 18750,
    daysLeft: 30,
  },
  {
    id: "3",
    title: "Clean Water Initiative",
    description: "Bring clean and safe drinking water to communities in need.",
    imageUrl: "/images/campaigns/water.jpg",
    goal: 35000,
    raised: 21000,
    daysLeft: 25,
  },
  // Add more sample campaigns as needed
];

export function CampaignGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sampleCampaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
} 