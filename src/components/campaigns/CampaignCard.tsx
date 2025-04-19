import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  goal: number;
  raised: number;
  daysLeft: number;
}

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = Math.round((campaign.raised / campaign.goal) * 100);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Campaign Image */}
      <div className="relative h-48 w-full">
        <Image
          src={campaign.imageUrl}
          alt={campaign.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Campaign Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">
          {campaign.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{formatCurrency(campaign.raised)} raised</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-600">Goal</p>
            <p className="font-semibold">{formatCurrency(campaign.goal)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Time Left</p>
            <p className="font-semibold">{campaign.daysLeft} days</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/campaigns/${campaign.id}`}
            className="flex-1 px-4 py-2 text-center text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Learn More
          </Link>
          <Link
            href={`/campaigns/${campaign.id}/donate`}
            className="flex-1 px-4 py-2 text-center text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
          >
            Donate Now
          </Link>
        </div>
      </div>
    </div>
  );
} 