'use client';
import Link from 'next/link';

export default function ScholarshipPage() {
  return (
    <section className="py-16 md:py-24 bg-brand-cream">
      <div className="container max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark-green mb-6">
              🎓 Zakat-Funded Scholarship Program
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              BarakahBot’s Scholarship Program ensures that your Zakat reaches deserving students who are committed to academic and personal growth, following verified Islamic principles and <strong>asnaf</strong> eligibility.
            </p>

            <ul className="space-y-4 text-base text-gray-700 mb-8">
              <li>📘 Full/partial tuition aid for school, college, or university students</li>
              <li>🕌 Priority for students from verified <strong>asnaf</strong> (Zakat-recipient) groups</li>
              <li>🤝 Mentorship and personal development support</li>
              <li>📊 Transparent tracking of Zakat distribution and outcomes</li>
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
                🧮 Calculate Zakat
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-white/50 backdrop-blur-sm p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-dark-green/10 to-transparent" />
              <div className="w-full h-full rounded-xl bg-white/30 backdrop-blur-sm">
                <img
                  src="https://cdn.pixabay.com/photo/2017/03/12/13/41/scholarship-2136164_960_720.jpg"
                  alt="Scholarship Zakat Illustration"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}