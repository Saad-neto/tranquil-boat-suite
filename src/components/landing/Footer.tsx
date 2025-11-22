import { Waves, Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contato" className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          {/* Coluna 1: Sobre */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Tranquilidade Boat</span>
            </div>
            <p className="text-background/80 leading-relaxed">
              Experiências náuticas únicas em João Pessoa/PB
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3 pt-2">
              <Button
                size="icon"
                variant="outline"
                className="bg-background/10 border-background/20 hover:bg-background/20 text-background"
                onClick={() => window.open('https://instagram.com/tranquilidadeboat', '_blank')}
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="bg-background/10 border-background/20 hover:bg-background/20 text-background"
                onClick={() => window.open('https://facebook.com/tranquilidadeboat', '_blank')}
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="bg-background/10 border-background/20 hover:bg-background/20 text-background"
                onClick={() => window.open('https://wa.me/5583999999999', '_blank')}
              >
                <Phone className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('passeios')}
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Passeios
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('como-funciona')}
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Como Funciona
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contato')}
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/80">
                <Phone className="w-4 h-4" />
                <span>(83) 9XXXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-background/80">
                <Mail className="w-4 h-4" />
                <span>contato@tranquilidadeboat.com.br</span>
              </li>
              <li className="flex items-center gap-2 text-background/80">
                <MapPin className="w-4 h-4" />
                <span>João Pessoa/PB</span>
              </li>
              <li className="flex items-center gap-2 text-background/80">
                <Instagram className="w-4 h-4" />
                <span>@tranquilidadeboat</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-background/20 pt-8 text-center text-background/60 text-sm">
          <p>© 2024 Tranquilidade Boat. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
