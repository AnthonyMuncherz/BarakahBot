'use client';

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

// ✅ Local image URLs
const fundraisingCampaigns = [
  {
    imageSrc: "/images/fr1.png", // 🔥 Fire Disaster
    title: "Victims of Disastrous Inferno",
    organizer: "MyCARE",
    collected: "RM 12,500.00",
    link: "/campaigns/inferno",
  },
  {
    imageSrc: "/images/fr2.png", // 🕊️ Palestine
    title: "Fight For Palestinian Right",
    organizer: "Mercy Malaysia",
    collected: "RM 50,000.00",
    link: "/campaigns/palestine",
  },
  {
    imageSrc: "/images/fr3.png", // 🌊 Flood Relief
    title: "For Our Beloved Flood Victims",
    organizer: "MyCARE",
    collected: "RM 45,000.50",
    link: "/campaigns/flood",
  },
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

        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {fundraisingCampaigns.map((campaign, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden border-border">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] bg-muted overflow-hidden">
                      <Image
                        src={campaign.imageSrc}
                        alt={campaign.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                        placeholder="empty"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="text-xl font-semibold">
                        {campaign.title} by <span className="font-bold">{campaign.organizer}</span>
                      </h3>
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