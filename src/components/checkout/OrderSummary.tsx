import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Users, UtensilsCrossed, Percent, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BookingData } from '@/types/checkout';
import { formatCurrency } from '@/services/bookingService';

interface OrderSummaryProps {
  bookingData: BookingData;
  onContinue: () => void;
  onBack: () => void;
}

export function OrderSummary({ bookingData, onContinue, onBack }: OrderSummaryProps) {
  const {
    customerName,
    customerEmail,
    customerPhone,
    date,
    numberOfPeople,
    notes,
    tourName,
    basePrice,
    kitQuantity,
    kitUnitPrice,
    kitDiscount,
    totalPrice,
  } = bookingData;

  const kitSubtotal = kitQuantity * kitUnitPrice;
  const installmentPrice = (totalPrice * 1.15 / 12).toFixed(2).replace('.', ',');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Revise sua Reserva</h2>
        <p className="text-muted-foreground mt-2">
          Confira os detalhes antes de prosseguir para o pagamento
        </p>
      </div>

      {/* Customer Info Card */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Dados do Cliente</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nome:</span>
              <span className="font-medium">{customerName}</span>
            </div>
            {customerEmail && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{customerEmail}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Telefone:</span>
              <span className="font-medium">{customerPhone}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tour Details Card */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Detalhes do Passeio</h3>
          <div className="space-y-4">
            {/* Tour name with image */}
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{tourName}</h4>
                <p className="text-sm text-muted-foreground">
                  {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                {numberOfPeople && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Users className="w-3 h-3" />
                    <span>{numberOfPeople} pessoa{numberOfPeople > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Kit info */}
            {kitQuantity > 0 && (
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <UtensilsCrossed className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">Kit Tranquilidade</span>
                    <span className="text-sm text-muted-foreground">({kitQuantity}x)</span>
                    {kitDiscount > 0 && (
                      <Badge className="bg-success text-success-foreground gap-1">
                        <Percent className="w-3 h-3" />
                        10% OFF
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Churrasco, bebidas e petiscos inclusos
                  </p>
                </div>
              </div>
            )}

            {/* Notes */}
            {notes && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Observações:</p>
                <p className="text-sm text-blue-700">{notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Price Summary Card */}
      <Card className="border-2 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Resumo do Valor</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Passeio {tourName}</span>
              <span className="font-medium">{formatCurrency(basePrice)}</span>
            </div>
            {kitQuantity > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span>Kit Tranquilidade ({kitQuantity}x)</span>
                  <span className="font-medium">{formatCurrency(kitSubtotal)}</span>
                </div>
                {kitDiscount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Desconto (10%)</span>
                    <span className="font-medium">- {formatCurrency(kitDiscount)}</span>
                  </div>
                )}
              </>
            )}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-bold text-lg mb-1">
                <span>Total</span>
                <span className="text-accent text-2xl">{formatCurrency(totalPrice)}</span>
              </div>
              <p className="text-sm text-muted-foreground text-right">
                ou 12x de R$ {installmentPrice}*
              </p>
              <p className="text-xs text-muted-foreground text-right mt-1">
                *Com juros de 15% ao ano no cartão
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para editar
        </Button>
        <Button
          onClick={onContinue}
          className="flex-1"
          size="lg"
        >
          Continuar para Pagamento
        </Button>
      </div>
    </div>
  );
}
