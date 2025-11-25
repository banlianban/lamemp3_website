import Hero from '@/components/home/Hero';
import DiagnosisDemo from '@/components/home/DiagnosisDemo';
import Features from '@/components/home/Features';
import CarSupport from '@/components/home/CarSupport';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import Footer from '@/components/layout/Footer';
import { setRequestLocale } from 'next-intl/server';

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 overflow-x-hidden">
      <Hero />
      <DiagnosisDemo />
      <Features />
      <CarSupport />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
