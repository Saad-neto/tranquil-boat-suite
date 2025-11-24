export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  tourName: string;
  avatar?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria Silva',
    location: 'São Paulo, SP',
    rating: 5,
    date: '2024-10-15',
    comment: 'Experiência incrível! O passeio para Areia Vermelha superou todas as expectativas. A formação geológica avermelhada é única! A equipe é super atenciosa e profissional. O capitão conhece cada detalhe da região. Voltaremos com certeza!',
    tourName: 'Areia Vermelha + Pôr do Sol',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
  },
  {
    id: '2',
    name: 'João Pedro Costa',
    location: 'Recife, PE',
    rating: 5,
    date: '2024-11-05',
    comment: 'O pôr do sol ao som do saxofone de Jurandy foi MÁGICO! O Bolero de Ravel tocado ao vivo enquanto o sol se põe no Rio Paraíba é uma experiência única no mundo. Perfeito para um pedido de casamento. Minha noiva amou!',
    tourName: 'Rio Paraíba + Pôr do Sol',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao'
  },
  {
    id: '3',
    name: 'Ana Carolina Rocha',
    location: 'Brasília, DF',
    rating: 5,
    date: '2024-09-20',
    comment: 'Passeio perfeito para família! As crianças adoraram a Areia Vermelha. Águas calmas, rasas e cristalinas nas piscinas naturais, perfeito para os pequenos brincarem com segurança. O capitão foi muito atencioso!',
    tourName: 'Areia Vermelha + Pôr do Sol',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana'
  },
  {
    id: '4',
    name: 'Carlos Eduardo Mendes',
    location: 'João Pessoa, PB',
    rating: 5,
    date: '2024-11-10',
    comment: 'Sou de João Pessoa e já fiz esse passeio com várias empresas. A Tranquilidade Boat é de longe a melhor! Lancha impecável, equipamentos de segurança novos, e o atendimento diferenciado. Recomendo!',
    tourName: 'Areia Vermelha + Pôr do Sol',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'
  },
  {
    id: '5',
    name: 'Beatriz Almeida',
    location: 'Fortaleza, CE',
    rating: 5,
    date: '2024-10-28',
    comment: 'Fizemos o passeio pelo Rio Paraíba e foi maravilhoso! A navegação tranquila, o pôr do sol com Jurandy tocando o saxofone... simplesmente perfeito! Uma experiência cultural e romântica. Vale cada centavo!',
    tourName: 'Rio Paraíba + Pôr do Sol',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Beatriz'
  },
  {
    id: '6',
    name: 'Rafael Santos',
    location: 'Salvador, BA',
    rating: 5,
    date: '2024-11-01',
    comment: 'Atendimento impecável desde o primeiro contato pelo WhatsApp. Pontualidade, profissionalismo e uma experiência inesquecível. Fotos incríveis da Areia Vermelha para guardar de lembrança!',
    tourName: 'Areia Vermelha + Pôr do Sol',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael'
  }
];
