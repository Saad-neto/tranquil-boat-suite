// Checkout flow types

export interface BookingData {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  date: Date;
  numberOfPeople?: number;
  notes?: string;
  tourName: string;
  basePrice: number;
  kitQuantity: number;
  kitUnitPrice: number;
  kitDiscount: number;
  totalPrice: number;
}

export type PaymentMethod = 'PIX' | 'CREDIT_CARD';

export type CheckoutStep = 1 | 2 | 3 | 4;

export interface CheckoutState {
  currentStep: CheckoutStep;
  bookingData: BookingData | null;
  paymentMethod: PaymentMethod | null;
  bookingId: string | null;
  bookingNumber: string | null;
  isLoading: boolean;
  error: string | null;
}
