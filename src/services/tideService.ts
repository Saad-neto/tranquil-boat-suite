import { TideData } from '@/types';

/**
 * Serviço de Tábua de Marés para João Pessoa/PB
 *
 * NOTA: Este serviço usa cálculos aproximados baseados em dados astronômicos.
 * Para dados oficiais precisos, recomenda-se consultar:
 * - https://www.marinha.mil.br/chm/tabuas-de-mare
 * - API paga: https://www.worldtides.info/ ou https://stormglass.io/
 */

const JOAO_PESSOA_LAT = -7.1195;
const JOAO_PESSOA_LON = -34.8450;

/**
 * Calcula as marés usando aproximação harmônica simples
 * Baseado no ciclo lunar de ~12.42 horas
 */
const calculateTidesForDate = (date: Date): TideData => {
  const dateStr = date.toISOString().split('T')[0];

  // Ciclo lunar (aproximado)
  const lunarCycle = 12.42; // horas entre marés altas
  const baseTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  const dayOffset = date.getDate();

  // Ajuste baseado na fase da lua (aproximado)
  const lunarMonth = 29.53; // dias
  const lunarPhase = (dayOffset % lunarMonth) / lunarMonth;

  // Amplitude das marés varia com a fase da lua
  // Lua nova/cheia = marés maiores (sizígia)
  // Quarto crescente/minguante = marés menores (quadratura)
  const isSpringTide = lunarPhase < 0.25 || (lunarPhase > 0.45 && lunarPhase < 0.55) || lunarPhase > 0.75;

  // Horários base das marés (ajustado para João Pessoa)
  const firstHighTide = 3.5 + (dayOffset * 0.84) % lunarCycle; // Varia ~50 minutos por dia
  const firstLowTide = firstHighTide + 6.21; // ~6h após maré alta

  const tides = [];

  // Maré alta 1
  const highTide1Time = firstHighTide;
  const highTide1Height = isSpringTide ? 2.2 : 1.7;
  tides.push({
    time: formatTime(highTide1Time),
    height: parseFloat(highTide1Height.toFixed(1)),
    type: 'high' as const,
    quality: 'bad' as const
  });

  // Maré baixa 1
  const lowTide1Time = firstLowTide;
  const lowTide1Height = isSpringTide ? 0.2 : 0.5;
  tides.push({
    time: formatTime(lowTide1Time),
    height: parseFloat(lowTide1Height.toFixed(1)),
    type: 'low' as const,
    quality: getTideQuality(lowTide1Height)
  });

  // Maré alta 2
  const highTide2Time = firstHighTide + lunarCycle;
  const highTide2Height = isSpringTide ? 2.1 : 1.6;
  if (highTide2Time < 24) {
    tides.push({
      time: formatTime(highTide2Time),
      height: parseFloat(highTide2Height.toFixed(1)),
      type: 'high' as const,
      quality: 'bad' as const
    });
  }

  // Maré baixa 2
  const lowTide2Time = firstLowTide + lunarCycle;
  const lowTide2Height = isSpringTide ? 0.3 : 0.6;
  if (lowTide2Time < 24) {
    tides.push({
      time: formatTime(lowTide2Time),
      height: parseFloat(lowTide2Height.toFixed(1)),
      type: 'low' as const,
      quality: getTideQuality(lowTide2Height)
    });
  }

  // Ordenar por hora
  tides.sort((a, b) => {
    const timeA = parseFloat(a.time.replace(':', '.'));
    const timeB = parseFloat(b.time.replace(':', '.'));
    return timeA - timeB;
  });

  return {
    date: dateStr,
    tides
  };
};

/**
 * Formata hora decimal para HH:MM
 */
const formatTime = (decimalHour: number): string => {
  const hour = Math.floor(decimalHour) % 24;
  const minute = Math.round((decimalHour % 1) * 60);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

/**
 * Determina qualidade da maré para passeio Areia Vermelha
 */
const getTideQuality = (height: number): 'ideal' | 'good' | 'regular' | 'bad' => {
  if (height <= 0.3) return 'ideal';
  if (height <= 0.5) return 'good';
  if (height <= 0.7) return 'regular';
  return 'bad';
};

/**
 * Busca tábua de marés para os próximos N dias
 */
export const fetchTides = async (days: number = 30): Promise<TideData[]> => {
  try {
    // TODO: Integrar com API real quando disponível
    // Opções: WorldTides, StormGlass, ou scraping da Marinha

    console.log('🌊 Calculando marés para João Pessoa...');

    const tides: TideData[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const tideData = calculateTidesForDate(date);
      tides.push(tideData);
    }

    console.log(`✅ ${tides.length} dias de marés calculados`);

    return tides;
  } catch (error) {
    console.error('❌ Erro ao calcular marés:', error);

    // Fallback para dados mockados
    const { mockTides } = await import('@/data/mockTides');
    return mockTides;
  }
};

/**
 * Busca apenas marés baixas ideais para Areia Vermelha
 */
export const fetchIdealTides = async (days: number = 30): Promise<TideData[]> => {
  const allTides = await fetchTides(days);

  // Filtra apenas dias com marés baixas ideais ou boas
  return allTides.filter(day =>
    day.tides.some(tide =>
      tide.type === 'low' && (tide.quality === 'ideal' || tide.quality === 'good')
    )
  );
};

/**
 * Busca próximas N marés baixas ideais
 */
export const fetchNextIdealTides = async (count: number = 5): Promise<Array<{
  date: string;
  time: string;
  height: number;
  quality: string;
}>> => {
  const idealTides = await fetchIdealTides();
  const result = [];

  for (const day of idealTides) {
    const bestTide = day.tides
      .filter(t => t.type === 'low')
      .sort((a, b) => a.height - b.height)[0];

    if (bestTide && (bestTide.quality === 'ideal' || bestTide.quality === 'good')) {
      result.push({
        date: day.date,
        time: bestTide.time,
        height: bestTide.height,
        quality: bestTide.quality
      });
    }

    if (result.length >= count) break;
  }

  return result;
};

/**
 * Verifica se um dia específico tem maré boa para Areia Vermelha
 */
export const checkTideForDate = async (date: string): Promise<{
  isGood: boolean;
  bestTide?: { time: string; height: number; quality: string };
  message: string;
}> => {
  const tides = await fetchTides(30);
  const dayTide = tides.find(t => t.date === date);

  if (!dayTide) {
    return {
      isGood: false,
      message: 'Data não disponível na previsão'
    };
  }

  const lowTides = dayTide.tides.filter(t => t.type === 'low');
  const bestLowTide = lowTides.sort((a, b) => a.height - b.height)[0];

  if (!bestLowTide) {
    return {
      isGood: false,
      message: 'Sem marés baixas neste dia'
    };
  }

  const isGood = bestLowTide.quality === 'ideal' || bestLowTide.quality === 'good';

  return {
    isGood,
    bestTide: {
      time: bestLowTide.time,
      height: bestLowTide.height,
      quality: bestLowTide.quality
    },
    message: isGood
      ? `Maré baixa ${bestLowTide.quality === 'ideal' ? 'ideal' : 'boa'} às ${bestLowTide.time}`
      : `Maré não recomendada (${bestLowTide.height}m às ${bestLowTide.time})`
  };
};
