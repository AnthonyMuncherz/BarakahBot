import React from 'react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Waves, HeartPulse } from 'lucide-react'; // Import relevant icons

const programs = [
  {
    icon: GraduationCap,
    title: 'Scholarship',
    description: 'With education, they have the opportunity to develop the necessary skills and knowledge.',
    link: '/programs/scholarship',
  },
  {
    icon: Waves,
    title: 'Natural disasters',
    description: 'By helping them, we can lighten their burden and give them hope in the midst of a difficult situation.',
    link: '/programs/natural-disasters',
  },
  {
    icon: HeartPulse,
    title: 'Humanity',
    description: 'A society that helps and supports each other is a stronger and more resilient society.',
    link: '/programs/humanity',
  },
  // Add more programs if needed
];

const Programs = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-screen-xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            We invite you to share securely in these donation program hosted by our verified charity organizers
          </h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {programs.map((program, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="bg-transparent border-none shadow-none">
                    <CardContent className="flex flex-col aspect-square items-start justify-start p-6 gap-4">
                      <program.icon className="w-12 h-12 text-primary mb-4" />
                      <h3 className="text-2xl font-semibold">{program.title}</h3>
                      <p className="text-muted-foreground">
                        {program.description}
                      </p>
                      <Link href={program.link} className="text-primary font-medium hover:underline mt-auto">
                        View more
                      </Link>
                    </CardContent>
                  </Card>
                </div>
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

export default Programs; 