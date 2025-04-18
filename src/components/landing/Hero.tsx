/**
 * Hero Component
 * 
 * The main landing page hero section that introduces BarakahBot to visitors.
 * Features a banner, headline, description, and call-to-action buttons.
 * Uses Framer Motion for animations and responsive design for different screen sizes.
 * 
 * Components:
 * - Banner: Displays location-specific text
 * - AnimatedContainer: Wrapper for animated content
 * - Motion components: For smooth animations and transitions
 * 
 * Features:
 * - Responsive layout (mobile-first approach)
 * - Animated text and content appearance
 * - Call-to-action buttons for Zakat calculation and registration
 * - Custom styling using Tailwind CSS
 * 
 * Props: None
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { ArrowRight } from 'lucide-react';

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
      <section className="py-16 md:py-24 bg-brand-cream">
        <div className="container max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedContainer>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.h1
                  className="text-4xl md:text-6xl font-bold text-brand-dark-green mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Empowering Generosity Through Technology
                </motion.h1>

                <motion.p
                  className="text-lg text-muted-foreground mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Join us in making a difference. BarakahBot makes it easy to calculate and distribute your Zakat, ensuring your charitable giving reaches those who need it most.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  {/* Updated Calculate Zakat Button (Primary Style) */}
                  <Link
                    href="/zakatbot"
                    className="group inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 hover:scale-105 shadow-lg shadow-primary/20 transition-all duration-200"
                  >
                    Calculate Zakat
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  {/* Updated Create Account Button (Outline Style) */}
                  <Link
                    href="/register"
                    className="group inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-primary bg-transparent rounded-xl border border-primary hover:bg-primary/5 hover:scale-105 shadow-lg shadow-primary/10 transition-all duration-200"
                  >
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatedContainer>

            <motion.div
  className="relative"
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
    delay: 0.3,
    duration: 0.8,
    type: "spring",
    stiffness: 100
  }}
>
<div className="w-full h-auto rounded-2xl p-0 bg-transparent overflow-hidden shadow-none">
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-brand-dark-green/10 to-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    />
    <motion.div
      className="w-full h-full"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <img
        src="/images/hero.png"
        alt="Donate with BarakahBot"
        className="w-full object-contain"
      />
    </motion.div>
  </div>
</motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
