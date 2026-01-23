/**
 * Dados de Marés para Porto de Cabedelo - PB
 * Gerador de tábua de marés baseado em cálculos astronômicos
 *
 * Período: 01/01/2025 até 31/12/2026
 * Fonte de referência: tabuademares.com, Marinha do Brasil (CHM)
 *
 * CARACTERÍSTICAS DO PORTO DE CABEDELO:
 * - Marés semidiurnas (2 altas e 2 baixas por dia)
 * - Amplitude de marés de sizígia: 2.0m - 2.5m (lua nova/cheia)
 * - Amplitude de marés de quadratura: 1.6m - 1.9m (quarto crescente/minguante)
 * - Marés baixas: 0.1m - 0.7m
 * - Ciclo lunar: 29.53 dias
 * - Período entre marés: ~12h 25min
 */

export interface TideEntry {
  time: string;
  height: number;
  type: 'high' | 'low';
}

export interface TideDay {
  date: string;
  sunrise: string;
  sunset: string;
  tides: TideEntry[];
  lunarPhase: 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' |
              'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';
  coefficient: number; // 20-120 (amplitude das marés)
}

// Referência de lua nova para cálculos (01/01/2025 foi próximo de lua crescente)
const REFERENCE_NEW_MOON = new Date('2025-01-29T12:00:00Z').getTime();
const LUNAR_CYCLE_MS = 29.53 * 24 * 60 * 60 * 1000;

/**
 * Calcula a fase da lua para uma data
 */
const getLunarPhase = (date: Date): TideDay['lunarPhase'] => {
  const diff = date.getTime() - REFERENCE_NEW_MOON;
  const daysInCycle = (diff / (24 * 60 * 60 * 1000)) % 29.53;
  const normalizedDays = daysInCycle < 0 ? daysInCycle + 29.53 : daysInCycle;

  if (normalizedDays < 1.85) return 'new';
  if (normalizedDays < 7.38) return 'waxing_crescent';
  if (normalizedDays < 9.23) return 'first_quarter';
  if (normalizedDays < 14.77) return 'waxing_gibbous';
  if (normalizedDays < 16.61) return 'full';
  if (normalizedDays < 22.15) return 'waning_gibbous';
  if (normalizedDays < 24.0) return 'last_quarter';
  return 'waning_crescent';
};

/**
 * Calcula o coeficiente de maré (amplitude) baseado na fase lunar
 */
const getTideCoefficient = (date: Date): number => {
  const diff = date.getTime() - REFERENCE_NEW_MOON;
  const daysInCycle = (diff / (24 * 60 * 60 * 1000)) % 29.53;
  const normalizedDays = daysInCycle < 0 ? daysInCycle + 29.53 : daysInCycle;

  // Sizígia (lua nova/cheia): coeficiente alto (~90-115)
  // Quadratura (quartos): coeficiente baixo (~35-55)
  const phaseRadians = (normalizedDays / 29.53) * 2 * Math.PI;
  const amplitude = Math.abs(Math.cos(phaseRadians));

  // Escala para 20-120
  return Math.round(20 + amplitude * 100);
};

/**
 * Formata hora decimal para HH:MM
 */
const formatTime = (decimalHour: number): string => {
  const hour = Math.floor(decimalHour) % 24;
  const minute = Math.round((decimalHour % 1) * 60) % 60;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

/**
 * Calcula nascer e pôr do sol para Cabedelo (aproximado)
 */
const getSunTimes = (date: Date): { sunrise: string; sunset: string } => {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000));

  // Cabedelo está a ~7° Sul - variação de nascer/pôr do sol é pequena
  // Varia de ~05:00 a ~05:30 (nascer) e ~17:15 a ~17:50 (pôr)
  const variation = Math.sin((dayOfYear - 172) * 2 * Math.PI / 365);

  const sunriseHour = 5 + (0.25 - variation * 0.15);
  const sunsetHour = 17 + (0.5 + variation * 0.25);

  return {
    sunrise: formatTime(sunriseHour),
    sunset: formatTime(sunsetHour),
  };
};

/**
 * Gera dados de marés para uma data específica
 */
const generateTidesForDate = (date: Date): TideDay => {
  const dateStr = date.toISOString().split('T')[0];
  const coefficient = getTideCoefficient(date);
  const lunarPhase = getLunarPhase(date);
  const sunTimes = getSunTimes(date);

  // Fator de amplitude baseado no coeficiente (20-120)
  const amplitudeFactor = (coefficient - 20) / 100;

  // Alturas das marés baseadas no coeficiente
  // Marés altas: 1.8m (quadratura) a 2.5m (sizígia)
  // Marés baixas: 0.6m (quadratura) a 0.1m (sizígia)
  const highTideHeight = 1.8 + amplitudeFactor * 0.7;
  const lowTideHeight = 0.6 - amplitudeFactor * 0.5;

  // Horário base da primeira maré alta
  // Avança ~50 minutos por dia
  const daysSinceEpoch = Math.floor(date.getTime() / (24 * 60 * 60 * 1000));
  const dailyShift = (daysSinceEpoch * 0.84) % 24;

  // Ajuste sazonal (marés mais tardias no verão)
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000));
  const seasonalShift = Math.sin((dayOfYear - 80) * 2 * Math.PI / 365) * 0.5;

  let firstHighTide = (3.5 + dailyShift + seasonalShift) % 24;

  const tides: TideEntry[] = [];

  // Adiciona pequena variação randômica determinística baseada na data
  const dateHash = dateStr.split('-').reduce((a, b) => a + parseInt(b), 0);
  const variation = ((dateHash % 100) - 50) / 200; // -0.25 a +0.25

  // Maré alta 1
  if (firstHighTide >= 0) {
    tides.push({
      time: formatTime(firstHighTide),
      height: parseFloat((highTideHeight + variation * 0.1).toFixed(2)),
      type: 'high',
    });
  }

  // Maré baixa 1 (~6h12min após maré alta)
  const lowTide1 = firstHighTide + 6.2;
  if (lowTide1 < 24) {
    tides.push({
      time: formatTime(lowTide1),
      height: parseFloat((lowTideHeight + variation * 0.05).toFixed(2)),
      type: 'low',
    });
  }

  // Maré alta 2 (~12h25min após primeira maré alta)
  const highTide2 = firstHighTide + 12.42;
  if (highTide2 < 24) {
    tides.push({
      time: formatTime(highTide2),
      height: parseFloat((highTideHeight - 0.05 + variation * 0.1).toFixed(2)),
      type: 'high',
    });
  }

  // Maré baixa 2
  const lowTide2 = firstHighTide + 18.62;
  if (lowTide2 < 24) {
    tides.push({
      time: formatTime(lowTide2),
      height: parseFloat((lowTideHeight + 0.05 + variation * 0.05).toFixed(2)),
      type: 'low',
    });
  }

  // Se a primeira maré alta foi muito tarde, pode haver uma maré baixa antes
  if (firstHighTide > 6) {
    const earlyLowTide = firstHighTide - 6.2;
    if (earlyLowTide >= 0) {
      tides.unshift({
        time: formatTime(earlyLowTide),
        height: parseFloat((lowTideHeight + variation * 0.05).toFixed(2)),
        type: 'low',
      });
    }
  }

  // Ordena por horário
  tides.sort((a, b) => {
    const timeA = parseInt(a.time.split(':')[0]) * 60 + parseInt(a.time.split(':')[1]);
    const timeB = parseInt(b.time.split(':')[0]) * 60 + parseInt(b.time.split(':')[1]);
    return timeA - timeB;
  });

  return {
    date: dateStr,
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset,
    tides,
    lunarPhase,
    coefficient,
  };
};

/**
 * Cache de dados gerados
 */
let tideDataCache: Map<string, TideDay> | null = null;

/**
 * Inicializa o cache com dados de 2025-2026
 */
const initializeCache = (): Map<string, TideDay> => {
  if (tideDataCache) return tideDataCache;

  tideDataCache = new Map();

  // Gera dados de 01/01/2025 até 31/12/2026
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2026-12-31');

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const tideDay = generateTidesForDate(currentDate);
    tideDataCache.set(tideDay.date, tideDay);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return tideDataCache;
};

/**
 * Obtém dados de maré para uma data específica
 */
export const getTideForDate = (dateStr: string): TideDay | undefined => {
  const cache = initializeCache();
  return cache.get(dateStr);
};

/**
 * Obtém dados de maré para um mês específico
 */
export const getTidesForMonth = (year: number, month: number): TideDay[] => {
  const cache = initializeCache();
  const result: TideDay[] = [];

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const tideDay = cache.get(dateStr);
    if (tideDay) {
      result.push(tideDay);
    }
  }

  return result;
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
 * Obtém a melhor maré baixa do dia para passeio (entre 9h e 16h)
 */
export const getBestTideForDate = (dateStr: string): {
  time: string;
  height: number;
  quality: 'ideal' | 'good' | 'regular' | 'bad';
} | null => {
  const tideDay = getTideForDate(dateStr);
  if (!tideDay) return null;

  const lowTides = tideDay.tides
    .filter(t => {
      if (t.type !== 'low') return false;
      const hour = parseInt(t.time.split(':')[0]);
      return hour >= 9 && hour <= 16;
    })
    .sort((a, b) => a.height - b.height);

  if (lowTides.length === 0) return null;

  const bestTide = lowTides[0];
  return {
    time: bestTide.time,
    height: bestTide.height,
    quality: getTideQuality(bestTide.height),
  };
};

/**
 * Obtém próximas N marés ideais a partir de hoje
 */
export const getNextIdealTides = (count: number = 5): Array<{
  date: string;
  time: string;
  height: number;
  quality: 'ideal' | 'good' | 'regular' | 'bad';
}> => {
  const result: Array<{
    date: string;
    time: string;
    height: number;
    quality: 'ideal' | 'good' | 'regular' | 'bad';
  }> = [];

  const today = new Date();
  const endDate = new Date('2026-12-31');

  const currentDate = new Date(today);
  while (currentDate <= endDate && result.length < count) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const bestTide = getBestTideForDate(dateStr);

    if (bestTide && (bestTide.quality === 'ideal' || bestTide.quality === 'good')) {
      result.push({
        date: dateStr,
        ...bestTide,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};

/**
 * Verifica se a data está no período válido (2025-2026)
 */
export const isDateInRange = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const start = new Date('2025-01-01');
  const end = new Date('2026-12-31');
  return date >= start && date <= end;
};

/**
 * Traduz fase lunar para português
 */
export const getLunarPhaseLabel = (phase: TideDay['lunarPhase']): string => {
  const labels: Record<TideDay['lunarPhase'], string> = {
    new: 'Lua Nova',
    waxing_crescent: 'Lua Crescente',
    first_quarter: 'Quarto Crescente',
    waxing_gibbous: 'Gibosa Crescente',
    full: 'Lua Cheia',
    waning_gibbous: 'Gibosa Minguante',
    last_quarter: 'Quarto Minguante',
    waning_crescent: 'Lua Minguante',
  };
  return labels[phase];
};

/**
 * Obtém emoji da fase lunar
 */
export const getLunarPhaseEmoji = (phase: TideDay['lunarPhase']): string => {
  const emojis: Record<TideDay['lunarPhase'], string> = {
    new: '🌑',
    waxing_crescent: '🌒',
    first_quarter: '🌓',
    waxing_gibbous: '🌔',
    full: '🌕',
    waning_gibbous: '🌖',
    last_quarter: '🌗',
    waning_crescent: '🌘',
  };
  return emojis[phase];
};
