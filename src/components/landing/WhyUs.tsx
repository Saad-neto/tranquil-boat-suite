import { Star, Anchor, CheckCircle2, MessageCircle } from 'lucide-react';

const features = [
  {
    icon: Star,
    title: 'Experiências Únicas',
    description: 'Areia Vermelha e Bolero ao vivo só em João Pessoa'
  },
  {
    icon: Anchor,
    title: 'Capitão Experiente',
    description: 'Segurança total e conhecimento local privilegiado'
  },
  {
    icon: CheckCircle2,
    title: 'Tudo Incluso',
    description: 'Sem custos escondidos, transparência total'
  },
  {
    icon: MessageCircle,
    title: 'Atendimento Personalizado',
    description: 'Cada grupo é único e especial para nós'
  }
];

const WhyUs = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Por que Tranquilidade?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Compromisso com excelência e experiências memoráveis
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center space-y-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-white">{feature.title}</h3>
                <p className="text-white/90">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
