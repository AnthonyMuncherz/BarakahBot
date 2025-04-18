/**
 * Fundraising Component
 * 
 * Displays emergency fundraising campaigns from verified organizations.
 * Features a carousel of campaign cards with images and details.
 * Uses custom UI components for consistent styling.
 * 
 * Components:
 * - Carousel: Custom carousel component with navigation
 * - Card: UI component for campaign display
 * - Image: Next.js optimized image component
 * 
 * Features:
 * - Responsive carousel layout
 * - Campaign cards with image placeholders
 * - Campaign details including title, organizer, and amount
 * - Navigation buttons for carousel control
 * 
 * Data Structure:
 * fundraisingCampaigns = [
 *   {
 *     imageSrc: string,
 *     title: string,
 *     organizer: string,
 *     collected: string,
 *     link: string
 *   }
 * ]
 * 
 * Carousel Options:
 * - Aligned to start
 * - Loop enabled
 * - Responsive breakpoints for different screen sizes
 * 
 * Props: None
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const fundraisingCampaigns = [
  {
    imageSrc: "/placeholder-fire.jpg", // Replace with actual image path
    title: "Victims of Disastrous Inferno",
    organizer: "MyCARE",
    collected: "RM 12,500.00",
    link: "/campaigns/inferno",
  },
  {
    imageSrc: "/placeholder-palestine.jpg", // Replace with actual image path
    title: "Fight For Palestinian Right",
    organizer: "Mercy Malaysia",
    collected: "RM 50,000.00",
    link: "/campaigns/palestine",
  },
  {
    imageSrc: "/placeholder-flood.jpg", // Replace with actual image path
    title: "For Our Beloved Flood Victims",
    organizer: "MyCARE",
    collected: "RM 45,000.50",
    link: "/campaigns/flood",
  },
  // Add more campaigns if needed
];

const Fundraising = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container max-w-screen-xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Emergency fundraising from our verified organizations
          </h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {fundraisingCampaigns.map((campaign, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden border-border">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] bg-muted overflow-hidden">
                      <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                        <p className="text-primary font-medium">{campaign.title}</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                       <h3 className="text-xl font-semibold">{campaign.title} by <span className="font-bold">{campaign.organizer}</span></h3>
                       <p className="text-sm text-muted-foreground">Collected {campaign.collected}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                     <Link href={campaign.link} className="text-primary font-medium hover:underline text-sm">
                       Learn more & start donating
                     </Link>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-4">
             <CarouselPrevious className="static translate-y-0 bg-brand-light-green text-brand-dark-green hover:bg-brand-light-green/90" />
             <CarouselNext className="static translate-y-0 bg-brand-light-green text-brand-dark-green hover:bg-brand-light-green/90" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Fundraising; 