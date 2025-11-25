import { Tour } from '@/types';

export const tours: Tour[] = [
  {
    id: '1',
    name: 'Areia Vermelha + Pôr do Sol',
    slug: 'areia-vermelha-por-do-sol',
    description: 'Visite o famoso banco de areia com formação geológica única e tonalidade avermelhada que emerge na maré baixa, criando uma "ilha" no meio do mar com águas cristalinas e piscinas naturais. Termine o dia contemplando o espetacular pôr do sol paraibano.',
    duration: 360, // 6 horas
    price: 1699,
    image: '/areia03.jpg',
    includes: [
      'Capitão experiente certificado',
      'Combustível',
      'Colete salva-vidas'
    ],
    requiresLowTide: true,
    hasLiveMusic: false,
    bestFor: ['Famílias', 'Grupos', 'Casais', 'Fotos'],
    isActive: true
  },
  {
    id: '2',
    name: 'Rio Paraíba + Pôr do Sol',
    slug: 'rio-paraiba-por-do-sol',
    description: 'Navegue pelas águas tranquilas do Rio Paraíba descobrindo a beleza natural da região. Termine com o famoso pôr do sol da Praia do Jacaré ao som do saxofone de Jurandy, que há mais de 20 anos toca Bolero de Ravel em um espetáculo único no mundo! Experiência inesquecível!',
    duration: 240, // 4 horas
    price: 1699,
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1920&q=80',
    includes: [
      'Capitão experiente certificado',
      'Combustível',
      'Colete salva-vidas'
    ],
    requiresLowTide: false,
    hasLiveMusic: true,
    departureTime: '15:00',
    bestFor: ['Casais', 'Romântico', 'Contemplação', 'Experiência Cultural'],
    isActive: true
  }
];
