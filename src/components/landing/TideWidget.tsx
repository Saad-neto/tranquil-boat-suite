import { useState, useMemo } from 'react';
import { Waves, Sunrise, Sunset, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  getTideForDate,
  getTideQuality,
  getBestTideForDate,
  getLunarPhaseLabel,
  getLunarPhaseEmoji,
} from '@/data/tideData2026';

const TideWidget = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const selectedTideData = useMemo(() => {
    return getTideForDate(selectedDate);
  }, [selectedDate]);

  const bestTide = useMemo(() => {
    return getBestTideForDate(selectedDate);
  }, [selectedDate]);

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case 'ideal':
        return <Badge className="bg-success text-success-foreground text-xs">Ideal</Badge>;
      case 'good':
        return <Badge className="bg-info text-info-foreground text-xs">Boa</Badge>;
      case 'regular':
        return <Badge className="bg-warning text-warning-foreground text-xs">Regular</Badge>;
      default:
        return <Badge variant="destructive" className="text-xs">Ruim</Badge>;
    }
  };

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const goToToday = () => {
    setSelectedDate(today);
  };

  const isToday = selectedDate === today;

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-lg border border-border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Waves className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-card-foreground">Tábua de Marés</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Porto de Cabedelo</p>
        </div>
      </div>

      {/* Date Picker */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min="2025-01-01"
            max="2026-12-31"
            className="w-full pl-10 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        {!isToday && (
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-xs"
          >
            Hoje
          </Button>
        )}
      </div>

      {/* Selected Date Details */}
      {selectedTideData ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm capitalize">
              {formatDateHeader(selectedDate)}
            </h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{getLunarPhaseEmoji(selectedTideData.lunarPhase)}</span>
              <span className="hidden sm:inline">{getLunarPhaseLabel(selectedTideData.lunarPhase)}</span>
            </div>
          </div>

          {/* Sun times */}
          <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Sunrise className="w-3 h-3" />
              <span>{selectedTideData.sunrise}</span>
            </div>
            <div className="flex items-center gap-1">
              <Sunset className="w-3 h-3" />
              <span>{selectedTideData.sunset}</span>
            </div>
          </div>

          {/* Tide times */}
          <div className="space-y-2">
            {selectedTideData.tides.map((tide, index) => {
              const quality = tide.type === 'low' ? getTideQuality(tide.height) : null;
              const hour = parseInt(tide.time.split(':')[0]);
              const isGoodTime = tide.type === 'low' && hour >= 9 && hour <= 16;

              return (
                <div
                  key={index}
                  className={`
                    flex items-center justify-between p-2 sm:p-3 rounded-lg
                    ${isGoodTime && (quality === 'ideal' || quality === 'good')
                      ? 'bg-success/10 border border-success/20'
                      : 'bg-muted/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`
                      w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
                      ${tide.type === 'high' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}
                    `}>
                      {tide.type === 'high' ? (
                        <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-xs sm:text-sm">
                        {tide.type === 'high' ? 'Maré Alta' : 'Maré Baixa'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        às {tide.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm sm:text-base">{tide.height}m</p>
                    {quality && isGoodTime && getQualityBadge(quality)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Best tide recommendation */}
          {bestTide && (bestTide.quality === 'ideal' || bestTide.quality === 'good') && (
            <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
              <p className="text-xs sm:text-sm font-medium text-success">
                Melhor horário para Areia Vermelha: {bestTide.time} ({bestTide.height}m)
              </p>
            </div>
          )}

          {bestTide && bestTide.quality === 'regular' && (
            <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
              <p className="text-xs sm:text-sm font-medium text-warning">
                Maré regular às {bestTide.time} - passeio possível com restrições
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-sm">Dados não disponíveis para esta data.</p>
          <p className="text-xs mt-1">Selecione uma data entre 01/01/2025 e 31/12/2026</p>
        </div>
      )}
    </div>
  );
};

export default TideWidget;
