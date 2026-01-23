import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  createCreditCardPayment,
  formatCurrency,
  formatCPFCNPJ,
  validateCPFCNPJ,
  Payment,
} from '@/services/paymentService';

interface CardPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  totalAmount: number;
  paidAmount: number;
  onPaymentCreated?: (payment: Payment, success: boolean) => void;
}

interface FormData {
  // Customer info
  cpfCnpj: string;
  name: string;
  email: string;
  phone: string;
  postalCode: string;
  addressNumber: string;
  // Card info
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
  // Amount
  amount: string;
  installments: string;
}

export function CardPayment({
  isOpen,
  onClose,
  bookingId,
  bookingNumber,
  customerName,
  customerPhone,
  customerEmail,
  totalAmount,
  paidAmount,
  onPaymentCreated,
}: CardPaymentProps) {
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
    expiryYear: '',
    ccv: '',
    amount: '',
    installments: '1',
  });

  const remainingAmount = totalAmount - paidAmount;

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
      case 'amount':
        const numValue = parseInt(value.replace(/\D/g, '')) / 100;
        if (numValue > remainingAmount) return;
        processedValue = numValue > 0 ? numValue.toFixed(2) : '';
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

    const chargeAmount = formData.amount ? parseFloat(formData.amount) : remainingAmount;

    if (chargeAmount <= 0) {
      toast.error('Valor inválido');
      return;
    }

    setIsLoading(true);

    try {
      const response = await createCreditCardPayment(bookingId, {
        cpfCnpj: formData.cpfCnpj.replace(/\D/g, ''),
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone.replace(/\D/g, ''),
        postalCode: formData.postalCode.replace(/\D/g, ''),
        addressNumber: formData.addressNumber,
        amount: chargeAmount,
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
      } else {
        toast.error('Pagamento recusado');
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

  const handleClose = () => {
    if (paymentResult?.payment && onPaymentCreated) {
      onPaymentCreated(paymentResult.payment, paymentResult.success);
    }
    // Reset state
    setStep('form');
    setPaymentResult(null);
    setFormData({
      cpfCnpj: '',
      name: customerName,
      email: customerEmail || '',
      phone: customerPhone,
      postalCode: '',
      addressNumber: '',
      cardNumber: '',
      cardHolder: '',
      expiryMonth: '',
      expiryYear: '',
      ccv: '',
      amount: '',
      installments: '1',
    });
    onClose();
  };

  // Generate installment options
  const getInstallmentOptions = () => {
    const chargeAmount = formData.amount ? parseFloat(formData.amount) : remainingAmount;
    const options = [];
    const maxInstallments = Math.min(12, Math.floor(chargeAmount / 50)); // Min R$50 per installment

    for (let i = 1; i <= Math.max(1, maxInstallments); i++) {
      const installmentValue = chargeAmount / i;
      options.push({
        value: i.toString(),
        label: i === 1
          ? `1x de ${formatCurrency(installmentValue)} (à vista)`
          : `${i}x de ${formatCurrency(installmentValue)}`,
      });
    }
    return options;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Pagamento com Cartão
          </DialogTitle>
          <DialogDescription>
            Reserva: {bookingNumber}
          </DialogDescription>
        </DialogHeader>

        {step === 'form' ? (
          <div className="space-y-4">
            {/* Amount info */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Total da reserva:</span>
                <span className="font-semibold">{formatCurrency(totalAmount)}</span>
              </div>
              {paidAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Já pago:</span>
                  <span>{formatCurrency(paidAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold border-t mt-2 pt-2">
                <span>Restante:</span>
                <span>{formatCurrency(remainingAmount)}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Dados do Cliente</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="cpfCnpj" className="text-xs">CPF/CNPJ *</Label>
                  <Input
                    id="cpfCnpj"
                    placeholder="000.000.000-00"
                    value={formData.cpfCnpj}
                    onChange={(e) => handleChange('cpfCnpj', e.target.value)}
                    maxLength={18}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-xs">Telefone *</Label>
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    maxLength={15}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="postalCode" className="text-xs">CEP *</Label>
                  <Input
                    id="postalCode"
                    placeholder="00000-000"
                    value={formData.postalCode}
                    onChange={(e) => handleChange('postalCode', e.target.value)}
                    maxLength={9}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="addressNumber" className="text-xs">Número *</Label>
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
              <h4 className="font-semibold text-sm">Dados do Cartão</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="cardNumber" className="text-xs">Número do Cartão *</Label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={formData.cardNumber}
                    onChange={(e) => handleChange('cardNumber', e.target.value)}
                    maxLength={19}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cardHolder" className="text-xs">Nome no Cartão *</Label>
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
                    <Label htmlFor="expiryMonth" className="text-xs">Mês *</Label>
                    <Input
                      id="expiryMonth"
                      placeholder="MM"
                      value={formData.expiryMonth}
                      onChange={(e) => handleChange('expiryMonth', e.target.value)}
                      maxLength={2}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="expiryYear" className="text-xs">Ano *</Label>
                    <Input
                      id="expiryYear"
                      placeholder="AAAA"
                      value={formData.expiryYear}
                      onChange={(e) => handleChange('expiryYear', e.target.value)}
                      maxLength={4}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ccv" className="text-xs">CVV *</Label>
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

            {/* Amount and Installments */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="amount" className="text-xs">
                  Valor (vazio = total)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    R$
                  </span>
                  <Input
                    id="amount"
                    placeholder={remainingAmount.toFixed(2)}
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="installments" className="text-xs">Parcelas</Label>
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
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Processar Pagamento'
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Result */}
            <div className="flex flex-col items-center space-y-4">
              {paymentResult?.success ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-600">
                    Pagamento Aprovado!
                  </h3>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-red-600">
                    Pagamento Recusado
                  </h3>
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
              <p className="text-center text-sm text-muted-foreground">
                {paymentResult.message}
              </p>
            )}

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Fechar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
