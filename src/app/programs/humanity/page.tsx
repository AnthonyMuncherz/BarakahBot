'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HumanityPage() {
  return (
    <section className="py-16 md:py-24 bg-brand-cream">
      <div className="container max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark-green mb-6">
              ❤️ Zakat for Humanity Initiatives
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              Help build a caring society where no one is left behind. Your Zakat supports orphans, widows, the elderly, and vulnerable groups with dignity, resources, and hope.
            </p>

            <ul className="space-y-4 text-base text-gray-700 mb-8">
              <li>🧕 Food and medical aid for elderly and widowed women</li>
              <li>🎒 Educational support for orphans and low-income children</li>
              <li>🏡 Community shelters and care homes</li>
              <li>🧾 Transparent and audited aid delivery process</li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" className="group inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-primary bg-transparent rounded-xl border border-primary hover:bg-primary/5 hover:scale-105 shadow-md transition-all">
                ← Back to Dashboard
              </Link>
              <Link href="/zakatbot" className="group inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 hover:scale-105 shadow-md transition-all">
                ❤️ Donate Zakat
              </Link>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <img
              src="/images/dr2.png"
              alt="Humanity Zakat Illustration"
              className="w-3/4 max-w-md object-cover rounded-2xl shadow-md"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}