import { Anchor, Heart, Shield, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AboutUs = () => {
  const values = [
    {
      icon: Shield,
      title: 'Segurança em Primeiro Lugar',
      description: 'Equipamentos certificados, capitães experientes e protocolos rigorosos para sua tranquilidade.',
    },
    {
      icon: Heart,
      title: 'Paixão pelo Mar',
      description: 'Amamos o que fazemos e queremos compartilhar a beleza de João Pessoa com você.',
    },
    {
      icon: Users,
      title: 'Atendimento Personalizado',
      description: 'Cada cliente é único. Adaptamos nossos passeios para criar experiências inesquecíveis.',
    },
    {
      icon: Anchor,
      title: 'Compromisso com a Qualidade',
      description: 'Mantemos nossos barcos em perfeito estado e oferecemos o melhor serviço da região.',
    },
  ];

  return (
    <section id="sobre" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-block mb-4">
            <span className="text-4xl">⚓</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Sobre Nós
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Navegando pelos mares paraibanos há mais de 5 anos
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Story */}
          <div className="animate-fade-up">
            <h3 className="text-3xl font-bold mb-6 text-foreground">
              Nossa História
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                A <span className="text-primary font-semibold">Tranquilidade Boat</span> nasceu do sonho de compartilhar as belezas naturais de João Pessoa com pessoas de todo o Brasil e do mundo.
              </p>
              <p className="text-lg leading-relaxed">
                Começamos em 2019 com uma única lancha e o compromisso de oferecer experiências únicas e seguras. Hoje, somos referência em passeios náuticos na Paraíba, reconhecidos pela qualidade do serviço e pela paixão que colocamos em cada viagem.
              </p>
              <p className="text-lg leading-relaxed">
                Nossa equipe é formada por capitães experientes que conhecem cada detalhe da costa paraibana. Eles garantem não só sua segurança, mas também compartilham histórias, curiosidades e os melhores pontos para fotos inesquecíveis.
              </p>
              <p className="text-lg leading-relaxed">
                Mais de <span className="text-primary font-semibold">500 clientes satisfeitos</span> já navegaram conosco e levaram consigo memórias que durarão para sempre. Venha fazer parte da nossa história!
              </p>
            </div>
          </div>

          {/* Image Placeholder - You can replace with actual image */}
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80"
                alt="Tranquilidade Boat"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h4 className="text-2xl font-bold mb-2">5 Anos de Tradição</h4>
                <p className="text-lg">Levando felicidade aos mares paraibanos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
            Nossos Valores
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold text-lg mb-3">
                      {value.title}
                    </h4>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Team / Captain Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold mb-6 text-foreground">
            Equipe Experiente
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Nossos capitães possuem certificação da Marinha do Brasil, dezenas de horas de navegação e conhecimento profundo da região. Sua segurança e diversão são nossa prioridade.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">
              Certificados pela Marinha do Brasil
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
