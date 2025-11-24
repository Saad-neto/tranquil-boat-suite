import { WeatherData } from '@/types';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const LATITUDE = import.meta.env.VITE_LATITUDE || '-7.1195';
const LONGITUDE = import.meta.env.VITE_LONGITUDE || '-34.8450';

interface OpenWeatherResponse {
  list: Array<{
    dt: number;
    main: {
      temp_max: number;
      temp_min: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
    pop: number; // Probability of precipitation
  }>;
}

/**
 * Converte a condição do OpenWeather para nosso formato
 */
const mapWeatherCondition = (main: string): string => {
  const conditions: Record<string, string> = {
    Clear: 'sunny',
    Clouds: 'cloudy',
    Rain: 'rainy',
    Drizzle: 'rainy',
    Thunderstorm: 'stormy',
    Snow: 'snowy',
    Mist: 'foggy',
    Smoke: 'foggy',
    Haze: 'foggy',
    Dust: 'foggy',
    Fog: 'foggy',
    Sand: 'foggy',
    Ash: 'foggy',
    Squall: 'stormy',
    Tornado: 'stormy',
  };

  return conditions[main] || 'partly_cloudy';
};

/**
 * Retorna o emoji baseado na condição
 */
const getWeatherIcon = (condition: string, cloudiness?: number): string => {
  if (condition === 'Clear') return '☀️';
  if (condition === 'Rain' || condition === 'Drizzle') return '🌧️';
  if (condition === 'Thunderstorm') return '⛈️';
  if (condition === 'Snow') return '❄️';
  if (condition === 'Clouds') {
    if (cloudiness && cloudiness > 70) return '☁️';
    if (cloudiness && cloudiness > 40) return '⛅';
    return '🌤️';
  }
  if (condition === 'Mist' || condition === 'Fog') return '🌫️';
  return '⛅';
};

/**
 * Converte direção do vento de graus para cardinal (N, NE, E, etc)
 */
const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

/**
 * Determina a condição do mar baseado no vento
 */
const getSeaCondition = (windSpeed: number): 'calm' | 'moderate' | 'rough' => {
  // Converte m/s para km/h
  const windKmh = windSpeed * 3.6;

  if (windKmh < 20) return 'calm';
  if (windKmh < 35) return 'moderate';
  return 'rough';
};

/**
 * Gera recomendação para passeios baseado nas condições
 */
const getRecommendation = (
  rainChance: number,
  windSpeed: number,
  seaCondition: string
): 'ideal' | 'attention' | 'not_recommended' => {
  const windKmh = windSpeed * 3.6;

  // Não recomendado
  if (rainChance > 50 || windKmh > 35 || seaCondition === 'rough') {
    return 'not_recommended';
  }

  // Atenção
  if (rainChance > 20 || windKmh > 20 || seaCondition === 'moderate') {
    return 'attention';
  }

  // Ideal
  return 'ideal';
};

/**
 * Busca previsão do tempo para os próximos 7 dias
 */
export const fetchWeatherForecast = async (): Promise<WeatherData[]> => {
  try {
    // Se não tiver API key, retorna dados mockados
    if (!API_KEY || API_KEY === 'demo_key') {
      console.warn('⚠️ OpenWeather API key não configurada. Usando dados mockados.');
      const { mockWeather } = await import('@/data/mockWeather');
      return mockWeather;
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${API_KEY}&units=metric&lang=pt_br`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status}`);
    }

    const data: OpenWeatherResponse = await response.json();

    // Agrupar previsões por dia (pega a do meio-dia de cada dia)
    const dailyForecasts = new Map<string, WeatherData>();

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const hour = date.getHours();

      // Pega a previsão do meio-dia (12h) de cada dia
      if (hour === 12 && !dailyForecasts.has(dateStr)) {
        const windSpeed = item.wind.speed;
        const seaCondition = getSeaCondition(windSpeed);
        const rainChance = Math.round(item.pop * 100);

        dailyForecasts.set(dateStr, {
          date: dateStr,
          condition: mapWeatherCondition(item.weather[0].main),
          icon: getWeatherIcon(item.weather[0].main),
          tempMax: Math.round(item.main.temp_max),
          tempMin: Math.round(item.main.temp_min),
          rainChance,
          windSpeed: Math.round(windSpeed * 3.6), // Converte m/s para km/h
          windDirection: getWindDirection(item.wind.deg),
          seaCondition,
          recommendation: getRecommendation(rainChance, windSpeed, seaCondition),
        });
      }
    });

    const forecasts = Array.from(dailyForecasts.values()).slice(0, 7);

    // Se não conseguiu pegar 7 dias, completa com mock
    if (forecasts.length < 7) {
      console.warn('⚠️ Não conseguiu obter 7 dias de previsão. Complementando com mock.');
      const { mockWeather } = await import('@/data/mockWeather');
      return mockWeather;
    }

    return forecasts;
  } catch (error) {
    console.error('❌ Erro ao buscar previsão do tempo:', error);

    // Fallback para dados mockados em caso de erro
    const { mockWeather } = await import('@/data/mockWeather');
    return mockWeather;
  }
};

/**
 * Busca a previsão atual (hoje)
 */
export const fetchCurrentWeather = async (): Promise<WeatherData | null> => {
  try {
    const forecast = await fetchWeatherForecast();
    return forecast[0] || null;
  } catch (error) {
    console.error('❌ Erro ao buscar clima atual:', error);
    return null;
  }
};
