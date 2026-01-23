import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LocationMap = () => {
  const googleMapsUrl = 'https://maps.app.goo.gl/aWazzhfSrgz6QxEs7';

  return (
    <section id="localizacao" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12 animate-fade-up">
          <div className="inline-block mb-4">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Ponto de Encontro
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Nos encontramos na Marina Big Toys, na Praia do Jacaré
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
          {/* Map */}
          <div className="animate-fade-up">
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.5!2d-34.8425!3d-7.0383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ace8a95b0b8c1d%3A0x1234567890abcdef!2sPraia%20do%20Jacar%C3%A9!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
              <Button
                onClick={() => window.open(googleMapsUrl, '_blank')}
                className="absolute bottom-4 right-4 gap-2 shadow-lg"
                size="sm"
              >
                <Navigation className="w-4 h-4" />
                Abrir no Maps
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Endereço
              </h3>
              <p className="text-muted-foreground mb-4">
                <strong className="text-foreground">Marina Big Toys</strong><br />
                Praia do Jacaré<br />
                Cabedelo - PB
              </p>
              <Button
                onClick={() => window.open(googleMapsUrl, '_blank')}
                variant="outline"
                className="w-full gap-2"
              >
                <Navigation className="w-4 h-4" />
                Ver no Google Maps
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
