import { mockWeather } from '@/data/mockWeather';
import { Cloud } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const WeatherWidget = () => {
  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'ideal':
        return <Badge className="bg-success text-success-foreground text-xs">✅ Ideal para passeios</Badge>;
      case 'attention':
        return <Badge className="bg-warning text-warning-foreground text-xs">⚠️ Atenção</Badge>;
      default:
        return <Badge variant="destructive" className="text-xs">❌ Não recomendado</Badge>;
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Cloud className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-card-foreground">Previsão do Tempo</h3>
          <p className="text-sm text-muted-foreground">Próximos 7 dias</p>
        </div>
      </div>

      {/* Week Forecast */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {mockWeather.map((day) => {
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
          
          return (
            <div
              key={day.date}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <p className="text-xs font-medium capitalize mb-1">{dayName}</p>
              <span className="text-2xl mb-1">{day.icon}</span>
              <p className="text-xs font-bold">{day.tempMax}°</p>
              <p className="text-xs text-muted-foreground">{day.tempMin}°</p>
            </div>
          );
        })}
      </div>

      {/* Today's Details */}
      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Chuva:</span>
          <span className="text-sm font-medium">{mockWeather[0].rainChance}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Vento:</span>
          <span className="text-sm font-medium">{mockWeather[0].windSpeed} km/h {mockWeather[0].windDirection}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Mar:</span>
          <span className="text-sm font-medium capitalize">{mockWeather[0].seaCondition === 'calm' ? 'Calmo' : 'Moderado'}</span>
        </div>
      </div>

      <div className="mt-4">
        {getRecommendationBadge(mockWeather[0].recommendation)}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <button className="text-sm text-primary hover:underline font-medium">
          Ver previsão detalhada →
        </button>
      </div>
    </div>
  );
};

export default WeatherWidget;
