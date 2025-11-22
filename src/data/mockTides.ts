import { TideData } from '@/types';

export const mockTides: TideData[] = [
  {
    date: '2024-11-25',
    tides: [
      { time: '08:30', height: 0.2, type: 'low', quality: 'ideal' },
      { time: '14:45', height: 1.8, type: 'high', quality: 'bad' },
      { time: '20:15', height: 0.4, type: 'low', quality: 'good' }
    ]
  },
  {
    date: '2024-11-26',
    tides: [
      { time: '09:15', height: 0.3, type: 'low', quality: 'good' },
      { time: '15:30', height: 1.9, type: 'high', quality: 'bad' },
      { time: '21:00', height: 0.5, type: 'low', quality: 'regular' }
    ]
  },
  {
    date: '2024-11-27',
    tides: [
      { time: '10:00', height: 0.5, type: 'low', quality: 'regular' },
      { time: '16:15', height: 2.0, type: 'high', quality: 'bad' },
      { time: '21:45', height: 0.6, type: 'low', quality: 'regular' }
    ]
  },
  {
    date: '2024-11-28',
    tides: [
      { time: '07:45', height: 0.2, type: 'low', quality: 'ideal' },
      { time: '14:00', height: 1.7, type: 'high', quality: 'bad' },
      { time: '19:30', height: 0.3, type: 'low', quality: 'good' }
    ]
  },
  {
    date: '2024-11-29',
    tides: [
      { time: '08:15', height: 0.3, type: 'low', quality: 'good' },
      { time: '14:45', height: 1.8, type: 'high', quality: 'bad' },
      { time: '20:15', height: 0.4, type: 'low', quality: 'good' }
    ]
  },
  {
    date: '2024-11-30',
    tides: [
      { time: '09:00', height: 0.4, type: 'low', quality: 'good' },
      { time: '15:30', height: 1.9, type: 'high', quality: 'bad' },
      { time: '21:00', height: 0.5, type: 'low', quality: 'regular' }
    ]
  },
  {
    date: '2024-12-01',
    tides: [
      { time: '09:45', height: 0.6, type: 'low', quality: 'regular' },
      { time: '16:15', height: 2.0, type: 'high', quality: 'bad' },
      { time: '21:45', height: 0.7, type: 'low', quality: 'bad' }
    ]
  }
];
