'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react'; // Import CheckCircle icon
import { AnimatedContainer } from '@/components/ui/animated-container';
import { motion } from 'framer-motion';

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

const featureVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  }),
};

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30" id="how-we-protect">
      <div className="container max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <AnimatedContainer className="order-last md:order-first">
          {/* Placeholder div instead of image */}
          <motion.div 
            className="aspect-video bg-muted rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
              <p className="text-primary font-medium">Features Image Placeholder</p>
            </div>
          </motion.div>
        </AnimatedContainer>

        {/* Text Content */}
        <AnimatedContainer className="space-y-6">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            With BarakahBot, everything is handled with trust, acknowledgement and honest.
          </motion.h2>
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <motion.li 
                key={index} 
                className="flex items-start gap-3"
                custom={index}
                initial="hidden"
                animate="visible"
                variants={featureVariants}
              >
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <span className="text-muted-foreground">{feature.text}</span>
              </motion.li>
            ))}
          </ul>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link 
              href="/about" 
              className="inline-block text-[#1A4D2E] font-medium hover:underline"
            >
              More about BarakahBot
            </Link>
          </motion.div>
        </AnimatedContainer>
      </div>
    </section>
  );
};

export default Features; 