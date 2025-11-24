import { Waves, Instagram, Facebook, Phone, Mail, MapPin, Clock, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contato" className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
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
            <h3 className="font-bold text-lg mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-background/80 hover:text-background transition-colors text-left"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('passeios')}
                  className="text-background/80 hover:text-background transition-colors text-left"
                >
                  Nossos Passeios
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('reservas')}
                  className="text-background/80 hover:text-background transition-colors text-left"
                >
                  Fazer Reserva
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('sobre')}
                  className="text-background/80 hover:text-background transition-colors text-left"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('como-funciona')}
                  className="text-background/80 hover:text-background transition-colors text-left"
                >
                  Como Funciona
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Passeios */}
          <div>
            <h3 className="font-bold text-lg mb-4">Passeios</h3>
            <ul className="space-y-2">
              <li className="text-background/80 text-sm">
                Areia Vermelha + Pôr do Sol
              </li>
              <li className="text-background/80 text-sm">
                Rio Paraíba + Pôr do Sol
              </li>
            </ul>
            <div className="mt-4 inline-block px-3 py-1 bg-primary/20 rounded-full">
              <span className="text-background text-sm font-semibold">
                R$ 1.699 cada
              </span>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-background/80 text-sm">
                <Clock className="w-4 h-4" />
                <span>Seg - Dom: 6h às 18h</span>
              </div>
              <div className="flex items-center gap-2 text-background/80 text-sm">
                <Shield className="w-4 h-4" />
                <span>100% Seguro</span>
              </div>
              <div className="flex items-center gap-2 text-background/80 text-sm">
                <Award className="w-4 h-4" />
                <span>5 Anos de Experiência</span>
              </div>
            </div>
          </div>

          {/* Coluna 4: Contato */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/80 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+5583999999999" className="hover:text-background transition-colors">
                  (83) 99999-9999
                </a>
              </li>
              <li className="flex items-center gap-2 text-background/80 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:contato@tranquilidadeboat.com.br" className="hover:text-background transition-colors">
                  contato@tranquilidadeboat.com.br
                </a>
              </li>
              <li className="flex items-center gap-2 text-background/80 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>João Pessoa, Paraíba - Brasil</span>
              </li>
              <li className="flex items-center gap-2 text-background/80 text-sm">
                <Instagram className="w-4 h-4 flex-shrink-0" />
                <a href="https://instagram.com/tranquilidadeboat" target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors">
                  @tranquilidadeboat
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <Button
                onClick={() => scrollToSection('reservas')}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
              >
                Reservar Agora
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/20 my-8"></div>

        {/* Bottom Section */}
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="text-center md:text-left">
            <p className="text-background/60 text-sm">
              © 2024 Tranquilidade Boat. Todos os direitos reservados.
            </p>
            <p className="text-background/40 text-xs mt-1">
              CNPJ: XX.XXX.XXX/XXXX-XX | Licenciado pela Marinha do Brasil
            </p>
          </div>

          <div className="flex justify-center md:justify-end gap-4 text-background/60 text-xs">
            <button className="hover:text-background transition-colors">
              Política de Privacidade
            </button>
            <span>•</span>
            <button className="hover:text-background transition-colors">
              Termos de Uso
            </button>
            <span>•</span>
            <button className="hover:text-background transition-colors">
              Cancelamento
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
