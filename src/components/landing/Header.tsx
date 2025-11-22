import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const whatsappLink = "https://wa.me/5583999999999?text=Olá!%20Gostaria%20de%20agendar%20um%20passeio";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Tranquilidade Boat
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('hero')}
              className={`font-medium transition-colors ${
                isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-accent'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('passeios')}
              className={`font-medium transition-colors ${
                isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-accent'
              }`}
            >
              Passeios
            </button>
            <button
              onClick={() => scrollToSection('como-funciona')}
              className={`font-medium transition-colors ${
                isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-accent'
              }`}
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('contato')}
              className={`font-medium transition-colors ${
                isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-accent'
              }`}
            >
              Contato
            </button>
            <Button
              onClick={() => window.open(whatsappLink, '_blank')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              Fale Conosco
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? 'text-foreground' : 'text-white'} size={24} />
            ) : (
              <Menu className={isScrolled ? 'text-foreground' : 'text-white'} size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-background/95 backdrop-blur-md rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 px-4">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-left font-medium text-foreground hover:text-primary transition-colors"
              >
                Início
              </button>
              <button
                onClick={() => scrollToSection('passeios')}
                className="text-left font-medium text-foreground hover:text-primary transition-colors"
              >
                Passeios
              </button>
              <button
                onClick={() => scrollToSection('como-funciona')}
                className="text-left font-medium text-foreground hover:text-primary transition-colors"
              >
                Como Funciona
              </button>
              <button
                onClick={() => scrollToSection('contato')}
                className="text-left font-medium text-foreground hover:text-primary transition-colors"
              >
                Contato
              </button>
              <Button
                onClick={() => window.open(whatsappLink, '_blank')}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold w-full"
              >
                Fale Conosco
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
