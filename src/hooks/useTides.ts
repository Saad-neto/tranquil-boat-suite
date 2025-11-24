import { useQuery } from '@tanstack/react-query';
import { fetchTides, fetchIdealTides, fetchNextIdealTides, checkTideForDate } from '@/services/tideService';
import { TideData } from '@/types';

/**
 * Hook para buscar tábua de marés completa
 */
export const useTides = (days: number = 30) => {
  return useQuery<TideData[], Error>({
    queryKey: ['tides', days],
    queryFn: () => fetchTides(days),
    staleTime: 1000 * 60 * 60 * 24, // 24 horas (marés não mudam rapidamente)
    gcTime: 1000 * 60 * 60 * 48, // 48 horas
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para buscar apenas dias com marés ideais
 */
export const useIdealTides = (days: number = 30) => {
  return useQuery<TideData[], Error>({
    queryKey: ['ideal-tides', days],
    queryFn: () => fetchIdealTides(days),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 48,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para buscar próximas N marés ideais (para widget)
 */
export const useNextIdealTides = (count: number = 5) => {
  return useQuery({
    queryKey: ['next-ideal-tides', count],
    queryFn: () => fetchNextIdealTides(count),
    staleTime: 1000 * 60 * 60 * 12, // 12 horas
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para verificar maré de uma data específica
 */
export const useTideForDate = (date: string) => {
  return useQuery({
    queryKey: ['tide-check', date],
    queryFn: () => checkTideForDate(date),
    enabled: !!date, // Só executa se tiver data
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 48,
  });
};
