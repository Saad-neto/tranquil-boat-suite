import { mockTides } from '@/data/mockTides';
import { Waves, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TideWidget = () => {
  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case 'ideal':
        return <Badge className="bg-success text-success-foreground">⭐ Ideal</Badge>;
      case 'good':
        return <Badge className="bg-info text-info-foreground">✅ Boa</Badge>;
      case 'regular':
        return <Badge className="bg-warning text-warning-foreground">⚠️ Regular</Badge>;
      default:
        return <Badge variant="destructive">❌ Não Recomendado</Badge>;
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Waves className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-card-foreground">Tábua de Marés</h3>
          <p className="text-sm text-muted-foreground">João Pessoa</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground mb-3">
          Próximas marés baixas ideais:
        </p>
        
        {mockTides.slice(0, 3).map((tideDay) => {
          const idealTide = tideDay.tides.find(t => t.type === 'low' && t.quality === 'ideal') || 
                           tideDay.tides.find(t => t.type === 'low');
          
          if (!idealTide) return null;
          
          const date = new Date(tideDay.date);
          const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
          const dayNum = date.getDate();
          const month = date.getMonth() + 1;

          return (
            <div
              key={tideDay.date}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                  <p className="font-medium text-sm capitalize">
                    {dayName} {dayNum}/{month}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    às {idealTide.time} ({idealTide.height}m)
                  </p>
                </div>
              </div>
              {getQualityBadge(idealTide.quality)}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <button className="text-sm text-primary hover:underline font-medium">
          Ver calendário completo →
        </button>
      </div>
    </div>
  );
};

export default TideWidget;
