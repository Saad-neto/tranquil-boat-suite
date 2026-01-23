import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import {
  createCreditCardPayment,
  formatCurrency,
  formatCPFCNPJ,
  validateCPFCNPJ,
  Payment,
} from '@/services/paymentService';

interface CheckoutCardPaymentProps {
  bookingId: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  totalAmount: number;
  onPaymentCreated: (payment: Payment, success: boolean) => void;
}

interface FormData {
  cpfCnpj: string;
  name: string;
  email: string;
  phone: string;
  postalCode: string;
  addressNumber: string;
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
  installments: string;
}

export function CheckoutCardPayment({
  bookingId,
  bookingNumber,
  customerName,
  customerPhone,
  customerEmail,
  totalAmount,
  onPaymentCreated,
}: CheckoutCardPaymentProps) {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    payment?: Payment;
    message?: string;
  } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    cpfCnpj: '',
    name: customerName,
    email: customerEmail || '',
    phone: customerPhone,
    postalCode: '',
    addressNumber: '',
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: new Date().getFullYear().toString(),
    ccv: '',
    installments: '1',
  });

  const handleChange = (field: keyof FormData, value: string) => {
    let processedValue = value;

    switch (field) {
      case 'cpfCnpj':
        processedValue = value.replace(/\D/g, '');
        if (processedValue.length <= 14) {
          processedValue = formatCPFCNPJ(processedValue);
        } else {
          return;
        }
        break;
      case 'phone':
        processedValue = value.replace(/\D/g, '');
        if (processedValue.length <= 11) {
          processedValue = processedValue.replace(
            /(\d{2})(\d{5})(\d{4})/,
            '($1) $2-$3'
          );
        } else {
          return;
        }
        break;
      case 'postalCode':
        processedValue = value.replace(/\D/g, '');
        if (processedValue.length <= 8) {
          processedValue = processedValue.replace(/(\d{5})(\d{3})/, '$1-$2');
        } else {
          return;
        }
        break;
      case 'cardNumber':
        processedValue = value.replace(/\D/g, '');
        if (processedValue.length <= 16) {
          processedValue = processedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
        } else {
          return;
        }
        break;
      case 'expiryMonth':
        processedValue = value.replace(/\D/g, '');
        if (parseInt(processedValue) > 12) processedValue = '12';
        break;
      case 'expiryYear':
        processedValue = value.replace(/\D/g, '');
        break;
      case 'ccv':
        processedValue = value.replace(/\D/g, '');
        if (processedValue.length > 4) return;
        break;
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));
  };

  const validateForm = (): boolean => {
    if (!validateCPFCNPJ(formData.cpfCnpj)) {
      toast.error('CPF/CNPJ inválido');
      return false;
    }
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Preencha todos os dados do cliente');
      return false;
    }
    if (!formData.postalCode || formData.postalCode.replace(/\D/g, '').length < 8) {
      toast.error('CEP inválido');
      return false;
    }
    if (!formData.addressNumber) {
      toast.error('Número do endereço é obrigatório');
      return false;
    }
    if (!formData.cardNumber || formData.cardNumber.replace(/\D/g, '').length < 13) {
      toast.error('Número do cartão inválido');
      return false;
    }
    if (!formData.cardHolder) {
      toast.error('Nome no cartão é obrigatório');
      return false;
    }
    if (!formData.expiryMonth || !formData.expiryYear) {
      toast.error('Data de validade é obrigatória');
      return false;
    }
    if (!formData.ccv || formData.ccv.length < 3) {
      toast.error('CVV inválido');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await createCreditCardPayment(bookingId, {
        cpfCnpj: formData.cpfCnpj.replace(/\D/g, ''),
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone.replace(/\D/g, ''),
        postalCode: formData.postalCode.replace(/\D/g, ''),
        addressNumber: formData.addressNumber,
        amount: totalAmount,
        description: `Reserva ${bookingNumber}`,
        installments: parseInt(formData.installments),
        creditCard: {
          holderName: formData.cardHolder.toUpperCase(),
          number: formData.cardNumber.replace(/\D/g, ''),
          expiryMonth: formData.expiryMonth.padStart(2, '0'),
          expiryYear: formData.expiryYear,
          ccv: formData.ccv,
        },
      });

      setPaymentResult({
        success: response.data.success,
        payment: response.data.payment,
        message: response.message,
      });
      setStep('result');

      if (response.data.success) {
        toast.success('Pagamento aprovado!');
        onPaymentCreated(response.data.payment, true);
      } else {
        toast.error('Pagamento recusado');
        onPaymentCreated(response.data.payment, false);
      }
    } catch (error) {
      console.error('Error processing card payment:', error);
      setPaymentResult({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao processar pagamento',
      });
      setStep('result');
      toast.error('Erro ao processar pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate installment options with 15% interest for 12 months
  const getInstallmentOptions = () => {
    const options = [];
    const maxInstallments = 12;

    for (let i = 1; i <= maxInstallments; i++) {
      if (i === 1) {
        // No interest for single payment
        options.push({
          value: i.toString(),
          label: `1x de ${formatCurrency(totalAmount)} (à vista)`,
        });
      } else {
        // Calculate with 15% total interest distributed
        const totalWithInterest = totalAmount * 1.15;
        const installmentValue = totalWithInterest / i;
        options.push({
          value: i.toString(),
          label: `${i}x de ${formatCurrency(installmentValue)}`,
        });
      }
    }
    return options;
  };

  if (step === 'result') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Result */}
            <div className="flex flex-col items-center space-y-4 py-4">
              {paymentResult?.success ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-600">
                    Pagamento Aprovado!
                  </h3>
                  <p className="text-center text-muted-foreground">
                    Seu pagamento foi processado com sucesso
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-600">
                    Pagamento Recusado
                  </h3>
                  <p className="text-center text-muted-foreground">
                    Não foi possível processar seu pagamento
                  </p>
                </>
              )}
            </div>

            {/* Payment details */}
            {paymentResult?.payment && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="font-semibold">
                    {formatCurrency(paymentResult.payment.amount)}
                  </span>
                </div>
                {paymentResult.payment.installments && paymentResult.payment.installments > 1 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Parcelas:</span>
                    <span>
                      {paymentResult.payment.installments}x de{' '}
                      {formatCurrency(
                        paymentResult.payment.amount / paymentResult.payment.installments
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    className={
                      paymentResult.success
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {paymentResult.success ? 'Aprovado' : 'Recusado'}
                  </Badge>
                </div>
              </div>
            )}

            {/* Error message */}
            {!paymentResult?.success && paymentResult?.message && (
              <div className="p-4 bg-red-50 text-red-800 rounded-lg">
                <p className="text-sm">{paymentResult.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Pagamento com Cartão</h2>
        <p className="text-muted-foreground mt-2">
          Preencha os dados para processar o pagamento
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Amount info */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Valor a pagar:</span>
              <span className="text-2xl font-bold text-accent">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Reserva: {bookingNumber}
            </p>
          </div>

          {/* Customer Info */}
          <div className="space-y-3">
            <h4 className="font-semibold">Dados do Cliente</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                <Input
                  id="cpfCnpj"
                  placeholder="000.000.000-00"
                  value={formData.cpfCnpj}
                  onChange={(e) => handleChange('cpfCnpj', e.target.value)}
                  maxLength={18}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  maxLength={15}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="postalCode">CEP *</Label>
                <Input
                  id="postalCode"
                  placeholder="00000-000"
                  value={formData.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  maxLength={9}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="addressNumber">Número *</Label>
                <Input
                  id="addressNumber"
                  placeholder="123"
                  value={formData.addressNumber}
                  onChange={(e) => handleChange('addressNumber', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Card Info */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Dados do Cartão
            </h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="cardNumber">Número do Cartão *</Label>
                <Input
                  id="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  value={formData.cardNumber}
                  onChange={(e) => handleChange('cardNumber', e.target.value)}
                  maxLength={19}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cardHolder">Nome no Cartão *</Label>
                <Input
                  id="cardHolder"
                  placeholder="NOME COMO NO CARTÃO"
                  value={formData.cardHolder}
                  onChange={(e) => handleChange('cardHolder', e.target.value)}
                  className="uppercase"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="expiryMonth">Mês *</Label>
                  <Input
                    id="expiryMonth"
                    placeholder="MM"
                    value={formData.expiryMonth}
                    onChange={(e) => handleChange('expiryMonth', e.target.value)}
                    maxLength={2}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="expiryYear">Ano *</Label>
                  <Input
                    id="expiryYear"
                    placeholder="AAAA"
                    value={formData.expiryYear}
                    onChange={(e) => handleChange('expiryYear', e.target.value)}
                    maxLength={4}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ccv">CVV *</Label>
                  <Input
                    id="ccv"
                    placeholder="000"
                    type="password"
                    value={formData.ccv}
                    onChange={(e) => handleChange('ccv', e.target.value)}
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Installments */}
          <div className="space-y-2">
            <Label htmlFor="installments">Parcelas</Label>
            <Select
              value={formData.installments}
              onValueChange={(value) => handleChange('installments', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getInstallmentOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {parseInt(formData.installments) > 1 && (
              <p className="text-xs text-muted-foreground">
                * Juros de 15% ao ano inclusos no parcelamento
              </p>
            )}
          </div>

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processando Pagamento...
              </>
            ) : (
              `Pagar ${formatCurrency(totalAmount)}`
            )}
          </Button>

          {/* Security note */}
          <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
            <p className="font-semibold mb-1">🔒 Pagamento Seguro</p>
            <p className="text-xs">
              Seus dados são protegidos com criptografia SSL e processados de forma segura.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
