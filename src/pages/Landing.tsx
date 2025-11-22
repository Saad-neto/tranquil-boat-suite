import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import ToursSection from '@/components/landing/ToursSection';
import WidgetsSection from '@/components/landing/WidgetsSection';
import HowItWorks from '@/components/landing/HowItWorks';
import WhyUs from '@/components/landing/WhyUs';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ToursSection />
      <WidgetsSection />
      <HowItWorks />
      <WhyUs />
      <FAQ />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Landing;
