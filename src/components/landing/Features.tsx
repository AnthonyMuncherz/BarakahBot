import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react'; // Import CheckCircle icon

const features = [
  {
    text: 'All campaigns from organizations and community is verified with multi-layer verification process',
  },
  {
    text: 'Advanced real-time detection of suspicious activity with threat analysis pattern for immediate administrator action',
  },
  {
    text: 'Various donation programs according to your interests will follow legal procedures and comply with Shariah',
  },
  {
    text: 'Learn more about charity powered by AI guidance system chatbot, ZakatBot',
  },
  {
    text: 'Understand about safe and secure donation practice with our built-in security-aware educational elements',
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30" id="how-we-protect">
      <div className="container max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="order-last md:order-first">
          {/* Placeholder div instead of image */}
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
              <p className="text-primary font-medium">Features Image Placeholder</p>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            With BarakahBot, everything is handled with trust, acknowledgement and honest.
          </h2>
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <span className="text-muted-foreground">{feature.text}</span>
              </li>
            ))}
          </ul>
          <Link 
            href="/about" 
            className="inline-block text-[#1A4D2E] font-medium hover:underline"
          >
            More about BarakahBot
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features; 