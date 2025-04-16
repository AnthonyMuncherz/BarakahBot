import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Banner component for the "BarakahBot is Based on Malaysia" text
const Banner = () => {
  return (
    <div className="w-full bg-brand-light-green/30 py-2">
      <div className="container max-w-screen-xl mx-auto text-center">
        <p className="text-sm text-brand-dark-green">BarakahBot is Based on Malaysia, made for Malaysian</p>
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <>
      <Banner />
      <section className="container max-w-screen-xl mx-auto py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-brand-dark-green">
              Introducing BarakahBot
            </h1>
            <p className="text-lg text-muted-foreground">
              BarakahBot is the first security-first charity and donation platform in Malaysia. With AI-powered guidance and verified campaigns, we ensure every donation is safe, transparent, and Shariah-compliant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-brand-light-green text-brand-dark-green hover:bg-brand-light-green/90">
                Start Sharing Securely
              </Button>
              <Button variant="link" size="lg" asChild className="text-brand-dark-green">
                <Link href="#how-we-protect">See How We Protect Your Donations</Link>
              </Button>
            </div>
          </div>
          
          {/* Image */}
          <div>
            {/* Placeholder div instead of image */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                <p className="text-primary font-medium">Donation Image Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero; 