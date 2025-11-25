import { Button } from '@/components/ui/button';
import { Waves } from 'lucide-react';

const Hero = () => {
  const whatsappLink = "https://wa.me/5583999999999?text=Olá!%20Gostaria%20de%20agendar%20um%20passeio";

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/areia-vermelha-photo.jpg)',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--hero-overlay))]/30 via-[hsl(var(--hero-overlay))]/20 to-[hsl(var(--hero-overlay))]/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-fade-up">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-primary/20 backdrop-blur-sm p-4 rounded-full">
              <Waves className="w-16 h-16 text-accent animate-pulse-slow" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Sua experiência náutica em<br />
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              João Pessoa
            </span>{' '}
            começa aqui
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Aluguel de lanchas com capitão experiente<br />
            para passeios inesquecíveis
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => scrollToSection('passeios')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Ver Passeios
            </Button>
            <Button
              onClick={() => window.open(whatsappLink, '_blank')}
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30 font-semibold text-lg px-8 py-6 shadow-xl transition-all duration-300 hover:scale-105"
            >
              Fale Conosco
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
