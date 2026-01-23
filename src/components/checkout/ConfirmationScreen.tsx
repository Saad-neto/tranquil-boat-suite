import { CheckCircle, MessageCircle, Home, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentMethod } from '@/types/checkout';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConfirmationScreenProps {
  bookingNumber: string;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  customerName: string;
  tourDate?: Date;
}

export function ConfirmationScreen({
  bookingNumber,
  paymentMethod,
  paymentStatus,
  customerName,
  tourDate,
}: ConfirmationScreenProps) {
  const navigate = useNavigate();

  const getPaymentStatusInfo = () => {
    if (paymentMethod === 'PIX') {
      return {
        title: 'Reserva Criada!',
        description: 'Aguardando confirmação do pagamento PIX',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        instructions: [
          'Escaneie o QR Code PIX exibido acima',
          'Ou copie e cole o código no seu app bancário',
          'O pagamento é confirmado em segundos',
          'Você receberá uma confirmação assim que o pagamento for detectado',
        ],
      };
    } else if (paymentMethod === 'CREDIT_CARD') {
      if (paymentStatus === 'CONFIRMED' || paymentStatus === 'RECEIVED') {
        return {
          title: 'Reserva Confirmada!',
          description: 'Pagamento aprovado com sucesso',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          instructions: [
            'Seu pagamento foi processado com sucesso',
            'Sua reserva está confirmada',
            'Você receberá um email de confirmação',
            'Prepare-se para uma experiência incrível!',
          ],
        };
      } else {
        return {
          title: 'Pagamento em Análise',
          description: 'Aguardando aprovação do processador',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          instructions: [
            'Seu pagamento está sendo processado',
            'A confirmação pode levar alguns minutos',
            'Você receberá um email assim que for aprovado',
            'Em caso de dúvidas, entre em contato conosco',
          ],
        };
      }
    }

    return {
      title: 'Reserva Criada!',
      description: 'Aguardando confirmação do pagamento',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      instructions: [],
    };
  };

  const statusInfo = getPaymentStatusInfo();

  const handleWhatsAppConfirmation = () => {
    const whatsappNumber = '5583999999999'; // SUBSTITUIR pelo número real
    const message = `Olá! Gostaria de confirmar minha reserva:\n\n` +
      `📋 *Número da Reserva:* ${bookingNumber}\n` +
      `👤 *Nome:* ${customerName}\n` +
      `💳 *Método de Pagamento:* ${paymentMethod === 'PIX' ? 'PIX' : 'Cartão de Crédito'}\n` +
      (tourDate ? `📅 *Data:* ${format(tourDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}\n\n` : '\n') +
      `Aguardo confirmação. Obrigado!`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Success Animation */}
      <div className="flex flex-col items-center space-y-4 py-8">
        <div className={`w-24 h-24 rounded-full ${statusInfo.bgColor} flex items-center justify-center animate-scale-in`}>
          <CheckCircle className={`w-12 h-12 ${statusInfo.color}`} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">{statusInfo.title}</h2>
          <p className="text-lg text-muted-foreground">{statusInfo.description}</p>
        </div>
      </div>

      {/* Booking Details Card */}
      <Card className="border-2 border-primary/20">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col items-center space-y-2 pb-4 border-b">
            <p className="text-sm text-muted-foreground">Número da Reserva</p>
            <p className="text-3xl font-bold text-primary">{bookingNumber}</p>
            <Badge className={statusInfo.bgColor + ' ' + statusInfo.color}>
              {paymentMethod === 'PIX' ? 'Aguardando PIX' :
               paymentStatus === 'CONFIRMED' ? 'Pagamento Confirmado' : 'Em Processamento'}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cliente:</span>
              <span className="font-medium">{customerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Método de Pagamento:</span>
              <span className="font-medium">
                {paymentMethod === 'PIX' ? 'PIX' : 'Cartão de Crédito'}
              </span>
            </div>
            {tourDate && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data do Passeio:</span>
                <span className="font-medium">
                  {format(tourDate, "dd 'de' MMMM", { locale: ptBR })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Próximos Passos
          </h3>
          <ol className="space-y-2">
            {statusInfo.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </span>
                <span className="pt-0.5">{instruction}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleWhatsAppConfirmation}
          className="w-full"
          size="lg"
          variant="default"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Confirmar via WhatsApp
        </Button>
        <Button
          onClick={() => navigate('/')}
          className="w-full"
          size="lg"
          variant="outline"
        >
          <Home className="w-5 h-5 mr-2" />
          Voltar para Home
        </Button>
      </div>

      {/* Support Note */}
      <div className="bg-muted/50 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Em caso de dúvidas, entre em contato conosco pelo WhatsApp ou email.
          <br />
          Estamos sempre à disposição para ajudar!
        </p>
      </div>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
