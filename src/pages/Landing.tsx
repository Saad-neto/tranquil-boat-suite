import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import ToursSection from '@/components/landing/ToursSection';
import WidgetsSection from '@/components/landing/WidgetsSection';
import BookingSection from '@/components/landing/BookingSection';
import FAQ from '@/components/landing/FAQ';
import InstagramGallery from '@/components/landing/InstagramGallery';
import LocationMap from '@/components/landing/LocationMap';
import Footer from '@/components/landing/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import FloatingCTA from '@/components/landing/FloatingCTA';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ToursSection />
      <BookingSection />
      <WidgetsSection />
      <InstagramGallery />
      <LocationMap />
      <FAQ />
      <Footer />
      <WhatsAppButton />
      <FloatingCTA />
    </div>
  );
};

export default Landing;
