// app/page.tsx
import Hero from "@/components/home/Hero";
import BrandsStrip from "@/components/home/BrandsStrip";
import Benefits from "@/components/home/Benefits";
import HowItWorks from "@/components/home/HowItWorks";
import Chapters from "@/components/home/Chapters";
import Testimonials from "@/components/home/Testimonials";
import Events from "@/components/home/Events";
import Stats from "@/components/home/Stats";
// import Newsletter from "@/components/home/Newsletter";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <BrandsStrip />
      <Benefits />
      <HowItWorks />
      <Chapters />
      <Testimonials />
      <Events />
      <Stats />
      {/* <Newsletter /> */}
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
