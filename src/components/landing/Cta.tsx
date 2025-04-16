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
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Let's show our mutual concern
            </h2>
            <p className="text-xl md:text-2xl font-medium leading-relaxed">
              by helping those who are less fortunate.
            </p>
            <p className="text-lg leading-relaxed opacity-90">
              With BarakahBot, you can channel some of your fortune to help our relatives 
              in need with <span className="font-medium">transparency, trust and honesty</span>.
            </p>
          </div>
          <Link 
            href="/donate" 
            className="inline-block px-8 py-3 bg-[#C9E4D9] text-[#0F3D23] font-medium rounded-md hover:bg-[#B8D9CA] transition-colors shadow-sm"
          >
            Donate now
          </Link>
        </div>

        {/* Image/Video Placeholder */}
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
          <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
            <p className="text-primary-foreground font-medium">Video Placeholder</p>
          </div>
          {/* Optional Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <PlayCircle className="w-16 h-16 text-white/90 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta; 