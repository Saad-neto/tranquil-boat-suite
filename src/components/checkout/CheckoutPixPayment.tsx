import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, Loader2, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  createPixPayment,
  formatCurrency,
  formatCPFCNPJ,
  validateCPFCNPJ,
  PixQrCode,
  Payment,
  getPaymentsByBooking,
} from '@/services/paymentService';
import { trackPurchase } from '@/lib/analytics';

interface CheckoutPixPaymentProps {
  bookingId: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  totalAmount: number;
  onPaymentCreated: (payment: Payment) => void;
}

export function CheckoutPixPayment({
  bookingId,
  bookingNumber,
  customerName,
  customerPhone,
  customerEmail,
  totalAmount,
  onPaymentCreated,
}: CheckoutPixPaymentProps) {
  const [step, setStep] = useState<'form' | 'qrcode' | 'expired'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [qrCode, setQrCode] = useState<PixQrCode | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutos = 600 segundos
  const [showLowTimeWarning, setShowLowTimeWarning] = useState(false);

  // Contador regressivo
  useEffect(() => {
    if (step !== 'qrcode') return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStep('expired');
          toast.error('Tempo expirado! Faça uma nova reserva.');
          return 0;
        }

        // Alerta quando faltar 2 minutos
        if (prev === 120 && !showLowTimeWarning) {
          setShowLowTimeWarning(true);
          toast.warning('⚠️ Restam apenas 2 minutos para concluir o pagamento!', {
            duration: 5000,
          });
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, showLowTimeWarning]);

  // 🎯 NOVO: Polling para detectar confirmação de pagamento PIX
  useEffect(() => {
    if (step !== 'qrcode' || !payment?.id) return;

    let pollCount = 0;
    const MAX_POLLS = 120; // 10 minutos (120 * 5s)
    const POLL_INTERVAL = 5000; // 5 segundos
    let hasTrackedPurchase = false; // Flag anti-duplicação

    const pollInterval = setInterval(async () => {
      pollCount++;

      try {
        // Consultar status do pagamento
        const response = await getPaymentsByBooking(bookingId);
        const currentPayment = response.data.find(p => p.id === payment.id);

        if (!currentPayment) return;

        // Verificar se foi confirmado
        const isConfirmed = ['RECEIVED', 'CONFIRMED'].includes(currentPayment.status);

        if (isConfirmed && !hasTrackedPurchase) {
          hasTrackedPurchase = true; // Previne duplicação
          clearInterval(pollInterval);

          // 🎯 Rastrear Conversão no GA4/Google Ads
          trackPurchase(
            'Passeio Náutico',
            currentPayment.amount,
            bookingNumber
          );

          // Notificar componente pai
          onPaymentCreated(currentPayment);

          toast.success('Pagamento PIX confirmado!');
        }

        // Timeout após 10 minutos
        if (pollCount >= MAX_POLLS) {
          clearInterval(pollInterval);
          console.log('Polling timeout - pagamento ainda pendente');
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
        // Não para polling em caso de erro transitório
      }
    }, POLL_INTERVAL);

    return () => clearInterval(pollInterval);
  }, [step, payment, bookingId, bookingNumber, onPaymentCreated]);

  // Formatar tempo restante (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) { // Only CPF (11 digits)
      setCpfCnpj(formatCPFCNPJ(value));
    }
  };

  const handleSubmit = async () => {
    const cleanCpf = cpfCnpj.replace(/\D/g, '');
    if (cleanCpf.length !== 11 || !validateCPFCNPJ(cpfCnpj)) {
      toast.error('CPF inválido');
      return;
    }

    setIsLoading(true);

    try {
      const response = await createPixPayment(bookingId, {
        cpfCnpj: cpfCnpj.replace(/\D/g, ''),
        customerName,
        customerEmail,
        customerPhone,
        amount: totalAmount,
        description: `Reserva ${bookingNumber}`,
      });

      setQrCode(response.data.qrCode);
      setPayment(response.data.payment);
      setStep('qrcode');
      toast.success('QR Code PIX gerado com sucesso!');

      // NÃO chamar onPaymentCreated aqui!
      // O pagamento ainda NÃO foi confirmado, apenas o QR Code foi gerado
      // onPaymentCreated só deve ser chamado quando o webhook do Asaas confirmar o pagamento
    } catch (error) {
      console.error('Error creating PIX payment:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao gerar QR Code PIX');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (qrCode?.copyPaste) {
      try {
        await navigator.clipboard.writeText(qrCode.copyPaste);
        setCopied(true);
        toast.success('Código PIX copiado!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Erro ao copiar código');
      }
    }
  };

  // Tela de expiração
  if (step === 'expired') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-red-600">Tempo Expirado</h2>
            <p className="text-muted-foreground">
              O QR Code PIX expirou após 10 minutos sem pagamento.
            </p>
            <p className="text-sm">
              Por favor, faça uma nova reserva para gerar um novo QR Code.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Nova Reserva
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'qrcode') {
    const isLowTime = timeRemaining <= 120; // Menos de 2 minutos
    const isCriticalTime = timeRemaining <= 60; // Menos de 1 minuto

    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Pagamento via PIX</h2>
          <p className="text-muted-foreground mt-2">
            Escaneie o QR Code ou copie o código para pagar
          </p>
        </div>

        {/* Aviso de tempo restante */}
        <Card className={`${isLowTime ? 'border-orange-500' : ''} ${isCriticalTime ? 'border-red-500 animate-pulse' : ''}`}>
          <CardContent className="pt-4">
            <div className={`flex items-center gap-3 p-4 rounded-lg ${
              isCriticalTime ? 'bg-red-50 text-red-800' :
              isLowTime ? 'bg-orange-50 text-orange-800' :
              'bg-blue-50 text-blue-800'
            }`}>
              <Clock className={`w-5 h-5 ${isCriticalTime || isLowTime ? 'animate-pulse' : ''}`} />
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {isCriticalTime ? '⚠️ ATENÇÃO: Menos de 1 minuto!' :
                   isLowTime ? '⏰ Pouco tempo restante!' :
                   'PIX válido por 10 minutos'}
                </p>
                <p className="text-xs mt-1">
                  Tempo restante: <span className="font-bold text-lg">{formatTime(timeRemaining)}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* QR Code */}
            <div className="flex justify-center">
              {qrCode?.image && (
                <div className="p-4 bg-white rounded-lg border-2 border-primary/20">
                  <img
                    src={`data:image/png;base64,${qrCode.image}`}
                    alt="QR Code PIX"
                    className="w-64 h-64"
                  />
                </div>
              )}
            </div>

            {/* Payment info */}
            <div className="text-center space-y-2">
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(payment?.amount || totalAmount)}
              </p>
              <Badge variant="outline" className="text-base px-4 py-1">
                Aguardando pagamento
              </Badge>
              <p className="text-sm text-muted-foreground">
                Reserva: {bookingNumber}
              </p>
            </div>

            {/* Copy code */}
            <div className="space-y-2">
              <Label>Código PIX (Copia e Cola)</Label>
              <div className="flex gap-2">
                <Input
                  value={qrCode?.copyPaste || ''}
                  readOnly
                  className="text-xs font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg">
              <p className="font-semibold mb-2">Como pagar:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Abra o app do seu banco</li>
                <li>Escolha pagar via PIX</li>
                <li>Escaneie o QR Code ou cole o código</li>
                <li>Confirme o pagamento</li>
              </ol>
              <p className="mt-3 text-xs font-medium">
                ✓ O pagamento é processado instantaneamente
              </p>
            </div>

            {/* Copy button */}
            <Button onClick={handleCopyCode} className="w-full" size="lg">
              <Copy className="w-4 h-4 mr-2" />
              Copiar Código PIX
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Pagamento via PIX</h2>
        <p className="text-muted-foreground mt-2">
          Informe seu CPF para gerar o QR Code
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

          {/* CPF input */}
          <div className="space-y-2">
            <Label htmlFor="cpfCnpj">CPF do pagador *</Label>
            <Input
              id="cpfCnpj"
              placeholder="000.000.000-00"
              value={cpfCnpj}
              onChange={handleCpfCnpjChange}
              maxLength={14}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Informe o CPF de quem irá realizar o pagamento
            </p>
          </div>

          {/* Info box */}
          <div className="p-4 bg-green-50 text-green-800 rounded-lg">
            <p className="font-semibold mb-1">✓ Pagamento Instantâneo</p>
            <p className="text-sm">
              Após gerar o QR Code, o pagamento é confirmado em segundos e sua reserva
              é automaticamente confirmada.
            </p>
          </div>

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !cpfCnpj}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Gerando QR Code...
              </>
            ) : (
              'Gerar QR Code PIX'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
