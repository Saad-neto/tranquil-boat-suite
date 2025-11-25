import { useNextIdealTides } from '@/hooks/useTides';
import { Waves, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TideWidget = () => {
  const { data: idealTides, isLoading, error } = useNextIdealTides(3);

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

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-3 text-muted-foreground">Calculando marés...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao calcular marés. Usando dados de exemplo.
          </AlertDescription>
        </Alert>
      )}

      {/* Tide Data */}
      {idealTides && idealTides.length > 0 && (
        <>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground mb-3">
              Próximas marés baixas ideais:
            </p>

            {idealTides.map((tide) => {
              const date = new Date(tide.date);
              const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
              const dayNum = date.getDate();
              const month = date.getMonth() + 1;

              return (
                <div
                  key={tide.date}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-medium text-sm capitalize">
                        {dayName} {dayNum}/{month}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        às {tide.time} ({tide.height}m)
                      </p>
                    </div>
                  </div>
                  {getQualityBadge(tide.quality)}
                </div>
              );
            })}
          </div>

          {/* Calculation Info */}
          {!isLoading && !error && (
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                <p className="text-xs font-medium text-success">
                  Dados REAIS de Cabedelo/PB - Nov/Dez 2025
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Fonte: Apolo11 (cálculos astronômicos oficiais).{' '}
                Confirme com a{' '}
                <a
                  href="https://www.marinha.mil.br/chm/tabuas-de-mare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Marinha do Brasil
                </a>
              </p>
            </div>
          )}
        </>
      )}

      {/* No ideal tides found */}
      {idealTides && idealTides.length === 0 && !isLoading && (
        <div className="text-center py-6">
          <Waves className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Nenhuma maré ideal encontrada nos próximos dias
          </p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-border">
        <a
          href="https://www.marinha.mil.br/chm/tabuas-de-mare"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline font-medium inline-block"
        >
          Ver calendário completo →
        </a>
      </div>
    </div>
  );
};

export default TideWidget;
