/**
 * Dados REAIS de Marés para Porto de Cabedelo - PB
 * Fonte: Apolo11 (baseado em cálculos astronômicos oficiais)
 * Data de extração: 25/11/2025
 *
 * IMPORTANTE: Estes dados são calculados e devem ser confirmados com
 * a Tábua oficial da Marinha do Brasil quando disponível.
 */

export interface RealTideEntry {
  time: string;
  height: number;
  type: 'high' | 'low';
}

export interface RealTideDay {
  date: string;
  sunrise: string;
  sunset: string;
  tides: RealTideEntry[];
}

/**
 * Tábua de marés real para Cabedelo/PB - Novembro/Dezembro 2025
 */
export const realTides2025: RealTideDay[] = [
  {
    date: '2025-11-24',
    sunrise: '04:51',
    sunset: '17:20',
    tides: [
      { time: '00:15', height: 0.33, type: 'low' },
      { time: '06:28', height: 1.88, type: 'high' },
      { time: '12:37', height: 0.44, type: 'low' },
      { time: '18:42', height: 1.82, type: 'high' },
    ],
  },
  {
    date: '2025-11-25',
    sunrise: '04:52',
    sunset: '17:20',
    tides: [
      { time: '00:56', height: 0.41, type: 'low' },
      { time: '07:09', height: 1.79, type: 'high' },
      { time: '13:18', height: 0.51, type: 'low' },
      { time: '19:27', height: 1.76, type: 'high' },
    ],
  },
  {
    date: '2025-11-26',
    sunrise: '04:52',
    sunset: '17:21',
    tides: [
      { time: '01:42', height: 0.49, type: 'low' },
      { time: '07:55', height: 1.71, type: 'high' },
      { time: '14:07', height: 0.56, type: 'low' },
      { time: '20:21', height: 1.71, type: 'high' },
    ],
  },
  {
    date: '2025-11-27',
    sunrise: '04:52',
    sunset: '17:21',
    tides: [
      { time: '02:40', height: 0.57, type: 'low' },
      { time: '08:53', height: 1.64, type: 'high' },
      { time: '15:08', height: 0.59, type: 'low' },
      { time: '21:29', height: 1.68, type: 'high' },
    ],
  },
  {
    date: '2025-11-28',
    sunrise: '04:52',
    sunset: '17:22',
    tides: [
      { time: '03:53', height: 0.60, type: 'low' },
      { time: '10:05', height: 1.61, type: 'high' },
      { time: '16:22', height: 0.57, type: 'low' },
      { time: '22:48', height: 1.73, type: 'high' },
    ],
  },
  {
    date: '2025-11-29',
    sunrise: '04:53',
    sunset: '17:22',
    tides: [
      { time: '05:12', height: 0.56, type: 'low' },
      { time: '11:21', height: 1.66, type: 'high' },
      { time: '17:36', height: 0.48, type: 'low' },
    ],
  },
  {
    date: '2025-11-30',
    sunrise: '04:53',
    sunset: '17:22',
    tides: [
      { time: '00:01', height: 1.85, type: 'high' },
      { time: '06:22', height: 0.45, type: 'low' },
      { time: '12:27', height: 1.77, type: 'high' },
      { time: '18:38', height: 0.32, type: 'low' },
    ],
  },
  {
    date: '2025-12-01',
    sunrise: '04:53',
    sunset: '17:23',
    tides: [
      { time: '01:00', height: 2.02, type: 'high' },
      { time: '07:19', height: 0.31, type: 'low' },
      { time: '13:21', height: 1.92, type: 'high' },
      { time: '19:32', height: 0.15, type: 'low' },
    ],
  },
  {
    date: '2025-12-02',
    sunrise: '04:53',
    sunset: '17:23',
    tides: [
      { time: '01:52', height: 2.18, type: 'high' },
      { time: '08:08', height: 0.18, type: 'low' },
      { time: '14:10', height: 2.05, type: 'high' },
      { time: '20:21', height: 0.01, type: 'low' },
    ],
  },
];

/**
 * Função auxiliar para converter hora HH:MM para decimal
 */
const timeToDecimal = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + minutes / 60;
};

/**
 * Determina a qualidade da maré para passeio à Areia Vermelha
 */
export const getTideQuality = (height: number): 'ideal' | 'good' | 'regular' | 'bad' => {
  if (height <= 0.3) return 'ideal';
  if (height <= 0.5) return 'good';
  if (height <= 0.7) return 'regular';
  return 'bad';
};

/**
 * Filtra marés baixas ideais entre 9h e 15h
 */
export const getIdealTidesFromRealData = (count: number = 5) => {
  const result: Array<{
    date: string;
    time: string;
    height: number;
    quality: string;
  }> = [];

  for (const day of realTides2025) {
    // Filtra marés baixas entre 9h e 15h
    const validTides = day.tides
      .filter(tide => {
        if (tide.type !== 'low') return false;
        const timeDecimal = timeToDecimal(tide.time);
        return timeDecimal >= 9 && timeDecimal <= 15;
      })
      .sort((a, b) => a.height - b.height); // Ordena pela mais baixa

    const bestTide = validTides[0];

    if (bestTide) {
      const quality = getTideQuality(bestTide.height);

      // Só adiciona se for ideal ou boa
      if (quality === 'ideal' || quality === 'good') {
        result.push({
          date: day.date,
          time: bestTide.time,
          height: bestTide.height,
          quality,
        });
      }
    }

    if (result.length >= count) break;
  }

  return result;
};

/**
 * Busca dados de maré para uma data específica
 */
export const getRealTideForDate = (dateStr: string) => {
  return realTides2025.find(day => day.date === dateStr);
};
