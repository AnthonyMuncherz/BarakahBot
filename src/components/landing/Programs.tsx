import React from 'react';
import Link from 'next/link';
import { GraduationCap, Waves, HeartPulse } from 'lucide-react';

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
    <section className="py-16 md:py-24 bg-brand-cream/50">
      <div className="container max-w-screen-xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-green text-center mb-12">
          We invite you to share securely in these donation program hosted by our verified charity organizers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {programs.map((program, index) => (
            <div key={index} className="flex flex-col">
              <div className="mb-4 flex justify-center">
                <program.icon className="w-14 h-14 text-brand-dark-green" />
              </div>
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
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-2 mt-6">
          <button className="w-8 h-8 rounded-full bg-white border border-brand-dark-green/20 flex items-center justify-center">
            <span aria-hidden="true">←</span>
          </button>
          <button className="w-8 h-8 rounded-full bg-white border border-brand-dark-green/20 flex items-center justify-center">
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Programs; 