// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ============================================
// TYPES
// ============================================

export interface Booking {
  id: string;
  bookingNumber: string;
  leadId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  boatId: string;
  tourId?: string;
  startDateTime: string;
  endDateTime: string;
  numberOfPeople: number;
  totalPrice: number;
  paidAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  observations?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePublicBookingData {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  date: string; // ISO date string
  numberOfPeople?: number;
  notes?: string;
  tourName?: string;
  totalPrice: number;
  kitQuantity?: number;
}

export interface CreatePublicBookingResponse {
  success: boolean;
  data: {
    id: string;
    bookingNumber: string;
    customerName: string;
    totalPrice: number;
    status: string;
    paymentStatus: string;
  };
  message?: string;
}

// ============================================
// BOOKING SERVICE (PUBLIC - NO AUTH)
// ============================================

/**
 * Create a public booking without authentication
 * Used by the checkout flow from the landing page
 */
export async function createPublicBooking(
  data: CreatePublicBookingData
): Promise<CreatePublicBookingResponse> {
  const response = await fetch(`${API_URL}/bookings/public`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || 'Erro ao criar reserva');
  }

  return result;
}

// ============================================
// HELPERS
// ============================================

/**
 * Format currency to Brazilian Real
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Map booking status to display text
 */
export function getBookingStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    PAID: 'Pago',
    IN_PROGRESS: 'Em Andamento',
    COMPLETED: 'Concluído',
    CANCELLED: 'Cancelado',
    NO_SHOW: 'Não Compareceu',
  };
  return statusMap[status] || status;
}

/**
 * Map booking status to color
 */
export function getBookingStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PAID: 'bg-green-100 text-green-800',
    IN_PROGRESS: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
    NO_SHOW: 'bg-orange-100 text-orange-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Map payment status to display text
 */
export function getPaymentStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: 'Pagamento Pendente',
    PARTIAL: 'Parcialmente Pago',
    PAID: 'Pago',
    REFUNDED: 'Estornado',
  };
  return statusMap[status] || status;
}

/**
 * Map payment status to color
 */
export function getPaymentStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PARTIAL: 'bg-orange-100 text-orange-800',
    PAID: 'bg-green-100 text-green-800',
    REFUNDED: 'bg-red-100 text-red-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}
