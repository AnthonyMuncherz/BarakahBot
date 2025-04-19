'use client';

import { useState, useEffect } from 'react';
import { Metadata } from "next";
import Link from "next/link";
import { CampaignGrid } from "@/components/campaigns/CampaignGrid";
import { getCampaigns, Campaign } from "@/lib/services/campaigns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

// Metadata can't be dynamic in client components easily, consider moving or handling differently if needed
// export const metadata: Metadata = {
//   title: "Campaigns | BarakahBot",
//   description: "Browse and support our ongoing charitable campaigns",
// };

// Predefined categories based on the image and the enum created
const categories = ["All Campaigns", "Education", "Medical Aid", "Mosque Building", "Food Bank", "Emergency"];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Campaigns');
  const [sortBy, setSortBy] = useState('newest'); // Default sort

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      const params = {
        search: searchTerm || undefined,
        category: selectedCategory === 'All Campaigns' ? undefined : selectedCategory,
        sortBy: sortBy as 'newest' | 'goal_desc' | 'goal_asc',
      };
      const fetchedCampaigns = await getCampaigns(params);
      setCampaigns(fetchedCampaigns);
      setIsLoading(false);
    };

    // Debounce search input
    const handler = setTimeout(() => {
      fetchCampaigns();
    }, 300); // Debounce search calls

    return () => {
      clearTimeout(handler);
    };

  }, [searchTerm, selectedCategory, sortBy]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  return (
    <div className="bg-[#fdfaf5] min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2c5c4b] mb-2">Browse Campaigns</h1>
          <p className="text-lg text-gray-600">Discover and support meaningful causes</p>
        </div>

        {/* Filters and Search Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="search"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-grow bg-white border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
            <div className="flex items-center gap-2">
              <span className="text-gray-600 whitespace-nowrap">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px] bg-white border-gray-300 rounded-md">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  {/* Add other sort options based on available indices */}
                  <SelectItem value="goal_desc">Goal (High-Low)</SelectItem>
                  <SelectItem value="goal_asc">Goal (Low-High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => handleCategoryClick(category)}
                className={`rounded-full px-4 py-1 transition-colors duration-200 ${selectedCategory === category
                    ? 'bg-[#c8e6c9] text-[#2c5c4b] border-[#a5d6a7]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Campaigns Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <CampaignGrid initialCampaigns={campaigns} />
        )}
      </div>
    </div>
  );
}