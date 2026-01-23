import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ReactNode } from "react";

interface FAQ {
  question: string;
  answer: ReactNode;
}

const faqs: FAQ[] = [
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
    answer: "É um passeio pelo Rio Paraíba onde Jurandir do Sax toca Bolero de Ravel ao vivo durante o pôr do sol. É uma experiência única no mundo que levamos você para assistir!"
  },
  {
    question: "É possível ver golfinhos durante o passeio?",
    answer: "Sim! Atualmente está muito comum o avistamento de golfinhos na região do Porto de Cabedelo, especialmente no encontro do rio com o mar. Eles aparecem com frequência durante nossos passeios e é uma experiência incrível!"
  },
  {
    question: "Preciso levar algo?",
    answer: "Recomendamos levar protetor solar, roupa de banho, toalha e câmera/celular. Fornecemos cooler com gelo e coletes salva-vidas. Opcionalmente, oferecemos o Kit Tranquilidade (R$ 400) com bebidas e carnes - na compra de 2 kits, você ganha 10% de desconto!"
  },
  {
    question: "Qual a política de reembolso?",
    answer: "Em caso de condições climáticas adversas (chuva, ventos fortes ou mar agitado), você tem direito ao reembolso integral do valor pago ou pode remarcar para outra data sem custo adicional. Sua segurança é nossa prioridade!"
  },
  {
    question: "Onde é o ponto de encontro?",
    answer: (
      <>
        Nos encontramos na Marina Big Toys, na Praia do Jacaré, Cabedelo - PB.{" "}
        <a
          href="https://maps.app.goo.gl/aWazzhfSrgz6QxEs7"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Ver localização no Google Maps →
        </a>
      </>
    )
  },
  {
    question: "Como faço para reservar?",
    answer: "Clique em 'Reservar Agora'. Aceitamos pagamento em até 12x no cartão. Após a confirmação, você receberá todos os detalhes por WhatsApp. Qualquer dúvida é só chamar no WhatsApp!"
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12 animate-fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Tudo que você precisa saber sobre nosso passeio
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
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
