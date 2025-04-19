'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Waves, HeartPulse } from 'lucide-react';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

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
];

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
};

const Programs = () => {
  return (
    <section className="py-16 md:py-24 bg-brand-cream/50">
      <div className="container max-w-screen-xl mx-auto">
        <AnimatedContainer>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-brand-dark-green text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            We invite you to share securely in these donation program hosted by our verified charity organizers
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {programs.map((program, index) => (
              <Card
                key={index}
                className="flex flex-col bg-white/50 backdrop-blur-sm"
              >
                <CardContent className="pt-6">
                  <motion.div
                    className="mb-4 flex justify-center"
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.2 + 0.3 }}
                  >
                    <program.icon className="w-14 h-14 text-brand-dark-green" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-brand-dark-green text-center mb-3">
                    {program.title}
                  </h3>
                  <p className="text-muted-foreground text-center mb-5">
                    {program.description}
                  </p>
                  <div className="mt-auto text-center">
                    <Link
                      href={program.link}
                      className="text-brand-dark-green font-medium hover:underline"
                    >
                      View more
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
};

export default Programs;