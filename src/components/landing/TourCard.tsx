import { Tour } from '@/types';
import { Button } from '@/components/ui/button';
import { Clock, Users, Music, Waves, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TourCardProps {
  tour: Tour;
}

const TourCard = ({ tour }: TourCardProps) => {
  const whatsappLink = `https://wa.me/5583999999999?text=Olá!%20Gostaria%20de%20agendar%20o%20passeio:%20${encodeURIComponent(tour.name)}`;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins}min`;
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {tour.requiresLowTide && (
            <Badge className="bg-warning/90 text-warning-foreground backdrop-blur-sm">
              ⚠️ Consulte disponibilidade
            </Badge>
          )}
          {tour.hasLiveMusic && (
            <Badge className="bg-secondary/90 text-secondary-foreground backdrop-blur-sm">
              🎵 Música ao vivo
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-2xl font-bold text-card-foreground">{tour.name}</h3>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">{tour.description}</p>

        {/* Info Icons */}
        <div className="grid grid-cols-2 gap-3 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-medium">{formatDuration(tour.duration)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-medium">Até 10 pessoas</span>
          </div>
          {tour.requiresLowTide && (
            <div className="flex items-center gap-2 text-sm">
              <Waves className="w-4 h-4 text-primary" />
              <span className="font-medium text-xs">Maré baixa</span>
            </div>
          )}
          {tour.hasLiveMusic && (
            <div className="flex items-center gap-2 text-sm">
              <Music className="w-4 h-4 text-primary" />
              <span className="font-medium text-xs">Música ao vivo</span>
            </div>
          )}
          {tour.departureTime && (
            <div className="flex items-center gap-2 text-sm col-span-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-medium">Saída: {tour.departureTime}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="pt-4 border-t">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold text-accent">
              R$ {tour.price.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Includes */}
        <div className="space-y-2">
          <p className="font-semibold text-sm text-foreground">✅ Inclui:</p>
          <div className="grid grid-cols-2 gap-2">
            {tour.includes.slice(0, 6).map((item, index) => (
              <div key={index} className="flex items-start gap-1 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3 h-3 text-success mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => window.open(whatsappLink, '_blank')}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg shadow-md hover:shadow-lg transition-all"
        >
          Agendar Agora
        </Button>

        {/* Best For Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {tour.bestFor.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourCard;
