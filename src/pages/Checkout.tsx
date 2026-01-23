import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { PaymentMethodSelector } from '@/components/checkout/PaymentMethodSelector';
import { CheckoutPixPayment } from '@/components/checkout/CheckoutPixPayment';
import { CheckoutCardPayment } from '@/components/checkout/CheckoutCardPayment';
import { ConfirmationScreen } from '@/components/checkout/ConfirmationScreen';
import { createPublicBooking } from '@/services/bookingService';
import { Payment } from '@/services/paymentService';
import { BookingData, PaymentMethod, CheckoutStep, CheckoutState } from '@/types/checkout';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [state, setState] = useState<CheckoutState>({
    currentStep: 1,
    bookingData: null,
    paymentMethod: null,
    bookingId: null,
    bookingNumber: null,
    isLoading: false,
    error: null,
  });

  // Check if we have booking data from navigation
  useEffect(() => {
    const bookingData = location.state?.bookingData as BookingData | undefined;

    if (!bookingData) {
      toast.error('Inicie uma reserva primeiro');
      navigate('/');
      return;
    }

    setState(prev => ({ ...prev, bookingData }));
  }, [location, navigate]);

  const handleContinueFromSummary = () => {
    setState(prev => ({ ...prev, currentStep: 2 as CheckoutStep }));
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setState(prev => ({ ...prev, paymentMethod: method }));
  };

  const handleContinueToPayment = async () => {
    if (!state.paymentMethod || !state.bookingData) return;

    // Create booking in database before showing payment form
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await createPublicBooking({
        customerName: state.bookingData!.customerName,
        customerEmail: state.bookingData!.customerEmail,
        customerPhone: state.bookingData!.customerPhone,
        date: state.bookingData!.date.toISOString(),
        numberOfPeople: state.bookingData!.numberOfPeople,
        notes: state.bookingData!.notes,
        tourName: state.bookingData!.tourName,
        totalPrice: state.bookingData!.totalPrice,
        kitQuantity: state.bookingData!.kitQuantity,
      });

      setState(prev => ({
        ...prev,
        bookingId: response.data.id,
        bookingNumber: response.data.bookingNumber,
        currentStep: 3 as CheckoutStep,
        isLoading: false,
      }));

      toast.success('Reserva criada com sucesso!');
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar reserva';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      toast.error(errorMessage);
    }
  };

  const handlePaymentCreated = (payment: Payment, success?: boolean) => {
    // Move to confirmation screen
    setTimeout(() => {
      setState(prev => ({ ...prev, currentStep: 4 as CheckoutStep }));
    }, 1500);
  };

  const renderProgressBar = () => {
    const steps = [
      { number: 1, label: 'Resumo' },
      { number: 2, label: 'Pagamento' },
      { number: 3, label: 'Processar' },
      { number: 4, label: 'Confirmação' },
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    state.currentStep >= step.number
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.number}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    state.currentStep > step.number ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Loading state
  if (!state.bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete sua reserva em 4 passos simples</p>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Content */}
        <div className="transition-all duration-300">
          {/* Step 1: Order Summary */}
          {state.currentStep === 1 && (
            <OrderSummary
              bookingData={state.bookingData}
              onContinue={handleContinueFromSummary}
              onBack={handleBackToLanding}
            />
          )}

          {/* Step 2: Payment Method Selection */}
          {state.currentStep === 2 && (
            <PaymentMethodSelector
              selectedMethod={state.paymentMethod}
              onSelect={handleSelectPaymentMethod}
              onContinue={handleContinueToPayment}
            />
          )}

          {/* Step 3: Payment Form */}
          {state.currentStep === 3 && state.bookingId && state.bookingNumber && (
            <div>
              {state.paymentMethod === 'PIX' && (
                <CheckoutPixPayment
                  bookingId={state.bookingId}
                  bookingNumber={state.bookingNumber}
                  customerName={state.bookingData.customerName}
                  customerPhone={state.bookingData.customerPhone}
                  customerEmail={state.bookingData.customerEmail}
                  totalAmount={state.bookingData.totalPrice}
                  onPaymentCreated={handlePaymentCreated}
                />
              )}
              {state.paymentMethod === 'CREDIT_CARD' && (
                <CheckoutCardPayment
                  bookingId={state.bookingId}
                  bookingNumber={state.bookingNumber}
                  customerName={state.bookingData.customerName}
                  customerPhone={state.bookingData.customerPhone}
                  customerEmail={state.bookingData.customerEmail}
                  totalAmount={state.bookingData.totalPrice}
                  onPaymentCreated={handlePaymentCreated}
                />
              )}
            </div>
          )}

          {/* Step 4: Confirmation */}
          {state.currentStep === 4 && state.bookingNumber && state.paymentMethod && (
            <ConfirmationScreen
              bookingNumber={state.bookingNumber}
              paymentMethod={state.paymentMethod}
              paymentStatus="PENDING"
              customerName={state.bookingData.customerName}
              tourDate={state.bookingData.date}
            />
          )}

          {/* Loading Overlay */}
          {state.isLoading && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-lg font-semibold">Criando sua reserva...</p>
                <p className="text-sm text-muted-foreground">Por favor, aguarde</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {state.error && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-destructive text-sm">{state.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
