import { CreditCard, QrCode, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentMethod } from '@/types/checkout';
import { cn } from '@/lib/utils';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  onContinue: () => void;
}

const paymentMethods = [
  {
    id: 'PIX' as PaymentMethod,
    name: 'PIX',
    icon: QrCode,
    description: 'Pagamento instantâneo',
    benefits: [
      'Aprovação imediata',
      'Confirmação em segundos',
      'Seguro e prático',
    ],
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'CREDIT_CARD' as PaymentMethod,
    name: 'Cartão de Crédito',
    icon: CreditCard,
    description: 'Parcele em até 12x',
    benefits: [
      'Parcele em 12x',
      'Todas as bandeiras',
      'Processamento seguro',
    ],
    color: 'from-blue-500 to-indigo-600',
  },
];

export function PaymentMethodSelector({
  selectedMethod,
  onSelect,
  onContinue,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Escolha a Forma de Pagamento</h2>
        <p className="text-muted-foreground mt-2">
          Selecione como você deseja pagar pela sua reserva
        </p>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <Card
              key={method.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-lg',
                isSelected && 'ring-2 ring-primary shadow-lg'
              )}
              onClick={() => onSelect(method.id)}
            >
              <CardContent className="pt-6 relative">
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Icon with gradient background */}
                <div className={cn(
                  'w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4',
                  method.color
                )}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Method info */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{method.name}</h3>
                  <p className="text-sm text-muted-foreground">{method.description}</p>

                  {/* Benefits */}
                  <ul className="space-y-1 pt-2">
                    {method.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Continue Button */}
      <Button
        onClick={onContinue}
        disabled={!selectedMethod}
        size="lg"
        className="w-full"
      >
        {selectedMethod
          ? `Continuar com ${paymentMethods.find(m => m.id === selectedMethod)?.name}`
          : 'Selecione um método de pagamento'}
      </Button>

      {/* Security Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 text-center">
          🔒 Pagamento 100% seguro. Seus dados são protegidos com criptografia SSL.
        </p>
      </div>
    </div>
  );
}
