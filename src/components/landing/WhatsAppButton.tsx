import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatsAppButton = () => {
  const whatsappLink = "https://wa.me/5583999999999?text=Olá!%20Gostaria%20de%20agendar%20um%20passeio";

  return (
    <Button
      onClick={() => window.open(whatsappLink, '_blank')}
      size="lg"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl bg-[#25D366] hover:bg-[#128C7E] text-white p-0 animate-pulse-slow"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </Button>
  );
};

export default WhatsAppButton;
