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
import { Copy, Check, Loader2, QrCode, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  createPixPayment,
  formatCurrency,
  formatCPFCNPJ,
  validateCPFCNPJ,
  PixQrCode,
  Payment,
} from '@/services/paymentService';

interface PixPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  totalAmount: number;
  paidAmount: number;
  onPaymentCreated?: (payment: Payment) => void;
}

export function PixPayment({
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
}: PixPaymentProps) {
  const [step, setStep] = useState<'form' | 'qrcode'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form state
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [amount, setAmount] = useState('');

  // QR Code state
  const [qrCode, setQrCode] = useState<PixQrCode | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);

  const remainingAmount = totalAmount - paidAmount;

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 14) {
      setCpfCnpj(formatCPFCNPJ(value));
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(value) / 100;
    if (numValue <= remainingAmount) {
      setAmount(numValue > 0 ? numValue.toFixed(2) : '');
    }
  };

  const handleSubmit = async () => {
    // Validate CPF/CNPJ
    if (!validateCPFCNPJ(cpfCnpj)) {
      toast.error('CPF/CNPJ inválido');
      return;
    }

    const chargeAmount = amount ? parseFloat(amount) : remainingAmount;

    if (chargeAmount <= 0) {
      toast.error('Valor inválido');
      return;
    }

    setIsLoading(true);

    try {
      const response = await createPixPayment(bookingId, {
        cpfCnpj: cpfCnpj.replace(/\D/g, ''),
        customerName,
        customerEmail,
        customerPhone,
        amount: chargeAmount,
        description: `Reserva ${bookingNumber}`,
      });

      setQrCode(response.data.qrCode);
      setPayment(response.data.payment);
      setStep('qrcode');
      toast.success('Cobrança PIX gerada com sucesso!');
    } catch (error) {
      console.error('Error creating PIX payment:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao gerar cobrança PIX');
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

  const handleClose = () => {
    if (payment && onPaymentCreated) {
      onPaymentCreated(payment);
    }
    // Reset state
    setStep('form');
    setCpfCnpj('');
    setAmount('');
    setQrCode(null);
    setPayment(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Pagamento via PIX
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

            {/* CPF/CNPJ input */}
            <div className="space-y-2">
              <Label htmlFor="cpfCnpj">CPF ou CNPJ do pagador *</Label>
              <Input
                id="cpfCnpj"
                placeholder="000.000.000-00"
                value={cpfCnpj}
                onChange={handleCpfCnpjChange}
                maxLength={18}
              />
            </div>

            {/* Amount input */}
            <div className="space-y-2">
              <Label htmlFor="amount">
                Valor a cobrar (deixe vazio para cobrar total)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id="amount"
                  placeholder={remainingAmount.toFixed(2)}
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Máximo: {formatCurrency(remainingAmount)}
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading || !cpfCnpj}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  'Gerar QR Code'
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            {/* QR Code */}
            <div className="flex justify-center">
              {qrCode?.image && (
                <img
                  src={`data:image/png;base64,${qrCode.image}`}
                  alt="QR Code PIX"
                  className="w-48 h-48 border rounded-lg"
                />
              )}
            </div>

            {/* Payment info */}
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(payment?.amount || 0)}
              </p>
              <Badge variant="outline">Aguardando pagamento</Badge>
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
            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
              <p className="font-semibold mb-1">Como pagar:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Abra o app do seu banco</li>
                <li>Escolha pagar via PIX</li>
                <li>Escaneie o QR Code ou cole o código</li>
                <li>Confirme o pagamento</li>
              </ol>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleClose}>
                Fechar
              </Button>
              <Button variant="outline" onClick={handleCopyCode}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Código
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
