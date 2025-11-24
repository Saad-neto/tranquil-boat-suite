import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import ToursSection from '@/components/landing/ToursSection';
import WidgetsSection from '@/components/landing/WidgetsSection';
import BookingSection from '@/components/landing/BookingSection';
import HowItWorks from '@/components/landing/HowItWorks';
import AboutUs from '@/components/landing/AboutUs';
import Gallery from '@/components/landing/Gallery';
import WhyUs from '@/components/landing/WhyUs';
import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import FloatingCTA from '@/components/landing/FloatingCTA';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ToursSection />
      <WidgetsSection />
      <BookingSection />
      <HowItWorks />
      <AboutUs />
      <Gallery />
      <WhyUs />
      <Testimonials />
      <FAQ />
      <Footer />
      <WhatsAppButton />
      <FloatingCTA />
    </div>
  );
};

export default Landing;
