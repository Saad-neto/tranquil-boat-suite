import { TideData } from '@/types';
import {
  getTideForDate,
  getTidesForMonth,
  getNextIdealTides,
  getBestTideForDate,
  getTideQuality,
  isDateInRange,
} from '@/data/tideData2026';

/**
 * Serviço de Tábua de Marés para Porto de Cabedelo - PB
 *
 * ATUALIZADO: Agora usa dados gerados por algoritmos astronômicos
 * Período: 01/01/2025 até 31/12/2026
 */

/**
 * Busca tábua de marés para os próximos N dias
 */
export const fetchTides = async (days: number = 30): Promise<TideData[]> => {
  const tides: TideData[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    if (!isDateInRange(dateStr)) continue;

    const tideDay = getTideForDate(dateStr);
    if (tideDay) {
      tides.push({
        date: tideDay.date,
        tides: tideDay.tides.map((t) => ({
          ...t,
          quality: t.type === 'low' ? getTideQuality(t.height) : 'bad' as const,
        })),
      });
    }
  }

  return tides;
};

/**
 * Busca apenas marés baixas ideais para Areia Vermelha
 */
export const fetchIdealTides = async (days: number = 30): Promise<TideData[]> => {
  const allTides = await fetchTides(days);

  return allTides.filter((day) =>
    day.tides.some(
      (tide) =>
        tide.type === 'low' && (tide.quality === 'ideal' || tide.quality === 'good')
    )
  );
};

/**
 * Busca próximas N marés baixas ideais entre 9h e 16h
 */
export const fetchNextIdealTides = async (
  count: number = 5
): Promise<
  Array<{
    date: string;
    time: string;
    height: number;
    quality: string;
  }>
> => {
  return getNextIdealTides(count);
};

/**
 * Verifica se um dia específico tem maré boa para Areia Vermelha
 */
export const checkTideForDate = async (
  date: string
): Promise<{
  isGood: boolean;
  bestTide?: { time: string; height: number; quality: string };
  message: string;
}> => {
  const bestTide = getBestTideForDate(date);

  if (!bestTide) {
    return {
      isGood: false,
      message: 'Sem maré baixa favorável neste dia',
    };
  }

  const isGood = bestTide.quality === 'ideal' || bestTide.quality === 'good';

  return {
    isGood,
    bestTide: {
      time: bestTide.time,
      height: bestTide.height,
      quality: bestTide.quality,
    },
    message: isGood
      ? `Maré baixa ${bestTide.quality === 'ideal' ? 'ideal' : 'boa'} às ${bestTide.time}`
      : `Maré não recomendada (${bestTide.height}m às ${bestTide.time})`,
  };
};
