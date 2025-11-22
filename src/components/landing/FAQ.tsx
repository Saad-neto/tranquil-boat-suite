import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O que é a Areia Vermelha?",
    answer: "Banco de areia que surge durante a maré baixa, criando uma 'ilha' no meio do mar com água rasa e morna. É uma formação geológica única com tonalidade avermelhada característica."
  },
  {
    question: "Quando posso ir para Areia Vermelha?",
    answer: "Apenas durante a maré baixa. Consulte nossa tábua de marés ou fale conosco pelo WhatsApp para verificar a disponibilidade nas datas desejadas."
  },
  {
    question: "O que é o Pôr do Sol no Jacaré?",
    answer: "É um passeio pelo Rio Paraíba onde um saxofonista toca Bolero de Ravel ao vivo durante o pôr do sol. Jacarés aparecem nas margens atraídos pela música! É uma experiência única no mundo."
  },
  {
    question: "Os jacarés são perigosos?",
    answer: "Não! Mantemos distância segura. Eles ficam na margem do rio e é totalmente seguro observá-los da lancha. Nosso capitão experiente garante a segurança de todos."
  },
  {
    question: "Quantas pessoas cabem na lancha?",
    answer: "Nossos passeios comportam até 10 pessoas, dependendo da embarcação escolhida. Entre em contato para grupos maiores."
  },
  {
    question: "Preciso levar algo?",
    answer: "Recomendamos levar protetor solar, roupa de banho, toalha, câmera/celular e bom humor! Nós fornecemos todo o resto: cooler com gelo, bebidas, petiscos e coletes salva-vidas."
  },
  {
    question: "E se chover no dia do passeio?",
    answer: "Monitoramos a previsão do tempo constantemente. Em caso de condições climáticas adversas, remarcamos o passeio sem nenhum custo adicional para garantir sua segurança e conforto."
  },
  {
    question: "Como faço para agendar um passeio?",
    answer: "É muito simples! Fale conosco pelo WhatsApp através do botão flutuante no canto da tela ou clique em 'Agendar Agora' em qualquer um dos passeios. Responderemos rapidamente!"
  }
];

const FAQ = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-block mb-4">
            <span className="text-4xl">❓</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-muted-foreground">
            Tudo que você precisa saber sobre nossos passeios
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background border rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left font-semibold hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
