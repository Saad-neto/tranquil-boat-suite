import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Otimizado para Mobile */}
      <div className="absolute inset-0">
        <img
          src="/areia03.jpg"
          alt="Areia Vermelha - João Pessoa"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center py-20">
        <div className="animate-fade-up">
          {/* Pre-headline */}
          <p className="text-sm sm:text-base md:text-lg text-accent font-medium mb-3 md:mb-4 tracking-wide uppercase">
            Reserve sua lancha privativa para Areia Vermelha + Pôr do Sol do Jacaré
          </p>

          {/* Main Heading - Responsivo */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight px-2">
            Viva Areia Vermelha com
            <span className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Exclusividade e Tranquilidade
            </span>
          </h1>

          {/* Subheadline - Responsivo */}
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-4 md:mb-6 max-w-3xl mx-auto leading-relaxed px-4">
            Curta o dia nas águas mornas das piscinas naturais de Areia Vermelha, delicie-se com churrasco preparado pelo nosso marinheiro e finalize com o espetáculo mais tradicional e emocionante da Paraíba: o Pôr do Sol do Jacaré em um camarote VIP, ao som do Bolero de Ravel a poucos metros de Jurandy do Sax.
          </p>

          {/* Micro-copy */}
          <p className="text-xs sm:text-sm text-white/70 mb-6 md:mb-8 max-w-xl mx-auto px-4">
            Reserve online em minutos, parcele em 12x no cartão e tenha garantia de reembolso por condições meteorológicas adversas.
          </p>

          {/* CTA Buttons - Stack no mobile */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button
              onClick={() => scrollToSection('reservas')}
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base md:text-lg px-6 md:px-8 py-5 md:py-6 shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Ver Disponibilidade
            </Button>
            <Button
              onClick={() => scrollToSection('passeios')}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30 font-semibold text-base md:text-lg px-6 md:px-8 py-5 md:py-6 shadow-xl transition-all duration-300 active:scale-95"
            >
              Conhecer o Passeio
            </Button>
          </div>

          {/* Price Tag - Responsivo */}
          <div className="mt-6 md:mt-8 inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-3 rounded-2xl">
            <span className="text-white/80 text-sm sm:text-base">Barco exclusivo até 7 pessoas:</span>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-accent">R$ 2.199</span>
              <span className="text-white/60 text-xs sm:text-sm">em até 12x</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Escondido no mobile pequeno */}
        <div className="hidden sm:block absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
