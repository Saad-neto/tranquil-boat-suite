import { useQuery } from '@tanstack/react-query';
import { fetchWeatherForecast } from '@/services/weatherService';
import { WeatherData } from '@/types';

/**
 * Hook para buscar previsão do tempo
 * Usa React Query para cache e refetch automático
 */
export const useWeather = () => {
  return useQuery<WeatherData[], Error>({
    queryKey: ['weather-forecast'],
    queryFn: fetchWeatherForecast,
    staleTime: 1000 * 60 * 30, // 30 minutos
    gcTime: 1000 * 60 * 60, // 1 hora (anteriormente cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

/**
 * Hook para buscar apenas o clima de hoje
 */
export const useCurrentWeather = () => {
  const { data, isLoading, error } = useWeather();

  return {
    data: data?.[0] || null,
    isLoading,
    error,
  };
};
