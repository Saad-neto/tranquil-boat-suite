import { MapPin, MessageCircle, CheckCircle2, Anchor } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: MapPin,
    title: 'Escolha o Passeio',
    description: 'Areia Vermelha, Pôr do Sol ou Dia Completo'
  },
  {
    number: 2,
    icon: MessageCircle,
    title: 'Entre em Contato',
    description: 'WhatsApp direto - resposta rápida'
  },
  {
    number: 3,
    icon: CheckCircle2,
    title: 'Confirmamos Disponibilidade',
    description: 'Verificamos maré, clima e horário'
  },
  {
    number: 4,
    icon: Anchor,
    title: 'Aproveite!',
    description: 'Experiência única em João Pessoa'
  }
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Como Funciona
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Quatro passos simples para sua experiência perfeita
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          {/* Desktop - Horizontal */}
          <div className="hidden md:flex items-start justify-between relative">
            {/* Connecting Line */}
            <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" 
                 style={{ width: 'calc(100% - 128px)', marginLeft: '64px' }}>
            </div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center relative z-10"
                  style={{ width: '200px' }}
                >
                  {/* Icon Circle */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-xl hover:scale-110 transition-transform duration-300">
                    <Icon className="w-14 h-14 text-white" />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <div className="inline-block bg-accent text-accent-foreground px-4 py-1 rounded-full font-bold mb-3">
                      {step.number}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile - Vertical */}
          <div className="md:hidden space-y-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex gap-6 items-start">
                  {/* Icon Circle */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <div className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full font-bold text-sm mb-2">
                      Passo {step.number}
                    </div>
                    <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
