import { Anchor, Instagram, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-10 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo e Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Anchor className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">Tranquilidade Boat</span>
            </div>
            <p className="text-background/60 text-sm">
              Areia Vermelha + Pôr do Sol do Jacaré
            </p>
          </div>

          {/* Contato */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-background/80">
            <a href="tel:+5583999999999" className="flex items-center gap-1 hover:text-background transition-colors">
              <Phone className="w-4 h-4" />
              (83) 99999-9999
            </a>
            <a href="https://instagram.com/tranquilidadeboat" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-background transition-colors">
              <Instagram className="w-4 h-4" />
              @tranquilidadeboat
            </a>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Marina Big Toys, Jacaré
            </span>
          </div>

          {/* WhatsApp */}
          <Button
            onClick={() => window.open('https://wa.me/5583999999999?text=Olá!%20Gostaria%20de%20reservar%20um%20passeio', '_blank')}
            className="bg-primary hover:bg-primary/90 text-white font-semibold"
          >
            Reservar Agora
          </Button>
        </div>

        {/* Copyright */}
        <div className="border-t border-background/20 mt-8 pt-6 text-center">
          <p className="text-background/50 text-xs">
            © 2024 Tranquilidade Boat. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
