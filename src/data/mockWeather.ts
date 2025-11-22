import { WeatherData } from '@/types';

export const mockWeather: WeatherData[] = [
  {
    date: '2024-11-25',
    condition: 'sunny',
    icon: '☀️',
    tempMax: 32,
    tempMin: 24,
    rainChance: 10,
    windSpeed: 15,
    windDirection: 'NE',
    seaCondition: 'calm',
    recommendation: 'ideal'
  },
  {
    date: '2024-11-26',
    condition: 'partly_cloudy',
    icon: '⛅',
    tempMax: 30,
    tempMin: 23,
    rainChance: 20,
    windSpeed: 18,
    windDirection: 'E',
    seaCondition: 'calm',
    recommendation: 'ideal'
  },
  {
    date: '2024-11-27',
    condition: 'sunny',
    icon: '☀️',
    tempMax: 31,
    tempMin: 24,
    rainChance: 5,
    windSpeed: 12,
    windDirection: 'NE',
    seaCondition: 'calm',
    recommendation: 'ideal'
  },
  {
    date: '2024-11-28',
    condition: 'partly_cloudy',
    icon: '🌤️',
    tempMax: 29,
    tempMin: 22,
    rainChance: 30,
    windSpeed: 22,
    windDirection: 'E',
    seaCondition: 'moderate',
    recommendation: 'attention'
  },
  {
    date: '2024-11-29',
    condition: 'sunny',
    icon: '☀️',
    tempMax: 32,
    tempMin: 25,
    rainChance: 10,
    windSpeed: 14,
    windDirection: 'NE',
    seaCondition: 'calm',
    recommendation: 'ideal'
  },
  {
    date: '2024-11-30',
    condition: 'partly_cloudy',
    icon: '⛅',
    tempMax: 31,
    tempMin: 24,
    rainChance: 15,
    windSpeed: 16,
    windDirection: 'NE',
    seaCondition: 'calm',
    recommendation: 'ideal'
  },
  {
    date: '2024-12-01',
    condition: 'cloudy',
    icon: '☁️',
    tempMax: 28,
    tempMin: 22,
    rainChance: 45,
    windSpeed: 25,
    windDirection: 'SE',
    seaCondition: 'moderate',
    recommendation: 'attention'
  }
];
