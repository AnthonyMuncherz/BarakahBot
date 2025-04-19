'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NaturalDisasterPage() {
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
              🌊 Zakat for Natural Disaster Relief
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              Your Zakat empowers emergency responses. We support families affected by natural disasters by providing shelter, essentials, and hope — delivered with compassion and accountability.
            </p>

            <ul className="space-y-4 text-base text-gray-700 mb-8">
              <li>🏕️ Emergency shelter, food, water, and hygiene kits</li>
              <li>📍 Prioritized aid distribution based on verified needs</li>
              <li>🛠️ Infrastructure & school repairs post-disaster</li>
              <li>📦 Real-time reporting of how your Zakat is deployed</li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-primary bg-transparent rounded-xl border border-primary hover:bg-primary/5 hover:scale-105 shadow-md transition-all"
              >
                ← Back to Dashboard
              </Link>
              <Link
                href="/zakatbot"
                className="group inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 hover:scale-105 shadow-md transition-all"
              >
                🌐 Contribute Now
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
              src="/images/natural-disaster.png"
              alt="Illustration showing humanitarian aid for natural disaster victims"
              className="w-full max-w-md object-cover rounded-2xl shadow-md"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}