import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Programs from "@/components/landing/Programs";
import Fundraising from "@/components/landing/Fundraising";
import Cta from "@/components/landing/Cta";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Features />
      <Programs />
      <Fundraising />
      <Cta />
      {/* Placeholder for other sections */}
      <Footer />
    </main>
  );
}
