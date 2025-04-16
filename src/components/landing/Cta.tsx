import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

const Cta = () => {
  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-24">
      <div className="container max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Let's show our mutual concern by helping those who are less fortunate. With BarakahBot, you can channel some of your fortune to help our relatives in need with transparency, trust and honesty
          </h2>
          <Link 
            href="/donate" 
            className="inline-block px-8 py-3 bg-[#E8F5E9] text-[#1A4D2E] font-medium rounded-md hover:bg-[#D1E7DD] transition-colors"
          >
            Donate now
          </Link>
        </div>

        {/* Image/Video Placeholder */}
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <div className="w-full h-full bg-brand-light-green flex items-center justify-center">
            <p className="text-primary font-medium">Video Placeholder</p>
          </div>
          {/* Optional Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <PlayCircle className="w-16 h-16 text-white/80 cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta; 