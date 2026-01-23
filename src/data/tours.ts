import { Tour, PacoteChurrasco } from '@/types';

export const tours: Tour[] = [
  {
    id: '1',
    name: 'Areia Vermelha + Pôr do Sol do Jacaré',
    slug: 'areia-vermelha-por-do-sol-jacare',
    description: 'Embarque no Jacaré e navegue até a famosa Areia Vermelha, uma ilha de areia avermelhada que surge do mar na maré baixa. Nade em águas cristalinas, com possibilidade de avistar golfinhos. Finalize o dia assistindo ao espetacular pôr do sol ao som do saxofone de Jurandir, tradição única no mundo.',
    duration: null, // Flexível - depende da maré
    price: 2199, // Valor único do barco (até 7 pessoas)
    maxPeople: 7,
    image: '/areia03.jpg',
    includes: [
      'Capitão experiente certificado pela Marinha',
      'Combustível',
      'Coletes salva-vidas',
      'Caixa de som JBL',
      'Cooler com gelo',
      'Possibilidade de avistar golfinhos'
    ],
    highlights: [
      'Saída do Jacaré',
      'Parada na Areia Vermelha',
      'Pôr do sol ao som de Jurandir do Sax'
    ],
    departureTime: 'Flexível (combinado conforme maré)',
    requiresLowTide: true,
    hasLiveMusic: true,
    bestFor: ['Famílias', 'Grupos', 'Casais', 'Fotos', 'Experiência Completa'],
    isActive: true
  }
];

// Kit Tranquilidade Opcional
export const kitTranquilidade: PacoteChurrasco = {
  id: 'kit-tranquilidade',
  name: 'Kit Tranquilidade',
  price: 300,
  items: [
    { name: 'Churrasco Completo', value: 120 },
    { name: '12 Cervejas', value: 60 },
    { name: 'Refrigerantes', value: 20 },
    { name: 'Águas', value: 10 },
    { name: 'Petiscos', value: 40 },
    { name: 'Gelo e Carvão', value: 50 }
  ]
};

// Alias para compatibilidade
export const pacoteChurrasco = kitTranquilidade;
