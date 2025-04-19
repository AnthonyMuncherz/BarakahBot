'use client';

import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Campaign } from "@/lib/services/campaigns";
import { motion } from "framer-motion";

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const progress = Math.round((campaign.raised / campaign.goal) * 100);
  const isComingSoon = campaign.raised === 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Campaign Image */}
      <div className="relative h-48 w-full">
        <Image
          src={campaign.imageUrl || "/placeholder.png"}
          alt={campaign.title}
          fill
          className="object-cover"
        />
        {isComingSoon && (
          <div className="absolute top-2 left-2 animate-pulse">
            <Badge className="bg-yellow-200 text-yellow-800">Coming Soon</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">
          {campaign.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>

        {/* Progress */}
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

        {/* Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/campaigns/${campaign.$id}/report`}
            className="flex-1 px-4 py-2 text-center text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Learn More
          </Link>
          <button
            disabled={isComingSoon}
            className={`flex-1 px-4 py-2 text-center text-sm font-medium text-white rounded-md transition-colors ${
              isComingSoon
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            Donate Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignCard;