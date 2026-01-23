import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  createPixPayment,
  formatCurrency,
  formatCPFCNPJ,
  validateCPFCNPJ,
  PixQrCode,
  Payment,
} from '@/services/paymentService';

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
  const [step, setStep] = useState<'form' | 'qrcode'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [qrCode, setQrCode] = useState<PixQrCode | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 14) {
      setCpfCnpj(formatCPFCNPJ(value));
    }
  };

  const handleSubmit = async () => {
    if (!validateCPFCNPJ(cpfCnpj)) {
      toast.error('CPF/CNPJ inválido');
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

      // Notify parent after short delay to show QR code first
      setTimeout(() => {
        if (response.data.payment) {
          onPaymentCreated(response.data.payment);
        }
      }, 1000);
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

  if (step === 'qrcode') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Pagamento via PIX</h2>
          <p className="text-muted-foreground mt-2">
            Escaneie o QR Code ou copie o código para pagar
          </p>
        </div>

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
          Informe seu CPF/CNPJ para gerar o QR Code
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

          {/* CPF/CNPJ input */}
          <div className="space-y-2">
            <Label htmlFor="cpfCnpj">CPF ou CNPJ do pagador *</Label>
            <Input
              id="cpfCnpj"
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              value={cpfCnpj}
              onChange={handleCpfCnpjChange}
              maxLength={18}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Informe o CPF ou CNPJ de quem irá realizar o pagamento
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
