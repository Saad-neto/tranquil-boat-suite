import { Tour } from '@/types';

export const tours: Tour[] = [
  {
    id: '1',
    name: 'Areia Vermelha + Pôr do Sol no Jacaré',
    slug: 'areia-vermelha-por-do-sol',
    description: 'Banco de areia que emerge na maré baixa criando uma "ilha" no meio do mar, seguido do famoso pôr do sol com Bolero de Ravel ao vivo no Rio Paraíba onde jacarés aparecem ao som da música.',
    duration: 360, // 6 horas
    price: 2899,
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80',
    includes: [
      'Capitão experiente',
      'Combustível',
      'Cooler com gelo',
      'Espumante',
      'Petiscos',
      'Colete salva-vidas',
      'Seguro'
    ],
    requiresLowTide: true,
    hasLiveMusic: true,
    bestFor: ['Casais', 'Grupos', 'Experiência Completa'],
    isActive: true
  },
  {
    id: '2',
    name: 'Pôr do Sol no Jacaré',
    slug: 'por-do-sol-jacare',
    description: 'Experiência mágica e única: navegue pelo Rio Paraíba até o famoso ponto onde um saxofonista toca Bolero de Ravel ao vivo durante o pôr do sol, enquanto jacarés saem das margens atraídos pelo som da música. Experiência única no mundo!',
    duration: 150, // 2.5 horas
    price: 1399,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    includes: [
      'Capitão experiente',
      'Combustível',
      'Espumante ou refrigerante',
      'Petiscos gourmet',
      'Colete salva-vidas',
      'Seguro'
    ],
    requiresLowTide: false,
    hasLiveMusic: true,
    departureTime: '16:30',
    bestFor: ['Casais', 'Romântico', 'Pedido de Casamento'],
    isActive: true
  },
  {
    id: '3',
    name: 'Areia Vermelha',
    slug: 'areia-vermelha',
    description: 'Banco de areia com formação geológica única e tonalidade avermelhada característica. Emerge durante a maré baixa criando uma "ilha" no meio do mar com águas rasas e mornas. Perfeito para famílias e fotos incríveis!',
    duration: 180, // 3 horas
    price: 1699,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
    includes: [
      'Capitão experiente',
      'Combustível',
      'Cooler com gelo',
      'Colete salva-vidas',
      'Seguro'
    ],
    requiresLowTide: true,
    hasLiveMusic: false,
    bestFor: ['Famílias', 'Grupos', 'Fotos'],
    isActive: true
  }
];
