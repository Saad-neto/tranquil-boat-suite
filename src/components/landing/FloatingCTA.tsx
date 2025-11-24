import { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling 500px
      const scrolled = window.scrollY > 500;
      setIsVisible(scrolled && !isDismissed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const scrollToBooking = () => {
    const element = document.getElementById('reservas');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg shadow-2xl p-4 pr-12 relative max-w-sm animate-bounce-slow">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Reserve Agora!</h3>
            <p className="text-sm text-white/90 mb-3">
              Garanta seu lugar nos melhores passeios de João Pessoa
            </p>
            <Button
              onClick={scrollToBooking}
              variant="secondary"
              size="sm"
              className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
            >
              Fazer Reserva
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCTA;
