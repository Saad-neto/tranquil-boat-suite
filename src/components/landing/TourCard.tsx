import { Tour } from '@/types';
import { Button } from '@/components/ui/button';
import { Clock, Users, MapPin, Anchor, Ship, Star, ShieldCheck, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TourCardProps {
  tour: Tour;
}

const TourCard = ({ tour }: TourCardProps) => {
  const scrollToBooking = () => {
    const element = document.getElementById('reservas');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre o passeio Areia Vermelha + Pôr do Sol do Jacaré.');
    window.open(`https://wa.me/5583999999999?text=${message}`, '_blank');
  };

  const pricePerPerson = Math.ceil(tour.price / (tour.maxPeople || 7));
  const installmentPrice = (tour.price * 1.15 / 12).toFixed(2).replace('.', ',');

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border">
      {/* Image */}
      <div className="relative h-64 sm:h-72 overflow-hidden">
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Rating Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/95 text-foreground backdrop-blur-sm shadow-md px-3 py-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-bold">4.9</span>
            <span className="text-muted-foreground ml-1">(127)</span>
          </Badge>
        </div>
        {/* Urgency Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-destructive/90 text-destructive-foreground backdrop-blur-sm animate-pulse">
            Poucas datas disponíveis
          </Badge>
        </div>
        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent"></div>
        {/* Title on Image */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">{tour.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Section Title */}
        <p className="text-xs sm:text-sm text-primary font-semibold uppercase tracking-wide">
          A Experiência em João Pessoa: Um Dia Único, Uma Lembrança Eterna!
        </p>

        {/* Description */}
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Viva o melhor de João Pessoa: nade nas piscinas naturais de águas mornas de Areia Vermelha, aviste golfinhos pelo caminho, desfrute de paisagens paradisíacas e finalize com o espetáculo do Pôr do Sol do Jacaré ao som do Bolero de Ravel com Jurandy do Sax!
        </p>

        {/* Destaques do Passeio */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
            <span className="mr-1">🏝️</span> Ilha paradisíaca
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
            <span className="mr-1">🎷</span> Pôr do Sol do Jacaré
          </Badge>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-border">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-medium">4-6 horas</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-medium">Até {tour.maxPeople || 7} pessoas</span>
          </div>
          <div className="flex items-center gap-2 text-sm col-span-2">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-medium text-xs sm:text-sm">Saída: Marina Big Toys, Jacaré</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="bg-accent/10 rounded-xl p-4 space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-accent">
              R$ {tour.price.toLocaleString('pt-BR')}
            </span>
            <span className="text-sm text-muted-foreground">(barco exclusivo)</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
            <span className="text-success font-medium">
              = R$ {pricePerPerson}/pessoa com 7 amigos
            </span>
            <span className="text-muted-foreground">
              ou 12x de R$ {installmentPrice}
            </span>
          </div>
        </div>

        {/* Includes - Reorganized by value */}
        <div className="space-y-2">
          <p className="font-semibold text-sm text-foreground">O que está incluso:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { icon: Anchor, text: 'Capitão certificado pela Marinha' },
              { icon: Ship, text: 'Barco exclusivo (não compartilhado)' },
              { icon: '🔊', text: 'Som JBL Bluetooth' },
              { icon: '🧊', text: 'Cooler com gelo (traga suas bebidas)' },
              { icon: ShieldCheck, text: 'Coletes e equipamentos de segurança' },
              { icon: '📸', text: 'Fotos enviadas pelo WhatsApp' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                {typeof item.icon === 'string' ? (
                  <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">{item.icon}</span>
                ) : (
                  <item.icon className="w-4 h-4 text-success flex-shrink-0" />
                )}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground border-t border-border pt-3">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-success" />
            Cancelamento grátis 48h
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-success" />
            Pagamento seguro
          </span>
          <span className="text-border">•</span>
          <span>+500 passeios realizados</span>
        </div>

        {/* Refund Policy */}
        <div className="bg-info/10 rounded-lg p-3 border border-info/20">
          <p className="text-xs sm:text-sm text-info font-medium flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Reembolso integral em caso de cancelamento por condições climáticas desfavoráveis</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            onClick={scrollToBooking}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 sm:py-6 text-base sm:text-lg shadow-md hover:shadow-lg transition-all"
          >
            Reservar Agora
          </Button>
          <Button
            onClick={openWhatsApp}
            variant="outline"
            className="sm:w-auto border-success text-success hover:bg-success hover:text-white py-5 sm:py-6"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            <span className="sm:hidden">Dúvidas</span>
            <span className="hidden sm:inline">Tirar Dúvidas</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
